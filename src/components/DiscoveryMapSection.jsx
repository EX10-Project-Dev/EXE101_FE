import { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { ArrowUpRight, Coffee, Compass, Heart, MapPin, Navigation, Sparkles, Utensils, Wifi, X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { useLanguage } from '../contexts/LanguageContext'
import { MOCK_VENUES } from '../data/mockVenues'
import { extractVenueCoordinates, getDirectionsUrl } from '../utils/geoUtils'
import './DiscoveryMapSection.css'
import Reveal from './Reveal'
import { useReducedMotion } from 'framer-motion'

const CATEGORY_SYMBOLS = {
  Café: '☕',
  'Cà phê': '☕',
  Restaurant: '🥘',
  'Nhà hàng': '🥘',
  'Other F&B': '🍻',
  'Quán bar': '🍸',
  Dessert: '🍰',
  'Tráng miệng': '🧁',
  'Tea & Beverage': '🧋',
  'Trà & đồ uống': '🧋',
  'Fast Food': '🍔',
  'Đồ ăn nhanh': '🍔',
  'Món Việt': '🍜',
  'Kem': '🍨'
}


const REASON_ICONS = [Heart, Utensils, Coffee, Wifi]

const DEFAULT_MAP_CENTER = [10.8458, 106.8059]

// HTML generator for modern, crisp custom map pin
function createCustomMarkerHtml(venue, symbol, isActive = false) {
  const score = venue.matchScore?.toFixed(1) || '9.5'
  const shortName = venue.name.split('-')[0].trim()
  return `
    <div class="custom-map-pin ${isActive ? 'is-active' : 'is-marker'}" title="${venue.name}: ${score}/10">
      <div class="pin-card-pill">
        <span class="pin-emoji" aria-hidden="true">${symbol}</span>
        <span class="pin-name">${shortName}</span>
        ${isActive ? `<span class="pin-score-tag">★ ${score}</span>` : ''}
      </div>
      <div class="pin-pointer-tip"></div>
      <div class="pin-ground-dot"></div>
    </div>
  `
}

function LeafletMapCanvas({ venues = [], activeVenue, onMarkerClick, recenterTrigger, demo }) {
  const { tx } = useLanguage()
  const reducedMotion = useReducedMotion()
  const mapElement = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef(new Map())
  const onMarkerClickRef = useRef(onMarkerClick)

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick
  })

  useEffect(() => {
    if (!mapElement.current) return
    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      dragging: !demo,
      touchZoom: !demo,
      doubleClickZoom: !demo,
      boxZoom: !demo,
      keyboard: !demo,
      zoomControl: false,
      center: DEFAULT_MAP_CENTER,
      zoom: 13
    })
    mapInstanceRef.current = map

    // Humanitarian OpenStreetMap tiles: warm pastel palette, clear street names, no watermark
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank" rel="noopener">HOT</a>',
      maxZoom: 19
    }).addTo(map)

    const handleResize = () => map.invalidateSize()
    const observer = new ResizeObserver(handleResize)
    observer.observe(mapElement.current)

    const currentMarkers = markersRef.current
    return () => {
      observer.disconnect()
      currentMarkers.forEach((marker) => marker.remove())
      currentMarkers.clear()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [demo])

  useEffect(() => {
    if (demo || !mapInstanceRef.current) return
    const control = L.control.zoom({ position: 'bottomright', zoomInTitle: tx('Zoom in'), zoomOutTitle: tx('Zoom out') }).addTo(mapInstanceRef.current)
    return () => { control.remove() }
  }, [tx, demo])

  // Recenter back to database venues centroid or fit bounds
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    const validCoords = venues.map(extractVenueCoordinates).filter(Boolean)
    if (validCoords.length > 0) {
      map.fitBounds(validCoords.map((c) => [c.lat, c.lng]), { padding: [50, 50], maxZoom: 15, animate: !reducedMotion })
    } else {
      map.flyTo(DEFAULT_MAP_CENTER, 13, { duration: 1, animate: !reducedMotion })
    }
  }, [recenterTrigger, venues, reducedMotion])

  // Render & update markers for all venues in the current list
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const currentMarkers = markersRef.current

    // Remove stale markers
    currentMarkers.forEach((marker, id) => {
      if (!venues.some((v) => v.id === id)) {
        marker.remove()
        currentMarkers.delete(id)
      }
    })

    // Create or update markers
    venues.forEach((venue) => {
      const coords = extractVenueCoordinates(venue)
      if (!coords) return
      const isSelected = activeVenue?.id === venue.id
      const symbol = CATEGORY_SYMBOLS[venue.category] || '📍'
      const icon = L.divIcon({
        className: 'custom-leaflet-marker-wrap',
        html: createCustomMarkerHtml(venue, symbol, isSelected),
        iconSize: isSelected ? [240, 56] : [160, 44],
        iconAnchor: isSelected ? [120, 56] : [80, 44]
      })

      let marker = currentMarkers.get(venue.id)
      if (!marker) {
        marker = L.marker([coords.lat, coords.lng], {
          icon,
          title: `${venue.name}: ${venue.matchScore}/10`,
          keyboard: true,
          zIndexOffset: isSelected ? 1000 : 100
        }).addTo(map)
        marker.on('click', () => onMarkerClickRef.current?.(venue))
        currentMarkers.set(venue.id, marker)
      } else {
        marker.setLatLng([coords.lat, coords.lng])
        marker.setIcon(icon)
        marker.setZIndexOffset(isSelected ? 1000 : 100)
      }
    })
  }, [venues, activeVenue])

  // Smooth flyTo active venue
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !activeVenue) return
    const coords = extractVenueCoordinates(activeVenue)
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1.2, easeLinearity: 0.25, animate: !reducedMotion })
    }
  }, [activeVenue, reducedMotion])

  return (
    <div
      ref={mapElement}
      className="discovery-map-canvas"
      role="region"
      aria-label={tx('Interactive map of Ho Chi Minh City')}
    />
  )
}

function GoogleMapController({ activeCoords, venues, recenterTrigger }) {
  const map = useMap()
  useEffect(() => {
    if (!map || !activeCoords) return
    map.panTo(activeCoords)
  }, [map, activeCoords])

  useEffect(() => {
    if (!map) return
    const validCoords = venues.map(extractVenueCoordinates).filter(Boolean)
    if (!validCoords.length) {
      map.setCenter({ lat: DEFAULT_MAP_CENTER[0], lng: DEFAULT_MAP_CENTER[1] })
      map.setZoom(13)
      return
    }
    const lats = validCoords.map((c) => c.lat)
    const lngs = validCoords.map((c) => c.lng)
    map.fitBounds({
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    }, 50)
  }, [map, recenterTrigger, venues])

  return null
}

export default function DiscoveryMapSection({
  demo = false,
  searchControls,
  onOpenDetail,
  focusedVenueId,
  onClearVenue,
  onSelectVenue,
  venues = MOCK_VENUES
}) {
  const { isEn, tx } = useLanguage()
  const [userSelectedVenueId, setUserSelectedVenueId] = useState(null)
  const [prevFocusedVenueId, setPrevFocusedVenueId] = useState(focusedVenueId)
  const [recenterTrigger, setRecenterTrigger] = useState(0)

  // React official pattern: adjust state during render when props change
  if (focusedVenueId !== prevFocusedVenueId) {
    setPrevFocusedVenueId(focusedVenueId)
    setUserSelectedVenueId(null)
  }

  const venueList = venues?.length > 0 ? venues : MOCK_VENUES
  const activeVenueId = demo ? null : userSelectedVenueId || focusedVenueId || null
  const activeVenue = activeVenueId ? venueList.find((v) => v.id === activeVenueId) : null
  const activeCoords = extractVenueCoordinates(activeVenue)
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()

  const handleMarkerClick = (venue) => {
    setUserSelectedVenueId(venue.id)
    onSelectVenue?.(venue)
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
            {demo
              ? (isEn
                  ? 'A preview of how you can discover places that match your taste.'
                  : 'Xem trước cách khám phá những địa điểm phù hợp với gu của bạn.')
              : isEn
              ? 'Find places that fit your moment. Search or choose a venue above to view its exact location on the map.'
              : 'Khám phá những nơi phù hợp với khoảnh khắc của bạn. Tìm kiếm hoặc chọn một địa điểm ở trên để hiển thị vị trí trên bản đồ.'}
          </Typography>
        </Box>

        {demo && (
          <p className="discovery-map-demo-label">
            {isEn ? 'Demo · Preview only' : 'Bản demo · Chỉ để xem trước'}
          </p>
        )}
        <Reveal scale={0.97} delay={0.18} className={`discovery-map-frame${searchControls ? ' discovery-map-frame--search' : ''}${demo ? ' discovery-map-frame--demo' : ''}`}
          role={demo ? 'img' : undefined}
          aria-label={demo ? (isEn ? 'Demo preview of the venue map and search in Ho Chi Minh City' : 'Bản demo bản đồ và tìm kiếm quán tại TP. Hồ Chí Minh') : undefined}
        >
          <div inert={demo}>
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
                <span>{demo
                  ? (isEn ? 'Ho Chi Minh City · Demo map' : 'TP. Hồ Chí Minh · Bản đồ demo')
                  : (isEn ? 'Ho Chi Minh City · Pick a place to locate' : 'TP. Hồ Chí Minh · Chọn quán để định vị')}</span>
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
                <GoogleMap
                  defaultCenter={{ lat: DEFAULT_MAP_CENTER[0], lng: DEFAULT_MAP_CENTER[1] }}
                  defaultZoom={13}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                  disableDefaultUI
                  zoomControl={!demo}
                  gestureHandling={demo ? 'none' : 'auto'}
                  keyboardShortcuts={!demo}
                  clickableIcons={!demo}
                  style={{ width: '100%', height: '100%' }}
                >
                  <GoogleMapController activeCoords={activeCoords} venues={venueList} recenterTrigger={recenterTrigger} />
                  {venueList.map((venue) => {
                    const coords = extractVenueCoordinates(venue)
                    if (!coords) return null
                    const isSelected = activeVenue?.id === venue.id
                    const symbol = CATEGORY_SYMBOLS[venue.category] || '📍'
                    const score = venue.matchScore?.toFixed(1) || '9.5'
                    return (
                      <AdvancedMarker
                        key={venue.id}
                        position={coords}
                        onClick={() => handleMarkerClick(venue)}
                        zIndex={isSelected ? 1000 : 100}
                        title={`${venue.name}: ${score}/10`}
                      >
                        <div className={`custom-map-pin ${isSelected ? 'is-active' : 'is-marker'}`}>
                          <div className="pin-card-pill">
                            <span className="pin-emoji" aria-hidden="true">{symbol}</span>
                            <span className="pin-name">{venue.name.split('-')[0].trim()}</span>
                            {isSelected && <span className="pin-score-tag">★ {score}</span>}
                          </div>
                          <div className="pin-pointer-tip" />
                          <div className="pin-ground-dot" />
                        </div>
                      </AdvancedMarker>
                    )
                  })}
                </GoogleMap>
              </APIProvider>
            </div>
          ) : (
            <LeafletMapCanvas
              demo={demo}
              venues={venueList}
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
                {venueList.map((venue) => {
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
                      {CATEGORY_SYMBOLS[activeVenue.category] || '📍'} {tx(activeVenue.category)}
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
          </div>
        </Reveal>

        {/* Map Legend */}
        <div className="discovery-map-legend">
          <span><Sparkles size={16} aria-hidden="true" />{isEn ? 'Clear match scores' : 'Điểm phù hợp rõ ràng'}</span>
          <span><Wifi size={16} aria-hidden="true" />{isEn ? 'Reasons that matter to you' : 'Lý do đúng nhu cầu'}</span>
          <span><MapPin size={16} aria-hidden="true" />{demo
            ? (isEn ? 'Illustrative map preview' : 'Bản đồ minh họa')
            : (isEn ? 'Tap pin to see details' : 'Chạm vào vị trí để xem chi tiết')}</span>
        </div>
      </Container>
    </Box>
  )
}
