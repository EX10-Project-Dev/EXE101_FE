/**
 * Script đối soát dữ liệu địa chỉ với Google Maps / OpenStreetMap Geocoding.
 * Chạy: node scripts/reconcile-venues.mjs
 * 
 * Chức năng:
 * 1. Đọc danh sách địa điểm từ seed/database.
 * 2. Lấy Tên quán (Name) + Địa chỉ (Address).
 * 3. Truy vấn Geocoding để lấy tọa độ (Lat, Lng) chuẩn xác nhất.
 * 4. So sánh độ lệch (khoảng cách lệch bao nhiêu mét) và xuất báo cáo đối soát.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedFilePath = path.resolve(__dirname, '../../../Exe101BE/EXE101_BE/DAL/Data/venue-seed.json')

// Tính khoảng cách giữa 2 tọa độ (theo mét)
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

// Geocode địa chỉ thông qua Google Maps hoặc OpenStreetMap Nominatim
async function geocodeAddress(name, address, googleApiKey = null) {
  const query = `${name}, ${address}`
  
  if (googleApiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleApiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
      const loc = data.results[0].geometry.location
      return {
        lat: loc.lat,
        lng: loc.lng,
        formattedAddress: data.results[0].formatted_address,
        placeId: data.results[0].place_id,
        provider: 'Google Maps'
      }
    }
  }

  // Fallback: Geocode qua OpenStreetMap Nominatim (Miễn phí)
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'FINDANDGO-Reconciliation-Tool/1.0' }
    })
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        formattedAddress: data[0].display_name,
        provider: 'OpenStreetMap'
      }
    }
  } catch (err) {
    console.error(`Lỗi khi geocode "${address}":`, err.message)
  }

  return null
}

async function run() {
  console.log('🚀 Bắt đầu quá trình đối soát tọa độ theo địa chỉ...')
  
  if (!fs.existsSync(seedFilePath)) {
    console.error('❌ Không tìm thấy tệp seed tại:', seedFilePath)
    return
  }

  const raw = fs.readFileSync(seedFilePath, 'utf8').replace(/^\uFEFF/, '')
  const venues = JSON.parse(raw)
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || null

  console.log(`📋 Đã đọc ${venues.length} địa điểm. Sử dụng phương thức: ${apiKey ? 'Google Maps Geocoding API' : 'OpenStreetMap Nominatim (Miễn phí)'}`)

  const report = []

  for (let i = 0; i < Math.min(venues.length, 5); i++) {
    const v = venues[i]
    console.log(`\n[${i + 1}/${venues.length}] Đang đối soát: ${v.name}`)
    console.log(`   Địa chỉ: ${v.address}`)
    console.log(`   Tọa độ hiện tại: (${v.latitude}, ${v.longitude})`)

    const geoResult = await geocodeAddress(v.name, v.address, apiKey)
    if (geoResult) {
      const diffMeters = calculateDistanceMeters(v.latitude, v.longitude, geoResult.lat, geoResult.lng)
      console.log(`   ✅ Tọa độ đối soát (${geoResult.provider}): (${geoResult.lat}, ${geoResult.lng})`)
      console.log(`   📏 Độ lệch: ${diffMeters} mét`)

      report.push({
        sourceId: v.sourceId,
        name: v.name,
        currentLat: v.latitude,
        currentLng: v.longitude,
        matchedLat: geoResult.lat,
        matchedLng: geoResult.lng,
        diffMeters,
        provider: geoResult.provider
      })
    } else {
      console.log('   ⚠️ Không tìm thấy tọa độ đối soát tự động cho địa chỉ này.')
    }

    // Tạm dừng 1 giây giữa các request để tôn trọng rate limit
    await new Promise((r) => setTimeout(r, 1000))
  }

  console.log('\n📊 Hoàn tất đối soát mẫu.')
}

run().catch(console.error)
