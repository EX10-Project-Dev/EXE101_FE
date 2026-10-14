import { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { ArrowUpRight, Coffee, Compass, Heart, MapPin, Navigation, Sparkles, Utensils, Wifi, X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { useLanguage } from '../contexts/LanguageContext'
import { MOCK_VENUES } from '../data/mockVenues'
import { extractVenueCoordinates, getDirectionsUrl } from '../utils/geoUtils'
import './DiscoveryMapSection.css'
import Reveal from './Reveal'
import { useReducedMotion } from 'framer-motion'

const CATEGORY_SYMBOLS = {
  Café: '☕',
  Restaurant: '🍕',
  'Other F&B': '🍻',
  Dessert: '🍰',
  'Tea & Beverage': '🧋',
  'Fast Food': '🍔'
}

const REASON_ICONS = [Heart, Utensils, Coffee, Wifi]

// HTML generator for modern, crisp custom map pin
function createCustomMarkerHtml(venue, symbol) {
  const score = venue.matchScore?.toFixed(1) || '9.5'
  return `
    <div class="custom-map-pin is-active" title="${venue.name}: ${score}/10">
      <div class="pin-card-pill">
        <span class="pin-emoji" aria-hidden="true">${symbol}</span>
        <span class="pin-name">${venue.name}</span>
        <span class="pin-score-tag">★ ${score}</span>
      </div>
      <div class="pin-pointer-tip"></div>
      <div class="pin-ground-dot"></div>
    </div>
  `
}

// Custom designer Google Maps styles: clean, warm, uncluttered
const GOOGLE_MAP_STYLES = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cbe4f6' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#fbf9f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#eee7de' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffeacc' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#fbd09b' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5f3e5' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#57463a' }] },
  { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#2c201a' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#7a6557' }] }
]

function GoogleMapPanTo({ targetPosition, zoom = 16 }) {
  const map = useMap()
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (!map || !targetPosition) return
    if (reducedMotion) map.setCenter(targetPosition)
    else map.panTo(targetPosition)
    map.setZoom(zoom)
  }, [map, targetPosition, zoom, reducedMotion])
  return null
}

function LeafletMapCanvas({ activeVenue, onMarkerClick, recenterTrigger }) {
  const reducedMotion = useReducedMotion()
  const mapElement = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const onMarkerClickRef = useRef(onMarkerClick)

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick
  })

  useEffect(() => {
    if (!mapElement.current) return
    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: false,
      center: [10.775, 106.700],
      zoom: 14
    })
    mapInstanceRef.current = map

    // Humanitarian OpenStreetMap tiles: warm pastel palette, clear street names, no watermark
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank" rel="noopener">HOT</a>',
      maxZoom: 19
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const handleResize = () => map.invalidateSize()
    const observer = new ResizeObserver(handleResize)
    observer.observe(mapElement.current)

    return () => {
      observer.disconnect()
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Recenter back to central Ho Chi Minh City
  useEffect(() => {
    if (recenterTrigger > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([10.775, 106.700], 14, { duration: 1, animate: !reducedMotion })
    }
  }, [recenterTrigger, reducedMotion])

  // Update marker & smooth flyTo active venue with dynamically parsed coordinates
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (!activeVenue) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    const coords = extractVenueCoordinates(activeVenue)
    const position = coords ? [coords.lat, coords.lng] : [10.775, 106.700]
    const symbol = CATEGORY_SYMBOLS[activeVenue.category] || '📍'
    const icon = L.divIcon({
      className: 'custom-leaflet-marker-wrap',
      html: createCustomMarkerHtml(activeVenue, symbol),
      iconSize: [240, 56],
      iconAnchor: [120, 56]
    })

    if (!markerRef.current) {
      markerRef.current = L.marker(position, {
        icon,
        title: `${activeVenue.name}: ${activeVenue.matchScore}/10`,
        keyboard: true
      }).addTo(map)
      markerRef.current.on('click', () => onMarkerClickRef.current?.(activeVenue))
    } else {
      markerRef.current.setLatLng(position)
      markerRef.current.setIcon(icon)
    }

    map.flyTo(position, 16, { duration: 1.2, easeLinearity: 0.25, animate: !reducedMotion })
  }, [activeVenue, reducedMotion])

  return (
    <div
      ref={mapElement}
      className="discovery-map-canvas"
      role="region"
      aria-label="Interactive map of recommended places in Ho Chi Minh City"
    />
  )
}

export default function DiscoveryMapSection({
  searchControls,
  onOpenDetail,
  focusedVenueId,
  onClearVenue,
  onSelectVenue,
  venues = MOCK_VENUES
}) {
  const { isEn } = useLanguage()
  const [userSelectedVenueId, setUserSelectedVenueId] = useState(null)
  const [prevFocusedVenueId, setPrevFocusedVenueId] = useState(focusedVenueId)
  const [recenterTrigger, setRecenterTrigger] = useState(0)

  // React official pattern: adjust state during render when props change
  if (focusedVenueId !== prevFocusedVenueId) {
    setPrevFocusedVenueId(focusedVenueId)
    setUserSelectedVenueId(null)
  }

  const venueList = venues?.length > 0 ? venues : MOCK_VENUES
  const activeVenueId = userSelectedVenueId || focusedVenueId || null
  const activeVenue = activeVenueId ? venueList.find((v) => v.id === activeVenueId) : null
  const activeCoords = extractVenueCoordinates(activeVenue)
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()

  const handleMarkerClick = (venue) => {
    onOpenDetail?.(venue)
  }

  const handleClear = () => {
    setUserSelectedVenueId(null)
    onClearVenue?.()
  }

  const handleQuickSelect = (venue) => {
    setUserSelectedVenueId(venue.id)
    onSelectVenue?.(venue)
  }

  const handleRecenter = () => {
    setRecenterTrigger((prev) => prev + 1)
  }

  return (
    <Box component="section" id="discovery-map" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg" sx={{ maxWidth: '1080px !important' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography component={Reveal} tag="h2" className="discovery-map-title">
            {isEn ? 'FEELS LIKE THE RESEARCH' : 'QUÁN HỢP GU BẠN,'}
            <br />
            <Box component="span" sx={{ color: '#B9480B' }}>
              {isEn ? 'WAS ALREADY DONE FOR YOU' : 'ĐÃ ĐƯỢC TÌM SẴN.'}
            </Box>
          </Typography>
          <Typography component={Reveal} delay={0.12} sx={{ maxWidth: 590, mx: 'auto', mt: 2, color: '#68564B', fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.7 }}>
            {isEn
              ? 'Find places that fit your moment. Search or choose a venue above to view its exact location on the map.'
              : 'Khám phá những nơi phù hợp với khoảnh khắc của bạn. Tìm kiếm hoặc chọn một địa điểm ở trên để hiển thị vị trí trên bản đồ.'}
          </Typography>
        </Box>

        <Reveal scale={0.97} delay={0.18} className={`discovery-map-frame${searchControls ? ' discovery-map-frame--search' : ''}`}>
          <div className="map-surface">
          {/* Floating Top Control Bar */}
          <div className="map-top-bar">
            <div className="map-status-badge">
              <MapPin size={15} aria-hidden="true" />
              {activeVenue ? (
                <span>
                  {isEn ? 'Viewing: ' : 'Đang xem: '}
                  <strong>{activeVenue.name}</strong>
                </span>
              ) : (
                <span>{isEn ? 'Ho Chi Minh City · Pick a place to locate' : 'TP. Hồ Chí Minh · Chọn quán để định vị'}</span>
              )}
            </div>

            <div className="map-top-actions">
              <button
                type="button"
                className="map-action-btn"
                onClick={handleRecenter}
                title={isEn ? 'Center map on Ho Chi Minh City' : 'Về trung tâm TP. Hồ Chí Minh'}
              >
                <Compass size={14} />
                <span>{isEn ? 'Recenter' : 'Trung tâm'}</span>
              </button>

              {activeVenue && (
                <button
                  type="button"
                  className="map-action-btn"
                  onClick={handleClear}
                  title={isEn ? 'Hide venue marker' : 'Ẩn địa điểm khỏi bản đồ'}
                >
                  <X size={14} />
                  <span>{isEn ? 'Hide' : 'Ẩn vị trí'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Map Canvas: Google Maps (if API key provided) or Leaflet */}
          {googleMapsApiKey ? (
            <div
              className="discovery-map-canvas"
              role="region"
              aria-label={isEn ? 'Google Maps of recommended places in Ho Chi Minh City' : 'Bản đồ Google Maps địa điểm gợi ý tại TP.HCM'}
            >
              <APIProvider apiKey={googleMapsApiKey}>
                <Map
                  defaultCenter={{ lat: 10.775, lng: 106.700 }}
                  defaultZoom={14}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                  disableDefaultUI
                  zoomControl
                  styles={GOOGLE_MAP_STYLES}
                  style={{ width: '100%', height: '100%' }}
                >
                  {activeVenue && (
                    <>
                      <GoogleMapPanTo targetPosition={activeCoords || { lat: 10.775, lng: 106.700 }} />
                      <AdvancedMarker
                        position={activeCoords || { lat: 10.775, lng: 106.700 }}
                        onClick={() => handleMarkerClick(activeVenue)}
                        zIndex={1000}
                        title={`${activeVenue.name}: ${activeVenue.matchScore}/10`}
                      >
                        <div className="custom-map-pin is-active">
                          <div className="pin-card-pill">
                            <span className="pin-emoji" aria-hidden="true">{CATEGORY_SYMBOLS[activeVenue.category] || '📍'}</span>
                            <span className="pin-name">{activeVenue.name}</span>
                            <span className="pin-score-tag">★ {activeVenue.matchScore?.toFixed(1) || '9.5'}</span>
                          </div>
                          <div className="pin-pointer-tip" />
                          <div className="pin-ground-dot" />
                        </div>
                      </AdvancedMarker>
                    </>
                  )}
                </Map>
              </APIProvider>
            </div>
          ) : (
            <LeafletMapCanvas
              activeVenue={activeVenue}
              onMarkerClick={handleMarkerClick}
              recenterTrigger={recenterTrigger}
            />
          )}

          {/* Quick venue picks floating bar (when no venue is active) */}
          {!activeVenue && (
            <div className="map-quick-picks-bar" role="toolbar" aria-label={isEn ? 'Quick pick venues' : 'Chọn nhanh quán'}>
              <span className="quick-picks-label">
                <Sparkles size={13} aria-hidden="true" />
                {isEn ? 'Quick explore:' : 'Khám phá nhanh:'}
              </span>
              <div className="quick-picks-list">
                {venueList.slice(0, 10).map((venue) => {
                  const symbol = CATEGORY_SYMBOLS[venue.category] || '📍'
                  return (
                    <button
                      key={venue.id}
                      type="button"
                      className="map-quick-chip"
                      onClick={() => handleQuickSelect(venue)}
                    >
                      <span aria-hidden="true">{symbol}</span>
                      <span>{venue.name.split('-')[0].trim()}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Floating Detail Card for the active venue */}
          {activeVenue && (
            <Reveal
              tag="article"
              key={activeVenue.id}
              distance={16}
              delay={0.35}
              className="discovery-map-card"
              aria-live="polite"
              aria-atomic="true"
              onClick={() => onOpenDetail?.(activeVenue)}
              title={isEn ? 'Click to view full details' : 'Nhấn để xem chi tiết đầy đủ'}
            >
              <button
                type="button"
                className="card-close-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                aria-label={isEn ? 'Hide location' : 'Ẩn vị trí'}
                title={isEn ? 'Hide location' : 'Ẩn vị trí'}
              >
                <X size={15} />
              </button>

              <div className="card-top-content">
                {activeVenue.images?.[0] && (
                  <img
                    src={activeVenue.images[0]}
                    alt={activeVenue.name}
                    className="card-thumb"
                    loading="lazy"
                  />
                )}
                <div className="card-meta">
                  <div className="card-badge-row">
                    <span className="card-category-badge">
                      {CATEGORY_SYMBOLS[activeVenue.category] || '📍'} {activeVenue.category}
                    </span>
                    {activeVenue.priceRange && (
                      <span className="card-price-badge">{activeVenue.priceRange}</span>
                    )}
                  </div>
                  <h3 className="card-venue-title">{activeVenue.name}</h3>
                  <p className="card-venue-address">
                    <MapPin size={12} aria-hidden="true" />
                    <span>{activeVenue.address}</span>
                  </p>
                </div>
              </div>

              <div className="card-score-strip">
                <div className="score-badge">
                  <Sparkles size={16} aria-hidden="true" />
                  <strong>{activeVenue.matchScore?.toFixed(1) || '9.5'}</strong>
                  <span>/ 10</span>
                </div>
                <span className="score-label">
                  {isEn ? 'High Compatibility Match' : 'Độ phù hợp rất cao theo gu bạn'}
                </span>
              </div>

              <div className="card-reasons">
                {(isEn ? (activeVenue.reasonsEn || activeVenue.reasons) : activeVenue.reasons).slice(0, 2).map((reason, idx) => {
                  const Icon = REASON_ICONS[idx] || Heart
                  return (
                    <div key={reason} className="card-reason-tag">
                      <Icon size={13} aria-hidden="true" />
                      <span>{reason}</span>
                    </div>
                  )
                })}
              </div>

              <div className="card-actions-row">
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDetail?.(activeVenue)
                  }}
                  endIcon={<ArrowUpRight size={15} />}
                  className="card-detail-btn"
                >
                  {isEn ? 'View Details' : 'Xem chi tiết'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={getDirectionsUrl(activeVenue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  endIcon={<Navigation size={13} />}
                  className="card-directions-btn"
                >
                  {isEn ? 'Directions' : 'Chỉ đường'}
                </Button>
              </div>
            </Reveal>
          )}
          </div>
          {searchControls && <div className="map-search-controls">{searchControls}</div>}
        </Reveal>

        {/* Map Legend */}
        <div className="discovery-map-legend">
          <span><Sparkles size={16} aria-hidden="true" />{isEn ? 'Clear match scores' : 'Điểm phù hợp rõ ràng'}</span>
          <span><Wifi size={16} aria-hidden="true" />{isEn ? 'Reasons that matter to you' : 'Lý do đúng nhu cầu'}</span>
          <span><MapPin size={16} aria-hidden="true" />{isEn ? 'Tap pin to see details' : 'Chạm vào vị trí để xem chi tiết'}</span>
        </div>
      </Container>
    </Box>
  )
}
