import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/shared/context/LanguageContext";
import { baseMetadata } from "@/shared/lib/metadata";
import { Header } from "@/shared/ui/layout/Header";
import NavBar from "@/shared/ui/layout/NavBar";
import GlobalLoading from "@/shared/ui/feedback/GlobalLoading";
import GlobalToast from "@/shared/ui/feedback/GlobalToast";
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
        <GlobalLoading />
        <GlobalToast />
        <LanguageProvider>
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
