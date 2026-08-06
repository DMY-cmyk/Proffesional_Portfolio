export type Lang = 'en' | 'id'

export type LocalizedString = string | { en: string; id?: string }

export function pickLang(value: LocalizedString, lang: Lang): string {
  if (typeof value === 'string') return value
  return value[lang] ?? value.en
}

export function pickLangArray(values: LocalizedString[], lang: Lang): string[] {
  return values.map((v) => pickLang(v, lang))
}
