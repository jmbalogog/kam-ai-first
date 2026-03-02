import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Lightbulb, FileDown, Wrench, Bot, ArrowRight } from 'lucide-react'

export function Landing() {
  const { t } = useLanguage()

  const features = [
    { icon: Lightbulb, title: t('landing.features.prompts'), desc: t('landing.features.promptsDesc') },
    { icon: FileDown, title: t('landing.features.templates'), desc: t('landing.features.templatesDesc') },
    { icon: Wrench, title: t('landing.features.tools'), desc: t('landing.features.toolsDesc') },
    { icon: Bot, title: t('landing.features.ai'), desc: t('landing.features.aiDesc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-[var(--kam-navy)]">{t('app.name')}</span>
        <LanguageToggle />
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-24">
        <h1 className="text-4xl font-bold leading-tight text-[var(--kam-navy)] lg:text-5xl">
          {t('landing.hero')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {t('landing.subtitle')}
        </p>
        <Link
          to="/access"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--kam-navy)] px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[var(--kam-navy-light)]"
        >
          {t('landing.cta')}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--kam-navy)]/10">
                <feature.icon className="h-5 w-5 text-[var(--kam-navy)]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>{t('landing.social')}</p>
      </footer>
    </div>
  )
}
