import { create } from "zustand";

interface User {
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  user: User | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string; role?: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  role: null,
  user: null,
  setTokens: ({ accessToken, refreshToken, role }) => set((state) => ({
    accessToken,
    refreshToken,
    role: role ?? state.role,
  })),
  setUser: (user) => set({ user }),
  logout: () => set({ accessToken: null, refreshToken: null, role: null, user: null }),
}));