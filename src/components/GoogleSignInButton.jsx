import { useContext, useEffect, useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthContext } from '../contexts/googleAuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { googleSignIn } from '../services/authService'

export default function GoogleSignInButton({ rememberMe = false, disabled, onBusyChange, onNotice }) {
  const status = useContext(GoogleAuthContext)
  const { tx, language } = useLanguage()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const requestRef = useRef(false)
  const [width, setWidth] = useState(260)

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(200, Math.min(400, Math.floor(entry.contentRect.width))))
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  async function handleCredential({ credential }) {
    if (disabled || requestRef.current) return
    requestRef.current = true
    onNotice('', 'error')
    onBusyChange(true)
    try {
      await googleSignIn({ credential, rememberMe })
      navigate('/discover', { replace: true })
    } catch (error) {
      onNotice(error.message, 'error')
    } finally {
      requestRef.current = false
      onBusyChange(false)
    }
  }

  const unavailable = status === 'unconfigured'
    ? 'Google sign-in is not configured. Please use email and password.'
    : status === 'error'
      ? 'Unable to load Google sign-in. Check your connection and reload the page.'
      : ''

  return (
    <div ref={containerRef} className="auth-google-container" aria-busy={disabled || status === 'loading'}>
      {status === 'ready' ? (
        <div className="auth-google-widget" inert={disabled ? true : undefined}>
          <GoogleLogin
            key={language}
            onSuccess={handleCredential}
            onError={() => onNotice('Google sign-in failed. Please try again.', 'error')}
            // GIS does not expose a popup-close callback for ID-token buttons.
            // Keep both methods usable until a credential arrives, including after cancellation.
            click_listener={() => onNotice('Complete sign-in in the Google window. If you close it or it does not open, you can try again or use email and password.', 'info')}
            ux_mode="popup"
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width={width}
          />
        </div>
      ) : (
        <button className="auth-google" type="button" disabled>{tx(status === 'loading' ? 'Loading Google sign-in…' : 'Continue with Google')}</button>
      )}
      {unavailable && <p className="auth-field-error" role="status">{tx(unavailable)}</p>}
    </div>
  )
}
