/**
 * Mock data F&B tại Việt Nam phục vụ luồng khách chưa đăng nhập của FIND&GO.
 * Tích hợp đủ 7 nhóm tiêu chí từ README.md:
 * - Purpose: Study/Work, Eat & Drink, Hangout, Date, Group Gathering, Explore
 * - Budget: Khoảng giá VNĐ
 * - Distance & Location: Tọa độ, địa chỉ, khoảng cách tương đối
 * - Group Size: Solo, 2 người, 3-5 người, 6+ người
 * - Category: Café, Restaurant, Tea & Beverage, Dessert, Fast Food, Other F&B
 * - Atmosphere: Quiet, Cozy, Social, Spacious, Outdoor, Aesthetic
 * - Amenities: Wi-Fi, Power Outlets, Group Seating, Air Conditioning, Parking, Restroom
 */

export const MOCK_VENUES = [
  {
    id: 'venue-1',
    name: 'The Workshop Coffee',
    category: 'Café',
    tagline: 'Không gian cà phê specialty chuẩn gu làm việc & chạy deadline',
    address: 'Tầng 2, 27 Ngô Đức Kế, Bến Nghé, Quận 1, TP.HCM',
    distanceKm: 0.8,
    lat: 10.77348,
    lng: 106.70560,
    priceRange: '65.000đ - 120.000đ',
    budgetLevel: '50k-100k',
    rating: 4.8,
    matchScore: 9.8,
    reasons: [
      'Bàn làm việc lớn, nhiều ổ cắm điện',
      'Wi-Fi tốc độ cao, không gian yên tĩnh tập trung',
      'Cà phê Specialty pha thủ công cao cấp'
    ],
    purposes: ['Study / Work', 'Hangout'],
    groupSizes: ['Solo', '2 people', '3-5 people'],
    atmosphere: ['Quiet', 'Spacious', 'Aesthetic'],
    amenities: ['Wi-Fi tốc độ cao', 'Ổ cắm điện từng bàn', 'Bàn nhóm làm việc', 'Máy lạnh 24/7', 'Bãi giữ xe'],
    openingHours: '08:00 - 21:00',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://www.google.com/maps/place/The+Workshop+Coffee/@10.7734764,106.7056037,17z',
    description: 'Nằm trên tầng gác cổ kính ngay trung tâm Quận 1, The Workshop là không gian lý tưởng cho người cần sự tập trung cao độ, freelancer làm việc cả ngày cùng hương thơm cà phê Specialty nguyên bản.'
  },
  {
    id: 'venue-2',
    name: 'Pizza 4P\'s - Ben Thanh',
    category: 'Restaurant',
    tagline: 'Trải nghiệm ẩm thực Ý phong cách Nhật hoàn hảo cho buổi hẹn hò',
    address: '8 Thủ Khoa Huân, Phường Bến Thành, Quận 1, TP.HCM',
    distanceKm: 1.2,
    lat: 10.77336,
    lng: 106.69732,
    priceRange: '200.000đ - 450.000đ/người',
    budgetLevel: '250k-500k',
    rating: 4.9,
    matchScore: 9.7,
    reasons: [
      'Ánh sáng vàng ấm cúng, không gian lãng mạn',
      'Phục vụ chu đáo, pizza nướng củi phô mai tươi tự làm',
      'Rất phù hợp cho buổi hẹn hò hoặc kỷ niệm'
    ],
    purposes: ['Date', 'Eat & Drink', 'Group Gathering'],
    groupSizes: ['2 people', '3-5 people', '6+ people'],
    atmosphere: ['Cozy', 'Aesthetic', 'Spacious'],
    amenities: ['Máy lạnh', 'Bàn nhóm riêng tư', 'Bãi giữ xe có bảo vệ', 'Nhà vệ sinh sạch sẽ tiêu chuẩn cao'],
    openingHours: '10:00 - 23:00',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pizza+4Ps+Ben+Thanh+8+Thu+Khoa+Huan+Quan+1+TPHCM',
    description: 'Thương hiệu ẩm thực nổi tiếng với phô mai tự sản xuất, không gian mở ấm cúng kết hợp kiến trúc mộc mạc và hiện đại, mang lại trải nghiệm ẩm thực tinh tế.'
  },
  {
    id: 'venue-3',
    name: 'Okkio Caffe - Tự Do',
    category: 'Café',
    tagline: 'Góc cà phê retro tinh tế, góc check-in nghệ thuật và thư giãn',
    address: '151 Đồng Khởi, Bến Nghé, Quận 1, TP.HCM',
    distanceKm: 0.5,
    lat: 10.77584,
    lng: 106.70318,
    priceRange: '60.000đ - 95.000đ',
    budgetLevel: '50k-100k',
    rating: 4.7,
    matchScore: 9.4,
    reasons: [
      'Thiết kế kiến trúc vintage độc đáo, nhiều góc sống ảo',
      'Âm nhạc nhẹ nhàng, ánh sáng tự nhiên ngập tràn',
      'Thích hợp trò chuyện thân mật hoặc đọc sách'
    ],
    purposes: ['Date', 'Hangout', 'Explore'],
    groupSizes: ['Solo', '2 people', '3-5 people'],
    atmosphere: ['Aesthetic', 'Cozy', 'Quiet'],
    amenities: ['Wi-Fi', 'Máy lạnh', 'Nhà vệ sinh sạch sẽ', 'Thanh toán thẻ/QR'],
    openingHours: '07:30 - 22:00',
    images: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://maps.google.com/?cid=6671288971746035671',
    description: 'Okkio Caffe mang tone màu đỏ gạch cổ điển, kiến trúc uốn cong duyên dáng tạo cảm giác bình yên giữa lòng phố thị náo nhiệt.'
  },
  {
    id: 'venue-4',
    name: 'Rang Rang Coffee - Thảo Điền',
    category: 'Café',
    tagline: 'Không gian mở hiện đại, phong cách tối giản và thoáng đãng',
    address: '1 Thảo Điền, Phường Thảo Điền, TP. Thủ Đức, TP.HCM',
    distanceKm: 3.5,
    lat: 10.80332,
    lng: 106.73468,
    priceRange: '60.000đ - 110.000đ',
    budgetLevel: '50k-100k',
    rating: 4.7,
    matchScore: 9.3,
    reasons: [
      'Không gian cực kỳ rộng rãi, trần cao thoáng đãng',
      'Khu vực ngoài trời và trong nhà phân chia linh hoạt',
      'Chỗ đỗ xe ô tô và xe máy rộng rãi'
    ],
    purposes: ['Hangout', 'Group Gathering', 'Study / Work'],
    groupSizes: ['2 people', '3-5 people', '6+ people'],
    atmosphere: ['Spacious', 'Outdoor', 'Aesthetic'],
    amenities: ['Wi-Fi mạnh', 'Ổ cắm điện', 'Bàn nhóm dài', 'Máy lạnh', 'Bãi đỗ xe ô tô'],
    openingHours: '07:00 - 22:30',
    images: [
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rang+Rang+Coffee+1+Thao+Dien+Thu+Duc+TPHCM',
    description: 'Thiết kế kính trong suốt cùng các mảng cây xanh tự nhiên mang đến bầu không khí thư thái cho những buổi gặp gỡ bạn bè hay làm việc nhóm.'
  },
  {
    id: 'venue-5',
    name: 'Bia Craft Artisan Ales - Lê Ngô Cát',
    category: 'Other F&B',
    tagline: 'Thiên đường bia thủ công, tụ tập bạn bè bùng nổ năng lượng',
    address: '1 Lê Ngô Cát, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    distanceKm: 2.1,
    lat: 10.77640,
    lng: 106.68540,
    priceRange: '150.000đ - 350.000đ/người',
    budgetLevel: '100k-250k',
    rating: 4.6,
    matchScore: 9.5,
    reasons: [
      'Không khí sôi nổi, âm nhạc cuốn hút cực kỳ thích hợp tụ tập',
      'Menu hơn 30 loại bia thủ công và món nhắm đậm đà',
      'Khu vực ngồi ngoài trời thoáng mát'
    ],
    purposes: ['Hangout', 'Group Gathering', 'Eat & Drink'],
    groupSizes: ['3-5 people', '6+ people'],
    atmosphere: ['Social', 'Outdoor', 'Spacious'],
    amenities: ['Bàn nhóm lớn', 'Bãi giữ xe rộng', 'Thanh toán thẻ', 'Khu vực ngoài trời'],
    openingHours: '15:00 - 00:00',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=BiaCraft+Artisan+Ales+1+Le+Ngo+Cat+Quan+3+TPHCM',
    description: 'Địa điểm số 1 cho các buổi tụ họp sau giờ làm, sinh nhật hay liên hoan bạn bè với không khí vui tươi, hào sảng.'
  },
  {
    id: 'venue-6',
    name: 'Morico - Contemporary Japanese Desserts',
    category: 'Dessert',
    tagline: 'Thiên đường tráng miệng Matcha Nhật Bản thanh tao và thư thái',
    address: '30 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
    distanceKm: 0.9,
    lat: 10.77352,
    lng: 106.70138,
    priceRange: '70.000đ - 180.000đ',
    budgetLevel: '50k-100k',
    rating: 4.7,
    matchScore: 9.2,
    reasons: [
      'Nguyên liệu trà xanh Uji Kyoto nhập khẩu chuẩn Nhật',
      'Không gian bài trí thanh lịch, ấm cúng và sạch sẽ',
      'Phù hợp cho cả gia đình, nhóm bạn nữ và hẹn hò nhẹ nhàng'
    ],
    purposes: ['Hangout', 'Date', 'Explore'],
    groupSizes: ['Solo', '2 people', '3-5 people'],
    atmosphere: ['Cozy', 'Quiet', 'Aesthetic'],
    amenities: ['Máy lạnh', 'Bàn sofa êm ái', 'Nhà vệ sinh sạch sẽ', 'Thực đơn tráng miệng phong phú'],
    openingHours: '10:00 - 22:00',
    images: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Morico+30+Le+Loi+Ben+Nghe+Quan+1+TPHCM',
    description: 'Morico mang văn hóa ẩm thực ngọt ngào của xứ sở hoa anh đào đến Sài Gòn với phong cách phục vụ tinh tế và không gian thư giãn an yên.'
  }
]

export const POPULAR_PROMPTS = [
  'Quán cà phê yên tĩnh có ổ cắm để chạy deadline 2 người',
  'Nhà hàng ấm cúng lãng mạn cho buổi hẹn hò tối nay',
  'Quán rộng rãi, đồ uống ngon để tụ tập nhóm 5 người cuối tuần',
  'Góc cà phê acoustic view đẹp check-in sống ảo gần tôi'
]

export const FILTER_OPTIONS = {
  purposes: [
    { id: 'Study / Work', label: 'Học tập & Làm việc', icon: 'Laptop' },
    { id: 'Eat & Drink', label: 'Ăn uống ngon', icon: 'Utensils' },
    { id: 'Hangout', label: 'Cà phê trò chuyện', icon: 'Coffee' },
    { id: 'Date', label: 'Hẹn hò lãng mạn', icon: 'Heart' },
    { id: 'Group Gathering', label: 'Tụ tập nhóm đông', icon: 'Users' },
    { id: 'Explore', label: 'Khám phá quán mới', icon: 'Compass' }
  ],
  budget: [
    { id: '<50k', label: 'Dưới 50k', desc: 'Bình dân, tiết kiệm' },
    { id: '50k-100k', label: '50k - 100k', desc: 'Cà phê, trà sữa phổ biến' },
    { id: '100k-250k', label: '100k - 250k', desc: 'Ăn uống, bistro tầm trung' },
    { id: '250k-500k', label: '250k - 500k', desc: 'Hẹn hò, nhà hàng lịch sự' },
    { id: '>500k', label: 'Trên 500k', desc: 'Cao cấp, fine dining' }
  ],
  distance: [
    { id: 'near_me', label: 'Gần tôi nhất (< 1 km)' },
    { id: '3km', label: 'Bán kính dưới 3 km' },
    { id: '5km', label: 'Bán kính dưới 5 km' },
    { id: '10km', label: 'Toàn thành phố (< 10 km)' }
  ],
  groupSizes: [
    { id: 'Solo', label: '1 người (Đi một mình)' },
    { id: '2 people', label: '2 người (Cặp đôi / Bạn thân)' },
    { id: '3-5 people', label: '3 - 5 người (Nhóm nhỏ)' },
    { id: '6+ people', label: 'Từ 6 người trở lên (Nhóm lớn)' }
  ],
  categories: [
    { id: 'Café', label: 'Quán Cà Phê' },
    { id: 'Restaurant', label: 'Nhà Hàng Ẩm Thực' },
    { id: 'Tea & Beverage', label: 'Trà Sữa & Đồ Uống' },
    { id: 'Dessert', label: 'Bánh Ngọt & Tráng Miệng' },
    { id: 'Fast Food', label: 'Thức Ăn Nhanh' },
    { id: 'Other F&B', label: 'Bia Thủ Công / Bar / Khác' }
  ],
  atmosphere: [
    { id: 'Quiet', label: 'Yên tĩnh, tập trung' },
    { id: 'Cozy', label: 'Ấm cúng, gần gũi' },
    { id: 'Social', label: 'Náo nhiệt, vui vẻ' },
    { id: 'Spacious', label: 'Rộng rãi, thoáng mát' },
    { id: 'Outdoor', label: 'Ngoài trời / Rooftop' },
    { id: 'Aesthetic', label: 'Đẹp mắt, nhiều góc chụp ảnh' }
  ],
  amenities: [
    { id: 'Wi-Fi', label: 'Wi-Fi tốc độ cao' },
    { id: 'Power Outlets', label: 'Nhiều ổ cắm điện' },
    { id: 'Group Seating', label: 'Bàn nhóm dài' },
    { id: 'Air Conditioning', label: 'Máy lạnh mát mẻ' },
    { id: 'Parking', label: 'Bãi giữ xe rộng rãi' },
    { id: 'Restroom', label: 'Nhà vệ sinh sạch sẽ' }
  ]
}
