// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import elCommon from "./locales/el/common.json";
import itCommon from "./locales/it/common.json";
import esCommon from "./locales/es/common.json";
import roCommon from "./locales/ro/common.json";
import hrCommon from "./locales/hr/common.json";

let initialized = false;

export function ensureI18n() {
  if (initialized) return i18n;

  initialized = true;

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: enCommon },
        el: { common: elCommon },
        it: { common: itCommon },
        es: { common: esCommon },
        ro: { common: roCommon },
        hr: { common: hrCommon }
      },

       lng: "en", 

      fallbackLng: "en",
      defaultNS: "common",

      supportedLngs: ["en", "el", "it", "es", "ro", "hr"],
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      react: { useSuspense: false },

      detection: {
        // URL wins first (prevents surprises), then localStorage, then navigator
        order: ["querystring", "localStorage", "navigator"],
        lookupQuerystring: "lang",
        caches: ["localStorage"]
      },

      returnNull: false,
      returnEmptyString: false,

      interpolation: { escapeValue: false }
    });

  return i18n;
}

export default i18n;
