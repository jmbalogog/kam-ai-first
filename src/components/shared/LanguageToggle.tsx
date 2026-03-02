import { useLanguage } from '@/hooks/useLanguage'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
    >
      <span>{lang === 'fr' ? 'FR' : 'EN'}</span>
      <span className="text-muted-foreground">|</span>
      <span className="text-muted-foreground">{lang === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  )
}
