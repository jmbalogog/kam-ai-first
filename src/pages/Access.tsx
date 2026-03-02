import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { LogIn, Loader2, ArrowLeft, Shield } from 'lucide-react'

export function Access() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim() || loading) return

    setError(null)
    setLoading(true)

    const result = await login(email.trim(), password.trim())

    if (result.valid) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(
        result.error === 'network'
          ? t('access.error_network')
          : t('access.error_invalid'),
      )
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
        <LanguageToggle />
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--kam-navy)]/10">
              <LogIn className="h-7 w-7 text-[var(--kam-navy)]" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">{t('access.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('access.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('access.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder={t('access.emailPlaceholder')}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('access.passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder={t('access.passwordPlaceholder')}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kam-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kam-navy)]/20"
              />
            </div>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--kam-navy)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--kam-navy-light)] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t('access.button')
              )}
            </button>
          </form>

          {/* RGPD notice */}
          <div className="mt-6 flex items-start gap-2 rounded-lg bg-secondary/50 p-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kam-success)]" />
            <p className="text-xs text-muted-foreground">{t('privacy.notice')}</p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">{t('access.no_code')}</p>
            <a
              href="https://systeme.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-[var(--kam-gold)]"
            >
              {t('access.buy_link')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
