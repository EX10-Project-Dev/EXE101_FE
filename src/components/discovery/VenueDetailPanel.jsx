import { useLanguage } from '../../contexts/LanguageContext'
import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import { X, ArrowUpRight, Heart } from 'lucide-react'
import { getDirectionsUrl } from '../../utils/geoUtils'
import { getMatchReasons } from '../../services/discoveryService'
import VenuePhoto from './VenuePhoto'

export default function VenueDetailPanel({ venue, onClose, filters, saved, onSave, onChoose }) {
  const { tx, language } = useLanguage()
  const [chosen, setChosen] = useState(false)
  return (
    <Drawer anchor="right" open={Boolean(venue)} onClose={onClose} slotProps={{ paper: { className: 'dg-detail-panel', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'dg-detail-name' } }}>
      {venue && <>
        <div className="dg-detail-photo"><VenuePhoto venue={venue} /><button className="dg-detail-close" type="button" onClick={onClose} aria-label={tx('Close venue details')}><X size={22} /></button></div>
        <div className="dg-detail-body">
          <p className="dg-detail-category">{tx(venue.category)}</p>
          <h2 id="dg-detail-name">{venue.name}</h2>
          <p className="dg-rating"><span>★ {venue.rating.toFixed(1)}</span><span className="dg-distance">({new Intl.NumberFormat(language, { notation: 'compact', maximumFractionDigits: 1 }).format(venue.reviewCount)})</span><i>·</i><span className="dg-distance">{venue.distanceKm} km</span><i>·</i><span className="dg-distance">{venue.priceLevel}</span></p>
          <p className="dg-detail-description">{language === 'vi' ? venue.descriptionVi : venue.description}</p>
          <section><h3>{tx('Why it matches you')}</h3><ul>{getMatchReasons(venue, filters, language).map((reason) => <li key={reason}>{reason}</li>)}</ul></section>
          <section><h3>{tx('Amenities')}</h3><div className="dg-tags">{venue.amenities.map((amenity) => <span key={amenity}>{tx(amenity)}</span>)}</div></section>
          <section><h3>{tx('Opening hours')}</h3><p>{venue.openingHours}</p></section>
          <section><h3>{tx('Address')}</h3><p>{venue.address}</p></section>
          <p className="dg-detail-note">{tx('Sample venue information. Check current hours and details before visiting.')}</p>
          {chosen && <p className="dg-chosen" role="status">{tx('{name} is your chosen place. Open Google Maps when you’re ready to go.', { name: venue.name })}</p>}
        </div>
        <div className="dg-detail-actions"><a href={getDirectionsUrl(venue)} target="_blank" rel="noopener noreferrer">{tx('Open in Google Maps')}<ArrowUpRight size={17} aria-hidden="true" /></a><div><button type="button" className="dg-primary" onClick={() => { setChosen(true); onChoose(venue.id) }}>{tx(chosen ? 'Place chosen' : 'Choose this place')}</button><button type="button" className="dg-detail-save" aria-label={tx(saved ? 'Unsave {name}' : 'Save {name}', { name: venue.name })} aria-pressed={saved} onClick={() => onSave(venue.id)}><Heart size={21} fill={saved ? 'currentColor' : 'none'} /></button></div></div>
      </>}
    </Drawer>
  )
}
