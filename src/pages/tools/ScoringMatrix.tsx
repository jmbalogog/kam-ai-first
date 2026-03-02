import { useState, useCallback } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Plus, Trash2 } from 'lucide-react'

interface Account {
  id: string
  name: string
  criteria: Record<string, number>
}

const CRITERIA_KEYS = [
  'revenue_potential',
  'strategic_fit',
  'relationship_strength',
  'growth_likelihood',
  'competitive_position',
  'decision_timeline',
] as const

const STORAGE_KEY = 'kam_scoring_accounts'

function loadAccounts(): Account[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

function getScore(account: Account): number {
  return Object.values(account.criteria).reduce((sum, v) => sum + v, 0)
}

function getScoreColor(score: number): string {
  if (score >= 24) return 'bg-green-100 text-green-800'
  if (score >= 18) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

export function ScoringMatrix() {
  const { t } = useLanguage()
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts)
  const [newName, setNewName] = useState('')

  const update = useCallback((updated: Account[]) => {
    const sorted = [...updated].sort((a, b) => getScore(b) - getScore(a))
    setAccounts(sorted)
    saveAccounts(sorted)
  }, [])

  const addAccount = () => {
    if (!newName.trim()) return
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      criteria: Object.fromEntries(CRITERIA_KEYS.map((k) => [k, 3])),
    }
    update([...accounts, newAccount])
    setNewName('')
  }

  const updateCriteria = (id: string, key: string, value: number) => {
    update(
      accounts.map((a) =>
        a.id === id ? { ...a, criteria: { ...a.criteria, [key]: value } } : a,
      ),
    )
  }

  const removeAccount = (id: string) => {
    update(accounts.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('scoring.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('scoring.subtitle')}</p>
      </div>

      {/* Add account */}
      <div className="flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAccount()}
          placeholder={t('scoring.accountName')}
          className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
        />
        <button
          onClick={addAccount}
          disabled={!newName.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--kam-navy)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--kam-navy-light)] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {t('scoring.addAccount')}
        </button>
      </div>

      {/* Table */}
      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          {t('scoring.noAccounts')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3 text-left font-semibold text-foreground">{t('scoring.accountName')}</th>
                {CRITERIA_KEYS.map((key) => (
                  <th key={key} className="px-2 py-3 text-center font-medium text-muted-foreground" title={t(`scoring.criteria.${key}`)}>
                    <span className="hidden lg:inline">{t(`scoring.criteria.${key}`)}</span>
                    <span className="lg:hidden">{t(`scoring.criteria.${key}`).slice(0, 6)}</span>
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold text-foreground">{t('scoring.score')}</th>
                <th className="px-2 py-3 text-center">{t('scoring.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const score = getScore(account)
                return (
                  <tr key={account.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-3 font-medium text-foreground">{account.name}</td>
                    {CRITERIA_KEYS.map((key) => (
                      <td key={key} className="px-2 py-3 text-center">
                        <select
                          value={account.criteria[key]}
                          onChange={(e) => updateCriteria(account.id, key, parseInt(e.target.value))}
                          className="w-14 rounded border border-input bg-card px-1 py-1 text-center text-sm"
                        >
                          {[1, 2, 3, 4, 5].map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex h-8 w-10 items-center justify-center rounded-full text-sm font-bold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => removeAccount(account.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
