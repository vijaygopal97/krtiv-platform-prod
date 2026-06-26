import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import {
  recordGoogleAuth,
  recordPasswordLogin,
  syncRegisteredUserCount,
} from '../services/plannerAnalytics.js';
import { authJwt } from '../middleware/authJwt.js';
import { verifyFacebookAccessToken } from '../services/facebookAuth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kraik-dev-secret-change-in-production';
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '776460659429-sjh20gea0kitvi1un3436po05pajppam.apps.googleusercontent.com';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const userPayload = (user, token) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  phone: user.phone,
  dob: user.dob,
  interests: user.interests,
  role: user.role || 'user',
  authProvider: user.authProvider || 'local',
  profilePicture: user.profilePicture || '',
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  token,
});

router.get('/session', authJwt, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role || 'user',
        authProvider: user.authProvider || 'local',
        profilePicture: user.profilePicture || '',
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (err) {
    console.error('GET /auth/session error:', err);
    res.status(500).json({ success: false, message: 'Could not verify your session.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }
    const phoneNorm = (phone && typeof phone === 'string') ? phone.trim() : '';
    if (!phoneNorm) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existingByPhone = await User.findOne({ phone: phoneNorm });
    if (existingByPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    if (email && typeof email === 'string' && email.trim()) {
      const existingByEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingByEmail) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }
    const user = await User.create({
      name,
      email: (email && typeof email === 'string' && email.trim()) ? email.toLowerCase().trim() : undefined,
      phone: phoneNorm,
      password,
      authProvider: 'local',
    });
    const token = generateToken(user);
    await syncRegisteredUserCount().catch(() => {});
    res.status(201).json({
      success: true,
      user: userPayload(user, token),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailOrPhone = (email != null && email !== '') ? String(email).trim() : '';
    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Email or phone and password are required' });
    }
    const isEmail = emailOrPhone.includes('@');
    const user = isEmail
      ? await User.findOne({ email: emailOrPhone.toLowerCase() })
      : await User.findOne({ phone: emailOrPhone });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email/phone or password' });
    }
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in' });
    }
    if (user.authProvider === 'facebook' && !user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Facebook sign-in' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    user.lastLoginAt = new Date();
    await user.save();
    await recordPasswordLogin().catch(() => {});
    const token = generateToken(user);
    res.json({
      success: true,
      user: userPayload(user, token),
    });
  } catch (err) {
    console.error('Login error:', err.message || err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/google', async (req, res) => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        success: false,
        message: 'Google sign-in is temporarily unavailable. Please try again later.',
      });
    }
    const credential = req.body?.credential || req.body?.idToken;
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ success: false, message: 'We could not complete sign-in. Please try again.' });
    }
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error('Google token verify error:', verifyErr.message || verifyErr);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please try again.',
      });
    }
    if (!payload?.email) {
      return res.status(401).json({ success: false, message: 'Authentication failed. Please try again.' });
    }
    if (payload.email_verified === false) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your Google email address and try again.',
      });
    }

    const email = payload.email.toLowerCase().trim();
    const googleId = payload.sub;
    const name = payload.name || email.split('@')[0];
    const profilePicture = payload.picture || '';

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
    }
    let isNewUser = false;

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({
          success: false,
          message: 'This email is already linked to another account. Please sign in with email and password.',
        });
      }
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.password || user.authProvider === 'google') {
        user.authProvider = 'google';
      }
      if (profilePicture) user.profilePicture = profilePicture;
      if (name && (!user.name || user.name === user.email)) user.name = name;
      if (!user.email) user.email = email;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      isNewUser = true;
      try {
        user = await User.create({
          name,
          email,
          googleId,
          profilePicture,
          authProvider: 'google',
          password: crypto.randomBytes(32).toString('hex'),
          lastLoginAt: new Date(),
        });
        await syncRegisteredUserCount().catch(() => {});
      } catch (createErr) {
        console.error('Google user create error:', createErr);
        return res.status(500).json({
          success: false,
          message: 'We could not create your account. Please try again.',
        });
      }
    }

    await recordGoogleAuth({ isNewUser }).catch(() => {});
    const token = generateToken(user);
    res.json({ success: true, user: userPayload(user, token), isNewUser });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again in a few minutes.',
    });
  }
});

router.post('/facebook', async (req, res) => {
  try {
    const accessToken = req.body?.accessToken || req.body?.access_token;
    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({ success: false, message: 'We could not complete sign-in. Please try again.' });
    }

    let profile;
    try {
      profile = await verifyFacebookAccessToken(accessToken);
    } catch (verifyErr) {
      const code = verifyErr.code || '';
      console.error('Facebook token verify error:', verifyErr.message || verifyErr);
      if (code === 'NOT_CONFIGURED') {
        return res.status(503).json({
          success: false,
          message: 'Facebook sign-in is temporarily unavailable. Please try again later.',
        });
      }
      if (code === 'MISSING_EMAIL') {
        return res.status(400).json({ success: false, message: verifyErr.message });
      }
      if (code === 'NETWORK') {
        return res.status(502).json({
          success: false,
          message: 'Network error. Check your connection and try again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please try again.',
      });
    }

    const { facebookId, email, name, profilePicture } = profile;

    let user = await User.findOne({ facebookId });
    if (!user) {
      user = await User.findOne({ email });
    }
    let isNewUser = false;

    if (user) {
      if (user.facebookId && user.facebookId !== facebookId) {
        return res.status(409).json({
          success: false,
          message: 'This email is already linked to another Facebook account.',
        });
      }
      if (!user.facebookId) {
        user.facebookId = facebookId;
      }
      if (!user.password || user.authProvider === 'facebook') {
        if (!user.googleId) user.authProvider = 'facebook';
      }
      if (profilePicture) user.profilePicture = profilePicture;
      if (name && (!user.name || user.name === user.email)) user.name = name;
      if (!user.email) user.email = email;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      isNewUser = true;
      try {
        user = await User.create({
          name,
          email,
          facebookId,
          profilePicture,
          authProvider: 'facebook',
          password: crypto.randomBytes(32).toString('hex'),
          lastLoginAt: new Date(),
        });
        await syncRegisteredUserCount().catch(() => {});
      } catch (createErr) {
        console.error('Facebook user create error:', createErr);
        return res.status(500).json({
          success: false,
          message: 'We could not create your account. Please try again.',
        });
      }
    }

    const token = generateToken(user);
    res.json({ success: true, user: userPayload(user, token), isNewUser });
  } catch (err) {
    console.error('Facebook auth error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again in a few minutes.',
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent' });
    }
    const token = uuidv4();
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save();
    res.json({ success: true, message: 'Password reset link has been sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

export default router;
