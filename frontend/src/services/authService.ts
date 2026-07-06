import { getApiBase as getApiBasePath } from '@/lib/basePath';
import { friendlyAuthMessage } from '@/lib/authErrors';

const getApiBase = () => {
  if (typeof window !== 'undefined') return getApiBasePath();
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';
};

const LOGGED_OUT_KEY = 'krtiv_auth_logged_out';

let sessionEpoch = 0;

function markLoggedIn(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(LOGGED_OUT_KEY);
  }
}

function persistUser(user: User): void {
  if (typeof window === 'undefined') return;
  if (sessionStorage.getItem(LOGGED_OUT_KEY)) return;
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('krtiv-auth-changed'));
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dob?: string;
  interests?: string[];
  role?: string;
  authProvider?: 'local' | 'google' | 'facebook';
  profilePicture?: string;
  lastLoginAt?: string;
  token: string;
}

export const authService = {
  async loginWithGoogle(credential: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ credential }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(friendlyAuthMessage(res.status, data.message));
    markLoggedIn();
    persistUser(data.user);
    return data;
  },

  async loginWithFacebook(accessToken: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/facebook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ accessToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(friendlyAuthMessage(res.status, data.message, 'facebook'));
    markLoggedIn();
    persistUser(data.user);
    return data;
  },

  /** Validate stored JWT with the server; clears session if expired. */
  async refreshSession(): Promise<User | null> {
    if (typeof window !== 'undefined' && sessionStorage.getItem(LOGGED_OUT_KEY)) {
      return null;
    }
    const epoch = sessionEpoch;
    const current = this.getCurrentUser();
    if (!current?.token) return null;
    try {
      const res = await fetch(`${getApiBase()}/auth/session`, {
        headers: { Authorization: `Bearer ${current.token}` },
        credentials: 'same-origin',
      });
      if (epoch !== sessionEpoch) return null;
      if (sessionStorage.getItem(LOGGED_OUT_KEY)) return null;
      if (!res.ok) {
        this.logout();
        return null;
      }
      const data = await res.json();
      if (epoch !== sessionEpoch) return null;
      if (sessionStorage.getItem(LOGGED_OUT_KEY)) return null;
      if (data?.user) {
        const merged = { ...current, ...data.user, token: current.token };
        persistUser(merged);
        return merged;
      }
    } catch {
      if (epoch !== sessionEpoch || sessionStorage.getItem(LOGGED_OUT_KEY)) return null;
    }
    return current;
  },

  async login(emailOrPhone: string, password: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrPhone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email/phone or password');
    markLoggedIn();
    persistUser(data.user);
    return data;
  },

  async register(userData: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    markLoggedIn();
    persistUser(data.user);
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${getApiBase()}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send reset email');
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${getApiBase()}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset password');
    return data;
  },

  logout(): void {
    sessionEpoch += 1;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.setItem(LOGGED_OUT_KEY, '1');
      window.dispatchEvent(new Event('krtiv-auth-changed'));
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    if (sessionStorage.getItem(LOGGED_OUT_KEY)) return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  isAdmin(): boolean {
    const role = this.getCurrentUser()?.role;
    return role === 'admin' || role === 'super_admin';
  },

  isContentEditor(): boolean {
    const role = this.getCurrentUser()?.role;
    return role === 'admin' || role === 'super_admin' || role === 'content_admin';
  },

  async adminLogin(email: string, password: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Invalid admin credentials');
    markLoggedIn();
    persistUser(data.user);
    return data;
  },
};
