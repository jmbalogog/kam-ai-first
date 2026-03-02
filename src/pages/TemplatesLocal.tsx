import { useCallback } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { templates } from '@/data/templates'
import { embeddedTemplates } from '@/data/templates-embedded'
import { Download, FileSpreadsheet, FileText, Presentation } from 'lucide-react'

const formatIcons = {
  xlsx: FileSpreadsheet,
  docx: FileText,
  pptx: Presentation,
}

const formatColors = {
  xlsx: 'bg-green-100 text-green-700',
  docx: 'bg-blue-100 text-blue-700',
  pptx: 'bg-orange-100 text-orange-700',
}

export function TemplatesLocal() {
  const { t, lang } = useLanguage()

  const handleDownload = useCallback((filename: string) => {
    const embedded = embeddedTemplates[filename]
    if (!embedded) return

    const byteChars = atob(embedded.data)
    const byteNumbers = new Uint8Array(byteChars.length)
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i)
    }
    const blob = new Blob([byteNumbers], { type: embedded.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('templates.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('templates.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => {
          const FormatIcon = formatIcons[template.format]
          const filename = template.filename[lang]
          return (
            <div
              key={template.id}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${formatColors[template.format]}`}>
                <FormatIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{template.label[lang]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{template.description[lang]}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${formatColors[template.format]}`}>
                    {t(`templates.format.${template.format}`)}
                  </span>
                  <button
                    onClick={() => handleDownload(filename)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--kam-navy)] hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t('templates.download')}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
