import { NavLink } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import {
  LayoutDashboard,
  Lightbulb,
  FileDown,
  BarChart3,
  FileText,
  CheckSquare,
  Users,
  X,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarLocalProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarLocal({ isOpen, onClose }: SidebarLocalProps) {
  const { t } = useLanguage()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/prompts', icon: Lightbulb, label: t('nav.prompts') },
    { to: '/templates', icon: FileDown, label: t('nav.templates') },
    { type: 'divider' as const, label: t('nav.tools') },
    { to: '/tools/scoring', icon: BarChart3, label: t('nav.scoring') },
    { to: '/tools/account-plan', icon: FileText, label: t('nav.accountPlan') },
    { to: '/tools/qbr', icon: CheckSquare, label: t('nav.qbr') },
    { to: '/tools/relationship-map', icon: Users, label: t('nav.relationshipMap') },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-lg font-bold text-sidebar-primary">{t('app.name')}</span>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-sidebar-accent lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              if ('type' in item && item.type === 'divider') {
                return (
                  <li key={index} className="pb-1 pt-4">
                    {item.label && (
                      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                        {item.label}
                      </span>
                    )}
                  </li>
                )
              }

              const navItem = item as { to: string; icon: typeof LayoutDashboard; label: string }

              return (
                <li key={navItem.to}>
                  <NavLink
                    to={navItem.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      )
                    }
                  >
                    <navItem.icon className="h-4 w-4 shrink-0" />
                    {navItem.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* RGPD footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-start gap-2 rounded-md bg-sidebar-accent/30 p-2.5">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <p className="text-[10px] leading-tight text-sidebar-foreground/60">
              {t('privacy.footer')}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
