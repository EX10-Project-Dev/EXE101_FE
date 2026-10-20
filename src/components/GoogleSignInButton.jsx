import { useContext, useEffect, useRef, useState } from 'react'
import { Loader2, ShieldCheck, Info } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthContext } from '../contexts/googleAuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { googleSignIn } from '../services/authService'
import { getAccountHome } from '../utils/accountNavigation'

export default function GoogleSignInButton({ rememberMe = false, disabled, onBusyChange, onNotice }) {
  const status = useContext(GoogleAuthContext)
  const { tx, language } = useLanguage()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const requestRef = useRef(false)
  const [width, setWidth] = useState(null)

  useEffect(() => {
    // Measure before mounting GIS. Resizing must not remount its global initializer.
    const measuredWidth = containerRef.current?.getBoundingClientRect().width || 320
    setWidth(Math.max(200, Math.min(400, Math.floor(measuredWidth))))
  }, [])

  async function handleCredential({ credential }) {
    if (disabled || requestRef.current) return
    requestRef.current = true
    onNotice('', 'error')
    onBusyChange(true)
    try {
      const { user } = await googleSignIn({ credential, rememberMe })
      navigate(getAccountHome(user), { replace: true })
    } catch (error) {
      onNotice(error.message, 'error')
    } finally {
      requestRef.current = false
      onBusyChange(false)
    }
  }

  const unavailable = status === 'unconfigured'
    ? 'Google sign-in is currently unavailable. Please continue with email.'
    : status === 'error'
      ? 'Unable to load Google sign-in. Check your connection and reload the page.'
      : ''

  return (
    <div ref={containerRef} className="auth-google-container" aria-busy={disabled || status === 'loading'}>
      {status === 'ready' && width !== null ? (
        <div className="auth-google-widget" inert={disabled ? true : undefined}>
          <GoogleLogin
            key={language}
            locale={language}
            onSuccess={handleCredential}
            onError={() => onNotice('Google sign-in failed. Please try again.', 'error')}
            // GIS does not expose a popup-close callback for ID-token buttons.
            // Keep both methods usable until a credential arrives, including after cancellation.
            click_listener={() => onNotice('Complete sign-in in the Google window. If you close it or it does not open, you can try again or use email and password.', 'info')}
            ux_mode="popup"
            theme="outline"
            size="large"
            shape="pill"
            logo_alignment="left"
            text="continue_with"
            width={width}
          />
        </div>
      ) : (
        <button className="auth-google" type="button" disabled>
          {status === 'loading' && <Loader2 className="auth-google-spinner" size={20} aria-hidden="true" />}{tx(status === 'loading' ? 'Loading Google sign-in…' : 'Continue with Google')}</button>
      )}
      <p className={`auth-google-caption${unavailable ? ' auth-google-caption--notice' : ''}`} role="status">
        {unavailable ? <Info size={14} aria-hidden="true" /> : <ShieldCheck size={14} aria-hidden="true" />}
        <span>{tx(unavailable || 'One account. More places to discover.')}</span>
      </p>
    </div>
  )
}
