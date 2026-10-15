import { useLanguage } from '../../contexts/LanguageContext'
import { useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Search } from 'lucide-react'
import Popover from '@mui/material/Popover'
import { discoveryFilters } from '../../data/venues'
import DiscoveryVenueCard from './DiscoveryVenueCard'

function FilterRow({ filters, onChange, onReset, active }) {
  const { tx } = useLanguage()
  const [anchor, setAnchor] = useState(null)
  return (
    <div className="dg-filter-row" aria-label={tx('Filter places')}>
      {discoveryFilters.map((filter) => filter.key === 'amenities' ? (
        <button key={filter.key} type="button" className={`dg-filter dg-amenities${filters.amenities.length ? ' has-value' : ''}`} onClick={(event) => setAnchor(event.currentTarget)} aria-haspopup="dialog" aria-expanded={Boolean(anchor)}>{tx('Amenities')}{filters.amenities.length ? ` (${filters.amenities.length})` : ''}<ChevronDown size={16} aria-hidden="true" /></button>
      ) : (
        <label className={`dg-filter${filters[filter.key] ? ' has-value' : ''}`} key={filter.key}>
          <select aria-label={tx(filter.label)} value={filters[filter.key]} onChange={(event) => onChange(filter.key, event.target.value)}>
            <option value="">{tx(filter.label)}</option>
            {filter.options.map((option) => { const [value, label] = Array.isArray(option) ? option : [option, option]; return <option key={value} value={value}>{tx(label)}</option> })}
          </select><ChevronDown size={16} aria-hidden="true" />
        </label>
      ))}
      {active && <button type="button" className="dg-clear" onClick={onReset}>{tx('Clear all')}</button>}
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} slotProps={{ paper: { className: 'dg-amenities-popover', role: 'dialog', 'aria-label': tx('Choose amenities') } }}>
        <strong>{tx('Amenities')}</strong>
        {discoveryFilters.find((filter) => filter.key === 'amenities').options.map((amenity) => <label key={amenity}><input type="checkbox" checked={filters.amenities.includes(amenity)} onChange={(event) => onChange('amenities', event.target.checked ? [...filters.amenities, amenity] : filters.amenities.filter((item) => item !== amenity))} />{tx(amenity)}</label>)}
        <button type="button" className="dg-primary" onClick={() => setAnchor(null)}>{tx('Done')}</button>
      </Popover>
    </div>
  )
}

export default function DiscoveryBottomSheet({ sheetState, onSheetState, query, onQuery, filters, onFilter, onSearch, onReset, results, selectedVenueId, onSelect, onHover, savedIds, onSave, savedOnly, hasSearch }) {
  const { tx } = useLanguage()
  const startY = useRef(null)
  const suppressClick = useRef(false)
  const activeFilters = Object.values(filters).some((value) => Array.isArray(value) ? value.length : value)
  const expanded = sheetState === 'expanded'
  const visible = expanded ? results : results.slice(0, 4)

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
        <form className="dg-search" onSubmit={(event) => { event.preventDefault(); onSearch() }} role="search">
          <Search size={22} aria-hidden="true" />
          <input aria-label={tx('Search places')} placeholder={tx('Quiet café with power outlets to work...')} value={query} onChange={(event) => onQuery(event.target.value)} />
          <button type="submit" className="dg-primary">{tx('Search')}</button>
        </form>
        <FilterRow filters={filters} onChange={onFilter} onReset={onReset} active={Boolean(activeFilters || hasSearch)} />
        <div className="dg-recommendation-heading">
          <h1>{savedOnly ? tx('Your saved places') : hasSearch || activeFilters ? tx(results.length === 1 ? '1 place for you' : '{count} places for you', { count: results.length }) : tx('Recommended for you')}</h1>
          {results.length > 0 && <button type="button" onClick={() => onSheetState(expanded ? 'default' : 'expanded')}>{tx(expanded ? 'Show less' : 'View all')}<ArrowRight size={19} aria-hidden="true" /></button>}
        </div>
        <div className="dg-results" aria-label={tx('Recommended places')}>
          {visible.map((venue) => <DiscoveryVenueCard key={venue.id} venue={venue} selected={selectedVenueId === venue.id} saved={savedIds.includes(venue.id)} onSelect={onSelect} onHover={onHover} onSave={onSave} />)}
          {results.length === 0 && <div className="dg-empty" role="status"><h2>{tx(savedOnly ? 'No saved places here yet' : 'No places match just yet')}</h2><p>{tx(savedOnly ? 'Tap the heart on a place you like to keep it here.' : 'Try a different search or loosen a filter to find your next spot.')}</p><button type="button" onClick={onReset}>{tx(savedOnly ? 'Explore places' : 'Clear search and filters')}</button></div>}
        </div>
        <span className="dg-sr-only" role="status">{tx('{count} places found', { count: results.length })}</span>
      </div>
      {sheetState === 'collapsed' && <button type="button" className="dg-collapsed-summary" onClick={() => onSheetState('default')}><Search size={19} aria-hidden="true" /><span>{hasSearch ? query : tx('Find your next spot')}<small>{tx('{count} places to explore', { count: results.length })}</small></span><span>{tx('Explore ↑')}</span></button>}
    </section>
  )
}
