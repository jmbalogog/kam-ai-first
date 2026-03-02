import {
  BarChart3,
  Target,
  Shield,
  MessageSquare,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export interface Category {
  id: string
  icon: LucideIcon
  label: { fr: string; en: string }
  description: { fr: string; en: string }
  promptCount: number
}

export const categories: Category[] = [
  {
    id: 'account-analysis',
    icon: Target,
    label: { fr: 'Analyse de Compte', en: 'Account Analysis' },
    description: {
      fr: 'Analysez vos comptes stratégiques en profondeur',
      en: 'Deep-dive into your strategic accounts',
    },
    promptCount: 9,
  },
  {
    id: 'qbr',
    icon: BarChart3,
    label: { fr: 'QBR', en: 'QBR' },
    description: {
      fr: 'Préparez et animez vos revues trimestrielles',
      en: 'Prepare and run your quarterly business reviews',
    },
    promptCount: 8,
  },
  {
    id: 'capture-plan',
    icon: Shield,
    label: { fr: 'Capture Plan', en: 'Capture Plan' },
    description: {
      fr: 'Sécurisez le renouvellement de vos contrats',
      en: 'Secure your contract renewals proactively',
    },
    promptCount: 8,
  },
  {
    id: 'objections',
    icon: MessageSquare,
    label: { fr: 'Objections Grands Comptes', en: 'Enterprise Objections' },
    description: {
      fr: 'Anticipez et traitez les objections complexes',
      en: 'Anticipate and handle complex objections',
    },
    promptCount: 9,
  },
  {
    id: 'relationship-mapping',
    icon: Users,
    label: { fr: 'Mapping Relationnel', en: 'Relationship Mapping' },
    description: {
      fr: 'Cartographiez les parties prenantes et les décideurs',
      en: 'Map stakeholders and decision-makers',
    },
    promptCount: 8,
  },
  {
    id: 'scoring',
    icon: TrendingUp,
    label: { fr: 'Scoring', en: 'Scoring' },
    description: {
      fr: 'Priorisez vos comptes par potentiel stratégique',
      en: 'Prioritize accounts by strategic potential',
    },
    promptCount: 8,
  },
]
