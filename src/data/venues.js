import { MOCK_VENUES } from './mockVenues.js'

// Discovery fixtures reuse the existing locations and galleries. Ratings, distances,
// and English descriptions are sample content, not live venue information.
const discoveryDetails = [
  { name: 'The Workshop Coffee', rating: 4.6, reviewCount: 1200, distanceKm: 1.2, tags: ['Café', 'Work Friendly', 'Quiet'], priceLevel: '$$', description: 'Quiet, great for study, has power outlets and good Wi-Fi.', amenities: ['Wi-Fi', 'Power outlets', 'Air conditioning', 'Parking'], image: '/images/venues/workshop.jpg' },
  { name: 'Pizza 4P’s', rating: 4.5, reviewCount: 2100, distanceKm: 2.1, tags: ['Italian', 'Dinner', 'Date Spot'], priceLevel: '$$$', description: 'Wood-fired pizza, fresh cheese, and a comfortable space to share with friends.', amenities: ['Group seating', 'Air conditioning', 'Parking'], image: '/images/venues/pizza.jpg' },
  { name: 'Okkio Caffe', rating: 4.4, reviewCount: 856, distanceKm: 1.8, tags: ['Café', 'Brunch', 'Aesthetic'], priceLevel: '$$', description: 'A cozy corner for good coffee, a slow brunch, and a little inspiration.', amenities: ['Wi-Fi', 'Air conditioning'], image: '/images/venues/okkio.jpg' },
  { name: 'Rang Rang Coffee', rating: 4.5, reviewCount: 642, distanceKm: 3.4, tags: ['Café', 'Outdoor', 'Local Favorite'], priceLevel: '$$', description: 'Spacious, relaxed, and full of natural light. A lovely place to meet up.', amenities: ['Wi-Fi', 'Power outlets', 'Group seating', 'Air conditioning', 'Parking'], image: '/images/venues/rangrang.jpg' },
  { name: 'BiaCraft Artisan Ales', rating: 4.6, reviewCount: 480, distanceKm: 2.6, tags: ['Craft Beer', 'Social', 'Outdoor'], priceLevel: '$$$', description: 'Local craft beers and casual bites for an easy evening with your group.', amenities: ['Group seating', 'Parking'], image: '/images/venues/biacraft.jpg' },
  { name: 'Morico', rating: 4.7, reviewCount: 920, distanceKm: 1.5, tags: ['Dessert', 'Matcha', 'Cozy'], priceLevel: '$$', description: 'Japanese desserts, matcha, and a peaceful spot for a sweet afternoon break.', amenities: ['Air conditioning', 'Group seating'], image: '/images/venues/morico.jpg' },
]

const descriptionsVi = [
  'Quán cà phê yên tĩnh, phù hợp học tập và làm việc, có ổ cắm điện và Wi-Fi tốt.',
  'Pizza nướng củi, phô mai tươi và không gian thoải mái để ăn uống cùng bạn bè.',
  'Góc cà phê ấm cúng để thưởng thức cà phê, ăn sáng muộn và tìm cảm hứng.',
  'Quán cà phê rộng rãi, thư thái và nhiều ánh sáng tự nhiên, phù hợp gặp gỡ bạn bè.',
  'Bia thủ công địa phương và món ăn nhẹ cho buổi tối thoải mái cùng nhóm bạn.',
  'Món tráng miệng Nhật Bản, matcha và không gian yên bình để nghỉ ngơi buổi chiều.',
]

export const venues = MOCK_VENUES.map((venue, index) => ({ ...venue, ...discoveryDetails[index], descriptionVi: descriptionsVi[index] }))

export const discoveryFilters = [
  { key: 'purpose', label: 'Purpose', options: ['Study / Work', 'Eat & Drink', 'Hangout', 'Date', 'Group Gathering', 'Explore'] },
  { key: 'budget', label: 'Budget', options: [['$', '$ · Budget'], ['$$', '$$ · Mid-range'], ['$$$', '$$$ · Treat yourself']] },
  { key: 'distance', label: 'Distance', options: [['2', 'Within 2 km'], ['3', 'Within 3 km'], ['5', 'Within 5 km']] },
  { key: 'groupSize', label: 'Group size', options: ['Solo', '2 people', '3-5 people', '6+ people'] },
  { key: 'atmosphere', label: 'Atmosphere', options: ['Quiet', 'Cozy', 'Social', 'Spacious', 'Outdoor', 'Aesthetic'] },
  { key: 'amenities', label: 'Amenities', options: ['Wi-Fi', 'Power outlets', 'Group seating', 'Air conditioning', 'Parking'] },
]

export const emptyFilters = { purpose: '', budget: '', distance: '', groupSize: '', atmosphere: '', amenities: [] }
