import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AppShellLocal } from '@/components/layout/AppShellLocal'
import { Dashboard } from '@/pages/Dashboard'
import { Prompts } from '@/pages/Prompts'
import { TemplatesLocal } from '@/pages/TemplatesLocal'
import { ScoringMatrix } from '@/pages/tools/ScoringMatrix'
import { AccountPlan } from '@/pages/tools/AccountPlan'
import { QBRChecklist } from '@/pages/tools/QBRChecklist'
import { RelationshipMap } from '@/pages/tools/RelationshipMap'

export function AppLocal() {
  return (
    <HashRouter>
      <LanguageProvider>
        <Routes>
          <Route element={<AppShellLocal />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/templates" element={<TemplatesLocal />} />
            <Route path="/tools/scoring" element={<ScoringMatrix />} />
            <Route path="/tools/account-plan" element={<AccountPlan />} />
            <Route path="/tools/qbr" element={<QBRChecklist />} />
            <Route path="/tools/relationship-map" element={<RelationshipMap />} />
          </Route>
          {/* Redirect root to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </LanguageProvider>
    </HashRouter>
  )
}
