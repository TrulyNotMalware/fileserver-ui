import { create } from 'zustand';

// Access tokens live in memory only. A reload re-runs the boot hydration which
// calls /auth/refresh; the refresh cookie is HttpOnly so XSS cannot read it.
interface AuthStore {
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,
  setToken: (token) =>
    set({ accessToken: token, isAuthenticated: true, isHydrated: true }),
  clearToken: () =>
    set({ accessToken: null, isAuthenticated: false, isHydrated: true }),
  markHydrated: () => set({ isHydrated: true }),
}));
