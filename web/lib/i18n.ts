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

export default i18n;
