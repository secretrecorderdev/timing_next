"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthToken, AuthUser } from "@/domain/auth/api/authApi";

interface LoginMeta {
  newUser: boolean;
  newConnection: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: AuthToken | null;
  loginMeta: LoginMeta | null;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  setLogin: (user: AuthUser, token: AuthToken, loginMeta: LoginMeta) => void;
  setToken: (token: AuthToken) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loginMeta: null,
      hydrated: false,
      setHydrated: (hydrated) => {
        console.log("[jang][authStore] setHydrated", { hydrated });
        set({ hydrated });
      },
      setLogin: (user, token, loginMeta) => {
        console.log("[jang][authStore] setLogin", {
          userId: user.userId,
          userUuid: user.userUuid,
          expiresIn: token.expiresIn,
          refreshTokenExpiresIn: token.refreshTokenExpiresIn,
          hasRefreshToken: Boolean(token.refreshToken),
          newUser: loginMeta.newUser,
          newConnection: loginMeta.newConnection,
        });
        set({ user, token, loginMeta });
      },
      setToken: (token) => {
        console.log("[jang][authStore] setToken", {
          expiresIn: token.expiresIn,
          refreshTokenExpiresIn: token.refreshTokenExpiresIn,
          hasAccessToken: Boolean(token.accessToken),
          hasRefreshToken: Boolean(token.refreshToken),
        });
        set((state) => ({ ...state, token }));
      },
      logout: () => {
        console.log("[jang][authStore] logout");
        set({ user: null, token: null, loginMeta: null });
      },
    }),
    {
      name: "timing-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        loginMeta: state.loginMeta,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
