import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// We will dynamically import or define the resources here.
// For now, let's define the structure.
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';
import vi from './locales/vi.json';
import ar from './locales/ar.json';
import es from './locales/es.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh },
  ru: { translation: ru },
  vi: { translation: vi },
  ar: { translation: ar },
  es: { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    parseMissingKeyHandler: (key) => `[ERR: ${key}]`,
  });

export default i18n;
