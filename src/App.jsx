import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useLanguage } from './contexts/LanguageContext'
import useAuth from './hooks/useAuth'

const DiscoverPage = lazy(() => import('./pages/DiscoverPage'))

function LandingLayout() {
  return <><LandingPage /><Outlet /></>
}

function AuthDialog({ pendingFlow, isSignup = false }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const close = () => navigate('/', { replace: true })

  if (isAuthenticated) return <Navigate to="/discover" replace />

  return (
    <Dialog
      open
      onClose={close}
      aria-labelledby="auth-title"
      maxWidth={false}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(30, 24, 20, 0.3)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)' } },
        paper: { className: 'auth-dialog', sx: { width: '1100px', maxWidth: 'calc(100% - 48px)', maxHeight: 'calc(100dvh - 48px)', margin: '24px', borderRadius: '16px', backgroundImage: 'none', boxShadow: '0 24px 90px rgba(30, 24, 20, 0.22)', '@media (max-width: 768px)': { maxWidth: 'calc(100% - 24px)', maxHeight: 'calc(100dvh - 24px)', margin: '12px', borderRadius: '12px' } } },
      }}
    >
      <LoginPage pendingFlow={pendingFlow} isSignup={isSignup} onClose={close} />
    </Dialog>
  )
}

function App() {
  const { tx } = useLanguage()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/discover" element={<ProtectedRoute><Suspense fallback={<p role="status" style={{ padding: 32 }}>{tx('Opening your map…')}</p>}><DiscoverPage /></Suspense></ProtectedRoute>} />
        <Route path="/auth/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route element={<LandingLayout />}>
          <Route path="/" element={null} />
          <Route path="/login" element={<AuthDialog />} />
          <Route path="/forgot-password" element={<AuthDialog pendingFlow="recovery" />} />
          <Route path="/register" element={<AuthDialog isSignup />} />
          <Route path="/auth/reset-password" element={<AuthDialog pendingFlow="reset-password" />} />
          <Route path="/reset-password" element={<AuthDialog pendingFlow="reset-password" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
