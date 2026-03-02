import { useLanguage } from '@/hooks/useLanguage'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-md p-2 hover:bg-secondary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground lg:hidden">{t('app.name')}</h1>
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
      </div>
    </header>
  )
}
