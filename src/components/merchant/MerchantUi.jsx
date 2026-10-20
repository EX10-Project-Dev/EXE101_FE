import { ArrowUpRight, MapPin, Clock3, CheckCircle2 } from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { venueStatuses, performance } from '../../data/merchantDemo'

export function DemoNotice() {
  return (
    <div className="mp-demo">
      <span className="mp-demo-dot" />
      <strong>Dữ liệu minh họa</strong>
      <span>
        Phiên bản thử nghiệm Checkpoint 3. Số liệu và địa điểm mẫu, chưa kết nối hệ thống thực tế.
      </span>
    </div>
  )
}

export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="mp-page-heading">
      <div>
        <p className="mp-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="mp-subtitle">{description}</p>
      </div>
      {children && <div className="mp-heading-action">{children}</div>}
    </div>
  )
}

export function PanelHeading({ title, description, children }) {
  return (
    <div className="mp-panel-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  )
}

export function VenueCard({ venue, onPreview }) {
  return (
    <article className="mp-venue-card">
      <div className="mp-venue-photo">
        <img src={venue.image} alt={`Không gian ${venue.name}`} loading="lazy" />
        <span className={`mp-badge ${venue.status}`}>
          <CheckCircle2 size={13} />
          {venueStatuses[venue.status]}
        </span>
      </div>
      <div className="mp-venue-body">
        <p className="mp-eyebrow">{venue.category}</p>
        <h3>{venue.name}</h3>
        <p className="mp-icon-text">
          <MapPin size={15} />
          {venue.address}
        </p>
        <p className="mp-icon-text">
          <Clock3 size={15} />
          {venue.hours}
        </p>
        <div className="mp-tags">
          {venue.amenities.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <button className="mp-text-button" onClick={() => onPreview(venue)}>
          Xem địa điểm <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  )
}

export function VenuePreview({ venue, onClose }) {
  // Dùng Dialog của MUI để có sẵn focus trap, Escape và trả focus về nút mở.
  return (
    <Dialog
      open={Boolean(venue)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { className: 'mp-dialog' } }}
      aria-labelledby="mp-venue-title"
    >
      <DialogTitle id="mp-venue-title">Thông tin địa điểm mẫu</DialogTitle>
      <DialogContent>
        {venue && (
          <div className="mp-preview">
            <img className="mp-detail-photo" src={venue.image} alt={`Không gian ${venue.name}`} />
            <span className={`mp-badge ${venue.status}`}>{venueStatuses[venue.status]}</span>
            <h2>{venue.name}</h2>
            <p>{venue.description}</p>
            <p className="mp-icon-text">
              <MapPin size={17} />
              {venue.address}
            </p>
            <p className="mp-icon-text">
              <Clock3 size={17} />
              {venue.hours}
            </p>
            <div className="mp-tags">
              {venue.amenities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="mp-note">
              <strong>Chỉnh sửa địa điểm: Sắp ra mắt</strong>
              <p>
                Hiện chỉ xem trước hồ sơ mẫu. Thông tin chưa được lưu lên máy chủ và không xác nhận
                quyền quản lý thực tế.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button className="mp-button secondary" onClick={onClose}>
          Đóng xem trước
        </button>
      </DialogActions>
    </Dialog>
  )
}

export function PerformanceChart({ period }) {
  const data = performance[period]
  const max = Math.ceil(Math.max(...data.impressions) / 4) * 4
  // SVG dùng hệ tọa độ cố định; viewBox co giãn theo chiều rộng card.
  // Mỗi điểm được đổi từ số liệu sang tọa độ, không gắn kích thước pixel màn hình.
  const points = (values) =>
    values
      .map((value, i) => `${50 + (i * 580) / (values.length - 1)},${210 - (value / max) * 170}`)
      .join(' ')
  return (
    <div className="mp-chart">
      <div className="mp-chart-legend">
        <span>
          <i />
          Lượt hiển thị gợi ý
        </span>
        <span>
          <i />
          Lượt xem hồ sơ
        </span>
      </div>
      <svg viewBox="0 0 660 255" role="img" aria-labelledby="mp-chart-title">
        <title id="mp-chart-title">{`Hiệu suất ${data.label}. Đường cam: lượt hiển thị; đường xanh: lượt xem hồ sơ. Dữ liệu chi tiết bên dưới.`}</title>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line
              x1="50"
              x2="630"
              y1={40 + i * 42.5}
              y2={40 + i * 42.5}
              stroke="#eee9e5"
              strokeDasharray="4 5"
            />
            <text x="39" y={44 + i * 42.5} textAnchor="end">
              {Math.round((max * (4 - i)) / 4)}
            </text>
          </g>
        ))}
        <polygon points={`50,210 ${points(data.impressions)} 630,210`} fill="#fff0e5" />
        <polyline points={points(data.impressions)} stroke="#f97316" />
        <polyline points={points(data.views)} stroke="#558277" />
        {data.dates.map((date, i) => (
          <text key={date} x={50 + (i * 580) / (data.dates.length - 1)} y="240" textAnchor="middle">
            {date}
          </text>
        ))}
      </svg>
      {/* Bảng HTML giúp đọc chính xác từng điểm và hỗ trợ người dùng trình đọc màn hình. */}
      <details className="mp-chart-data">
        <summary>Xem số liệu biểu đồ</summary>
        <div className="mp-table-wrap">
          <table>
            <caption>{data.label} · Dữ liệu minh họa</caption>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hiển thị</th>
                <th>Xem hồ sơ</th>
              </tr>
            </thead>
            <tbody>
              {data.dates.map((date, i) => (
                <tr key={date}>
                  <th>{date}</th>
                  <td>{data.impressions[i]}</td>
                  <td>{data.views[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
