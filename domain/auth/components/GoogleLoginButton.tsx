"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useToastStore } from "@/shared/store/useToastStore";
import { Button } from "@/shared/ui/primitives/button/Button";
import { Text } from "@/shared/ui/primitives/text/Text";

interface GoogleLoginButtonProps {
  locale?: "ko" | "en";
  onCredential?: (idToken: string) => void;
}

const GOOGLE_SCRIPT_ID = "google-identity-services";

export default function GoogleLoginButton({
  locale = "ko",
  onCredential,
}: GoogleLoginButtonProps) {
  const buttonId = useId();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const { showToast } = useToastStore();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonLocale = useMemo(() => (locale === "ko" ? "ko" : "en"), [locale]);

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current || !window.google?.accounts.id) {
      return;
    }

    if (!clientId) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => {
        if (!credential) {
          showToast("구글 인증 토큰을 받지 못했습니다.");
          return;
        }

        onCredential?.(credential);
      },
      ux_mode: "popup",
      context: "signin",
      cancel_on_tap_outside: true,
    });

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 320,
      locale: buttonLocale,
    });
  }, [buttonLocale, clientId, onCredential, scriptLoaded, showToast]);

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Text size="sm" color="error">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID가 없어 구글 로그인 버튼을 띄울 수 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <>
      <Script
        id={GOOGLE_SCRIPT_ID}
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="space-y-3">
        <div id={buttonId} ref={buttonRef} className="min-h-[44px]" />
        {!scriptLoaded ? (
          <Button disabled className="w-full max-w-[320px] justify-center">
            구글 로그인 불러오는 중...
          </Button>
        ) : null}
      </div>
    </>
  );
}
