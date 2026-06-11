import { getApiBase as getApiBasePath } from '@/lib/basePath';

const getApiBase = () => {
  if (typeof window !== 'undefined') return getApiBasePath();
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';
};

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dob?: string;
  interests?: string[];
  role?: string;
  token: string;
}

export const authService = {
  async login(emailOrPhone: string, password: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrPhone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email/phone or password');
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  },
};
