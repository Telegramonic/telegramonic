import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// English
import clientEn from './locales/en/client.json';
import commonEn from './locales/en/common.json';
import errorEn from './locales/en/error.json';
import webEn from './locales/en/web.json';

// Hindi
import clientHi from './locales/hi/client.json';
import commonHi from './locales/hi/common.json';
import errorHi from './locales/hi/error.json';
import webHi from './locales/hi/web.json';

// Spanish
import clientEs from './locales/es/client.json';
import commonEs from './locales/es/common.json';
import errorEs from './locales/es/error.json';
import webEs from './locales/es/web.json';

// Russian
import clientRu from './locales/ru/client.json';
import commonRu from './locales/ru/common.json';
import errorRu from './locales/ru/error.json';
import webRu from './locales/ru/web.json';

// Chinese
import clientZh from './locales/zh/client.json';
import commonZh from './locales/zh/common.json';
import errorZh from './locales/zh/error.json';
import webZh from './locales/zh/web.json';

// Japanese
import clientJa from './locales/ja/client.json';
import commonJa from './locales/ja/common.json';
import errorJa from './locales/ja/error.json';
import webJa from './locales/ja/web.json';

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

const mergeAll = (sources: any[]) =>
  sources.reduce((acc, src) => deepMerge(acc, src), {});

const enTranslations = mergeAll([clientEn, webEn, commonEn, errorEn]);
const hiTranslations = mergeAll([clientHi, webHi, commonHi, errorHi]);
const esTranslations = mergeAll([clientEs, webEs, commonEs, errorEs]);
const ruTranslations = mergeAll([clientRu, webRu, commonRu, errorRu]);
const zhTranslations = mergeAll([clientZh, webZh, commonZh, errorZh]);
const jaTranslations = mergeAll([clientJa, webJa, commonJa, errorJa]);

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    resources: {
      en: {
        translation: enTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
      es: {
        translation: esTranslations,
      },
      ru: {
        translation: ruTranslations,
      },
      zh: {
        translation: zhTranslations,
      },
      ja: {
        translation: jaTranslations,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18next;
