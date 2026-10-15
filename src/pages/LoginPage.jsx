import { useLanguage } from '../contexts/LanguageContext'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../services/authService'
import { ArrowRight, X } from 'lucide-react'
import BrandText from '../components/BrandText'
import logo from '../assets/logo-small.webp'
import './LoginPage.css'

function AuthHeader() {
  const { tx } = useLanguage()
  return (
    <header className="auth-header">
      <Link className="auth-brand" to="/" aria-label={tx('FIND&GO home')}>
        <img src={logo} width="38" height="38" alt="" />
        <span><BrandText /></span>
      </Link>
      <span className="auth-member">{tx('Member access')}</span>
    </header>
  )
}

function GoogleLoginButton({ onClick }) {
  const { tx } = useLanguage()
  return (
    <button className="auth-google" type="button" onClick={onClick}>
      <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z" />
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z" />
        <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z" />
        <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.2C14.2 15.5 18.7 11.9 24 11.9Z" />
      </svg>
      {tx('Continue with Google')}
    </button>
  )
}

function PasswordField({ id, label = 'Password', value, onChange, isNew = false, error, inputRef }) {
  const { tx } = useLanguage()
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-field">
      <label htmlFor={id}>{tx(label)}</label>
      <div className="auth-password">
        <input ref={inputRef} id={id} name={id} type={visible ? 'text' : 'password'} autoComplete={isNew ? 'new-password' : 'current-password'} placeholder={tx(label === 'Confirm password' ? 'Re-enter your password' : isNew ? 'Create a password' : 'Enter your password')} required minLength={isNew ? 8 : undefined} value={value} onChange={onChange} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : isNew && label === 'Password' ? `${id}-hint` : undefined} />
        <button type="button" aria-controls={id} aria-label={`${tx(visible ? 'Hide' : 'Show')} ${tx(label).toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible((current) => !current)}>{tx(visible ? 'Hide' : 'Show')}</button>
      </div>
      {isNew && label === 'Password' && <p className="auth-field-hint" id={`${id}-hint`}>{tx('Use at least 8 characters.')}</p>}
      {error && <p className="auth-field-error" id={`${id}-error`} role="alert">{tx(error)}</p>}
    </div>
  )
}

function SignupForm() {
  const { tx } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const confirmationRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    if (password !== confirmation) {
      setError('Passwords do not match. Please try again.')
      confirmationRef.current?.focus()
      return
    }
    setError('')
    // Connect registration here once the backend contract is available.
    setNotice('Account creation is not available yet. Please check back soon.')
  }

  return (
    <form className="auth-form auth-signup-form" onSubmit={handleSubmit}>
      <GoogleLoginButton onClick={() => setNotice('Google sign-up is coming soon. Please check back soon.')} />
      <div className="auth-divider"><span>{tx('Or sign up with email')}</span></div>
      <div className="auth-field">
        <label htmlFor="signup-name">{tx('Full name')}</label>
        <input id="signup-name" name="name" type="text" autoComplete="name" placeholder={tx('Your full name')} required maxLength={80} value={name} onChange={(event) => { setName(event.target.value); setNotice(''); event.target.setCustomValidity(event.target.value.trim() ? '' : tx('Please enter your name.')) }} />
      </div>
      <div className="auth-field">
        <label htmlFor="signup-email">{tx('Email address')}</label>
        <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@university.edu" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice('') }} />
      </div>
      <PasswordField id="signup-password" isNew value={password} onChange={(event) => { setPassword(event.target.value); setError(''); setNotice('') }} />
      <PasswordField id="signup-confirmation" label="Confirm password" isNew inputRef={confirmationRef} error={error} value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(''); setNotice('') }} />
      <button className="auth-submit" type="submit"><span>{tx('Create account')}</span><ArrowRight size={20} aria-hidden="true" /></button>
      {notice && <p className="auth-notice" role="status">{tx(notice)}</p>}
      <p className="auth-register">{tx('Already have an account?')} <Link to="/login">{tx('Log in')}</Link></p>
    </form>
  )
}

function LoginForm() {
  const { tx } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setNotice('')
    setIsSubmitting(true)
    try {
      await signIn({ email: email.trim(), password, rememberMe })
      navigate('/discover', { replace: true })
    } catch (error) {
      setNotice(error.response?.status === 401 || error.code === 'INVALID_CREDENTIALS' ? 'Incorrect email or password. Please try again.' : error.response ? 'Sign-in is unavailable right now. Please try again.' : 'Unable to connect. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <GoogleLoginButton onClick={() => setNotice('Google sign-in is coming soon. You can still explore places without an account.')} />
      <div className="auth-divider"><span>{tx('Or continue with email')}</span></div>
      <div className="auth-field">
        <label htmlFor="login-email">{tx('Email address')}</label>
        <input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@university.edu" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice('') }} />
      </div>
      <PasswordField id="login-password" value={password} onChange={(event) => { setPassword(event.target.value); setNotice('') }} />
      <div className="auth-options">
        <label className="auth-remember"><input name="remember" type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />{tx('Remember me')}</label>
        <Link to="/forgot-password">{tx('Forgot password?')}</Link>
      </div>
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}><span>{tx(isSubmitting ? 'Signing in…' : 'Log in')}</span><ArrowRight size={20} aria-hidden="true" /></button>
      {notice && <p className="auth-notice" role="status">{tx(notice)}</p>}
      <p className="auth-register">{tx('New to FIND&GO?')} <Link to="/register">{tx('Create an account')}</Link></p>
    </form>
  )
}

function LoginVisualPanel({ onClose }) {
  const { tx } = useLanguage()
  return (
    <aside className="auth-visual" aria-label={tx('Find your next café')}>
      <img className="auth-photo" src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=85" alt={tx('Friends gathering in a warm café filled with plants and natural light')} fetchPriority="high" />
      <button className="auth-close" type="button" onClick={onClose} aria-label={tx('Close authentication dialog')}><X size={20} aria-hidden="true" /></button>
      <div className="auth-testimonial">
        <blockquote>{tx('“My group stopped debating where to go. FIND&GO just gets the vibe.”')}</blockquote>
        <p>Minh Anh <span aria-hidden="true">·</span> {tx('UEH student')}</p>
      </div>
    </aside>
  )
}

export default function LoginPage({ pendingFlow, isSignup = false, onClose }) {
  const { tx, language, isEn } = useLanguage()
  return (
    <div className={`auth-page${isSignup ? ' auth-signup' : ''}`} lang={language}>
      <section className="auth-left" aria-labelledby="auth-title">
        <AuthHeader />
        <button className="auth-mobile-close" type="button" onClick={onClose} aria-label={tx('Close authentication dialog')}><X size={20} aria-hidden="true" /></button>
        <div className="auth-content">
          <div className="auth-intro">
            <p className="auth-eyebrow">{tx(isSignup ? 'Join the good company' : 'Welcome back')}</p>
            <h1 id="auth-title">{!isEn ? (isSignup ? <>Quán hợp gu.<br />Bạn cùng <span>sở thích.</span></> : <>Sẵn sàng tìm<br /><span>quán hợp gu?</span></>) : isSignup ? <>Your next spot.<br />Your kind of <span>people.</span></> : <>Ready to find<br />your next <span>spot?</span></>}</h1>
            <p className="auth-description">{tx(isSignup ? 'Create an account to save your favorite places and discover more moments worth sharing.' : 'Log in to save places, revisit your matches, and get recommendations shaped around you.')}</p>
          </div>
          {pendingFlow && <p className="auth-notice" role="status">{tx('Password recovery is coming soon.')} <Link to="/login">{tx('Back to login')}</Link></p>}
          {isSignup ? <SignupForm /> : <LoginForm />}
        </div>
        <p className="auth-footer">{tx('Good places. Great company.')} <span>FIND&GO.</span></p>
      </section>
      <LoginVisualPanel onClose={onClose} />
    </div>
  )
}
