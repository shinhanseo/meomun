import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isInitializing: boolean;

  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setSession: ({ accessToken, user }) => {
    set({ accessToken, user });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  setUser: (user) => {
    set({ user });
  },

  clearSession: () => {
    set({
      accessToken: null,
      user: null,
    });
  },

  setInitializing: (isInitializing) => {
    set({ isInitializing });
  },
}));