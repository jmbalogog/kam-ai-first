import { useState, useMemo } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { CopyButton } from '@/components/shared/CopyButton'
import { GordonCTA } from '@/components/shared/GordonCTA'
import { categories } from '@/data/categories'
import { Search } from 'lucide-react'

// Placeholder prompts — will be replaced with JSON data files
import { getPrompts, type Prompt } from '@/data/prompts/promptsData'

export function Prompts() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allPrompts = useMemo(() => getPrompts(lang), [lang])

  const filtered = useMemo(() => {
    let result = allPrompts
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }
    return result
  }, [allPrompts, selectedCategory, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('prompts.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('prompts.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('prompts.searchPlaceholder')}
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !selectedCategory
                ? 'bg-[var(--kam-navy)] text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t('prompts.allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[var(--kam-navy)] text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} prompt{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Prompt cards */}
      <div className="space-y-4">
        {filtered.map((prompt: Prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  )
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  const [expanded, setExpanded] = useState(false)
  const { t, lang } = useLanguage()

  const difficultyColors = {
    starter: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  }

  const category = categories.find((c) => c.id === prompt.category)

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kam-navy)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--kam-navy)]">
                <category.icon className="h-3 w-3" />
                {category.label[lang]}
              </span>
            )}
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[prompt.difficulty]}`}>
              {t(`prompts.difficulty.${prompt.difficulty}`)}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-foreground">{prompt.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{prompt.description}</p>
        </div>
        <CopyButton text={prompt.prompt} />
      </div>

      {/* Expandable prompt content */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm font-medium text-[var(--kam-navy)] hover:underline"
      >
        {expanded ? '▼ Masquer' : '▶ Voir le prompt'}
      </button>

      {expanded && (
        <div className="mt-3 rounded-lg bg-secondary/50 p-4">
          <pre className="whitespace-pre-wrap text-sm text-foreground">{prompt.prompt}</pre>
        </div>
      )}

      {/* Tags + Gordon CTA */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        {prompt.gordonBoost && <GordonCTA variant="inline" />}
      </div>
    </div>
  )
}
