import { UserProfile } from '../types';
import { DEFAULT_DEMO_USER, DEFAULT_DEMO_ORGANIZER_USER } from '../mocks/demo-data';
import { isDemoMode, apiClient } from './api-client';
import { auth, googleAuthProvider, signInWithPopup } from '../lib/firebase';

const USER_STORAGE_KEY = 'locora_current_user';
const TOKEN_STORAGE_KEY = 'locora_auth_token';

type AuthListener = (user: UserProfile | null) => void;
const listeners = new Set<AuthListener>();

function notify(user: UserProfile | null) {
  listeners.forEach((cb) => cb(user));
}

export const authService = {
  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) return null; // No profile is logged in by default
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(email: string, _password?: string): Promise<UserProfile> {
    if (!isDemoMode()) {
      const res = await apiClient.post<{ user: UserProfile; token: string }>('/auth/login', { email, password: _password });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      notify(res.user);
      return res.user;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Choose organizer or attendee demo profile depending on email
    let user = DEFAULT_DEMO_USER;
    if (email.includes('org') || email.includes('civictech') || email.includes('marcus')) {
      user = DEFAULT_DEMO_ORGANIZER_USER;
    } else {
      user = {
        ...DEFAULT_DEMO_USER,
        email: email || DEFAULT_DEMO_USER.email,
      };
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, 'demo_jwt_token_locora_preview');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    notify(user);
    return user;
  },

  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const userProfile: UserProfile = {
        id: cred.user.uid,
        name: cred.user.displayName || 'Community Member',
        email: cred.user.email || '',
        avatar: cred.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Active Locora community member.',
        neighborhood: 'Downtown Arts District',
        interests: ['Food & Community', 'Live Music & Culture'],
        role: 'attendee',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, idToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userProfile));
      notify(userProfile);
      return userProfile;
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      }
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in window was closed before completion. Please try again.');
      }
      if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was interrupted. Please try again.');
      }
      throw new Error(err.message || 'Google authentication failed.');
    }
  },

  async signup(name: string, email: string, role: 'attendee' | 'organizer' = 'attendee'): Promise<UserProfile> {
    if (!isDemoMode()) {
      const res = await apiClient.post<{ user: UserProfile; token: string }>('/auth/signup', { name, email, role });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      notify(res.user);
      return res.user;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: role === 'organizer' ? 'Community organizer in Metro City.' : 'Local resident and active event attendee.',
      neighborhood: 'Downtown Arts District',
      interests: ['Food & Community', 'Live Music & Culture'],
      role,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, 'demo_jwt_token_locora_preview');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    notify(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    notify(null);
  },

  quickSwitchUser(role: 'attendee' | 'organizer' | 'guest'): void {
    if (role === 'guest') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      notify(null);
    } else if (role === 'organizer') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_ORGANIZER_USER));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'demo_token_org');
      notify(DEFAULT_DEMO_ORGANIZER_USER);
    } else {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USER));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'demo_token_attendee');
      notify(DEFAULT_DEMO_USER);
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!isDemoMode()) {
      try {
        const updated = await apiClient.patch<UserProfile>('/me', updates);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
        notify(updated);
        return updated;
      } catch (err) {
        console.warn('Backend updateProfile failed, falling back to local update:', err);
      }
    }

    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    notify(updated);
    return updated;
  },
};
