import type { Metadata } from "next";

import "@/app/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { LocaleType } from "@/context/LanguageContext";
import { baseMetadata } from "@/lib/metadata";

export const metadata: Metadata = baseMetadata;

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
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
