import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Link } from 'react-router-dom'

interface GordonCTAProps {
  variant?: 'inline' | 'banner'
}

export function GordonCTA({ variant = 'inline' }: GordonCTAProps) {
  const { t } = useLanguage()

  if (variant === 'banner') {
    return (
      <div className="rounded-lg border border-[var(--kam-gold)]/30 bg-[var(--kam-gold)]/5 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--kam-gold)]" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">{t('gordon.title')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('gordon.subtitle')}</p>
            <Link
              to="/gordon"
              className="mt-3 inline-flex items-center rounded-md bg-[var(--kam-gold)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--kam-gold-light)]"
            >
              {t('gordon.cta')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      to="/gordon"
      className="inline-flex items-center gap-1.5 text-sm text-[var(--kam-gold)] hover:text-[var(--kam-gold-light)]"
    >
      <Sparkles className="h-3.5 w-3.5" />
      {t('prompts.gordonBoost')}
    </Link>
  )
}
