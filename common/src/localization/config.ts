import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import common from './locales/en/common.json';
import error from './locales/en/error.json';
import main from './locales/en/main.json';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    resources: {
      en: {
        translation: {
          ...main,
          ...common,
          ...error,
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18next;
