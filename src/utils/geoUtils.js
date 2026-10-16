/**
 * Utility hỗ trợ xử lý tọa độ địa lý (GPS) và liên kết Google Maps cho địa điểm F&B.
 * Đảm bảo khi thêm dữ liệu mới trong tương lai, bản đồ web luôn khớp chính xác với Google Maps.
 */

export const DATABASE_CITY_CENTER = { lat: 10.8458, lng: 106.8059 }

/**
 * Trích xuất tọa độ { lat, lng } chuẩn từ đối tượng venue.
 * Hỗ trợ đa dạng định dạng:
 * - venue.lat & venue.lng (số hoặc chuỗi số '10.77348' hoặc '10,8405')
 * - venue.latitude & venue.longitude
 * - venue.location.latitude & venue.location.longitude (từ Backend API DTO)
 * - venue.sourceData.latitudeSource / longitudeSource
 * - Tự động bóc tách tọa độ từ googleMapsUrl nếu không có sẵn lat/lng
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {{ lat: number, lng: number } | null}
 */
export function extractVenueCoordinates(venue) {
  if (!venue || typeof venue !== 'object') return null

  // 1. Kiểm tra trực tiếp lat/lng, location DTO hoặc sourceData
  const loc = venue.location || {}
  const source = venue.sourceData || {}
  const rawLat = venue.lat ?? venue.latitude ?? loc.latitude ?? loc.lat ?? source.latitudeSource ?? source.lat
  const rawLng = venue.lng ?? venue.lon ?? venue.longitude ?? loc.longitude ?? loc.lng ?? source.longitudeSource ?? source.lng

  if (rawLat !== undefined && rawLat !== null && rawLng !== undefined && rawLng !== null) {
    const latStr = String(rawLat).trim().replace(',', '.')
    const lngStr = String(rawLng).trim().replace(',', '.')
    const lat = typeof rawLat === 'number' ? rawLat : parseFloat(latStr)
    const lng = typeof rawLng === 'number' ? rawLng : parseFloat(lngStr)

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng }
    }
  }

  // 2. Trích xuất từ Google Maps URL nếu không có sẵn trường lat/lng
  const url = venue.googleMapsUrl || venue.mapUrl || venue.url || source.googleMapsUrlSource
  if (typeof url === 'string' && url.trim()) {
    const coordsFromUrl = parseCoordinatesFromGoogleMapsUrl(url.trim())
    if (coordsFromUrl) return coordsFromUrl
  }

  return null
}


/**
 * Trích xuất tọa độ từ các định dạng URL của Google Maps:
 * - URL dạng web: .../@10.77348,106.70560,17z
 * - URL dạng tham số: ?q=10.77348,106.70560 hoặc &query=10.77348,106.70560
 * - URL dạng protobuf: ...!3d10.77348!4d106.70560
 * - URL dạng chỉ đường: ...destination=10.77348,106.70560
 * 
 * @param {string} url - Đường dẫn Google Maps
 * @returns {{ lat: number, lng: number } | null}
 */
export function parseCoordinatesFromGoogleMapsUrl(url) {
  if (!url || typeof url !== 'string') return null

  // Dạng 1: /@10.77348,106.70560
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) {
    const lat = parseFloat(atMatch[1])
    const lng = parseFloat(atMatch[2])
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  // Dạng 2: ?q=10.77348,106.70560 hoặc query=, destination=, ll=, center=
  const queryMatch = url.match(/[?&](?:q|query|destination|ll|center)=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i)
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1])
    const lng = parseFloat(queryMatch[2])
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  // Dạng 3: Protobuf !3d10.77348!4d106.70560
  const protoMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1])
    const lng = parseFloat(protoMatch[2])
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  return null
}

/**
 * Tạo đường dẫn Google Maps chỉ đường (Directions) chính xác đến địa điểm
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {string} Đường dẫn Google Maps
 */
export function getDirectionsUrl(venue) {
  if (!venue) return 'https://www.google.com/maps'

  const coords = extractVenueCoordinates(venue)
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
  }

  if (venue.googleMapsUrl) return venue.googleMapsUrl

  const query = [venue.name, venue.address].filter(Boolean).join(' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Ho Chi Minh City')}`
}

/**
 * Tạo đường dẫn Google Maps xem chi tiết địa điểm
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {string} Đường dẫn xem địa điểm
 */
export function getPlaceViewUrl(venue) {
  if (!venue) return 'https://www.google.com/maps'

  if (venue.googleMapsUrl) return venue.googleMapsUrl

  const coords = extractVenueCoordinates(venue)
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  }

  const query = [venue.name, venue.address].filter(Boolean).join(' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Ho Chi Minh City')}`
}
