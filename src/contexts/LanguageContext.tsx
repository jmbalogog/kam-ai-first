import { createContext, useState, useCallback, type ReactNode } from 'react'
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'

export type Lang = 'fr' | 'en'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const translations: Record<Lang, Record<string, unknown>> = {
  fr: frTranslations,
  en: enTranslations,
}

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : undefined
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('kam_lang')
    return stored === 'en' ? 'en' : 'fr'
  })

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('kam_lang', newLang)
    document.documentElement.lang = newLang
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[lang], key)
      if (!value) return key
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v))
        }
      }
      return value
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
