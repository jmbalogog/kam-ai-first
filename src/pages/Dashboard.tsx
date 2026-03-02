import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import {
  Lightbulb,
  FileDown,
  Wrench,
  Bot,
  ArrowRight,
  BarChart3,
  FileText,
  CheckSquare,
  Users,
} from 'lucide-react'

export function Dashboard() {
  const { t } = useLanguage()

  const quickLinks = [
    { to: '/prompts', icon: Lightbulb, label: t('dashboard.explorePrompts'), color: 'bg-blue-100 text-blue-700' },
    { to: '/templates', icon: FileDown, label: t('dashboard.downloadTemplates'), color: 'bg-green-100 text-green-700' },
    { to: '/tools/scoring', icon: Wrench, label: t('dashboard.useTools'), color: 'bg-purple-100 text-purple-700' },
    { to: '/ai', icon: Bot, label: t('dashboard.askAI'), color: 'bg-amber-100 text-amber-700' },
  ]

  const stats = [
    { value: '50', label: t('dashboard.stats.prompts'), icon: Lightbulb },
    { value: '8', label: t('dashboard.stats.templates'), icon: FileDown },
    { value: '4', label: t('dashboard.stats.tools'), icon: Wrench },
    { value: '6', label: t('dashboard.stats.categories'), icon: BarChart3 },
  ]

  const tools = [
    { to: '/tools/scoring', icon: BarChart3, label: t('nav.scoring') },
    { to: '/tools/account-plan', icon: FileText, label: t('nav.accountPlan') },
    { to: '/tools/qbr', icon: CheckSquare, label: t('nav.qbr') },
    { to: '/tools/relationship-map', icon: Users, label: t('nav.relationshipMap') },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.welcome')}</h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <stat.icon className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">{t('dashboard.quickStart')}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${link.color}`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{link.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">{t('tools.title')}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <tool.icon className="h-5 w-5 text-[var(--kam-navy)]" />
              <span className="text-sm font-medium text-foreground">{tool.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
