import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { LocaleType } from "@/context/LanguageContext";
import { Header } from "@/ui/layout/Header";
// import HorizontalTabs from "@/ui/components/HorizontalTabs";
export const metadata: Metadata = {
  title: "더타이밍",
  description: "더 타이밍 웹페이지 입니다.",
};

// 이제 레이아웃 헤더 만들어야 함.
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
          <Header />
          {/* <HorizontalTabs /> */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
