import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export const translations = {
  en: enTranslations,
  ar: arTranslations,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
export type MonthKey = keyof typeof translations.en.months;
export type WeekdayKey = keyof typeof translations.en.weekdays;
