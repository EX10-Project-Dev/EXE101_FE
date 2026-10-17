import { useLanguage } from '../contexts/LanguageContext'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp, forgotPassword, extractErrorMessage } from '../services/authService'
import { ArrowRight, X } from 'lucide-react'
import BrandText from '../components/BrandText'
import GoogleSignInButton from '../components/GoogleSignInButton'
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
  const [noticeType, setNoticeType] = useState('error')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmationRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setNotice('')
    if (password !== confirmation) {
      setError('Passwords do not match. Please try again.')
      confirmationRef.current?.focus()
      return
    }
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const result = await signUp({ fullName: name, email, password })
      setNotice(result?.message || 'Tạo tài khoản thành công. Hãy kiểm tra email để xác minh trước khi đăng nhập.')
      setNoticeType('success')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmation('')
    } catch (err) {
      setNotice(extractErrorMessage(err, 'Không thể tạo tài khoản. Vui lòng thử lại.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form auth-signup-form" onSubmit={handleSubmit}>
      <GoogleSignInButton disabled={isSubmitting} onBusyChange={setIsSubmitting} onNotice={(message, type) => { setNotice(message); setNoticeType(type) }} />
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
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        <span>{tx(isSubmitting ? 'Creating account…' : 'Create account')}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      {notice && <p className={`auth-notice auth-notice--${noticeType}`} role="status">{tx(notice)}</p>}
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
  const [noticeType, setNoticeType] = useState('error')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setNotice('')
    setNoticeType('error')
    setIsSubmitting(true)
    try {
      await signIn({ email: email.trim(), password, rememberMe })
      navigate('/discover', { replace: true })
    } catch (error) {
      setNotice(extractErrorMessage(error, 'Incorrect email or password. Please try again.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <GoogleSignInButton rememberMe={rememberMe} disabled={isSubmitting} onBusyChange={setIsSubmitting} onNotice={(message, type) => { setNotice(message); setNoticeType(type) }} />
      <div className="auth-divider"><span>{tx('or continue with')}</span></div>
      <div className="auth-field">
        <label htmlFor="login-email">{tx('Email address')}</label>
        <input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@university.edu" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice('') }} />
      </div>
      <PasswordField id="login-password" value={password} onChange={(event) => { setPassword(event.target.value); setNotice('') }} />
      <div className="auth-options">
        <label className="auth-remember"><input name="remember" type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />{tx('Remember me')}</label>
        <Link to="/forgot-password">{tx('Forgot password?')}</Link>
      </div>
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        <span>{tx(isSubmitting ? 'Signing in…' : 'Log in')}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      {notice && <p className={`auth-notice auth-notice--${noticeType}`} role="status">{tx(notice)}</p>}
      <p className="auth-register">{tx('New to FIND&GO?')} <Link to="/register">{tx('Create an account')}</Link></p>
    </form>
  )
}

function ForgotPasswordForm() {
  const { tx } = useLanguage()
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('error')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setNotice('')
    setNoticeType('error')
    setIsSubmitting(true)
    try {
      const result = await forgotPassword({ email })
      setNotice(result?.message || 'Nếu email thuộc về tài khoản đã xác minh, hướng dẫn đặt lại mật khẩu sẽ được gửi.')
      setNoticeType('success')
    } catch (error) {
      setNotice(extractErrorMessage(error, 'Dịch vụ email chưa được cấu hình.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="recovery-email">{tx('Email address')}</label>
        <input id="recovery-email" name="email" type="email" autoComplete="email" placeholder="you@university.edu" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice('') }} />
      </div>
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        <span>{tx(isSubmitting ? 'Sending…' : 'Send reset link')}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      {notice && <p className={`auth-notice ${noticeType === 'success' ? 'auth-notice--success' : 'auth-notice--error'}`} role="status">{tx(notice)}</p>}
      <p className="auth-register"><Link to="/login">{tx('Back to login')}</Link></p>
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
  const isRecovery = pendingFlow === 'recovery'

  return (
    <div className={`auth-page${isSignup ? ' auth-signup' : ''}`} lang={language}>
      <section className="auth-left" aria-labelledby="auth-title">
        <AuthHeader />
        <button className="auth-mobile-close" type="button" onClick={onClose} aria-label={tx('Close authentication dialog')}><X size={20} aria-hidden="true" /></button>
        <div className="auth-content">
          <div className="auth-intro">
            <p className="auth-eyebrow">{tx(isRecovery ? 'Account recovery' : isSignup ? 'Join the good company' : 'Welcome back')}</p>
            <h1 id="auth-title">
              {!isEn ? (
                isRecovery ? (
                  <>Khôi phục<br /><span>mật khẩu</span></>
                ) : isSignup ? (
                  <>Quán hợp gu.<br />Bạn cùng <span>sở thích.</span></>
                ) : (
                  <>Sẵn sàng tìm<br /><span>quán hợp gu?</span></>
                )
              ) : isRecovery ? (
                <>Recover your<br /><span>password</span></>
              ) : isSignup ? (
                <>Your next spot.<br />Your kind of <span>people.</span></>
              ) : (
                <>Ready to find<br />your next <span>spot?</span></>
              )}
            </h1>
            <p className="auth-description">
              {tx(
                isRecovery
                  ? 'Enter your email address and we will send you instructions to reset your password.'
                  : isSignup
                    ? 'Create an account to save your favorite places and discover more moments worth sharing.'
                    : 'Log in to save places, revisit your matches, and get recommendations shaped around you.'
              )}
            </p>
          </div>
          {isRecovery ? <ForgotPasswordForm /> : isSignup ? <SignupForm /> : <LoginForm />}
        </div>
        <p className="auth-footer">{tx('Good places. Great company.')} <span>FIND&GO.</span></p>
      </section>
      <LoginVisualPanel onClose={onClose} />
    </div>
  )
}
