import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { CopyButton } from '@/components/shared/CopyButton'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'

interface PlanData {
  accountName: string
  industry: string
  revenue: string
  mainContact: string
  objectives: string
  risks: string
  opportunities: string
  competitors: string
  actions: string
  timeline: string
}

const EMPTY_PLAN: PlanData = {
  accountName: '',
  industry: '',
  revenue: '',
  mainContact: '',
  objectives: '',
  risks: '',
  opportunities: '',
  competitors: '',
  actions: '',
  timeline: '',
}

const STEPS = ['overview', 'contacts', 'objectives', 'risks', 'opportunities', 'competitors', 'actions', 'review'] as const

const FIELDS_BY_STEP: Record<string, (keyof PlanData)[]> = {
  overview: ['accountName', 'industry', 'revenue'],
  contacts: ['mainContact'],
  objectives: ['objectives'],
  risks: ['risks'],
  opportunities: ['opportunities'],
  competitors: ['competitors'],
  actions: ['actions', 'timeline'],
  review: [],
}

const FIELD_LABELS: Record<string, Record<string, string>> = {
  fr: {
    accountName: 'Nom du compte',
    industry: 'Secteur',
    revenue: 'CA actuel / potentiel',
    mainContact: 'Contacts clés (Nom, Rôle, Influence)',
    objectives: 'Objectifs stratégiques (3-5 max)',
    risks: 'Risques identifiés',
    opportunities: "Opportunités d'expansion",
    competitors: 'Concurrence en place',
    actions: 'Actions prioritaires (avec responsable)',
    timeline: 'Timeline (prochains 90 jours)',
  },
  en: {
    accountName: 'Account name',
    industry: 'Industry',
    revenue: 'Current / potential revenue',
    mainContact: 'Key contacts (Name, Role, Influence)',
    objectives: 'Strategic objectives (3-5 max)',
    risks: 'Identified risks',
    opportunities: 'Expansion opportunities',
    competitors: 'Incumbent competition',
    actions: 'Priority actions (with owner)',
    timeline: 'Timeline (next 90 days)',
  },
}

function generatePlanText(data: PlanData, lang: 'fr' | 'en'): string {
  const labels = FIELD_LABELS[lang]
  const header = lang === 'fr' ? 'PLAN DE COMPTE STRATÉGIQUE' : 'STRATEGIC ACCOUNT PLAN'
  const lines = [
    `═══ ${header} ═══`,
    '',
    `📋 ${labels.accountName}: ${data.accountName}`,
    `🏢 ${labels.industry}: ${data.industry}`,
    `💰 ${labels.revenue}: ${data.revenue}`,
    '',
    `👥 ${labels.mainContact}:`,
    data.mainContact,
    '',
    `🎯 ${labels.objectives}:`,
    data.objectives,
    '',
    `⚠️ ${labels.risks}:`,
    data.risks,
    '',
    `🚀 ${labels.opportunities}:`,
    data.opportunities,
    '',
    `🏁 ${labels.competitors}:`,
    data.competitors,
    '',
    `✅ ${labels.actions}:`,
    data.actions,
    '',
    `📅 ${labels.timeline}:`,
    data.timeline,
    '',
    `─── ${lang === 'fr' ? 'Généré avec KAM AI-First Toolkit' : 'Generated with KAM AI-First Toolkit'} ───`,
  ]
  return lines.join('\n')
}

export function AccountPlan() {
  const { t, lang } = useLanguage()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<PlanData>(EMPTY_PLAN)

  const labels = FIELD_LABELS[lang]
  const currentStep = STEPS[step]
  const fields = FIELDS_BY_STEP[currentStep] || []
  const isReview = currentStep === 'review'

  const updateField = (field: keyof PlanData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const planText = generatePlanText(data, lang)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('accountPlan.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('accountPlan.subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i === step ? 'bg-[var(--kam-navy)]' : i < step ? 'bg-[var(--kam-navy)]/40' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          {t(`accountPlan.steps.${currentStep}`)}
        </h2>

        {isReview ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {lang === 'fr' ? 'Votre plan de compte généré :' : 'Your generated account plan:'}
            </div>
            <pre className="rounded-lg bg-secondary/50 p-4 text-sm whitespace-pre-wrap text-foreground">
              {planText}
            </pre>
            <CopyButton text={planText} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {fields.map((field) => {
              const isMultiline = !['accountName', 'industry', 'revenue'].includes(field)
              return (
                <div key={field}>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {labels[field]}
                  </label>
                  {isMultiline ? (
                    <textarea
                      value={data[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
                    />
                  ) : (
                    <input
                      type="text"
                      value={data[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('accountPlan.previous')}
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--kam-navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--kam-navy-light)]"
            >
              {step === STEPS.length - 2 ? t('accountPlan.generate') : t('accountPlan.next')}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
