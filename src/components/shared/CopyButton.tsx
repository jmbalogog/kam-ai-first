import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {t('prompts.copied')}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {t('prompts.copy')}
        </>
      )}
    </button>
  )
}
