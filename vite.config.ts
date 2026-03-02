import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Dev-only mock API so we can run with `npm run dev` (no Vercel)
function devApiMock(): Plugin {
  return {
    name: 'dev-api-mock',
    configureServer(server) {
      server.middlewares.use('/api/validate-code', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { email, password } = JSON.parse(body)
            // Dev test credentials
            const validUsers = [
              { email: 'test@kam.com', password: 'test1234' },
              { email: 'demo@kam.com', password: 'demo1234' },
            ]
            const isValid = validUsers.some(
              (u) => u.email === email?.trim()?.toLowerCase() && u.password === password
            )
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ valid: isValid }))
          } catch {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ valid: false }))
          }
        })
      })

      server.middlewares.use('/api/chat', (_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          choices: [{ message: { content: 'AI Coach is not available in dev mode. Deploy to Vercel with OPENROUTER_API_KEY to enable.' } }],
        }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApiMock()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
