import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, Mail, RefreshCw, KeyRound } from 'lucide-react'
import { confirmEmail, resendConfirmation, extractErrorMessage } from '../services/authService'
import { useLanguage } from '../contexts/LanguageContext'
import BrandText from '../components/BrandText'
import logo from '../assets/logo-small.webp'
import './ConfirmEmailPage.css'

export default function ConfirmEmailPage() {
  const { language, toggleLanguage, tx } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlUserId = searchParams.get('userId') || searchParams.get('userid') || ''
  const urlToken = searchParams.get('token') || ''
  const initialEmail = searchParams.get('email') || ''

  const [status, setStatus] = useState(() => (urlUserId && urlToken ? 'loading' : 'idle'))
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)

  const [resendEmail, setResendEmail] = useState(initialEmail)
  const [resendNotice, setResendNotice] = useState('')
  const [resendNoticeType, setResendNoticeType] = useState('info')
  const [isResending, setIsResending] = useState(false)

  // Manual link or token input
  const [manualInput, setManualInput] = useState('')
  const [manualError, setManualError] = useState('')
  const [isVerifyingManual, setIsVerifyingManual] = useState(false)

  const hasTriggeredRef = useRef(false)

  // Verify email on mount if urlUserId & urlToken are present
  useEffect(() => {
    if (!urlUserId || !urlToken) return
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    let active = true

    async function verify() {
      try {
        const result = await confirmEmail({ userId: urlUserId, token: urlToken })
        if (!active) return
        setStatus('success')
        setMessage(result?.message || 'Email của bạn đã được xác minh thành công. Bạn có thể đăng nhập ngay bây giờ.')
      } catch (err) {
        if (!active) return
        setStatus('error')
        setMessage(extractErrorMessage(err, 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.'))
      }
    }

    verify()

    return () => {
      active = false
    }
  }, [urlUserId, urlToken])

  // Countdown timer on success to auto redirect
  useEffect(() => {
    if (status !== 'success') return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/login', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [status, navigate])

  async function handleResend(event) {
    event.preventDefault()
    if (!resendEmail.trim() || isResending) return

    setIsResending(true)
    setResendNotice('')

    try {
      const result = await resendConfirmation({ email: resendEmail.trim() })
      setResendNoticeType('success')
      setResendNotice(result?.message || 'Nếu tài khoản cần xác minh, email hướng dẫn mới đã được gửi.')
    } catch (err) {
      setResendNoticeType('error')
      setResendNotice(extractErrorMessage(err, 'Không thể gửi lại email xác minh lúc này. Vui lòng thử lại sau.'))
    } finally {
      setIsResending(false)
    }
  }

  async function handleManualVerify(event) {
    event.preventDefault()
    const raw = manualInput.trim()
    if (!raw || isVerifyingManual) return
    setManualError('')

    let extractedUserId = ''
    let extractedToken = ''

    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        const parsed = new URL(raw)
        extractedUserId = parsed.searchParams.get('userId') || parsed.searchParams.get('userid') || ''
        extractedToken = parsed.searchParams.get('token') || ''
      } else if (raw.includes('userId=') || raw.includes('token=')) {
        const qs = raw.includes('?') ? raw.split('?')[1] : raw
        const params = new URLSearchParams(qs)
        extractedUserId = params.get('userId') || params.get('userid') || ''
        extractedToken = params.get('token') || ''
      } else {
        // Fallback: If user passed token directly and email/userId is known
        extractedToken = raw
        extractedUserId = urlUserId
      }
    } catch {
      setManualError('Liên kết không hợp lệ. Vui lòng dán toàn bộ đường link nhận được trong email.')
      return
    }

    if (!extractedUserId || !extractedToken) {
      setManualError('Vui lòng nhập liên kết hợp lệ chứa cả userId và mã token.')
      return
    }

    setIsVerifyingManual(true)
    try {
      const result = await confirmEmail({ userId: extractedUserId, token: extractedToken })
      setStatus('success')
      setMessage(result?.message || 'Email của bạn đã được xác minh thành công. Bạn có thể đăng nhập ngay bây giờ.')
    } catch (err) {
      setManualError(extractErrorMessage(err, 'Xác minh thất bại. Liên kết không hợp lệ hoặc đã hết hạn.'))
    } finally {
      setIsVerifyingManual(false)
    }
  }

  return (
    <div className="confirm-page" lang={language}>
      <header className="confirm-header">
        <Link to="/" className="confirm-brand" aria-label="FIND&GO">
          <img src={logo} alt="" width="38" height="38" />
          <span><BrandText /></span>
        </Link>
        <button
          type="button"
          className="confirm-lang-toggle"
          onClick={toggleLanguage}
          aria-label={tx('switchLangTooltip')}
        >
          <span className={language === 'vi' ? 'is-active' : ''}>VI</span>
          <span className="confirm-lang-sep" aria-hidden="true">/</span>
          <span className={language === 'en' ? 'is-active' : ''}>EN</span>
        </button>
      </header>

      <main className="confirm-main">
        <div className="confirm-card">
          {status === 'loading' && (
            <div className="confirm-state confirm-state--loading">
              <div className="confirm-icon-wrap confirm-icon--spin" aria-hidden="true">
                <Loader2 size={44} className="icon-spin" />
              </div>
              <h1 className="confirm-title">{tx('Verifying email…')}</h1>
              <p className="confirm-desc">
                {tx('Please wait while we verify your email address and activate your account.')}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="confirm-state confirm-state--success">
              <div className="confirm-icon-wrap confirm-icon--success" aria-hidden="true">
                <CheckCircle2 size={46} />
              </div>
              <h1 className="confirm-title">{tx('Email verified!')}</h1>
              <p className="confirm-desc">
                {tx(message || 'Your email has been verified. You can now log in to FIND&GO.')}
              </p>
              <div className="confirm-countdown" role="status">
                {tx('Redirecting to login in {seconds} seconds…', { seconds: countdown })}
              </div>
              <Link to="/login" className="confirm-btn-primary">
                <span>{tx('Log in now')}</span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          )}

          {status === 'idle' && (
            <div className="confirm-state confirm-state--idle">
              <div className="confirm-icon-wrap confirm-icon--idle" aria-hidden="true">
                <Mail size={42} />
              </div>
              <h1 className="confirm-title">{tx('Verify your account')}</h1>
              <p className="confirm-desc">
                {tx('Your account must be verified before logging in. If you did not receive a link, request a new one below.')}
              </p>

              <div className="confirm-resend-box">
                <div className="confirm-resend-header">
                  <Mail size={18} aria-hidden="true" />
                  <h3>{tx('Request a new verification link')}</h3>
                </div>
                <p className="confirm-resend-help">
                  {tx('Enter your email below and we will send you a fresh verification link.')}
                </p>
                <form onSubmit={handleResend} className="confirm-resend-form">
                  <input
                    type="email"
                    required
                    placeholder="you@university.edu"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    aria-label={tx('Email address')}
                  />
                  <button type="submit" disabled={isResending} className="confirm-btn-resend">
                    {isResending ? (
                      <>
                        <Loader2 size={16} className="icon-spin" aria-hidden="true" />
                        <span>{tx('Sending…')}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} aria-hidden="true" />
                        <span>{tx('Resend link')}</span>
                      </>
                    )}
                  </button>
                </form>
                {resendNotice && (
                  <p className={`confirm-notice confirm-notice--${resendNoticeType}`} role="status">
                    {tx(resendNotice)}
                  </p>
                )}
              </div>

              <div className="confirm-resend-box" style={{ marginTop: -8 }}>
                <div className="confirm-resend-header">
                  <KeyRound size={18} aria-hidden="true" />
                  <h3>{tx('Or verify using email link')}</h3>
                </div>
                <p className="confirm-resend-help">
                  {tx('Paste confirmation link from email')}
                </p>
                <form onSubmit={handleManualVerify} className="confirm-resend-form">
                  <input
                    type="text"
                    required
                    placeholder="https://.../confirm-email?userId=...&token=..."
                    value={manualInput}
                    onChange={(e) => { setManualInput(e.target.value); setManualError('') }}
                    aria-label={tx('Paste confirmation link from email')}
                  />
                  <button type="submit" disabled={isVerifyingManual} className="confirm-btn-resend">
                    {isVerifyingManual ? (
                      <>
                        <Loader2 size={16} className="icon-spin" aria-hidden="true" />
                        <span>{tx('Verifying…')}</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} aria-hidden="true" />
                        <span>{tx('Verify now')}</span>
                      </>
                    )}
                  </button>
                </form>
                {manualError && (
                  <p className="confirm-notice confirm-notice--error" role="status">
                    {tx(manualError)}
                  </p>
                )}
              </div>

              <div className="confirm-actions">
                <Link to="/login" className="confirm-btn-secondary">
                  <ArrowLeft size={18} aria-hidden="true" />
                  <span>{tx('Back to login')}</span>
                </Link>
                <Link to="/" className="confirm-link-home">
                  {tx('Return to homepage')}
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="confirm-state confirm-state--error">
              <div className="confirm-icon-wrap confirm-icon--error" aria-hidden="true">
                <AlertCircle size={46} />
              </div>
              <h1 className="confirm-title">{tx('Verification failed')}</h1>
              <p className="confirm-desc">
                {tx(message || 'The verification link is invalid or has expired.')}
              </p>

              <div className="confirm-resend-box">
                <div className="confirm-resend-header">
                  <Mail size={18} aria-hidden="true" />
                  <h3>{tx('Request a new verification link')}</h3>
                </div>
                <p className="confirm-resend-help">
                  {tx('Enter your email below and we will send you a fresh verification link.')}
                </p>
                <form onSubmit={handleResend} className="confirm-resend-form">
                  <input
                    type="email"
                    required
                    placeholder="you@university.edu"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    aria-label={tx('Email address')}
                  />
                  <button type="submit" disabled={isResending} className="confirm-btn-resend">
                    {isResending ? (
                      <>
                        <Loader2 size={16} className="icon-spin" aria-hidden="true" />
                        <span>{tx('Sending…')}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} aria-hidden="true" />
                        <span>{tx('Resend link')}</span>
                      </>
                    )}
                  </button>
                </form>
                {resendNotice && (
                  <p className={`confirm-notice confirm-notice--${resendNoticeType}`} role="status">
                    {tx(resendNotice)}
                  </p>
                )}
              </div>

              <div className="confirm-actions">
                <Link to="/login" className="confirm-btn-secondary">
                  <ArrowLeft size={18} aria-hidden="true" />
                  <span>{tx('Back to login')}</span>
                </Link>
                <Link to="/" className="confirm-link-home">
                  {tx('Return to homepage')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="confirm-footer">
        <p>{tx('Good places. Great company.')} <span>FIND&GO.</span></p>
      </footer>
    </div>
  )
}
