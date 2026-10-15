import { useLanguage } from '../../contexts/LanguageContext'
import { useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import SearchSection from '../SearchSection'
import DiscoveryFilterDialog from './DiscoveryFilterDialog'
import DiscoveryVenueCard from './DiscoveryVenueCard'
import DiscoveryAiSearch from './DiscoveryAiSearch'

export default function DiscoveryBottomSheet({ sheetState, onSheetState, prompts, onPrompts, filters, onFilters, onSearch, onReset, location, onLocation, results, selectedVenueId, onSelect, onHover, savedIds, onSave, savedOnly, hasSearch, aiSearch, onCancelSearch, onRetrySearch }) {
  const { tx } = useLanguage()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const startY = useRef(null)
  const suppressClick = useRef(false)
  const activeFilters = Object.values(filters).reduce((count, value) => count + (Array.isArray(value) ? value.length : value ? 1 : 0), 0)
  const expanded = sheetState === 'expanded'
  const visible = expanded ? results : results.slice(0, 4)
  const searching = aiSearch.status === 'loading'
  const showResults = aiSearch.status === 'idle' || aiSearch.status === 'success'
  const reviewedVenue = results.find(venue => venue.id === selectedVenueId) || results[0]

  function handlePointerUp(event) {
    if (startY.current === null) return
    const delta = startY.current - event.clientY
    startY.current = null
    if (Math.abs(delta) > 30) {
      suppressClick.current = true
      onSheetState(delta > 0 ? (sheetState === 'collapsed' ? 'default' : 'expanded') : (expanded ? 'default' : 'collapsed'))
    }
  }

  return (
    <section className={`dg-sheet dg-sheet--${sheetState}`} aria-label={tx('Search and recommendations')}>
      <button className="dg-sheet-handle" type="button" aria-label={tx(sheetState === 'collapsed' ? 'Expand recommendations' : 'Collapse recommendations')} aria-expanded={sheetState !== 'collapsed'} onPointerDown={(event) => { startY.current = event.clientY; suppressClick.current = false; event.currentTarget.setPointerCapture(event.pointerId) }} onPointerUp={handlePointerUp} onPointerCancel={() => { startY.current = null }} onClick={() => { if (!suppressClick.current) onSheetState(sheetState === 'collapsed' ? 'default' : 'collapsed'); suppressClick.current = false }}><span /></button>
      <div className="dg-sheet-content" inert={sheetState === 'collapsed' ? true : undefined}>
        <SearchSection compact prompts={prompts} setPrompts={onPrompts} onSearch={onSearch} onOpenFilter={() => setFiltersOpen(true)} criteriaCount={activeFilters} onGetLocation={onLocation} locationState={location} onReset={onReset} isLoading={searching} />
        {filtersOpen && <DiscoveryFilterDialog filters={filters} onApply={onFilters} onClose={() => setFiltersOpen(false)} />}
        {aiSearch.status !== 'idle' && <DiscoveryAiSearch search={aiSearch} venue={reviewedVenue} onCancel={onCancelSearch} onRetry={onRetrySearch} />}
        {showResults && <><div className="dg-recommendation-heading">
          <h1>{savedOnly ? tx('Your saved places') : hasSearch || activeFilters ? tx(results.length === 1 ? '1 place for you' : '{count} places for you', { count: results.length }) : tx('Recommended for you')}</h1>
          {results.length > 0 && <button type="button" onClick={() => onSheetState(expanded ? 'default' : 'expanded')}>{tx(expanded ? 'Show less' : 'View all')}<ArrowRight size={19} aria-hidden="true" /></button>}
        </div>
        <div className="dg-results" aria-label={tx('Recommended places')}>
          {visible.map((venue) => <DiscoveryVenueCard key={venue.id} venue={venue} selected={selectedVenueId === venue.id} saved={savedIds.includes(venue.id)} onSelect={onSelect} onHover={onHover} onSave={onSave} />)}
          {results.length === 0 && <div className="dg-empty" role="status"><h2>{tx(savedOnly ? 'No saved places here yet' : 'No places match just yet')}</h2><p>{tx(savedOnly ? 'Tap the heart on a place you like to keep it here.' : 'Try a different search or loosen a filter to find your next spot.')}</p><button type="button" onClick={onReset}>{tx(savedOnly ? 'Explore places' : 'Clear search and filters')}</button></div>}
        </div>
        <span className="dg-sr-only" role="status">{tx('{count} places found', { count: results.length })}</span></>}
      </div>
      {sheetState === 'collapsed' && <button type="button" className="dg-collapsed-summary" onClick={() => onSheetState('default')}><Search size={19} aria-hidden="true" /><span>{hasSearch ? prompts.join(' · ') : tx('Find your next spot')}<small>{tx('{count} places to explore', { count: results.length })}</small></span><span>{tx('Explore ↑')}</span></button>}
    </section>
  )
}
