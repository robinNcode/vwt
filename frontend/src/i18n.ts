import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './i18n/en/translation.json'
import bnTranslation from './i18n/bn/translation.json'

const resources = {
    bn: {
        translation: bnTranslation
    },
    en: {
        translation: enTranslation
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'bn', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })

export default i18n
