import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {isTestEnvironment} from "./environment.ts"

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: ['es', 'en'],
        debug: true,
        saveMissing: isTestEnvironment,
        saveMissingTo: 'all',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            addPath: '/locales/{{lng}}/{{ns}}.json', // Path to save missing keys
        },
    })

export default i18n
