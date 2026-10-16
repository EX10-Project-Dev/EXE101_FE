import { lazy, Suspense } from 'react'
import HeroSection from '../components/HeroSection'
import ErrorBoundary from '../components/ErrorBoundary'

const DiscoveryContent = lazy(() => import('./DiscoveryContent'))

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ErrorBoundary>
        <Suspense fallback={<div className="discovery-placeholder" aria-busy="true" />}>
          <DiscoveryContent />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
