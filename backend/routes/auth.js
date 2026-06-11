import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kraik-dev-secret-change-in-production';

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
  token,
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
    });
    const token = generateToken(user);
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
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
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
