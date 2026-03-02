import { useLanguage } from '@/hooks/useLanguage'
import { Bot, Clock } from 'lucide-react'

export function AIChat() {
  const { t } = useLanguage()

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kam-navy)]/10">
        <Bot className="h-10 w-10 text-[var(--kam-navy)]" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">{t('ai.title')}</h1>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-[var(--kam-gold)]/10 px-4 py-2">
        <Clock className="h-4 w-4 text-[var(--kam-gold)]" />
        <span className="text-sm font-semibold text-[var(--kam-gold)]">{t('comingSoon.badge')}</span>
      </div>
      <p className="mt-4 max-w-md text-muted-foreground">{t('comingSoon.aiDescription')}</p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
        <p className="text-sm font-medium text-foreground">{t('comingSoon.inTheMeantime')}</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>&rarr; {t('comingSoon.tip1')}</li>
          <li>&rarr; {t('comingSoon.tip2')}</li>
          <li>&rarr; {t('comingSoon.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
