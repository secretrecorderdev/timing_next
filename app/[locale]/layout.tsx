import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { baseMetadata } from "@/lib/metadata/metadata";
import { Header } from "@/ui/layout/Header";
import NavBar from "@/ui/layout/NavBar";
import GlobalLoading from "@/ui/feedback/GlobalLoading";
import { Notification } from "@/ui/components";
import RealtimeBridge from "@/app/_bridges/RealtimeBridge";

// import { TabItem } from "@/ui/components/HorizontalTab/HorizontalTab.types";
export const metadata: Metadata = baseMetadata;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased max-w-screen-lg mx-auto px-4">
        <RealtimeBridge />
        <Notification />
        <GlobalLoading />
        <Notification />
        <LanguageProvider>
          <Notification />
          <Header />
          <NavBar />
          {/* <HorizontalTab
            tabs={tabs}
          /> */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
