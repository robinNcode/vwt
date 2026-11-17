'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bnTranslation from './i18n/bn/translation.json';
import enTranslation from './i18n/en/translation.json';

const resources = {
    bn: { translation: bnTranslation },
    en: { translation: enTranslation },
};

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: 'bn',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });
}

if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('vwt_language');

    if (stored === 'bn' || stored === 'en') {
        void i18n.changeLanguage(stored);
    }

    i18n.on('languageChanged', (language) => {
        window.localStorage.setItem('vwt_language', language);
        document.documentElement.lang = language;
    });
}

export default i18n;
