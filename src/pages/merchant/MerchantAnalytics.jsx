import { useState } from 'react'
import { Eye, Navigation, Lightbulb } from 'lucide-react'
import {
  DemoNotice,
  PageHeading,
  PanelHeading,
  PerformanceChart
} from '../../components/merchant/MerchantUi'
import {
  analyticsDemo,
  performance,
  popularAttributes,
  merchantVenues
} from '../../data/merchantDemo'

export default function MerchantAnalytics() {
  const [period, setPeriod] = useState('week')
  // Cùng một period điều khiển biểu đồ, nhu cầu và số liệu từng địa điểm.
  // Tất cả đều lấy từ fixture, không cần gọi API analytics của BE.
  const { interests, venueMetrics } = analyticsDemo[period]
  const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value)
  return (
    <>
      <PageHeading
        eyebrow="TỪ QUAN TÂM ĐẾN CƠ HỘI"
        title="Phân tích & nhu cầu"
        description="Một góc nhìn về cách FIND&GO có thể giúp bạn hiểu khách hàng."
      >
        <label className="mp-select-label">
          Khoảng thời gian
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">7 ngày minh họa</option>
            <option value="month">Tháng 10 minh họa</option>
          </select>
        </label>
      </PageHeading>
      <DemoNotice />
      <section className="mp-panel">
        <PanelHeading
          title="Hành trình khám phá địa điểm"
          description="Hiển thị và xem hồ sơ · Số liệu giả lập"
        />
        <PerformanceChart period={period} />
      </section>
      <div className="mp-two-columns">
        <section className="mp-panel">
          <PanelHeading
            title="Khách hàng đang tìm gì?"
            description="Mức quan tâm giả lập theo mục đích, có thể chồng lấp."
          />
          <div className="mp-interest-list">
            {interests.map((item) => (
              <div key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div
                  className="mp-progress"
                  role="img"
                  aria-label={`${item.label}: ${item.value}% minh họa`}
                >
                  <span style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mp-panel">
          <PanelHeading
            title="Tiện ích được quan tâm"
            description="Gợi ý tình huống nghiên cứu, chưa phải khảo sát thực tế."
          />
          <div className="mp-attribute-grid">
            {popularAttributes.map((label, i) => (
              <div key={label}>
                <span>0{i + 1}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
          <div className="mp-insight">
            <Lightbulb size={20} />
            <p>
              Thử giới thiệu khu vực bàn nhóm và tiện ích học tập trong hồ sơ để giúp sinh viên đánh
              giá độ phù hợp.
            </p>
          </div>
        </section>
      </div>
      <section className="mp-panel">
        <PanelHeading
          title="Tín hiệu quan tâm theo địa điểm"
          description={`${performance[period].label} · Không xác nhận lượt ghé thăm thực tế`}
        />
        <div className="mp-venue-metrics">
          {merchantVenues.map((venue) => (
            <article key={venue.id}>
              <img src={venue.image} alt="" />
              <h3>{venue.name}</h3>
              <span>
                <Eye size={16} />
                {formatNumber(venueMetrics[venue.id].views)} lượt xem mẫu
              </span>
              <span>
                <Navigation size={16} />
                {formatNumber(venueMetrics[venue.id].directions)} lượt chỉ đường mẫu
              </span>
            </article>
          ))}
        </div>
      </section>
      <div className="mp-note">
        <strong>Đọc số liệu đúng ngữ cảnh</strong>
        <p>
          Lượt xem, lượt nhấn chỉ đường và lượt tương tác chiến dịch là các tín hiệu khác nhau.
          Không thể dùng chúng để kết luận số khách đã đến hoặc doanh thu thực tế.
        </p>
      </div>
    </>
  )
}
