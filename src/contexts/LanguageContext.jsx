import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const TRANSLATIONS = {
  vi: {
    // Navbar
    brandTagline: 'Explore More Together • Gợi ý địa điểm F&B thông minh',
    guestBadge: 'Khách trải nghiệm',
    lightMode: 'Sáng',
    darkMode: 'Tối',
    findVenuesCTA: 'Tìm quán ngay',
    switchLangTooltip: 'Switch to English',
    langLabel: 'EN',

    // Hero Section
    heroBadge: 'NỀN TẢNG GỢI Ý ĐỊA ĐIỂM F&B THÔNG MINH',
    heroHeadline: 'TÌM ĐÚNG QUÁN CHO ĐÚNG NHU CẦU',
    heroSubtitle: 'Công nghệ gợi ý thông minh theo ngữ cảnh: làm việc, hẹn hò, tụ họp nhóm hay đổi gió một mình.',
    prompt1Placeholder: 'Yêu cầu 1: Quán cà phê yên tĩnh chạy deadline...',
    prompt2Placeholder: 'Yêu cầu 2: Có ổ điện, Wi-Fi mạnh, bàn rộng...',
    prompt3Placeholder: 'Yêu cầu 3: Không gian thoáng mát, mở tới 23h...',
    addCriteriaBtn: 'Thêm yêu cầu',
    searchBtn: 'Tìm quán',
    searchingBtn: 'Đang tìm...',
    nearMe: 'Gần tôi',
    locating: 'Đang định vị...',
    located: 'Đã định vị',
    locationError: 'Không thể lấy vị trí',

    // Hero Chips
    chipWork: 'Cà phê chạy deadline',
    chipDate: 'Hẹn hò lãng mạn',
    chipGathering: 'Ăn nhậu bạn bè',
    chipSolo: 'Chill một mình',
    chipMilkTea: 'Trà sữa tám chuyện',
    chipPet: 'Quán có thú cưng',

    // Marquee
    marqueeBadge: 'ĐỀ XUẤT ĐẶC BIỆT',
    marqueeTitle: 'ĐỊA ĐIỂM ĐƯỢC ĐÁNH GIÁ CAO NHẤT',
    marqueeSub: 'Khách ghé gần đây đã đánh giá các địa điểm này phù hợp nhất với ngữ cảnh',
    matchScore: 'Điểm phù hợp',
    viewDetailTooltip: 'Nhấn để xem chi tiết quán',

    // Recommendation Section
    recBadge: 'GỢI Ý TỐI ƯU CHO BẠN',
    recHeadline: 'ONE PLACE. THREE DIFFERENT ANSWERS.',
    recSubtitle: 'Cùng một địa điểm nhưng mang lại giá trị khác nhau tùy thuộc vào mục đích của bạn.',
    recEmpty: 'Không tìm thấy địa điểm nào phù hợp với bộ tiêu chí hiện tại.',
    recReset: 'Đặt lại bộ lọc',
    tabWork: 'Cà phê làm việc',
    tabDog: 'Dắt thú cưng',
    tabCatchup: 'Gặp gỡ bạn bè',
    viewDetails: 'Xem chi tiết quán',
    openGoogleMaps: 'Chỉ đường Google Maps',
    distanceKm: 'km',

    // Curated Collections
    colBadge: 'BỘ SƯU TẬP ĐỘC BẢN THEO GU',
    colTitle1: 'BỘ SƯU TẬP',
    colTitle2: 'TUYỂN CHỌN,',
    colTitle3: 'DÀNH RIÊNG CHO BẠN',
    colSubtitle: 'Khám phá các danh sách được tuyển chọn bởi người bản địa, cá nhân hóa theo đúng khẩu vị và sở thích của bạn để mỗi gợi ý đều mang đậm dấu ấn riêng.',
    colTag: 'SEEKERS • CÁ NHÂN HÓA TRẢI NGHIỆM ẨM THỰC',
    colBurger1: 'ĐẠI TIỆC',
    colBurger2: 'BURGER',
    colBurgerSub: 'Tuyển chọn từ 18k+ đánh giá bản địa',
    colHappy1: 'CHILL SAU',
    colHappy2: 'GIỜ LÀM',
    colHappySub: 'Tuyển chọn từ 22k+ đánh giá bản địa',
    colGreen1: 'CHUẨN GU',
    colGreen2: 'SỐNG XANH',
    colGreenSub: 'Tuyển chọn từ 15k+ đánh giá bản địa',

    // Intelligence Highlights
    intelBadge: 'Lấy cảm hứng từ Context-Aware Intelligence',
    intelTitleMain: 'Hiểu đúng nơi chốn. ',
    intelTitleAccent: 'Không chỉ là tọa độ bản đồ.',
    intelSubtitle: 'Mỗi quán mang ý nghĩa khác nhau tùy vào việc bạn đi cùng ai và làm gì. SEEKERS phân tích ngữ cảnh để trả về danh sách có điểm số và lý do minh bạch.',
    intelPillar1Title: 'Xếp hạng & Giải thích lý do rõ ràng',
    intelPillar1Body: 'Không đưa ra danh sách ngẫu nhiên. Mỗi đề xuất đều kèm theo lý do cụ thể vì sao quán phù hợp với tâm trạng và nhu cầu của bạn.',
    intelPillar2Title: 'Tối ưu theo văn hóa F&B Việt Nam',
    intelPillar2Body: 'Từ cà phê chạy deadline, trà sữa tám chuyện, ăn nhậu nhóm bạn đến hẹn hò sang trọng — được phân loại sát với thói quen người Việt.',
    intelPillar3Title: 'Một chạm chuyển thẳng sang Google Maps',
    intelPillar3Body: 'Sau khi chọn quán ưng ý, bạn lập tức mở Google Maps để định vị và nhận chỉ đường mà không cần đăng nhập hay thao tác rườm rà.',
    intelDemoYourRequest: 'Yêu cầu của bạn:',
    intelDemoPrompt: '"Quán cà phê yên tĩnh chạy deadline 2 người có ổ điện"',

    // Footer
    footerDesc: 'Nền tảng tìm kiếm và gợi ý địa điểm F&B thông minh theo ngữ cảnh, cảm xúc và nhu cầu thực tế của người dùng.',
    footerTaskBadge: 'FE TASK — LUỒNG KHÁCH CHƯA ĐĂNG NHẬP',
    footerNoLogin: 'Không lưu dữ liệu cá nhân • Trải nghiệm tức thì không cần tài khoản',
    footerCopyright: 'SEEKERS — Explore More Together.',
    footerCommunity: 'Được thiết kế cho cộng đồng ẩm thực Việt Nam',

    // Modals
    modalFilterTitle: 'Tùy chỉnh 7 tiêu chí tìm quán',
    modalFilterApply: 'Áp dụng bộ lọc',
    modalFilterReset: 'Đặt lại',
    modalFilterClose: 'Đóng',
    modalDetailScore: 'Điểm phù hợp',
    modalDetailReasons: 'Lý do gợi ý cho bạn',
    modalDetailAmenities: 'Tiện ích nổi bật',
    modalDetailAddress: 'Địa chỉ',
    modalDetailHours: 'Giờ mở cửa',
    modalDetailPrice: 'Khoảng giá',
    modalDetailNavBtn: 'Chỉ đường qua Google Maps'
  },
  en: {
    // Navbar
    brandTagline: 'Explore More Together • Context-Aware F&B Discovery',
    guestBadge: 'Guest Mode',
    lightMode: 'Light',
    darkMode: 'Dark',
    findVenuesCTA: 'Find Venues',
    switchLangTooltip: 'Chuyển sang Tiếng Việt',
    langLabel: 'VI',

    // Hero Section
    heroBadge: 'INTELLIGENT CONTEXT-AWARE F&B DISCOVERY',
    heroHeadline: 'FIND THE RIGHT PLACE FOR THE RIGHT OCCASION',
    heroSubtitle: 'AI-driven contextual recommendations: study, work, romantic dates, group catch-ups, or solo unwinding.',
    prompt1Placeholder: 'Prompt 1: Quiet café to work and meet deadline...',
    prompt2Placeholder: 'Prompt 2: Power outlets, fast Wi-Fi, wide tables...',
    prompt3Placeholder: 'Prompt 3: Open air, air-conditioned, open till 23:00...',
    addCriteriaBtn: 'Add Criteria',
    searchBtn: 'Search',
    searchingBtn: 'Searching...',
    nearMe: 'Near Me',
    locating: 'Locating...',
    located: 'Located',
    locationError: 'Cannot retrieve location',

    // Hero Chips
    chipWork: 'Work & Study Café',
    chipDate: 'Romantic Date',
    chipGathering: 'Drinks & Friends',
    chipSolo: 'Solo Chill',
    chipMilkTea: 'Milk Tea & Chat',
    chipPet: 'Pet Friendly',

    // Marquee
    marqueeBadge: 'CURATED PICKS',
    marqueeTitle: 'TOP RATED EXPERIENCES',
    marqueeSub: 'Recent foodies and explorers rated these spots as the top contextual matches',
    matchScore: 'Match Score',
    viewDetailTooltip: 'Click to view venue details',

    // Recommendation Section
    recBadge: 'OPTIMIZED RECOMMENDATIONS',
    recHeadline: 'ONE PLACE. THREE DIFFERENT ANSWERS.',
    recSubtitle: 'The exact same place delivers entirely different values depending on your occasion.',
    recEmpty: 'No venues match your current criteria.',
    recReset: 'Reset Filters',
    tabWork: 'Focus & Work',
    tabDog: 'Pet Friendly',
    tabCatchup: 'Catch Up',
    viewDetails: 'View Details',
    openGoogleMaps: 'Google Maps Directions',
    distanceKm: 'km',

    // Curated Collections
    colBadge: 'SIGNATURE CURATED COLLECTIONS',
    colTitle1: 'CURATED',
    colTitle2: 'COLLECTIONS,',
    colTitle3: 'MADE PERSONAL',
    colSubtitle: 'Find curated lists from locals, personalized to your taste and interests so every recommendation feels made for you.',
    colTag: 'SEEKERS • PERSONALIZED DINING EXPERIENCE',
    colBurger1: 'THE BURGER',
    colBurger2: 'BREAKDOWN',
    colBurgerSub: 'Curated from 18k+ local reviews',
    colHappy1: 'HAPPY HOUR',
    colHappy2: 'HEROES',
    colHappySub: 'Curated from 22k+ local reviews',
    colGreen1: 'GREEN FLAGS',
    colGreen2: 'ONLY',
    colGreenSub: 'Curated from 15k+ local reviews',

    // Intelligence Highlights
    intelBadge: 'Inspired by Context-Aware Intelligence',
    intelTitleMain: 'Understanding spaces. ',
    intelTitleAccent: 'Beyond raw map coordinates.',
    intelSubtitle: 'Every venue holds a different meaning depending on who you are with and what you do. SEEKERS analyzes context to deliver transparent scores and reasons.',
    intelPillar1Title: 'Transparent Scoring & Clear Rationale',
    intelPillar1Body: 'No random lists. Every recommendation provides specific reasons explaining why it matches your mood and intent.',
    intelPillar2Title: 'Tuned for Vietnamese F&B Culture',
    intelPillar2Body: 'From deadline-friendly cafes to gossip boba spots, drinking with friends to fine dates — accurately mapped to local habits.',
    intelPillar3Title: 'One-Tap Direct Google Maps Navigation',
    intelPillar3Body: 'Once you find the ideal spot, seamlessly open Google Maps for immediate directions without mandatory sign-in or clutter.',
    intelDemoYourRequest: 'Your request:',
    intelDemoPrompt: '"Quiet café for 2 to meet deadline with power outlets"',

    // Footer
    footerDesc: 'Smart F&B search and recommendation platform tailored to user context, mood, and real occasions.',
    footerTaskBadge: 'FE TASK — GUEST EXPERIENCE FLOW',
    footerNoLogin: 'No personal data logged • Instant access without registration',
    footerCopyright: 'SEEKERS — Explore More Together.',
    footerCommunity: 'Crafted for the Vietnamese culinary & coffee community',

    // Modals
    modalFilterTitle: 'Customize 7 Venue Criteria',
    modalFilterApply: 'Apply Filters',
    modalFilterReset: 'Reset',
    modalFilterClose: 'Close',
    modalDetailScore: 'Match Score',
    modalDetailReasons: 'Why this matches you',
    modalDetailAmenities: 'Key Amenities',
    modalDetailAddress: 'Address',
    modalDetailHours: 'Opening Hours',
    modalDetailPrice: 'Price Range',
    modalDetailNavBtn: 'Get Directions on Google Maps'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('findgo-language') || 'vi'
  })

  useEffect(() => {
    localStorage.setItem('findgo-language', language)
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))
  }

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.vi
    return langDict[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isEn: language === 'en' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
