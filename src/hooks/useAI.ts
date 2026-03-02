import { useContext } from 'react'
import { AIContext } from '@/contexts/AIContext'

export function useAI() {
  const context = useContext(AIContext)
  if (!context) throw new Error('useAI must be used within AIProvider')
  return context
}
