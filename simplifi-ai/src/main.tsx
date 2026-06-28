import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/motion.css'
import App from './App.tsx'
import { initMobileFeatures } from './mobile_init'

// Initialize mobile features if running on native device
initMobileFeatures().catch(err => console.error('Mobile init failed', err));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
