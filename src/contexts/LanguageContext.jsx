import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translateText } from '../utils/localization'

const LanguageContext = createContext()

export const TRANSLATIONS = {
  vi: {
    // Hero actions
    brandTagline: 'Explore More Together • Gợi ý địa điểm F&B thông minh',
    findVenuesCTA: 'Tìm quán',
    getStartedCTA: 'Bắt đầu khám phá',
    heroNote: 'Đúng gu. Đúng lúc. Đúng nơi.',
    heroExplore: 'Một nơi cho mọi khoảnh khắc',
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
    searchBtn: 'Tìm địa điểm',
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
    recHeadline: 'TÌM QUÁN HỢP GU CHO MỖI KHOẢNH KHẮC.',
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
    colTag: 'FIND&GO • CÁ NHÂN HÓA TRẢI NGHIỆM ẨM THỰC',
    colBurger1: 'ĐẠI TIỆC',
    colBurger2: 'BURGER',
    colBurgerSub: 'Tuyển chọn từ 18k+ đánh giá bản địa',
    colHappy1: 'CHILL SAU',
    colHappy2: 'GIỜ LÀM',
    colHappySub: 'Tuyển chọn từ 22k+ đánh giá bản địa',
    colGreen1: 'CHUẨN GU',
    colGreen2: 'SỐNG XANH',
    colGreenSub: 'Tuyển chọn từ 15k+ đánh giá bản địa',


    // Footer
    footerDesc: 'Nền tảng tìm kiếm và gợi ý địa điểm F&B thông minh theo ngữ cảnh, cảm xúc và nhu cầu thực tế của người dùng.',
    footerTaskBadge: '',
    footerNoLogin: 'Khám phá địa điểm ngay trên trang chủ',
    footerCopyright: 'FIND&GO — Cùng nhau khám phá nhiều hơn.',
    footerCommunity: 'Dành cho cộng đồng yêu ẩm thực và cà phê Việt Nam',

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
    // Hero actions
    brandTagline: 'Explore More Together • Context-Aware F&B Discovery',
    findVenuesCTA: 'Find Venues',
    getStartedCTA: 'Get Started',
    heroNote: 'Your mood. Your moment. Your place.',
    heroExplore: 'A place for every kind of moment',
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
    recHeadline: 'FIND THE RIGHT PLACE FOR YOUR MOMENT.',
    recSubtitle: 'One place can fit many needs. Tell FIND&GO what you’re looking for, and see the recommendations, match score, and reasons adapt to you.',
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
    colTag: 'FIND&GO • PERSONALIZED DINING EXPERIENCE',
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
    intelSubtitle: 'Every venue holds a different meaning depending on who you are with and what you do. FIND&GO analyzes context to deliver transparent scores and reasons.',
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
    footerTaskBadge: '',
    footerNoLogin: 'Explore places right from the home page',
    footerCopyright: 'FIND&GO — Explore More Together.',
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
    try {
      return localStorage.getItem('findgo-language') === 'en' ? 'en' : 'vi'
    } catch {
      return 'vi'
    }
  })

  useEffect(() => {
    try { localStorage.setItem('findgo-language', language) } catch { /* Use the selection for this visit. */ }
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))
  }

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.vi
    return langDict[key] ?? key
  }
  const tx = useCallback((text, values) => translateText(text, language, values), [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tx, isEn: language === 'en' }}>
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
