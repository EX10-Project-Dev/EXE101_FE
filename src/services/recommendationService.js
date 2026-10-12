import api from './api'
import { MOCK_VENUES } from '../data/mockVenues'

/**
 * Service tìm kiếm và đề xuất địa điểm F&B.
 * Tích hợp gọi API thật theo contract, đồng thời có thuật toán smart fallback 
 * tính điểm tương đồng trên mock data khi chưa kết nối backend.
 */
export async function getRecommendations(payload = {}) {
  const { prompts = [], criteria = {}, location = null } = payload

  try {
    // Thử gọi backend API
    const response = await api.post('/recommendations', {
      prompts,
      criteria,
      location
    })
    if (response.data && (response.data.data || Array.isArray(response.data))) {
      return response.data.data || response.data
    }
  } catch (error) {
    console.warn('Backend /api/recommendations chưa sẵn sàng hoặc lỗi, sử dụng thuật toán gợi ý dữ liệu mẫu:', error?.message)
  }

  // Fallback: Tính điểm phù hợp dựa trên prompt và tiêu chí đã chọn
  await new Promise((resolve) => setTimeout(resolve, 600)) // Giả lập độ trễ tìm kiếm AI

  const promptText = (prompts.join(' ') || '').toLowerCase()

  const scoredVenues = MOCK_VENUES.map((venue) => {
    let score = 8.5
    const matchedReasons = [...venue.reasons]

    // Khớp theo Prompt text
    if (promptText) {
      if (promptText.includes('deadline') || promptText.includes('làm việc') || promptText.includes('học')) {
        if (venue.purposes.includes('Study / Work')) {
          score += 1.0
          matchedReasons.unshift('Rất phù hợp để tập trung làm việc & chạy deadline')
        }
      }
      if (promptText.includes('hẹn hò') || promptText.includes('người yêu') || promptText.includes('date')) {
        if (venue.purposes.includes('Date')) {
          score += 1.1
          matchedReasons.unshift('Không gian lãng mạn, ghi điểm trong mắt đối phương')
        }
      }
      if (promptText.includes('nhóm') || promptText.includes('bạn bè') || promptText.includes('tụ tập')) {
        if (venue.groupSizes.includes('3-5 people') || venue.groupSizes.includes('6+ people')) {
          score += 0.9
          matchedReasons.unshift('Bàn rộng rãi, dễ dàng sắp xếp chỗ cho nhóm bạn')
        }
      }
      if (promptText.includes('yên tĩnh')) {
        if (venue.atmosphere.includes('Quiet')) {
          score += 0.8
        }
      }
    }

    // Khớp theo Mục đích
    if (criteria.purpose && venue.purposes.includes(criteria.purpose)) {
      score += 0.6
    }

    // Khớp theo Ngân sách
    if (criteria.budget && venue.budgetLevel === criteria.budget) {
      score += 0.5
    }

    // Khớp theo Số lượng người
    if (criteria.groupSize && venue.groupSizes.includes(criteria.groupSize)) {
      score += 0.4
    }

    // Khớp theo Loại hình
    if (criteria.category && venue.category === criteria.category) {
      score += 0.4
    }

    // Khớp theo Không khí
    if (criteria.atmosphere && venue.atmosphere.includes(criteria.atmosphere)) {
      score += 0.4
    }

    // Khớp theo Tiện ích
    if (criteria.amenities && criteria.amenities.length > 0) {
      const matchCount = criteria.amenities.filter((item) =>
        venue.amenities.some((a) => a.toLowerCase().includes(item.toLowerCase()))
      ).length
      score += matchCount * 0.2
    }

    // Chuẩn hóa điểm tối đa 9.9
    const finalScore = Math.min(9.9, Math.round(score * 10) / 10)

    return {
      ...venue,
      matchScore: finalScore,
      dynamicReasons: Array.from(new Set(matchedReasons)).slice(0, 3)
    }
  })

  // Sắp xếp thứ tự ưu tiên theo điểm match cao nhất
  return scoredVenues.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Lấy chi tiết một địa điểm theo ID
 */
export async function getVenueDetail(id) {
  try {
    const response = await api.get(`/venues/${id}`)
    if (response.data && (response.data.data || response.data)) {
      return response.data.data || response.data
    }
  } catch (error) {
    console.warn(`Backend /api/venues/${id} chưa kết nối, sử dụng dữ liệu cục bộ:`, error?.message)
  }

  const found = MOCK_VENUES.find((v) => v.id === id)
  if (!found) throw new Error('Không tìm thấy địa điểm.')
  return found
}
