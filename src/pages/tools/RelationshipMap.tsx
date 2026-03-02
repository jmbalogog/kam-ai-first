import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Influence = 'high' | 'medium' | 'low'
type Sentiment = 'champion' | 'supportive' | 'neutral' | 'resistant' | 'blocker'

interface Stakeholder {
  id: string
  name: string
  role: string
  influence: Influence
  sentiment: Sentiment
}

const STORAGE_KEY = 'kam_relationship_map'

function loadStakeholders(): Stakeholder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStakeholders(data: Stakeholder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  champion: 'bg-green-100 text-green-800 border-green-300',
  supportive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-300',
  resistant: 'bg-orange-100 text-orange-800 border-orange-300',
  blocker: 'bg-red-100 text-red-800 border-red-300',
}

const INFLUENCE_ORDER: Influence[] = ['high', 'medium', 'low']
const SENTIMENT_ORDER: Sentiment[] = ['champion', 'supportive', 'neutral', 'resistant', 'blocker']

export function RelationshipMap() {
  const { t, lang } = useLanguage()
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(loadStakeholders)
  const [form, setForm] = useState({ name: '', role: '' })

  const update = (updated: Stakeholder[]) => {
    setStakeholders(updated)
    saveStakeholders(updated)
  }

  const add = () => {
    if (!form.name.trim()) return
    const newSh: Stakeholder = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      role: form.role.trim(),
      influence: 'medium',
      sentiment: 'neutral',
    }
    update([...stakeholders, newSh])
    setForm({ name: '', role: '' })
  }

  const remove = (id: string) => update(stakeholders.filter((s) => s.id !== id))

  const updateField = (id: string, field: keyof Stakeholder, value: string) => {
    update(stakeholders.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  // Build grid data
  const getCell = (influence: Influence, sentiment: Sentiment) =>
    stakeholders.filter((s) => s.influence === influence && s.sentiment === sentiment)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('relationshipMap.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('relationshipMap.subtitle')}</p>
      </div>

      {/* Add form */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={t('relationshipMap.name')}
          className="flex-1 min-w-[150px] rounded-lg border border-input bg-card px-4 py-2.5 text-sm"
        />
        <input
          type="text"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={t('relationshipMap.role')}
          className="flex-1 min-w-[150px] rounded-lg border border-input bg-card px-4 py-2.5 text-sm"
        />
        <button
          onClick={add}
          disabled={!form.name.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--kam-navy)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--kam-navy-light)] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {t('relationshipMap.addStakeholder')}
        </button>
      </div>

      {stakeholders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          {t('relationshipMap.noStakeholders')}
        </div>
      ) : (
        <>
          {/* Stakeholder list with editable influence/sentiment */}
          <div className="space-y-2">
            {stakeholders.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="min-w-[120px] flex-1">
                  <span className="font-medium text-foreground">{s.name}</span>
                  {s.role && <span className="ml-2 text-sm text-muted-foreground">({s.role})</span>}
                </div>
                <select
                  value={s.influence}
                  onChange={(e) => updateField(s.id, 'influence', e.target.value)}
                  className="rounded border border-input bg-background px-2 py-1 text-sm"
                >
                  {INFLUENCE_ORDER.map((v) => (
                    <option key={v} value={v}>{t(`relationshipMap.influenceLevels.${v}`)}</option>
                  ))}
                </select>
                <select
                  value={s.sentiment}
                  onChange={(e) => updateField(s.id, 'sentiment', e.target.value)}
                  className="rounded border border-input bg-background px-2 py-1 text-sm"
                >
                  {SENTIMENT_ORDER.map((v) => (
                    <option key={v} value={v}>{t(`relationshipMap.sentimentLevels.${v}`)}</option>
                  ))}
                </select>
                <button onClick={() => remove(s.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Influence / Sentiment Grid */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-foreground">{t('relationshipMap.grid')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-24 border border-border bg-secondary/50 p-2 text-center font-medium">
                      {lang === 'fr' ? 'Influence ↓ / Sentiment →' : 'Influence ↓ / Sentiment →'}
                    </th>
                    {SENTIMENT_ORDER.map((s) => (
                      <th key={s} className="border border-border bg-secondary/50 p-2 text-center font-medium">
                        {t(`relationshipMap.sentimentLevels.${s}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INFLUENCE_ORDER.map((inf) => (
                    <tr key={inf}>
                      <td className="border border-border bg-secondary/50 p-2 text-center font-medium">
                        {t(`relationshipMap.influenceLevels.${inf}`)}
                      </td>
                      {SENTIMENT_ORDER.map((sent) => {
                        const cellStakeholders = getCell(inf, sent)
                        return (
                          <td key={sent} className="border border-border p-2 align-top" style={{ minWidth: 120 }}>
                            <div className="flex flex-wrap gap-1">
                              {cellStakeholders.map((sh) => (
                                <span
                                  key={sh.id}
                                  className={cn('inline-block rounded-md border px-2 py-1 text-xs font-medium', SENTIMENT_COLORS[sent])}
                                >
                                  {sh.name}
                                </span>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
