import { useState } from 'react'
import { Search } from 'lucide-react'
import { merchantVenues } from '../../data/merchantDemo'
import {
  DemoNotice,
  PageHeading,
  VenueCard,
  VenuePreview
} from '../../components/merchant/MerchantUi'

export default function MerchantVenues() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [preview, setPreview] = useState(null)
  // Kết hợp hai điều kiện trên cùng tập fixture: từ khóa tên/địa chỉ VÀ trạng thái.
  // Không sửa mảng gốc để khi xóa bộ lọc có thể hiện lại đầy đủ địa điểm mẫu.
  const venues = merchantVenues.filter(
    (venue) =>
      `${venue.name} ${venue.address}`
        .toLocaleLowerCase('vi')
        .includes(query.trim().toLocaleLowerCase('vi')) &&
      (status === 'all' || venue.status === status)
  )
  return (
    <>
      <PageHeading
        eyebrow="HỒ SƠ DOANH NGHIỆP"
        title="Địa điểm của tôi"
        description="Giới thiệu không gian, tiện ích và những điều làm nên nét riêng của bạn."
      />
      <DemoNotice />
      <div className="mp-toolbar">
        <label className="mp-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc địa chỉ…"
            aria-label="Tìm địa điểm"
          />
        </label>
        <label className="mp-select-label">
          Trạng thái
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="verified">Đã xác minh · mẫu</option>
            <option value="pending">Chờ xác minh · mẫu</option>
          </select>
        </label>
      </div>
      <p className="mp-result-count">{venues.length} địa điểm minh họa</p>
      <div className="mp-venue-grid">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} onPreview={setPreview} />
        ))}
      </div>
      {!venues.length && (
        <div className="mp-empty">
          <Search size={28} />
          <h2>Chưa tìm thấy địa điểm</h2>
          <p>Thử từ khóa khác hoặc chọn tất cả trạng thái.</p>
          <button
            className="mp-button secondary"
            onClick={() => {
              setQuery('')
              setStatus('all')
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
      <div className="mp-note">
        <strong>Thêm và chỉnh sửa địa điểm · Sắp ra mắt</strong>
        <p>
          Bản trình diễn hiện hỗ trợ xem hồ sơ. Quản lý quyền sở hữu và lưu thay đổi sẽ được kết nối
          trong giai đoạn tiếp theo.
        </p>
      </div>
      <VenuePreview venue={preview} onClose={() => setPreview(null)} />
    </>
  )
}
