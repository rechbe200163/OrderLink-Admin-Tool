export type Locale = (typeof locales)[number];

export const locales = ['en', 'de', 'fr', 'es', 'nl', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const;
export const defaultLocale: Locale = 'de';
