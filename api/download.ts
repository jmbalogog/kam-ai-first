import { readFileSync } from 'fs'
import { join } from 'path'

export default function handler(req: any, res: any) {
  try {
    const filePath = join(process.cwd(), 'public', 'kam-ai-first-toolkit.zip')
    const file = readFileSync(filePath)

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename="kam-ai-first-toolkit.zip"')
    res.setHeader('Content-Length', file.length)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(file)
  } catch {
    res.status(404).send('File not found')
  }
}
