import { useLanguage } from '../../contexts/LanguageContext'
import { Heart } from 'lucide-react'
import VenuePhoto from './VenuePhoto'

export default function DiscoveryVenueCard({ venue, selected, saved, onSelect, onHover, onSave }) {
  const { tx } = useLanguage()
  return (
    <article className={`dg-card${selected ? ' is-selected' : ''}`} data-venue-id={venue.id} onMouseEnter={() => onHover(venue.id)} onMouseLeave={() => onHover(null)}>
      <button type="button" className="dg-card-select" onClick={() => onSelect(venue.id)} onFocus={() => onHover(venue.id)} onBlur={() => onHover(null)} aria-pressed={selected} aria-label={tx('Show {name} on map', { name: venue.name })}>
        <VenuePhoto venue={venue} className="dg-card-photo" />
        <div className="dg-card-body">
          <h3>{venue.name}</h3>
          {venue.reviewSource === 'demo' && <span className="dg-card-match">✦ {venue.matchScore.toFixed(1)} / 10 · AI demo</span>}
          <p className="dg-rating"><span><span aria-hidden="true">★</span> {venue.rating.toFixed(1)}</span><i aria-hidden="true">·</i><span className="dg-distance">{venue.distanceKm} km</span></p>
          <div className="dg-tags">{(venue.tags || (venue.category ? [venue.category] : [])).map((tag) => <span key={tag}>{tx(tag)}</span>)}</div>
        </div>
      </button>
      <button className={`dg-save${saved ? ' is-saved' : ''}`} type="button" onClick={() => onSave(venue.id)} aria-pressed={saved} aria-label={tx(saved ? 'Unsave {name}' : 'Save {name}', { name: venue.name })}><Heart size={22} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /></button>
    </article>
  )
}
