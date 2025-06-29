import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ko from './ko.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  // lng는 런타임에 설정할 예정
});

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: en },
//       ko: { translation: ko },
//     },
//     lng: 'ko', // 초기 언어
//     fallbackLng: 'en',
//     interpolation: {
//       escapeValue: false,
//     },
//   });

export default i18n;
