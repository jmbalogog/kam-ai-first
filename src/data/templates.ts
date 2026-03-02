export interface Template {
  id: string
  label: { fr: string; en: string }
  description: { fr: string; en: string }
  format: 'xlsx' | 'docx' | 'pptx'
  filename: { fr: string; en: string }
}

export const templates: Template[] = [
  {
    id: 'account-plan',
    label: { fr: 'Plan de Compte 1 Page', en: 'One-Page Account Plan' },
    description: {
      fr: 'Template structuré pour résumer votre stratégie de compte sur une page',
      en: 'Structured template to summarize your account strategy on one page',
    },
    format: 'docx',
    filename: { fr: 'plan-de-compte-fr.docx', en: 'account-plan-en.docx' },
  },
  {
    id: 'scoring-matrix',
    label: { fr: 'Scoring Matrix', en: 'Scoring Matrix' },
    description: {
      fr: 'Matrice de scoring pour prioriser vos comptes sur 6 critères pondérés',
      en: 'Scoring matrix to prioritize accounts on 6 weighted criteria',
    },
    format: 'xlsx',
    filename: { fr: 'scoring-matrix-fr.xlsx', en: 'scoring-matrix-en.xlsx' },
  },
  {
    id: 'relationship-map',
    label: { fr: 'Carte Relationnelle', en: 'Relationship Map' },
    description: {
      fr: 'Cartographiez les parties prenantes, leur influence et leur sentiment',
      en: 'Map stakeholders, their influence level and sentiment',
    },
    format: 'xlsx',
    filename: { fr: 'carte-relationnelle-fr.xlsx', en: 'relationship-map-en.xlsx' },
  },
  {
    id: 'qbr-template',
    label: { fr: 'Template QBR', en: 'QBR Template' },
    description: {
      fr: 'Présentation PowerPoint pour votre revue trimestrielle client',
      en: 'PowerPoint presentation for your quarterly business review',
    },
    format: 'pptx',
    filename: { fr: 'qbr-template-fr.pptx', en: 'qbr-template-en.pptx' },
  },
  {
    id: 'capture-plan',
    label: { fr: 'Capture Plan', en: 'Capture Plan' },
    description: {
      fr: 'Plan de rétention proactif pour sécuriser le renouvellement',
      en: 'Proactive retention plan to secure contract renewals',
    },
    format: 'xlsx',
    filename: { fr: 'capture-plan-fr.xlsx', en: 'capture-plan-en.xlsx' },
  },
  {
    id: 'gap-analysis',
    label: { fr: 'Analyse des Écarts', en: 'Gap Analysis' },
    description: {
      fr: 'Identifiez les écarts entre état actuel et potentiel de chaque compte',
      en: 'Identify gaps between current state and potential for each account',
    },
    format: 'xlsx',
    filename: { fr: 'gap-analysis-fr.xlsx', en: 'gap-analysis-en.xlsx' },
  },
  {
    id: 'strategic-conversation',
    label: { fr: 'Canvas Conversation Stratégique', en: 'Strategic Conversation Canvas' },
    description: {
      fr: 'Canvas pour structurer vos conversations stratégiques avec vos clients',
      en: 'Canvas to structure strategic conversations with your clients',
    },
    format: 'docx',
    filename: { fr: 'conversation-strategique-fr.docx', en: 'strategic-conversation-en.docx' },
  },
  {
    id: '30-60-90',
    label: { fr: 'Plan 30-60-90 Jours', en: '30-60-90 Day Plan' },
    description: {
      fr: "Plan d'intégration structuré pour les 3 premiers mois sur un nouveau compte",
      en: 'Structured onboarding plan for your first 3 months on a new account',
    },
    format: 'xlsx',
    filename: { fr: 'plan-30-60-90-fr.xlsx', en: '30-60-90-plan-en.xlsx' },
  },
]
