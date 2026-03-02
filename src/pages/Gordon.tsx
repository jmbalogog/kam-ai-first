import { useLanguage } from '@/hooks/useLanguage'
import { Sparkles, Clock, Zap, MessageSquare, Target, Users } from 'lucide-react'

export function Gordon() {
  const { t } = useLanguage()

  const features = [
    { icon: Zap, label: t('gordon.features.unlimited') },
    { icon: MessageSquare, label: t('gordon.features.roleplay') },
    { icon: Target, label: t('gordon.features.objections') },
    { icon: Users, label: t('gordon.features.strategy') },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kam-gold)]/10">
          <Sparkles className="h-8 w-8 text-[var(--kam-gold)]" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">{t('gordon.title')}</h1>
        <div className="mt-3 mx-auto flex w-fit items-center gap-2 rounded-full bg-[var(--kam-gold)]/10 px-4 py-2">
          <Clock className="h-4 w-4 text-[var(--kam-gold)]" />
          <span className="text-sm font-semibold text-[var(--kam-gold)]">{t('comingSoon.badge')}</span>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">{t('gordon.subtitle')}</p>
      </div>

      {/* Features preview */}
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 opacity-75">
            <feature.icon className="h-5 w-5 shrink-0 text-[var(--kam-gold)]" />
            <span className="text-sm font-medium text-foreground">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* Coming soon message */}
      <div className="rounded-xl border-2 border-dashed border-[var(--kam-gold)]/30 bg-[var(--kam-gold)]/5 p-6 text-center">
        <p className="text-sm font-medium text-foreground">{t('comingSoon.gordonMessage')}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('comingSoon.gordonSub')}</p>
      </div>
    </div>
  )
}
