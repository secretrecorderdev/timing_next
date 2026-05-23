import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/shared/context/LanguageContext";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { baseMetadata } from "@/shared/lib/metadata";
import { Header } from "@/shared/ui/layout/Header";
import NavBar from "@/shared/ui/layout/NavBar";
import GlobalLoading from "@/shared/ui/feedback/GlobalLoading";
import GlobalToast from "@/shared/ui/feedback/GlobalToast";
import GlobalNotification from "@/shared/ui/feedback/GlobalNotification";
import SignalInboxModal from "@/shared/ui/feedback/SignalInboxModal";
import { TimingTradeItemsBootstrap } from "@/shared/bootstrap/TimingTradeItemsBootstrap";
import GuestAccessBootstrap from "@/shared/bootstrap/GuestAccessBootstrap";
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
      <body className="mx-auto min-h-screen max-w-screen-lg overflow-x-hidden px-3 pb-20 antialiased sm:px-4 sm:pb-24">
        <QueryProvider>
          <GlobalLoading />
          <GlobalToast />
          <GlobalNotification />
          <SignalInboxModal />
          <LanguageProvider>
            <TimingTradeItemsBootstrap />
            <GuestAccessBootstrap />
            <Header />
            <NavBar />
            {/* <HorizontalTab
              tabs={tabs}
            /> */}
            {children}
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
