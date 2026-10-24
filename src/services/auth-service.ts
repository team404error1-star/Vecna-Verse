import { UserProfile } from '../types';
import { DEFAULT_DEMO_USER, DEFAULT_DEMO_ORGANIZER_USER } from '../mocks/demo-data';
import { isDemoMode, apiClient } from './api-client';

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
      if (!raw) return DEFAULT_DEMO_USER; // Default to demo attendee user for instant interactive exploration
      return JSON.parse(raw);
    } catch {
      return DEFAULT_DEMO_USER;
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
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    notify(updated);
    return updated;
  },
};
