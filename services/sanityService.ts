import { AppContent } from '../types';

// The browser now talks ONLY to our own same-origin API (/api/*).
// The Sanity token and admin password live on the server (Cloudflare Functions),
// so they are never exposed in the client bundle.

const API_BASE = '/api';

export const loadContentFromSanity = async (): Promise<AppContent | null> => {
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) return null;
    const json = await res.json();
    return (json.result as AppContent) || null;
  } catch {
    return null;
  }
};

export const saveContentToSanity = async (
  content: AppContent,
  password: string
): Promise<boolean> => {
  if (!password) {
    console.error('❌ חסרה סיסמת ניהול לשמירה');
    return false;
  }
  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, content }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    console.log('✅ נשמר בהצלחה');
    return true;
  } catch (error) {
    console.error('❌ שגיאת שמירה:', error);
    return false;
  }
};

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.ok;
  } catch {
    return false;
  }
};
