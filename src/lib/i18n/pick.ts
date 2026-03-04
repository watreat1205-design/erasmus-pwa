export type I18nDict = Record<string, string> | null | undefined;

export function pickI18n(dict: I18nDict, lang: string, fallback: string): string {
  if (!dict) return fallback;
  if (dict[lang]) return dict[lang];
  const base = lang?.split("-")[0];
  if (base && dict[base]) return dict[base];
  if (dict.en) return dict.en;
  return fallback;
}
