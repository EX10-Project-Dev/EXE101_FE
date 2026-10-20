import { useLanguage } from '../contexts/LanguageContext'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  confirmEmail,
  resendConfirmation,
  extractErrorMessage,
} from '../services/authService'
import { ArrowRight, X, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import BrandText from '../components/BrandText'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { getAccountHome } from '../utils/accountNavigation'
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
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendStatus, setResendStatus] = useState('')
  const [isResending, setIsResending] = useState(false)
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
      setIsRegistered(true)
      setRegisteredEmail(email.trim())
      setNotice(result?.message || 'Tạo tài khoản thành công. Hãy kiểm tra email để xác minh trước khi đăng nhập.')
      setNoticeType('success')
    } catch (err) {
      setNotice(extractErrorMessage(err, 'Không thể tạo tài khoản. Vui lòng thử lại.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (!registeredEmail || isResending) return
    setIsResending(true)
    setResendStatus('')
    try {
      const result = await resendConfirmation({ email: registeredEmail })
      setResendStatus(result?.message || 'Đã gửi lại email xác minh thành công. Vui lòng kiểm tra hộp thư.')
    } catch (err) {
      setResendStatus(extractErrorMessage(err, 'Không thể gửi lại email xác minh lúc này.'))
    } finally {
      setIsResending(false)
    }
  }

  if (isRegistered) {
    return (
      <div className="auth-form auth-registered-box">
        <div className="auth-registered-icon" aria-hidden="true">
          <Mail size={38} />
        </div>
        <h2 className="auth-registered-title">{tx('Check your email')}</h2>
        <p className="auth-registered-desc">
          {tx('We sent a verification link to')} <strong>{registeredEmail}</strong>.{' '}
          {tx('Please check your inbox (or Spam folder) and click the link to activate your account.')}
        </p>
        <Link to="/login" className="auth-submit auth-submit-link">
          <span>{tx('Go to Log in')}</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <div className="auth-resend-row">
          <span>{tx("Didn't receive the email?")}</span>{' '}
          <button
            type="button"
            className="auth-link-button"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? tx('Sending…') : tx('Resend verification email')}
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Link
            to={`/confirm-email?email=${encodeURIComponent(registeredEmail)}`}
            className="auth-link-button"
          >
            {tx('Open email confirmation page')} →
          </Link>
        </div>
        {resendStatus && (
          <p className="auth-notice auth-notice--success" role="status">
            {tx(resendStatus)}
          </p>
        )}
        <p className="auth-register" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="auth-link-button auth-link-muted"
            onClick={() => {
              setIsRegistered(false)
              setRegisteredEmail('')
              setName('')
              setEmail('')
              setPassword('')
              setConfirmation('')
              setNotice('')
              setResendStatus('')
            }}
          >
            {tx('Register with a different email')}
          </button>
        </p>
      </div>
    )
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
      <p className="auth-register">
        {tx('Already have an account?')} <Link to="/login">{tx('Log in')}</Link>
        <span style={{ margin: '0 8px', opacity: 0.4 }}>•</span>
        <Link to="/confirm-email">{tx('Unverified account?')}</Link>
      </p>
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
  const [resendStatus, setResendStatus] = useState('')
  const [isResending, setIsResending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    setNotice('')
    setResendStatus('')
    setNoticeType('error')
    setIsSubmitting(true)
    try {
      const { user } = await signIn({ email: email.trim(), password, rememberMe })
      // Dùng user vừa nhận từ BE, tránh đọc state của hook trước khi React cập nhật session.
      navigate(getAccountHome(user), { replace: true })
    } catch (error) {
      setNotice(extractErrorMessage(error, 'Incorrect email or password. Please try again.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResendVerification() {
    if (!email.trim() || isResending) return
    setIsResending(true)
    setResendStatus('')
    try {
      const result = await resendConfirmation({ email: email.trim() })
      setResendStatus(result?.message || 'Đã gửi lại email xác minh thành công. Hãy kiểm tra hộp thư của bạn.')
    } catch (err) {
      setResendStatus(extractErrorMessage(err, 'Không thể gửi lại email xác minh lúc này.'))
    } finally {
      setIsResending(false)
    }
  }

  const showResendOption = notice && (
    notice.toLowerCase().includes('chưa được xác minh') ||
    notice.toLowerCase().includes('unverified')
  )

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <GoogleSignInButton rememberMe={rememberMe} disabled={isSubmitting} onBusyChange={setIsSubmitting} onNotice={(message, type) => { setNotice(message); setNoticeType(type) }} />
      <div className="auth-divider"><span>{tx('or continue with')}</span></div>
      <div className="auth-field">
        <label htmlFor="login-email">{tx('Email address')}</label>
        <input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@university.edu" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice(''); setResendStatus('') }} />
      </div>
      <PasswordField id="login-password" value={password} onChange={(event) => { setPassword(event.target.value); setNotice(''); setResendStatus('') }} />
      <div className="auth-options">
        <label className="auth-remember"><input name="remember" type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />{tx('Remember me')}</label>
        <Link to="/forgot-password">{tx('Forgot password?')}</Link>
      </div>
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        <span>{tx(isSubmitting ? 'Signing in…' : 'Log in')}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      {notice && (
        <div className={`auth-notice auth-notice--${noticeType}`} role="status">
          <p>{tx(notice)}</p>
          {showResendOption && email && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <button
                type="button"
                className="auth-link-button"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? tx('Sending…') : tx('Resend verification email')}
              </button>
              <Link
                to={`/confirm-email?email=${encodeURIComponent(email.trim())}`}
                className="auth-link-button"
              >
                {tx('Go to email verification page')} →
              </Link>
            </div>
          )}
        </div>
      )}
      {resendStatus && (
        <p className="auth-notice auth-notice--success" role="status" style={{ marginTop: 10 }}>
          {tx(resendStatus)}
        </p>
      )}
      <p className="auth-register">
        {tx('New to FIND&GO?')} <Link to="/register">{tx('Create an account')}</Link>
        <span style={{ margin: '0 8px', opacity: 0.4 }}>•</span>
        <Link to="/confirm-email">{tx('Unverified account?')}</Link>
      </p>
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

function ConfirmEmailForm() {
  const { tx } = useLanguage()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId') || searchParams.get('userid') || ''
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState(userId && token ? 'loading' : 'invalid')
  const [message, setMessage] = useState(userId && token ? '' : 'Liên kết xác minh không hợp lệ hoặc thiếu thông tin.')
  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState('')
  const [isResending, setIsResending] = useState(false)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (!userId || !token) return
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    let active = true
    async function verify() {
      try {
        const result = await confirmEmail({ userId, token })
        if (!active) return
        setStatus('success')
        setMessage(result?.message || 'Email đã được xác minh. Bạn có thể đăng nhập.')
      } catch (err) {
        if (!active) return
        setStatus('error')
        setMessage(extractErrorMessage(err, 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.'))
      }
    }
    verify()
    return () => { active = false }
  }, [userId, token])

  async function handleResend(e) {
    e.preventDefault()
    if (!resendEmail.trim() || isResending) return
    setIsResending(true)
    setResendStatus('')
    try {
      const result = await resendConfirmation({ email: resendEmail.trim() })
      setResendStatus(result?.message || 'Nếu tài khoản cần xác minh, email hướng dẫn sẽ được gửi.')
    } catch (err) {
      setResendStatus(extractErrorMessage(err, 'Không thể gửi lại email xác minh lúc này.'))
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="auth-form auth-registered-box">
        <div className="auth-registered-icon auth-icon--spin" aria-hidden="true">
          <Loader2 size={38} className="icon-spin" />
        </div>
        <h2 className="auth-registered-title">{tx('Verifying email…')}</h2>
        <p className="auth-registered-desc">{tx('Please wait while we verify your email address.')}</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="auth-form auth-registered-box">
        <div className="auth-registered-icon auth-icon--success" aria-hidden="true">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="auth-registered-title">{tx('Email verified!')}</h2>
        <p className="auth-registered-desc">{tx(message || 'Your email has been verified. You can now log in to FIND&GO.')}</p>
        <Link to="/login" className="auth-submit auth-submit-link">
          <span>{tx('Log in now')}</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div className="auth-form auth-registered-box">
      <div className="auth-registered-icon auth-icon--error" aria-hidden="true">
        <AlertCircle size={40} />
      </div>
      <h2 className="auth-registered-title">{tx('Verification failed')}</h2>
      <p className="auth-registered-desc">
        {tx(message || 'The verification link is invalid or has expired.')}
      </p>

      <form className="auth-resend-inline-form" onSubmit={handleResend} style={{ marginTop: 20 }}>
        <div className="auth-field" style={{ textAlign: 'left', marginBottom: 14 }}>
          <label htmlFor="confirm-resend-email">{tx('Resend verification email')}</label>
          <input
            id="confirm-resend-email"
            type="email"
            required
            placeholder="you@university.edu"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="auth-submit"
          disabled={isResending}
          style={{ height: 46 }}
        >
          <span>{tx(isResending ? 'Sending…' : 'Resend verification')}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      {resendStatus && (
        <p className="auth-notice auth-notice--success" role="status" style={{ marginTop: 12 }}>
          {tx(resendStatus)}
        </p>
      )}

      <p className="auth-register" style={{ marginTop: 22 }}>
        <Link to="/login">{tx('Back to login')}</Link>
      </p>
    </div>
  )
}

function ResetPasswordForm() {
  const { tx } = useLanguage()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('error')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const confirmationRef = useRef(null)

  if (!token) {
    return (
      <div className="auth-form auth-registered-box">
        <div className="auth-registered-icon auth-icon--error" aria-hidden="true">
          <AlertCircle size={40} />
        </div>
        <h2 className="auth-registered-title">{tx('Invalid reset link')}</h2>
        <p className="auth-registered-desc">{tx('The password reset link is missing required parameters.')}</p>
        <p className="auth-register" style={{ marginTop: 20 }}>
          <Link to="/forgot-password">{tx('Request a new reset link')}</Link>
        </p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="auth-form auth-registered-box">
        <div className="auth-registered-icon auth-icon--success" aria-hidden="true">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="auth-registered-title">{tx('Password reset successful')}</h2>
        <p className="auth-registered-desc">{tx(notice || 'Your password has been reset. You can now log in with your new password.')}</p>
        <Link to="/login" className="auth-submit auth-submit-link">
          <span>{tx('Log in')}</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    )
  }

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
      const result = await resetPassword({ email: email.trim(), token, newPassword: password })
      setIsSuccess(true)
      setNotice(result?.message || 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.')
    } catch (err) {
      setNotice(extractErrorMessage(err, 'Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'))
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="reset-email">{tx('Email address')}</label>
        <input
          id="reset-email"
          type="email"
          required
          readOnly={Boolean(emailParam)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <PasswordField id="reset-new-password" label="New password" isNew value={password} onChange={(e) => { setPassword(e.target.value); setError(''); setNotice('') }} />
      <PasswordField id="reset-confirm-password" label="Confirm password" isNew inputRef={confirmationRef} error={error} value={confirmation} onChange={(e) => { setConfirmation(e.target.value); setError(''); setNotice('') }} />
      <button className="auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        <span>{tx(isSubmitting ? 'Resetting…' : 'Reset password')}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      {notice && <p className={`auth-notice auth-notice--${noticeType}`} role="status">{tx(notice)}</p>}
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
  const isConfirmEmail = pendingFlow === 'confirm-email'
  const isResetPassword = pendingFlow === 'reset-password'

  return (
    <div className={`auth-page${isSignup ? ' auth-signup' : ''}`} lang={language}>
      <section className="auth-left" aria-labelledby="auth-title">
        <AuthHeader />
        <button className="auth-mobile-close" type="button" onClick={onClose} aria-label={tx('Close authentication dialog')}><X size={20} aria-hidden="true" /></button>
        <div className="auth-content">
          <div className="auth-intro">
            <p className="auth-eyebrow">
              {tx(
                isConfirmEmail
                  ? 'Account verification'
                  : isResetPassword
                    ? 'Reset password'
                    : isRecovery
                      ? 'Account recovery'
                      : isSignup
                        ? 'Join the good company'
                        : 'Welcome back'
              )}
            </p>
            <h1 id="auth-title">
              {!isEn ? (
                isConfirmEmail ? (
                  <>Xác minh<br /><span>email</span></>
                ) : isResetPassword ? (
                  <>Đặt lại<br /><span>mật khẩu</span></>
                ) : isRecovery ? (
                  <>Khôi phục<br /><span>mật khẩu</span></>
                ) : isSignup ? (
                  <>Quán hợp gu.<br />Bạn cùng <span>sở thích.</span></>
                ) : (
                  <>Sẵn sàng tìm<br /><span>quán hợp gu?</span></>
                )
              ) : isConfirmEmail ? (
                <>Verify your<br /><span>email</span></>
              ) : isResetPassword ? (
                <>Reset your<br /><span>password</span></>
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
                isConfirmEmail
                  ? 'Verify your email address to start exploring with FIND&GO.'
                  : isResetPassword
                    ? 'Create a new password to secure and access your account.'
                    : isRecovery
                      ? 'Enter your email address and we will send you instructions to reset your password.'
                      : isSignup
                        ? 'Create an account to save your favorite places and discover more moments worth sharing.'
                        : 'Log in to save places, revisit your matches, and get recommendations shaped around you.'
              )}
            </p>
          </div>
          {isConfirmEmail ? (
            <ConfirmEmailForm />
          ) : isResetPassword ? (
            <ResetPasswordForm />
          ) : isRecovery ? (
            <ForgotPasswordForm />
          ) : isSignup ? (
            <SignupForm />
          ) : (
            <LoginForm />
          )}
        </div>
        <p className="auth-footer">{tx('Good places. Great company.')} <span>FIND&GO.</span></p>
      </section>
      <LoginVisualPanel onClose={onClose} />
    </div>
  )
}
