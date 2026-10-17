import { useEffect, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleAuthContext, googleClientId } from './googleAuthContext'
import { useLanguage } from './LanguageContext'

export default function GoogleAuthProvider({ children }) {
  const { language } = useLanguage()
  const [status, setStatus] = useState(googleClientId ? 'loading' : 'unconfigured')

  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setStatus('error'), 15000)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <GoogleAuthContext.Provider value={status}>
      {googleClientId ? (
        <GoogleOAuthProvider
          clientId={googleClientId}
          locale={language}
          onScriptLoadSuccess={() => setStatus('ready')}
          onScriptLoadError={() => setStatus('error')}
        >
          {children}
        </GoogleOAuthProvider>
      ) : children}
    </GoogleAuthContext.Provider>
  )
}
