// Dữ liệu chỉ phục vụ Checkpoint 3, không chứng minh quyền sở hữu địa điểm thực tế.
// Tách riêng để sau này thay bằng API mà không phải viết lại bố cục các trang.
export const merchantVenues = [
  {
    id: 'workshop',
    name: 'The Workshop Coffee',
    address: '27 Ngô Đức Kế, Quận 1, TP. Hồ Chí Minh',
    category: 'Cà phê · Không gian học tập',
    hours: '07:00 – 21:00',
    image: '/images/venues/workshop.jpg',
    amenities: ['Wi-Fi', 'Ổ cắm điện', 'Bàn nhóm', 'Điều hòa'],
    status: 'verified',
    description:
      'Một góc tập trung giữa lòng thành phố. Không gian thoáng sáng, cà phê thủ công và những chiếc bàn lớn dành cho buổi học cùng bạn bè.'
  },
  {
    id: 'rangrang',
    name: 'Rang Rang Coffee',
    address: '82 Xuân Thủy, TP. Thủ Đức, TP. Hồ Chí Minh',
    category: 'Cà phê · Gặp gỡ bạn bè',
    hours: '07:00 – 22:00',
    image: '/images/venues/rangrang.jpg',
    amenities: ['Wi-Fi', 'Ánh sáng tự nhiên', 'Bàn nhóm', 'Chỗ đỗ xe'],
    status: 'pending',
    description:
      'Không gian nhiều ánh sáng và chỗ ngồi thoải mái cho một buổi gặp gỡ, trao đổi ý tưởng hoặc học nhóm vào buổi chiều.'
  }
]

// Trạng thái mẫu được khai báo rõ ràng, không suy luận từ ngày hệ thống:
// bài demo vẫn nhất quán khi mở lại vào một ngày khác.
export const initialCampaigns = [
  {
    id: 'group',
    name: 'Chiều học nhóm, thêm cảm hứng',
    venueId: 'workshop',
    audience: 'Sinh viên học nhóm',
    start: '2026-10-01',
    end: '2026-10-31',
    timeFrom: '13:00',
    timeTo: '16:00',
    benefit: 'Ưu tiên bàn nhóm từ 4 người, gần ổ cắm điện.',
    status: 'active',
    redemptions: 24
  },
  {
    id: 'morning',
    name: 'Góc tập trung buổi sáng',
    venueId: 'rangrang',
    audience: 'Sinh viên học tập cá nhân',
    start: '2026-11-01',
    end: '2026-11-30',
    timeFrom: '08:00',
    timeTo: '11:00',
    benefit: 'Không gian yên tĩnh và chỗ ngồi gần ánh sáng tự nhiên.',
    status: 'draft',
    redemptions: 0
  },
  {
    id: 'welcome',
    name: 'Hẹn nhau đầu học kỳ',
    venueId: 'workshop',
    audience: 'Sinh viên học nhóm',
    start: '2026-09-01',
    end: '2026-09-30',
    timeFrom: '14:00',
    timeTo: '17:00',
    benefit: 'Ưu tiên khu vực ngồi chung cho nhóm bạn.',
    status: 'expired',
    redemptions: 18
  }
]

export const campaignStatuses = {
  active: 'Đang diễn ra',
  draft: 'Bản nháp',
  expired: 'Đã kết thúc'
}
export const venueStatuses = { verified: 'Đã xác minh · mẫu', pending: 'Chờ xác minh · mẫu' }

// Hai tập số liệu độc lập để bộ lọc thời gian thực sự thay đổi cả biểu đồ lẫn KPI.
export const performance = {
  week: {
    label: '7 ngày minh họa',
    dates: ['14/10', '15/10', '16/10', '17/10', '18/10', '19/10', '20/10'],
    impressions: [420, 580, 490, 720, 610, 890, 760],
    views: [160, 220, 180, 290, 240, 350, 310],
    kpis: ['4.470', '1.750', '286', '24']
  },
  month: {
    label: 'Tháng 10 minh họa',
    dates: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    impressions: [2400, 3100, 4470, 2870],
    views: [850, 1200, 1750, 1060],
    kpis: ['12.840', '4.860', '842', '68']
  }
}

const weeklyInterests = [
  { label: 'Học nhóm', value: 78 },
  { label: 'Học tập cá nhân', value: 62 },
  { label: 'Gặp gỡ bạn bè', value: 46 },
  { label: 'Làm việc', value: 35 }
]

// Dùng ID địa điểm làm khóa thay vì vị trí trong mảng: đổi thứ tự card không làm sai số liệu.
// Tổng lượt xem/chỉ đường từng địa điểm khớp với KPI của cùng kỳ ở Dashboard.
export const analyticsDemo = {
  week: {
    interests: weeklyInterests,
    venueMetrics: {
      workshop: { views: 1050, directions: 176 },
      rangrang: { views: 700, directions: 110 }
    }
  },
  month: {
    interests: [
      { label: 'Học nhóm', value: 74 },
      { label: 'Học tập cá nhân', value: 65 },
      { label: 'Gặp gỡ bạn bè', value: 52 },
      { label: 'Làm việc', value: 39 }
    ],
    venueMetrics: {
      workshop: { views: 2940, directions: 526 },
      rangrang: { views: 1920, directions: 316 }
    }
  }
}

export const popularAttributes = [
  'Wi-Fi ổn định',
  'Ổ cắm điện',
  'Bàn học nhóm',
  'Không gian yên tĩnh'
]

export const merchantPlans = [
  {
    name: 'Free',
    subtitle: 'Bắt đầu hiện diện trên FIND&GO',
    features: ['Hồ sơ doanh nghiệp', 'Quản lý thông tin địa điểm'],
    cta: 'Xem hồ sơ mẫu'
  },
  {
    name: 'Pilot',
    subtitle: 'Cùng thử nghiệm những cơ hội mới',
    features: [
      'Các tính năng dự kiến của Free',
      'Thử nghiệm chiến dịch',
      'Theo dõi hiệu suất cơ bản'
    ],
    cta: 'Tìm hiểu gói Pilot'
  },
  {
    name: 'Growth',
    subtitle: 'Thấu hiểu nhu cầu, mở rộng kết nối',
    features: [
      'Các tính năng dự kiến của Pilot',
      'Phân tích nâng cao',
      'Thông tin nhu cầu khách hàng',
      'Quản lý chiến dịch'
    ],
    cta: 'Tìm hiểu gói Growth'
  }
]

// Trả về bản sao độc lập mỗi lần mở portal, tránh thao tác demo làm biến đổi fixture gốc.
// Khi có API, thay chỗ khởi tạo state ở MerchantLayout bằng dữ liệu trả về từ BE.
export function createDemoCampaigns() {
  return structuredClone(initialCampaigns)
}

export function createSampleCampaignForm() {
  // Chỉ lấy các trường của form; bỏ ID, trạng thái và số lượt dùng của chiến dịch mẫu.
  // Nhờ vậy bản nháp mới không vô tình kế thừa trạng thái "đang diễn ra".
  const { name, venueId, audience, start, end, timeFrom, timeTo, benefit } = initialCampaigns[0]
  return { name, venueId, audience, start, end, timeFrom, timeTo, benefit }
}
