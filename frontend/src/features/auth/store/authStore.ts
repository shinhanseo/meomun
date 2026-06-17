import { create } from 'zustand';

type User = {
  id: string;
  nickname: string | null;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isBootstrapping: boolean;

  setSession: (params: { accessToken: string; user: User }) => void;
  clearSession: () => void;
  setBootstrapping: (value: boolean) => void;
};

export const userAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isBootstrapping: true,

  setSession: ({ accessToken, user }) => {
    set({
      accessToken,
      user,
    });
  },


  clearSession: () => {
    set({
      accessToken: null,
      user: null,
    });
  },

  setBootstrapping: (value) => {
    set({ isBootstrapping: value });
  },

}));