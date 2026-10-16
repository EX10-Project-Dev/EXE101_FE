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
    let lat = typeof rawLat === 'number' ? rawLat : parseFloat(latStr)
    let lng = typeof rawLng === 'number' ? rawLng : parseFloat(lngStr)

    // Tự động đảo nếu nhập ngược Latitude (>90) và Longitude (<=90)
    if (lat > 90 && lng <= 90) {
      const temp = lat
      lat = lng
      lng = temp
    }

    // Bỏ qua tọa độ (0, 0) mặc định của database (Null Island) để thử bóc tách từ URL hoặc dùng fallback
    const isZero = Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001
    if (!isNaN(lat) && !isNaN(lng) && !isZero && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
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
 * Trích xuất Google Place ID chuẩn từ đối tượng venue.
 * Hỗ trợ lấy từ trường venue.googlePlaceId, venue.placeId, hoặc bóc tách từ URL nguồn.
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {string | null} Google Place ID (ví dụ: ChIJgXrzCAAndTERWBjEsI7ibSU)
 */
export function extractGooglePlaceId(venue) {
  if (!venue || typeof venue !== 'object') return null
  if (venue.googlePlaceId) return String(venue.googlePlaceId).trim()
  if (venue.placeId) return String(venue.placeId).trim()

  const rawUrl = venue.googleMapsUrl || venue.sourceData?.googleMapsUrlSource || ''
  if (!rawUrl) return null

  // Làm sạch khoảng trắng/xuống dòng do OCR trong chuỗi nguồn
  const cleanUrl = String(rawUrl).replace(/\s+/g, '')
  const match = cleanUrl.match(/query_place_id=([a-zA-Z0-9_\-]+)/) || cleanUrl.match(/place_id=([a-zA-Z0-9_\-]+)/)
  return match ? match[1] : null
}

/**
 * Tạo đường dẫn Google Maps chỉ đường (Directions) chính xác đến địa điểm.
 * Tận dụng Phương án 2 (Google Place ID) để đảm bảo Google Maps mở đúng cơ sở kinh doanh chính thức.
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {string} Đường dẫn Google Maps
 */
export function getDirectionsUrl(venue) {
  if (!venue) return 'https://www.google.com/maps'

  const placeId = extractGooglePlaceId(venue)
  const query = [venue.name, venue.address].filter(Boolean).join(', ')

  if (placeId && query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&destination_place_id=${placeId}`
  }

  if (query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
  }

  const coords = extractVenueCoordinates(venue)
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
  }

  if (venue.googleMapsUrl) return venue.googleMapsUrl
  return 'https://www.google.com/maps'
}

/**
 * Tạo đường dẫn Google Maps xem chi tiết địa điểm.
 * Tận dụng Phương án 2 (Google Place ID) để mở trực tiếp hồ sơ xác thực của địa điểm.
 * 
 * @param {Object} venue - Đối tượng địa điểm
 * @returns {string} Đường dẫn xem địa điểm
 */
export function getPlaceViewUrl(venue) {
  if (!venue) return 'https://www.google.com/maps'

  const placeId = extractGooglePlaceId(venue)
  const query = [venue.name, venue.address].filter(Boolean).join(', ')

  if (placeId && query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=${placeId}`
  }

  if (venue.googleMapsUrl) return venue.googleMapsUrl

  const coords = extractVenueCoordinates(venue)
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Ho Chi Minh City')}`
}
