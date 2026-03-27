export const SUPPORTED_LANGS = [
  'zh',
  'en',
  'fr',
  'es',
  'ru',
  'ja',
  'ko',
  'pt',
  'de',
  'id',
] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';
