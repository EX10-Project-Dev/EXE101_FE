import { useLanguage } from '../contexts/LanguageContext'
import { translateText } from '../utils/localization'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { emptyFilters, venues } from '../data/venues'
import { searchDiscoveryVenues } from '../services/discoveryService'
import { searchWithDemoAi } from '../services/discoveryAiDemo'
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
  const [matchVenueId, setMatchVenueId] = useState(null)
  const [recenterKey, setRecenterKey] = useState(0)
  const [savedOnly, setSavedOnly] = useState(false)
  const savedKey = `findgo:saved:${user?.id || user?.email || 'current-user'}`
  const [savedIds, setSavedIds] = useState(() => readSaved(savedKey))
  const [saveNotice, setSaveNotice] = useState('')
  const [aiSearch, setAiSearch] = useState({ status: 'idle', query: '', venues: [] })
  const searchRequest = useRef(null)
  const sheetStateRef = useRef(selectedSheetState)
  const mapDetailSession = useRef(null)
  const eligible = useMemo(() => searchDiscoveryVenues({ filters, savedIds, savedOnly, location }), [filters, savedIds, savedOnly, location])
  const results = useMemo(() => aiSearch.status === 'idle' ? eligible : aiSearch.status === 'success' ? aiSearch.venues.filter(venue => eligible.some(item => item.id === venue.id)) : [], [aiSearch, eligible])
  const visibleSelectedId = results.some((venue) => venue.id === selectedVenueId) ? selectedVenueId : null

  useEffect(() => () => searchRequest.current?.abort(), [])
  useEffect(() => { sheetStateRef.current = selectedSheetState }, [selectedSheetState])

  useEffect(() => {
    const previousTitle = document.title
    document.title = translateText('Discover your next spot · FIND&GO', language)
    return () => { document.title = previousTitle }
  }, [language])

  const selectVenue = useCallback((id) => {
    if (mapDetailSession.current) setSelectedSheetState(mapDetailSession.current.sheetState)
    mapDetailSession.current = null
    setMatchVenueId(null)
    setSelectedVenueId(id)
    if (results.findIndex((venue) => venue.id === id) >= 4) setSelectedSheetState('expanded')
    // Scroll only the carousel, never the map or entire page.
    requestAnimationFrame(() => {
      const card = id && document.querySelector(`[data-venue-id="${id}"]`)
      const carousel = card?.parentElement
      if (carousel && card) carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft - 4, behavior: 'instant' })
    })
  }, [results])

  const selectMapVenue = useCallback((id) => {
    if (!mapDetailSession.current) mapDetailSession.current = { sheetState: sheetStateRef.current }
    setSelectedVenueId(id)
    setMatchVenueId(id)
    setSelectedSheetState('collapsed')
  }, [])

  const closeMapDetails = useCallback(() => {
    setMatchVenueId(null)
    setSelectedVenueId(null)
    setHoveredVenueId(null)
    if (mapDetailSession.current) setSelectedSheetState(mapDetailSession.current.sheetState)
    mapDetailSession.current = null
  }, [])

  function saveVenue(id) {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id]
    setSavedIds(next)
    try { localStorage.setItem(savedKey, JSON.stringify(next)); setSaveNotice(next.includes(id) ? 'Place saved on this device.' : 'Place removed from saved places.') } catch { setSaveNotice('Saved for this visit. Your browser could not store this change.') }
  }

  function resetSearch() {
    mapDetailSession.current = null
    searchRequest.current?.abort()
    setAiSearch({ status: 'idle', query: '', venues: [] })
    setMatchVenueId(null)
    setPrompts([]); setSubmittedPrompts([]); setFilters(emptyFilters); setSavedOnly(false); setLocation(null)
    setSelectedVenueId(venues[0].id)
  }

  async function runSearch(next, nextFilters = filters, nextLocation = location) {
    mapDetailSession.current = null
    searchRequest.current?.abort()
    const cleanPrompts = next.map(prompt => prompt.trim()).filter(Boolean).slice(0, 3)
    setSubmittedPrompts(cleanPrompts)
    setMatchVenueId(null)
    setSelectedSheetState('default')
    if (!cleanPrompts.length) { setAiSearch({ status: 'idle', query: '', venues: [] }); return }
    const controller = new AbortController()
    searchRequest.current = controller
    const query = cleanPrompts.join(' · ')
    setAiSearch({ status: 'loading', query, venues: [] })
    try {
      const matches = await searchWithDemoAi({ candidates: searchDiscoveryVenues({ filters: nextFilters, location: nextLocation }), prompts: cleanPrompts, signal: controller.signal })
      if (controller.signal.aborted || searchRequest.current !== controller) return
      setAiSearch({ status: 'success', query, venues: matches })
      setSelectedVenueId(matches[0]?.id || null)
    } catch (error) {
      if (error.name !== 'AbortError' && searchRequest.current === controller) setAiSearch({ status: 'error', query, venues: [] })
    }
  }

  function cancelSearch() {
    mapDetailSession.current = null
    searchRequest.current?.abort()
    setAiSearch({ status: 'idle', query: '', venues: [] })
    setPrompts([])
    setSubmittedPrompts([])
    setMatchVenueId(null)
    setSelectedVenueId(eligible[0]?.id || null)
  }

  return (
    <main className={`dg-page dg-page--${selectedSheetState}${aiSearch.status !== 'idle' ? ' dg-page--search' : ''}`} lang={language}>
      <DiscoveryMap venues={results} selectedVenueId={visibleSelectedId} hoveredVenueId={hoveredVenueId} onSelect={selectMapVenue} onDetails={setDetailVenue} recenterKey={recenterKey} matchVenueId={matchVenueId} onMatch={(venue) => selectMapVenue(venue.id)} onCloseMatch={closeMapDetails} />
      <FloatingTopBar user={user} onLogout={() => { logout(); navigate('/login', { replace: true }) }} onRecenter={() => setRecenterKey((key) => key + 1)} savedOnly={savedOnly} onSavedOnly={(value) => { setSavedOnly(value); setSelectedSheetState('expanded') }} />
      <DiscoveryBottomSheet sheetState={selectedSheetState} onSheetState={setSelectedSheetState} prompts={prompts} onPrompts={(next) => { setPrompts(next); if (submittedPrompts.length && next.length < prompts.length) runSearch(next) }} filters={filters} onFilters={(next) => { setFilters(next); if (submittedPrompts.length) runSearch(submittedPrompts, next) }} onSearch={runSearch} onReset={resetSearch} location={location} onLocation={(next) => { setLocation(next); if (submittedPrompts.length) runSearch(submittedPrompts, filters, next) }} results={results} selectedVenueId={visibleSelectedId} onSelect={selectVenue} onHover={setHoveredVenueId} savedIds={savedIds} onSave={saveVenue} savedOnly={savedOnly} hasSearch={submittedPrompts.length > 0} aiSearch={aiSearch} onCancelSearch={cancelSearch} onRetrySearch={() => runSearch(submittedPrompts)} />
      {detailVenue && <VenueDetailPanel key={detailVenue.id} venue={detailVenue} onClose={() => { setDetailVenue(null); closeMapDetails() }} filters={filters} saved={savedIds.includes(detailVenue.id)} onSave={saveVenue} onChoose={selectVenue} />}
      <span className="dg-sr-only" role="status">{tx(saveNotice)}</span>
    </main>
  )
}
