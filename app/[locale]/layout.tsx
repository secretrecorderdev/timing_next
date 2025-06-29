import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { LocaleType } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "더타이밍",
  description: "더 타이밍 웹페이지 입니다.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>
}){
  const { locale } = await params;
  
  return (
    <html lang={locale}>
      <body
        className="antialiased"
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
