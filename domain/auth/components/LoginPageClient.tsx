"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loginWithGoogle, type AuthUser } from "@/domain/auth/api/authApi";
import GoogleLoginButton from "@/domain/auth/components/GoogleLoginButton";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useToastStore } from "@/shared/store/useToastStore";
import { Text } from "@/shared/ui/primitives/text/Text";

export default function LoginPageClient() {
  const router = useRouter();
  const { locale } = useLanguage();
  const { showToast } = useToastStore();
  const storedUser = useAuthStore((state) => state.user);
  const storedLoginMeta = useAuthStore((state) => state.loginMeta);
  const storedToken = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setLogin = useAuthStore((state) => state.setLogin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<AuthUser | null>(storedUser);
  const [loginMeta, setLoginMeta] = useState<{ newUser: boolean; newConnection: boolean } | null>(storedLoginMeta);
  const [accessTokenExpiresIn, setAccessTokenExpiresIn] = useState<number | null>(storedToken?.expiresIn ?? null);
  const [refreshTokenExpiresIn, setRefreshTokenExpiresIn] = useState<number | null>(storedToken?.refreshTokenExpiresIn ?? null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    console.log("[jang][loginPage] hydrated auth state", {
      hasStoredUser: Boolean(storedUser),
      storedUserId: storedUser?.userId,
      storedExpiresIn: storedToken?.expiresIn ?? null,
      storedRefreshExpiresIn: storedToken?.refreshTokenExpiresIn ?? null,
    });

    setLoggedInUser(storedUser);
    setLoginMeta(storedLoginMeta);
    setAccessTokenExpiresIn(storedToken?.expiresIn ?? null);
    setRefreshTokenExpiresIn(storedToken?.refreshTokenExpiresIn ?? null);

    if (storedUser) {
      console.log("[jang][loginPage] redirecting authenticated user", {
        userId: storedUser.userId,
        to: `/${locale}/timing`,
      });
      router.replace(`/${locale}/timing`);
    }
  }, [hydrated, locale, router, storedLoginMeta, storedToken?.expiresIn, storedUser]);

  const handleGoogleCredential = async (idToken: string) => {
    if (!idToken || isSubmitting) {
      console.log("[jang][loginPage] skip handleGoogleCredential", {
        hasIdToken: Boolean(idToken),
        isSubmitting,
      });
      return;
    }

    try {
      console.log("[jang][loginPage] received google credential", {
        idTokenLength: idToken.length,
      });
      setIsSubmitting(true);
      const result = await loginWithGoogle({ idToken });
      setLoggedInUser(result.user);
      setLoginMeta({ newUser: result.newUser, newConnection: result.newConnection });
      setAccessTokenExpiresIn(result.token.expiresIn);
      setRefreshTokenExpiresIn(result.token.refreshTokenExpiresIn);
      setLogin(result.user, result.token, { newUser: result.newUser, newConnection: result.newConnection });
      console.log("[jang][loginPage] login success", {
        userId: result.user.userId,
        newUser: result.newUser,
        newConnection: result.newConnection,
        expiresIn: result.token.expiresIn,
        refreshTokenExpiresIn: result.token.refreshTokenExpiresIn,
      });
      showToast(result.newUser ? "구글 로그인과 access token 발급까지 완료됐습니다." : "구글 로그인과 access token 발급이 완료됐습니다.");
      router.replace(`/${locale}/timing`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "구글 로그인 처리 중 오류가 발생했습니다."
        : "구글 로그인 처리 중 오류가 발생했습니다.";
      console.error("[jang][loginPage] login failed", {
        message,
        error,
      });
      showToast(message);
    } finally {
      console.log("[jang][loginPage] login request finished");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-220px)] max-w-xl items-center justify-center py-10">
      <section className="w-full rounded-3xl border border-white/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <Text as="h1" variant="heading" size="xl">
            로그인
          </Text>
        </div>

        <div className="mt-8 space-y-4">
          <GoogleLoginButton locale={locale} onCredential={(idToken) => void handleGoogleCredential(idToken)} />

          {isSubmitting ? (
            <Text size="sm" color="primary">
              구글 로그인 정보를 서버에 확인 중...
            </Text>
          ) : null}

          {loggedInUser ? (
            <>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-semibold">로그인 확인 완료</p>
                <ul className="mt-2 space-y-1">
                  <li>userId: {loggedInUser.userId}</li>
                  <li>nickName: {loggedInUser.nickName || "-"}</li>
                  <li>provider: {loggedInUser.provider}</li>
                  <li>emailVerified: {loggedInUser.emailVerified ? "true" : "false"}</li>
                  <li>newUser: {loginMeta?.newUser ? "true" : "false"}</li>
                  <li>newConnection: {loginMeta?.newConnection ? "true" : "false"}</li>
                  <li>accessTokenExpiresIn: {accessTokenExpiresIn ?? "-"}</li>
                  <li>refreshTokenExpiresIn: {refreshTokenExpiresIn ?? "-"}</li>
                </ul>
              </div>
              <Text size="sm" color="muted">
                로그아웃은 상단 헤더 메뉴에서 할 수 있어요.
              </Text>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
