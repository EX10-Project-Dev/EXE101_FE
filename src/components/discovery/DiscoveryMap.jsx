import { useLanguage } from '../../contexts/LanguageContext'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LocateFixed } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import VenuePhoto from './VenuePhoto'

const CITY_CENTER = { lat: 10.786, lng: 106.705 }

function VenueMapPopup({ venue, onDetails }) {
  const { tx } = useLanguage()
  return <button className="dg-map-preview" type="button" onClick={() => onDetails(venue)} aria-label={tx('View details for {name}', { name: venue.name })}><VenuePhoto venue={venue} /><span><strong>{venue.name}</strong><span className="dg-rating"><span>★ {venue.rating.toFixed(1)}</span><i>·</i><span className="dg-distance">{venue.distanceKm} km</span></span><span className="dg-preview-link">{tx('View details →')}</span></span></button>
}

function makeIcon(selected, highlighted) {
  return L.divIcon({ className: 'dg-marker-container', html: `<span class="dg-pin${selected ? ' is-selected' : ''}${highlighted ? ' is-highlighted' : ''}"><span></span></span>`, iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -48] })
}

function LeafletDiscoveryMap({ venues, selectedVenueId, hoveredVenueId, onSelect, onDetails, recenterKey }) {
  const { tx } = useLanguage()
  const element = useRef(null)
  const mapRef = useRef(null)
  const markers = useRef(new Map())
  const [popupElement] = useState(() => document.createElement('div'))
  const [tileError, setTileError] = useState(false)
  const selected = venues.find((venue) => venue.id === selectedVenueId)

  useEffect(() => {
    const map = L.map(element.current, { center: [CITY_CENTER.lat, CITY_CENTER.lng], zoom: 14, zoomControl: false, scrollWheelZoom: true })
    mapRef.current = map
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://www.hotosm.org/">HOT</a>',
      maxZoom: 19,
    }).addTo(map)
    tiles.on('tileerror', () => setTileError(true))
    tiles.on('tileload', () => setTileError(false))
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }))
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
      const marker = L.marker([venue.lat, venue.lng], { icon: makeIcon(false, false), title: venue.name, alt: venue.name, keyboard: true })
        .addTo(map).on('click', () => onSelect(venue.id))
      currentMarkers.set(venue.id, marker)
    })
    return () => { currentMarkers.forEach((marker) => marker.remove()); currentMarkers.clear() }
  }, [venues, onSelect])

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.setIcon(makeIcon(id === selectedVenueId, id === hoveredVenueId))
      marker.getElement()?.setAttribute('aria-label', tx('Show {name} on map', { name: venues.find((venue) => venue.id === id)?.name }))
      marker.setZIndexOffset(id === selectedVenueId ? 1000 : id === hoveredVenueId ? 500 : 0)
    })
  }, [venues, selectedVenueId, hoveredVenueId, tx])

  useEffect(() => {
    const map = mapRef.current
    map.closePopup()
    const marker = markers.current.get(selectedVenueId)
    if (marker) {
      map.panTo(marker.getLatLng(), { animate: false })
      marker.bindPopup(popupElement, { className: 'dg-leaflet-popup', closeButton: false, autoPan: true, autoPanPaddingTopLeft: [24, 105], autoPanPaddingBottomRight: [24, 55], maxWidth: 290, minWidth: 240 }).openPopup()
    }
  }, [selectedVenueId, venues, popupElement])

  useEffect(() => {
    if (!recenterKey) return
    const map = mapRef.current
    if (venues.length) map.fitBounds(venues.map((venue) => [venue.lat, venue.lng]), { paddingTopLeft: [70, 130], paddingBottomRight: [70, 100], maxZoom: 14, animate: false })
    else map.setView([CITY_CENTER.lat, CITY_CENTER.lng], 14)
  }, [recenterKey, venues])

  return <><div ref={element} className="dg-map-canvas" aria-label={tx('Interactive map of Ho Chi Minh City')} role="region" />{selected && createPortal(<VenueMapPopup venue={selected} onDetails={onDetails} />, popupElement)}{tileError && <p className="dg-map-error" role="status">{tx('Map tiles are unavailable. You can still explore the places below.')}</p>}</>
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
  const { venues, selectedVenueId, hoveredVenueId, onSelect, onDetails, recenterKey } = props
  const selected = venues.find((venue) => venue.id === selectedVenueId)
  return <GoogleMap className="dg-map-canvas" style={{ height: 'calc(100% - 38px)' }} defaultCenter={CITY_CENTER} defaultZoom={14} mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'} disableDefaultUI zoomControl gestureHandling="greedy" clickableIcons={false}>
    <GoogleMapController selected={selected} venues={venues} recenterKey={recenterKey} />
    {venues.map((venue) => <AdvancedMarker key={venue.id} position={{ lat: venue.lat, lng: venue.lng }} title={venue.name} onClick={() => onSelect(venue.id)} zIndex={venue.id === selectedVenueId ? 1000 : 1}><span className={`dg-pin${venue.id === selectedVenueId ? ' is-selected' : ''}${venue.id === hoveredVenueId ? ' is-highlighted' : ''}`}><span /></span></AdvancedMarker>)}
    {selected && <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} pixelOffset={[0, -48]} headerDisabled onCloseClick={() => onSelect(null)}><VenueMapPopup venue={selected} onDetails={onDetails} /></InfoWindow>}
  </GoogleMap>
}

export default function DiscoveryMap(props) {
  const { tx } = useLanguage()
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()
  const [googleFailed, setGoogleFailed] = useState(false)
  return (
    <div className="dg-map">
      {apiKey && !googleFailed ? <APIProvider apiKey={apiKey} onError={() => setGoogleFailed(true)}><GoogleDiscoveryMap {...props} /></APIProvider> : <LeafletDiscoveryMap {...props} />}
      <button type="button" className="dg-recenter" onClick={props.onRecenter}><LocateFixed size={18} aria-hidden="true" /><span>{tx('Recenter')}</span></button>
    </div>
  )
}
