import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AIProvider } from '@/contexts/AIContext'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { Landing } from '@/pages/Landing'
import { Access } from '@/pages/Access'
import { Dashboard } from '@/pages/Dashboard'
import { Prompts } from '@/pages/Prompts'
import { Templates } from '@/pages/Templates'
import { ScoringMatrix } from '@/pages/tools/ScoringMatrix'
import { AccountPlan } from '@/pages/tools/AccountPlan'
import { QBRChecklist } from '@/pages/tools/QBRChecklist'
import { RelationshipMap } from '@/pages/tools/RelationshipMap'
import { AIChat } from '@/pages/AIChat'
import { Gordon } from '@/pages/Gordon'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AIProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/access" element={<Access />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/prompts" element={<Prompts />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/tools/scoring" element={<ScoringMatrix />} />
                  <Route path="/tools/account-plan" element={<AccountPlan />} />
                  <Route path="/tools/qbr" element={<QBRChecklist />} />
                  <Route path="/tools/relationship-map" element={<RelationshipMap />} />
                  <Route path="/ai" element={<AIChat />} />
                  <Route path="/gordon" element={<Gordon />} />
                </Route>
              </Route>
            </Routes>
          </AIProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
