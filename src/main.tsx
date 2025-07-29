import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import{ App, App2} from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App2 />
    </BrowserRouter>
  </StrictMode>,
)
