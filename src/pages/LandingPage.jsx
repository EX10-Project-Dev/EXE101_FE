import { lazy, Suspense } from 'react'
import HeroSection from '../components/HeroSection'

const DiscoveryContent = lazy(() => import('./DiscoveryContent'))

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<div className="discovery-placeholder" aria-busy="true" />}>
        <DiscoveryContent />
      </Suspense>
    </main>
  )
}
