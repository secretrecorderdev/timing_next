'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/common/i18n/config';
import { useRouter, usePathname } from 'next/navigation';

export type LocaleType = 'ko' | 'en';

const LanguageContext = createContext<{
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
}>({ locale: 'ko', setLocale: () => {} });

export function LanguageProvider({
  children,
  initialLocale = 'ko',
}: {
  children: React.ReactNode;
  initialLocale?: LocaleType;
}) {
  const [locale, setLocaleState] = useState<LocaleType>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (newLocale: LocaleType) => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    setLocaleState(newLocale);
    router.push(newPath);
  };

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}