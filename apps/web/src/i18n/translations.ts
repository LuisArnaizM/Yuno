import es from "./locales/es.json";
import en from "./locales/en.json";

export type Locale = "es" | "en";
export type TranslationKey = keyof typeof es;

const translations: Record<Locale, Record<TranslationKey, string>> = {
  es,
  en,
};

export function getTranslation(locale: Locale, key: TranslationKey) {
  return translations[locale][key];
}
