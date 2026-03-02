import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppLocal } from './AppLocal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLocal />
  </StrictMode>,
)
