import { create } from 'zustand';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: AdminUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

/**
 * Admin auth store — access token is held in memory only (not persisted).
 * This is intentional: on page refresh the user must hit /auth/refresh using
 * the httpOnly refresh token cookie, which is handled by the axios interceptor.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),

  setAccessToken: (token) => set({ accessToken: token }),

  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
