import { useLanguage } from '../../contexts/LanguageContext'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import VenuePhoto from './VenuePhoto'
import VenueMatchPopup from './VenueMatchPopup'
import { venueSymbol } from '../../utils/venueSymbols'

const CITY_CENTER = { lat: 10.786, lng: 106.705 }


function VenueMapPopup({ venue, onDetails, onMatch, onCloseMatch, expanded }) {
  const { tx } = useLanguage()
  if (expanded) return <VenueMatchPopup venue={venue} onClose={onCloseMatch} onDetails={onDetails} />
  return <button className="dg-map-preview" type="button" onClick={(event) => { event.stopPropagation(); onMatch(venue) }} aria-label={tx('View details for {name}', { name: venue.name })}><VenuePhoto venue={venue} /><span><strong>{venue.name}</strong><span className="dg-rating"><span>★ {venue.rating.toFixed(1)}</span><i>·</i><span className="dg-distance">{venue.distanceKm} km</span></span><span className="dg-preview-link">{tx('View details →')}</span></span></button>
}

function makeIcon(venue, selected, highlighted, expanded) {
  if (expanded) return L.divIcon({ className: 'dg-marker-container', html: `<span class="dg-match-marker"><span>${venueSymbol(venue)}</span><strong>${venue.matchScore.toFixed(1)}</strong></span>`, iconSize: [96, 46], iconAnchor: [48, 46], popupAnchor: [0, -46] })
  return L.divIcon({ className: 'dg-marker-container', html: `<span class="dg-pin${selected ? ' is-selected' : ''}${highlighted ? ' is-highlighted' : ''}" aria-hidden="true"><span class="dg-pin-body"><span class="dg-pin-symbol">${venueSymbol(venue)}</span></span></span>`, iconSize: [38, 46], iconAnchor: [19, 46], popupAnchor: [0, -48] })
}

function LeafletDiscoveryMap({ venues, selectedVenueId, hoveredVenueId, onSelect, onDetails, recenterKey, matchVenueId, onMatch, onCloseMatch }) {
  const { tx } = useLanguage()
  const element = useRef(null)
  const mapRef = useRef(null)
  const markers = useRef(new Map())
  const [popupElement] = useState(() => document.createElement('div'))
  const [tileError, setTileError] = useState(false)
  const [markerClick, setMarkerClick] = useState(0)
  const selected = venues.find((venue) => venue.id === selectedVenueId)
  const expanded = Boolean(selected && selected.id === matchVenueId)

  useEffect(() => {
    const map = L.map(element.current, { center: [CITY_CENTER.lat, CITY_CENTER.lng], zoom: 14, zoomControl: false, scrollWheelZoom: true })
    mapRef.current = map
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://www.hotosm.org/">HOT</a>',
      maxZoom: 19,
    }).addTo(map)
    tiles.on('tileerror', () => setTileError(true))
    tiles.on('tileload', () => setTileError(false))
    const observer = new ResizeObserver(() => { map.invalidateSize({ pan: false }); map.eachLayer(layer => { if (layer instanceof L.Popup) layer.update() }) })
    observer.observe(element.current)
    return () => { observer.disconnect(); map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const control = L.control.zoom({ position: 'bottomright', zoomInTitle: tx('Zoom in'), zoomOutTitle: tx('Zoom out') }).addTo(mapRef.current)
    return () => { control.remove() }
  }, [tx])

  useEffect(() => {
    const map = mapRef.current
    const currentMarkers = markers.current
    venues.forEach((venue) => {
      const marker = L.marker([venue.lat, venue.lng], { icon: makeIcon(venue, false, false), title: venue.name, alt: venue.name, keyboard: true })
        .addTo(map).on('click', () => { onSelect(venue.id); setMarkerClick(value => value + 1) })
      currentMarkers.set(venue.id, marker)
    })
    return () => { currentMarkers.forEach((marker) => marker.remove()); currentMarkers.clear() }
  }, [venues, onSelect])

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      const venue = venues.find((item) => item.id === id)
      const isSelected = id === selectedVenueId
      const isHighlighted = !isSelected && id === hoveredVenueId
      const styleKey = `${isSelected}-${isHighlighted}-${expanded && isSelected}`
      if (marker.options.discoveryStyle !== styleKey) {
        marker.setIcon(makeIcon(venue, isSelected, isHighlighted, expanded && isSelected))
        marker.options.discoveryStyle = styleKey
      }
      marker.getElement()?.setAttribute('aria-label', tx('Show {name} on map', { name: venue?.name }))
      marker.setZIndexOffset(id === selectedVenueId ? 1000 : id === hoveredVenueId ? 500 : 0)
    })
  }, [venues, selectedVenueId, hoveredVenueId, tx, expanded])

  useEffect(() => {
    const map = mapRef.current
    map.closePopup()
    const marker = markers.current.get(selectedVenueId)
    if (marker) {
      map.panTo(marker.getLatLng(), { animate: false })
      const popup = L.popup({ className: `dg-leaflet-popup${expanded ? ' dg-leaflet-popup--match' : ''}`, offset: [0, -46], closeButton: false, autoPan: true, autoPanPaddingTopLeft: [12, 64], autoPanPaddingBottomRight: [12, 60], maxWidth: expanded ? 342 : 290, minWidth: 240 }).setLatLng(marker.getLatLng()).setContent(popupElement)
      popup.on('remove', onCloseMatch).openOn(map)
      return () => {
        // Replacing a popup during selection is not a user dismissal.
        popup.off('remove', onCloseMatch)
        map.closePopup(popup)
      }
    }
  }, [selectedVenueId, venues, popupElement, expanded, markerClick, onCloseMatch])

  useEffect(() => {
    if (!recenterKey) return
    const map = mapRef.current
    if (venues.length) map.fitBounds(venues.map((venue) => [venue.lat, venue.lng]), { paddingTopLeft: [70, 130], paddingBottomRight: [70, 100], maxZoom: 14, animate: false })
    else map.setView([CITY_CENTER.lat, CITY_CENTER.lng], 14)
  }, [recenterKey, venues])

  return <><div ref={element} className="dg-map-canvas" aria-label={tx('Interactive map of Ho Chi Minh City')} role="region" />{selected && createPortal(<VenueMapPopup venue={selected} onDetails={onDetails} onMatch={onMatch} onCloseMatch={onCloseMatch} expanded={expanded} />, popupElement)}{tileError && <p className="dg-map-error" role="status">{tx('Map tiles are unavailable. You can still explore the places below.')}</p>}</>
}

function GoogleMapController({ selected, venues, recenterKey }) {
  const map = useMap()
  useEffect(() => { if (map && selected) map.setCenter({ lat: selected.lat, lng: selected.lng }) }, [map, selected])
  useEffect(() => {
    if (!map || !recenterKey) return
    if (!venues.length) { map.setCenter(CITY_CENTER); map.setZoom(14); return }
    const lats = venues.map((venue) => venue.lat)
    const lngs = venues.map((venue) => venue.lng)
    map.fitBounds({ north: Math.max(...lats), south: Math.min(...lats), east: Math.max(...lngs), west: Math.min(...lngs) }, { top: 120, bottom: 90, left: 60, right: 60 })
  }, [map, recenterKey, venues])
  return null
}

function GoogleDiscoveryMap(props) {
  const { venues, selectedVenueId, hoveredVenueId, onSelect, onDetails, recenterKey, matchVenueId, onMatch, onCloseMatch } = props
  const selected = venues.find((venue) => venue.id === selectedVenueId)
  return <GoogleMap className="dg-map-canvas" style={{ height: 'calc(100% - 38px)' }} defaultCenter={CITY_CENTER} defaultZoom={14} mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'} disableDefaultUI zoomControl gestureHandling="greedy" clickableIcons={false} onClick={onCloseMatch}>
    <GoogleMapController selected={selected} venues={venues} recenterKey={recenterKey} />
    {venues.map((venue) => <AdvancedMarker key={venue.id} position={{ lat: venue.lat, lng: venue.lng }} title={venue.name} onClick={() => onSelect(venue.id)} zIndex={venue.id === selectedVenueId ? 1000 : venue.id === hoveredVenueId ? 500 : 1}>{venue.id === selectedVenueId && venue.id === matchVenueId ? <span className="dg-match-marker"><span aria-hidden="true">{venueSymbol(venue)}</span><strong>{venue.matchScore.toFixed(1)}</strong></span> : <span className={`dg-pin${venue.id === selectedVenueId ? ' is-selected' : ''}${venue.id === hoveredVenueId ? ' is-highlighted' : ''}`} aria-hidden="true"><span className="dg-pin-body"><span className="dg-pin-symbol">{venueSymbol(venue)}</span></span></span>}</AdvancedMarker>)}
    {selected && <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} pixelOffset={[0, -48]} headerDisabled onClose={onCloseMatch}><VenueMapPopup venue={selected} onDetails={onDetails} onMatch={onMatch} onCloseMatch={onCloseMatch} expanded={selected.id === matchVenueId} /></InfoWindow>}
  </GoogleMap>
}

export default function DiscoveryMap(props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()
  const [googleFailed, setGoogleFailed] = useState(false)
  return (
    <div className="dg-map">
      {apiKey && !googleFailed ? <APIProvider apiKey={apiKey} onError={() => setGoogleFailed(true)}><GoogleDiscoveryMap {...props} /></APIProvider> : <LeafletDiscoveryMap {...props} />}
    </div>
  )
}
