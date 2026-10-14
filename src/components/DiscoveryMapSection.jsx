import { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { ArrowUpRight, Coffee, Heart, MapPin, Sparkles, Utensils, Wifi } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '../contexts/LanguageContext'
import { MOCK_VENUES } from '../data/mockVenues'
import './DiscoveryMapSection.css'

// Sample discovery locations around central Ho Chi Minh City.
const MAP_PICKS = [
  { venueId: 'venue-1', position: [10.7717, 106.7045], symbol: '☕', reasonsEn: ['Wide tables and plenty of power outlets', 'Fast Wi-Fi and a quiet space to focus', 'Handcrafted specialty coffee'] },
  { venueId: 'venue-2', position: [10.7735, 106.6973], symbol: '🍕', reasonsEn: ['Warm lighting and a romantic atmosphere', 'Wood-fired pizza with house-made cheese', 'A thoughtful spot for a date night'] },
  { venueId: 'venue-3', position: [10.7771, 106.7031], symbol: '☕', reasonsEn: ['Vintage interiors with beautiful photo corners', 'Gentle music and plenty of natural light', 'A cozy place for a conversation or a book'] },
  { venueId: 'venue-5', position: [10.7825, 106.6874], symbol: '🍻', reasonsEn: ['A lively atmosphere for catching up with friends', 'Craft beers and a generous food menu', 'Relaxed outdoor seating'] },
  { venueId: 'venue-6', position: [10.7735, 106.7014], symbol: '🍰', reasonsEn: ['Japanese matcha and delicate desserts', 'An elegant, cozy space to unwind', 'An easy choice for friends or a casual date'] }
].map((pick) => ({ ...pick, venue: MOCK_VENUES.find((venue) => venue.id === pick.venueId) }))

function markerIcon(pick, active) {
  return L.divIcon({
    className: 'discovery-map-marker',
    html: `<span class="map-score-pill${active ? ' is-active' : ''}"><span aria-hidden="true">${pick.symbol}</span><b>${pick.venue.matchScore.toFixed(1)}</b></span>`,
    iconSize: [76, 38],
    iconAnchor: [38, 19]
  })
}

const REASON_ICONS = [Heart, Utensils, Coffee]

export default function DiscoveryMapSection({ onOpenDetail }) {
  const { isEn } = useLanguage()
  const mapElement = useRef(null)
  const markers = useRef([])
  const [selectedIndex, setSelectedIndex] = useState(1)
  const selected = MAP_PICKS[selectedIndex]

  useEffect(() => {
    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: false
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    markers.current = MAP_PICKS.map((pick, index) => {
      const marker = L.marker(pick.position, {
        icon: markerIcon(pick, index === 1),
        title: `${pick.venue.name}: ${pick.venue.matchScore}/10`,
        keyboard: true
      }).addTo(map)
      marker.on('click', () => setSelectedIndex(index))
      return marker
    })
    const fitMap = () => {
      map.invalidateSize()
      map.fitBounds(MAP_PICKS.map((pick) => pick.position), {
        paddingTopLeft: [55, 270],
        paddingBottomRight: [55, 60],
        maxZoom: 15
      })
    }
    const observer = new ResizeObserver(fitMap)
    observer.observe(mapElement.current)
    fitMap()
    return () => {
      observer.disconnect()
      markers.current = []
      map.remove()
    }
  }, [])

  useEffect(() => {
    markers.current.forEach((marker, index) => {
      marker.setIcon(markerIcon(MAP_PICKS[index], index === selectedIndex))
      marker.setZIndexOffset(index === selectedIndex ? 1000 : 0)
    })
  }, [selectedIndex])

  return (
    <Box component="section" id="discovery-map" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg" sx={{ maxWidth: '1080px !important' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography component="h2" className="discovery-map-title">
            {isEn ? 'FEELS LIKE THE RESEARCH' : 'QUÁN HỢP GU BẠN,'}
            <br />
            <Box component="span" sx={{ color: '#B9480B' }}>
              {isEn ? 'WAS ALREADY DONE FOR YOU' : 'ĐÃ ĐƯỢC TÌM SẴN.'}
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: 590, mx: 'auto', mt: 2, color: '#68564B', fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.7 }}>
            {isEn
              ? 'Find places that fit your moment. Explore the map and see the match score and reasons behind every recommendation.'
              : 'Khám phá những nơi phù hợp với khoảnh khắc của bạn. Chạm vào từng địa điểm để xem điểm phù hợp và lý do gợi ý.'}
          </Typography>
        </Box>

        <div className="discovery-map-frame">
          <div ref={mapElement} className="discovery-map-canvas" role="region" aria-label={isEn ? 'Recommended places in Ho Chi Minh City' : 'Bản đồ địa điểm gợi ý tại TP.HCM'} />
          <div className="discovery-map-caption"><MapPin size={14} aria-hidden="true" />{isEn ? 'Sample picks · Ho Chi Minh City' : 'Gợi ý mẫu · TP. Hồ Chí Minh'}</div>

          <article className="map-match-card" aria-live="polite" aria-atomic="true">
            <div className="map-match-score"><Sparkles size={20} aria-hidden="true" /><strong>{selected.venue.matchScore.toFixed(1)}</strong><span>/ 10 {isEn ? 'match score' : 'điểm phù hợp'}</span></div>
            <h3>{selected.venue.name}</h3>
            <div className="map-match-reasons">
              {(isEn ? selected.reasonsEn : selected.venue.reasons).map((reason, index) => {
                const Icon = REASON_ICONS[index]
                return <div className={`map-match-reason reason-${index}`} key={reason}><Icon size={15} strokeWidth={1.7} aria-hidden="true" /><span>{reason}</span></div>
              })}
            </div>
            <Button size="small" onClick={() => onOpenDetail?.(selected.venue)} endIcon={<ArrowUpRight size={15} />} sx={{ color: '#B9480B', textTransform: 'none', fontWeight: 600, mt: 0.75 }}>
              {isEn ? 'Explore this place' : 'Khám phá địa điểm'}
            </Button>
          </article>
        </div>

        <div className="discovery-map-legend">
          <span><Sparkles size={16} aria-hidden="true" />{isEn ? 'Clear match scores' : 'Điểm phù hợp rõ ràng'}</span>
          <span><Wifi size={16} aria-hidden="true" />{isEn ? 'Reasons that matter to you' : 'Lý do đúng nhu cầu'}</span>
          <span><MapPin size={16} aria-hidden="true" />{isEn ? 'Tap a pin to explore' : 'Chạm vào quán để khám phá'}</span>
        </div>
      </Container>
    </Box>
  )
}
