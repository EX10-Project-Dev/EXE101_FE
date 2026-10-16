import { X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import VenueAiReview from './VenueAiReview'

const highlights = {
  'venue-1': [
    ['💻', 'Dễ tập trung', 'Bàn rộng, phù hợp học tập và làm việc.', 'Room to focus', 'Large tables for studying and working.'],
    ['🔌', 'Kết nối thuận tiện', 'Có Wi-Fi và ổ cắm điện.', 'Stay connected', 'Wi-Fi and power outlets available.'],
    ['☕', 'Cà phê specialty', 'Cà phê pha thủ công trong không gian thoáng.', 'Specialty coffee', 'Handcrafted coffee in an airy space.'],
  ],
  'venue-2': [
    ['💖', 'Không gian lãng mạn', 'Ánh sáng ấm, phù hợp cho buổi hẹn hò.', 'Very romantic', 'Warm lighting for a relaxed date.'],
    ['🧀', 'Phô mai tươi', 'Phô mai tự làm kết hợp cùng pizza.', 'Fresh cheese', 'House-made cheese paired with pizza.'],
    ['🪵', 'Pizza nướng củi', 'Pizza thủ công được nướng trong lò củi.', 'Wood-fired pizza', 'Handcrafted pizza baked in a wood oven.'],
  ],
  'venue-3': [
    ['📷', 'Góc nhỏ đầy cảm hứng', 'Thiết kế vintage, nhiều góc chụp ảnh.', 'Aesthetic corners', 'Vintage design with photogenic corners.'],
    ['☕', 'Cà phê và brunch', 'Thích hợp cho một buổi sáng chậm rãi.', 'Coffee and brunch', 'A lovely setting for a slow morning.'],
    ['📖', 'Thư giãn nhẹ nhàng', 'Không gian ấm cúng để đọc sách, trò chuyện.', 'Take it easy', 'A cozy space for reading and conversation.'],
  ],
  'venue-4': [
    ['🌿', 'Không gian ngoài trời', 'Ánh sáng tự nhiên và nhiều cây xanh.', 'Outdoor space', 'Natural light and leafy surroundings.'],
    ['👥', 'Thoải mái gặp bạn bè', 'Không gian rộng, có chỗ ngồi cho nhóm.', 'Room for friends', 'Spacious surroundings with group seating.'],
    ['🔌', 'Tiện làm việc', 'Có Wi-Fi và ổ cắm điện.', 'Work friendly', 'Wi-Fi and power outlets available.'],
  ],
  'venue-5': [
    ['🍻', 'Bia thủ công', 'Nhiều lựa chọn bia và món ăn kèm.', 'Craft beer', 'A range of craft beers and casual bites.'],
    ['👥', 'Gặp gỡ bạn bè', 'Bàn nhóm cho những buổi tụ tập.', 'Get together', 'Group seating for a social evening.'],
    ['🌿', 'Chỗ ngồi ngoài trời', 'Không gian thoáng cho buổi tối thư giãn.', 'Outdoor seating', 'An airy setting for an easy evening.'],
  ],
  'venue-6': [
    ['🍵', 'Matcha Nhật Bản', 'Trà xanh Uji Kyoto và món ngọt Nhật.', 'Japanese matcha', 'Uji Kyoto matcha and Japanese sweets.'],
    ['🍰', 'Tráng miệng đa dạng', 'Gợi ý cho một buổi chiều ăn ngọt.', 'Something sweet', 'Desserts for a leisurely afternoon.'],
    ['💖', 'Ấm cúng, nhẹ nhàng', 'Thích hợp trò chuyện hoặc hẹn hò.', 'Cozy atmosphere', 'A comfortable setting to chat or go on a date.'],
  ],
}

const matchSubjects = {
  'venue-1': ['Cà phê làm việc', 'Work-friendly coffee'],
  'venue-2': ['Pizza nướng củi', 'Wood oven pizza'],
  'venue-3': ['Cà phê và brunch', 'Coffee and brunch'],
  'venue-4': ['Cà phê ngoài trời', 'Outdoor coffee'],
  'venue-5': ['Bia thủ công', 'Craft beer'],
  'venue-6': ['Matcha và món ngọt', 'Matcha and desserts'],
}

export default function VenueMatchPopup({ venue, onClose, onDetails }) {
  const { isEn, tx } = useLanguage()
  const dynamicRows = (Array.isArray(venue.reasons) && venue.reasons.length > 0 ? venue.reasons : (Array.isArray(venue.dynamicReasons) ? venue.dynamicReasons : []))
    .slice(0, 3)
    .map((r) => ['✨', r, '', r, ''])
  const rows = highlights[venue.id] || dynamicRows
  const subject = matchSubjects[venue.id]?.[isEn ? 1 : 0] || venue.name
  const missing = ['Wi-Fi', 'Power outlets', 'Parking'].find(amenity => !venue.amenities?.includes(amenity))
  if (venue.reviewSource === 'demo') return <article className="dg-match-popup dg-match-popup--review">
    <button type="button" className="dg-match-close" onClick={(event) => { event.stopPropagation(); onClose() }} aria-label={isEn ? 'Close match details' : 'Đóng độ phù hợp'}><X size={16} /></button>
    <div className="dg-match-scroll"><VenueAiReview venue={venue} /></div>
    <footer><span>{venue.name}</span><button type="button" onClick={() => onDetails(venue)}>{isEn ? 'Venue info →' : 'Thông tin quán →'}</button></footer>
  </article>
  return (
    <article className="dg-match-popup" aria-label={isEn ? `Match details for ${venue.name}` : `Độ phù hợp của ${venue.name}`}>
      <button type="button" className="dg-match-close" onClick={(event) => { event.stopPropagation(); onClose() }} aria-label={isEn ? 'Close match details' : 'Đóng độ phù hợp'}><X size={16} /></button>
      <header className="dg-match-heading">
        <span aria-hidden="true">💖</span><strong>{venue.matchScore.toFixed(1)}</strong>
        <span>/ 10 <span>{isEn ? 'match for' : 'phù hợp với'} <b>{subject}</b></span></span>
      </header>
      <div className="dg-match-scroll">
        <div className="dg-match-positives">
          {rows.map(([icon, titleVi, bodyVi, titleEn, bodyEn], idx) => <div className="dg-match-row" key={`${idx}-${titleEn}`}><span aria-hidden="true">{icon}</span><div><strong>{isEn ? titleEn : titleVi}</strong>{bodyEn || bodyVi ? <p>{isEn ? bodyEn : bodyVi}</p> : null}</div></div>)}
        </div>
        <div className="dg-match-row dg-match-neutral"><span aria-hidden="true">💰</span><div><strong>{isEn ? 'Budget to plan for' : 'Chi phí tham khảo'}</strong><p>{venue.priceRange}</p></div></div>
        <div className="dg-match-row dg-match-caution"><span aria-hidden="true">💡</span><div><strong>{isEn ? 'Before you go' : 'Lưu ý trước khi đến'}</strong><p>{missing ? (isEn ? `${tx(missing)} is not listed. Check with the venue.` : `Chưa có thông tin ${tx(missing).toLowerCase()}. Hãy hỏi quán trước.`) : (isEn ? 'Check seating availability with the venue.' : 'Hãy kiểm tra chỗ ngồi với quán trước.')}</p></div></div>
      </div>
      <footer><small>{venue.reviewSource === 'backend' ? (isEn ? 'FindGo Matched' : 'Tìm kiếm FindGo') : (isEn ? 'Sample match score' : 'Điểm phù hợp minh họa')}</small><button type="button" onClick={() => onDetails(venue)}>{isEn ? 'Venue info →' : 'Thông tin quán →'}</button></footer>
    </article>
  )
}
