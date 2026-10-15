import { useState } from 'react'

export default function VenuePhoto({ venue, className = '', ...props }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`dg-photo-fallback ${className}`} role="img" aria-label={venue.name}><span>{venue.name}</span></div>
  return <img src={venue.image} alt={venue.name} className={className} onError={() => setFailed(true)} {...props} />
}
