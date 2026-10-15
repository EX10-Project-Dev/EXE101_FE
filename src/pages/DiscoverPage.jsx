import { useLanguage } from '../contexts/LanguageContext'
import { translateText } from '../utils/localization'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { emptyFilters, venues } from '../data/venues'
import { searchDiscoveryVenues } from '../services/discoveryService'
import FloatingTopBar from '../components/discovery/FloatingTopBar'
import DiscoveryMap from '../components/discovery/DiscoveryMap'
import DiscoveryBottomSheet from '../components/discovery/DiscoveryBottomSheet'
import VenueDetailPanel from '../components/discovery/VenueDetailPanel'
import './DiscoverPage.css'

function readSaved(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [] } catch { return [] }
}

export default function DiscoverPage() {
  const { language, tx } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [prompts, setPrompts] = useState([])
  const [submittedPrompts, setSubmittedPrompts] = useState([])
  const [location, setLocation] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0].id)
  const [hoveredVenueId, setHoveredVenueId] = useState(null)
  const [selectedSheetState, setSelectedSheetState] = useState('default')
  const [detailVenue, setDetailVenue] = useState(null)
  const [recenterKey, setRecenterKey] = useState(0)
  const [savedOnly, setSavedOnly] = useState(false)
  const savedKey = `findgo:saved:${user?.id || user?.email || 'current-user'}`
  const [savedIds, setSavedIds] = useState(() => readSaved(savedKey))
  const [saveNotice, setSaveNotice] = useState('')
  const results = useMemo(() => searchDiscoveryVenues({ prompts: submittedPrompts, filters, savedIds, savedOnly, location }), [submittedPrompts, filters, savedIds, savedOnly, location])
  const visibleSelectedId = results.some((venue) => venue.id === selectedVenueId) ? selectedVenueId : null

  useEffect(() => {
    const previousTitle = document.title
    document.title = translateText('Discover your next spot · FIND&GO', language)
    return () => { document.title = previousTitle }
  }, [language])

  const selectVenue = useCallback((id) => {
    setSelectedVenueId(id)
    if (results.findIndex((venue) => venue.id === id) >= 4) setSelectedSheetState('expanded')
    // Scroll only the carousel, never the map or entire page.
    requestAnimationFrame(() => {
      const card = id && document.querySelector(`[data-venue-id="${id}"]`)
      const carousel = card?.parentElement
      if (carousel && card) carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft - 4, behavior: 'instant' })
    })
  }, [results])

  function saveVenue(id) {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id]
    setSavedIds(next)
    try { localStorage.setItem(savedKey, JSON.stringify(next)); setSaveNotice(next.includes(id) ? 'Place saved on this device.' : 'Place removed from saved places.') } catch { setSaveNotice('Saved for this visit. Your browser could not store this change.') }
  }

  function resetSearch() {
    setPrompts([]); setSubmittedPrompts([]); setFilters(emptyFilters); setSavedOnly(false); setLocation(null)
    setSelectedVenueId(venues[0].id)
  }

  return (
    <main className={`dg-page dg-page--${selectedSheetState}`} lang={language}>
      <DiscoveryMap venues={results} selectedVenueId={visibleSelectedId} hoveredVenueId={hoveredVenueId} onSelect={selectVenue} onDetails={setDetailVenue} recenterKey={recenterKey} onRecenter={() => setRecenterKey((key) => key + 1)} />
      <FloatingTopBar user={user} onLogout={() => { logout(); navigate('/login', { replace: true }) }} onRecenter={() => setRecenterKey((key) => key + 1)} savedOnly={savedOnly} onSavedOnly={(value) => { setSavedOnly(value); setSelectedSheetState('expanded') }} />
      <DiscoveryBottomSheet sheetState={selectedSheetState} onSheetState={setSelectedSheetState} prompts={prompts} onPrompts={(next) => { setPrompts(next); if (next.length < prompts.length) setSubmittedPrompts(next) }} filters={filters} onFilters={setFilters} onSearch={(next) => { setSubmittedPrompts(next); setSelectedSheetState('default') }} onReset={resetSearch} location={location} onLocation={setLocation} results={results} selectedVenueId={visibleSelectedId} onSelect={selectVenue} onHover={setHoveredVenueId} savedIds={savedIds} onSave={saveVenue} savedOnly={savedOnly} hasSearch={submittedPrompts.length > 0} />
      {detailVenue && <VenueDetailPanel key={detailVenue.id} venue={detailVenue} onClose={() => setDetailVenue(null)} filters={filters} saved={savedIds.includes(detailVenue.id)} onSave={saveVenue} onChoose={selectVenue} />}
      <span className="dg-sr-only" role="status">{tx(saveNotice)}</span>
    </main>
  )
}
