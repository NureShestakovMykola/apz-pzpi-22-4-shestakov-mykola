import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/translation_en.json";
import translationUK from "./locales/translation_uk.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: { translation: translationEN },
            uk: { translation: translationUK },
        },
    });

export default i18n;