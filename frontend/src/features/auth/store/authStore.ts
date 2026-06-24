import { create } from 'zustand';

import {
  setApiAccessToken,
  setAuthEventHandlers,
} from '../../../shared/api/client';
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
    setApiAccessToken(accessToken);
    set({ accessToken, user });
  },

  setAccessToken: (accessToken) => {
    setApiAccessToken(accessToken);
    set({ accessToken });
  },

  setUser: (user) => {
    set({ user });
  },

  clearSession: () => {
    setApiAccessToken(null);
    set({
      accessToken: null,
      user: null,
    });
  },

  setInitializing: (isInitializing) => {
    set({ isInitializing });
  },
}));

setAuthEventHandlers({
  onAccessTokenRefreshed: (accessToken) => {
    useAuthStore.setState({ accessToken });
  },
  onSessionExpired: () => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
    });
  },
});
