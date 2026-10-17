import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import ErrorBoundary from './components/ErrorBoundary.jsx'
import GoogleAuthProvider from './contexts/GoogleAuthProvider.jsx'

const theme = createTheme({
  typography: { fontFamily: '"Segoe UI", Arial, sans-serif' },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <GoogleAuthProvider>
            <App />
          </GoogleAuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)
