import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import{  App2} from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider} from 'notistack'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient}>
    <BrowserRouter>
<SnackbarProvider autoHideDuration={3000}>

</SnackbarProvider>
    <App2 />
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
