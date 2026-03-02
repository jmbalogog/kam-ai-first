import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Link } from 'react-router-dom'

export function AILimitBanner() {
  const { t } = useLanguage()

  return (
    <div className="rounded-lg border-2 border-[var(--kam-gold)] bg-[var(--kam-gold)]/10 p-6 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-[var(--kam-gold)]" />
      <h3 className="mt-3 text-lg font-bold text-foreground">{t('ai.limitReachedTitle')}</h3>
      <p className="mt-2 text-muted-foreground">{t('ai.limitReachedBody')}</p>
      <Link
        to="/gordon"
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--kam-gold)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--kam-gold-light)]"
      >
        {t('ai.discoverGordon')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
