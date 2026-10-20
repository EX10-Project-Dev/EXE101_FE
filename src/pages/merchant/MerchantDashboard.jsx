import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  Eye,
  MousePointer2,
  Navigation,
  Ticket,
  Plus,
  ArrowUpRight,
  Store,
  Megaphone,
  Sparkles
} from 'lucide-react'
import {
  DemoNotice,
  PageHeading,
  PanelHeading,
  PerformanceChart,
  VenueCard,
  VenuePreview
} from '../../components/merchant/MerchantUi'
import { merchantVenues, performance } from '../../data/merchantDemo'

const metrics = [
  { label: 'Hiển thị trong gợi ý', icon: Eye, detail: 'Cơ hội được khách hàng khám phá' },
  { label: 'Lượt xem hồ sơ', icon: MousePointer2, detail: 'Mối quan tâm đến không gian' },
  { label: 'Lượt nhấn chỉ đường', icon: Navigation, detail: 'Tín hiệu ý định ghé thăm' },
  { label: 'Lượt dùng chiến dịch', icon: Ticket, detail: 'Tương tác giả lập, chưa xác thực' }
]

export default function MerchantDashboard() {
  const { campaigns } = useOutletContext()
  const [period, setPeriod] = useState('week')
  const [venue, setVenue] = useState(null)
  // period được truyền vào cả KPI và chart để chúng luôn dùng cùng một kỳ mẫu.
  // venue = null đóng dialog; chọn card sẽ truyền nguyên thông tin địa điểm vào preview.
  return (
    <>
      <PageHeading
        eyebrow="KHÔNG GIAN CỦA BẠN, CƠ HỘI MỚI"
        title="Chào bạn, đối tác FIND&GO 👋"
        description="Cùng đưa những không gian phù hợp đến gần hơn với sinh viên."
      >
        <Link className="mp-button" to="/merchant/campaigns?create=1">
          <Plus size={18} />
          Tạo chiến dịch
        </Link>
      </PageHeading>
      <DemoNotice />
      <div className="mp-summary-row">
        <span>
          <Store size={16} />
          <strong>{merchantVenues.length}</strong> địa điểm mẫu
        </span>
        <span>
          <Megaphone size={16} />
          <strong>
            {campaigns.filter((campaign) => campaign.status === 'active').length}
          </strong>{' '}
          chiến dịch mẫu đang diễn ra
        </span>
        <label className="mp-period">
          Khoảng thời gian
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">7 ngày minh họa</option>
            <option value="month">Tháng 10 minh họa</option>
          </select>
        </label>
      </div>
      <div className="mp-kpi-grid">
        {metrics.map(({ label, icon: Icon, detail }, i) => (
          <article className="mp-kpi" key={label}>
            <div>
              <span>{label}</span>
              <span className={`mp-kpi-icon tone-${i}`}>
                <Icon size={19} />
              </span>
            </div>
            <strong>{performance[period].kpis[i]}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <div className="mp-dashboard-grid">
        <section className="mp-panel">
          <PanelHeading
            title="Không gian của bạn được chú ý thế nào?"
            description="Lượt hiển thị và xem hồ sơ · Dữ liệu minh họa"
          />
          <PerformanceChart period={period} />
        </section>
        <section className="mp-panel mp-opportunity">
          <span className="mp-feature-icon">
            <Sparkles size={24} />
          </span>
          <p className="mp-eyebrow">GỢI Ý CHO ĐỐI TÁC</p>
          <h2>
            Một chiếc bàn.
            <br />
            Nhiều kết nối mới.
          </h2>
          <p>
            Nhóm sinh viên thường tìm không gian có Wi-Fi, ổ cắm và bàn ngồi chung vào buổi chiều.
          </p>
          <div className="mp-tags">
            <span>Học nhóm</span>
            <span>13:00 – 16:00</span>
          </div>
          <Link className="mp-button secondary" to="/merchant/campaigns?create=1">
            Thử tạo chiến dịch <ArrowUpRight size={17} />
          </Link>
          <small>Tình huống minh họa, không phải kết luận từ khách hàng thực.</small>
        </section>
      </div>
      <div className="mp-section-title">
        <PanelHeading
          title="Địa điểm của tôi"
          description="Một hồ sơ chỉn chu, thêm cơ hội được khám phá."
        />
        <Link className="mp-text-button" to="/merchant/venues">
          Xem tất cả <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="mp-venue-grid">
        {merchantVenues.map((item) => (
          <VenueCard key={item.id} venue={item} onPreview={setVenue} />
        ))}
      </div>
      <section className="mp-quick-actions" aria-label="Thao tác nhanh">
        <Link to="/merchant/venues">
          <Store size={20} />
          <span>
            <strong>Xem hồ sơ địa điểm</strong>
            <small>Khám phá thông tin đang hiển thị</small>
          </span>
          <ArrowUpRight size={18} />
        </Link>
        <Link to="/merchant/analytics">
          <Eye size={20} />
          <span>
            <strong>Hiểu nhu cầu khách hàng</strong>
            <small>Xem các tín hiệu quan tâm minh họa</small>
          </span>
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <VenuePreview venue={venue} onClose={() => setVenue(null)} />
    </>
  )
}
