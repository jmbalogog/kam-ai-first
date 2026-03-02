import { useState, useMemo } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { RotateCcw } from 'lucide-react'

interface CheckItem {
  id: string
  text: { fr: string; en: string }
  section: string
}

const CHECKLIST_ITEMS: CheckItem[] = [
  // Preparation
  { id: 'p1', section: 'preparation', text: { fr: 'Collecter les KPIs et métriques du trimestre', en: 'Collect quarter KPIs and metrics' } },
  { id: 'p2', section: 'preparation', text: { fr: 'Analyser les tickets support et incidents majeurs', en: 'Analyze support tickets and major incidents' } },
  { id: 'p3', section: 'preparation', text: { fr: 'Préparer le bilan des actions du trimestre précédent', en: 'Prepare previous quarter action items review' } },
  { id: 'p4', section: 'preparation', text: { fr: "Vérifier l'organigramme et les changements de personnel", en: 'Check org chart and personnel changes' } },
  { id: 'p5', section: 'preparation', text: { fr: 'Rechercher les actualités du client (presse, LinkedIn, rapports)', en: 'Research client news (press, LinkedIn, reports)' } },
  // Agenda
  { id: 'a1', section: 'agenda', text: { fr: 'Définir les objectifs de la réunion (max 3)', en: 'Define meeting objectives (max 3)' } },
  { id: 'a2', section: 'agenda', text: { fr: "Envoyer l'agenda 48h avant la réunion", en: 'Send agenda 48h before meeting' } },
  { id: 'a3', section: 'agenda', text: { fr: 'Confirmer la présence des décideurs clés', en: 'Confirm attendance of key decision-makers' } },
  { id: 'a4', section: 'agenda', text: { fr: "Prévoir du temps pour les questions du client (30% de l'agenda)", en: 'Allocate time for client questions (30% of agenda)' } },
  // Performance
  { id: 'r1', section: 'performance', text: { fr: 'Présenter les résultats vs objectifs fixés', en: 'Present results vs set objectives' } },
  { id: 'r2', section: 'performance', text: { fr: 'Mettre en avant les quick wins et succès', en: 'Highlight quick wins and successes' } },
  { id: 'r3', section: 'performance', text: { fr: 'Adresser proactivement les points négatifs', en: 'Proactively address negative points' } },
  { id: 'r4', section: 'performance', text: { fr: 'Quantifier la valeur ajoutée délivrée', en: 'Quantify delivered added value' } },
  // Strategy
  { id: 's1', section: 'strategy', text: { fr: "Discuter les priorités business du client pour le prochain trimestre", en: "Discuss client's business priorities for next quarter" } },
  { id: 's2', section: 'strategy', text: { fr: 'Identifier les nouvelles opportunités de collaboration', en: 'Identify new collaboration opportunities' } },
  { id: 's3', section: 'strategy', text: { fr: "Aligner votre roadmap sur les enjeux du client", en: "Align your roadmap with client's challenges" } },
  // Actions
  { id: 'ac1', section: 'actions', text: { fr: 'Définir les actions avec responsables et deadlines', en: 'Define actions with owners and deadlines' } },
  { id: 'ac2', section: 'actions', text: { fr: "S'accorder sur les KPIs du prochain trimestre", en: 'Agree on next quarter KPIs' } },
  { id: 'ac3', section: 'actions', text: { fr: "Planifier la prochaine QBR (date, format, participants)", en: 'Schedule next QBR (date, format, attendees)' } },
  // Follow-up
  { id: 'f1', section: 'followup', text: { fr: 'Envoyer le compte-rendu sous 24h', en: 'Send meeting notes within 24h' } },
  { id: 'f2', section: 'followup', text: { fr: 'Créer les tâches dans votre CRM/outil de suivi', en: 'Create tasks in your CRM/tracking tool' } },
  { id: 'f3', section: 'followup', text: { fr: 'Planifier les points de suivi intermédiaires', en: 'Schedule intermediate follow-up checkpoints' } },
]

const SECTIONS = ['preparation', 'agenda', 'performance', 'strategy', 'actions', 'followup'] as const
const STORAGE_KEY = 'kam_qbr_checklist'

function loadChecked(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

export function QBRChecklist() {
  const { t, lang } = useLanguage()
  const [checked, setChecked] = useState<Set<string>>(loadChecked)

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const reset = () => {
    setChecked(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }

  const total = CHECKLIST_ITEMS.length
  const done = checked.size
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const grouped = useMemo(() => {
    const map = new Map<string, CheckItem[]>()
    for (const section of SECTIONS) {
      map.set(section, CHECKLIST_ITEMS.filter((item) => item.section === section))
    }
    return map
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('qbrChecklist.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('qbrChecklist.subtitle')}</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t('qbrChecklist.reset')}
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{t('qbrChecklist.progress')}</span>
          <span className="text-muted-foreground">{done}/{total} ({progress}%)</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[var(--kam-navy)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const items = grouped.get(section) || []
          const sectionDone = items.filter((i) => checked.has(i.id)).length
          return (
            <div key={section} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  {t(`qbrChecklist.sections.${section}`)}
                </h2>
                <span className="text-xs text-muted-foreground">{sectionDone}/{items.length}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 hover:bg-secondary/50">
                      <input
                        type="checkbox"
                        checked={checked.has(item.id)}
                        onChange={() => toggle(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--kam-navy)]"
                      />
                      <span className={`text-sm ${checked.has(item.id) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {item.text[lang]}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
