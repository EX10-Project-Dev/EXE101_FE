import { useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Plus, CalendarDays, Clock3, Users, ArrowUpRight, Megaphone, Gift } from 'lucide-react'
import { merchantVenues, campaignStatuses, createSampleCampaignForm } from '../../data/merchantDemo'
import { DemoNotice, PageHeading } from '../../components/merchant/MerchantUi'

const emptyForm = {
  name: '',
  venueId: 'workshop',
  audience: 'Sinh viên học nhóm',
  start: '',
  end: '',
  timeFrom: '13:00',
  timeTo: '16:00',
  benefit: ''
}
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN').format(new Date(`${date}T12:00:00`))

function CampaignDetails({ campaign }) {
  const venue = merchantVenues.find((item) => item.id === campaign.venueId)
  return (
    <div className="mp-campaign-preview">
      <img className="mp-detail-photo" src={venue.image} alt={venue.name} />
      <span className={`mp-badge ${campaign.status}`}>{campaignStatuses[campaign.status]}</span>
      <h2>{campaign.name}</h2>
      <p>{venue.name}</p>
      <dl className="mp-detail-list">
        <div>
          <dt>
            <Users size={17} />
            Đối tượng
          </dt>
          <dd>{campaign.audience}</dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={17} />
            Thời gian
          </dt>
          <dd>
            {formatDate(campaign.start)} – {formatDate(campaign.end)}
          </dd>
        </div>
        <div>
          <dt>
            <Clock3 size={17} />
            Khung giờ mỗi ngày
          </dt>
          <dd>
            {campaign.timeFrom} – {campaign.timeTo}
          </dd>
        </div>
        <div>
          <dt>
            <Gift size={17} />
            Quyền lợi
          </dt>
          <dd>{campaign.benefit}</dd>
        </div>
      </dl>
      <div className="mp-note">
        Bản xem trước minh họa. Chiến dịch chưa được phát hành tới khách hàng; lượt tương tác không
        xác nhận khách đã đến quán.
      </div>
    </div>
  )
}

export default function MerchantCampaigns() {
  const { campaigns, setCampaigns } = useOutletContext()
  const [params, setParams] = useSearchParams()
  // ?create=1 cho phép nút "Tạo chiến dịch" từ Dashboard mở đúng form ở trang này.
  // Không lưu giá trị form lên URL vì đây chỉ là nội dung nháp trong phiên trình diễn.
  const creating = params.get('create') === '1'
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [stage, setStage] = useState('edit')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [preview, setPreview] = useState(null)
  // filter chỉ thay đổi danh sách hiển thị, không xóa chiến dịch khỏi state của layout.
  const visible = campaigns.filter((item) => filter === 'all' || item.status === filter)

  function openForm() {
    setForm(emptyForm)
    setStage('edit')
    setError('')
    setNotice('')
    setParams({ create: '1' })
  }
  function closeForm() {
    setParams({})
    setStage('edit')
    setForm(emptyForm)
    setError('')
  }
  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }
  function fillSample() {
    // Điền đầy đủ dữ liệu hợp lệ để demo được ngay khi BE chưa có API.
    // Người dùng vẫn sửa từng trường và xem trước; nút này không tạo hay phát hành chiến dịch.
    setForm(createSampleCampaignForm())
    setError('')
  }
  function review(event) {
    event.preventDefault()
    // Chuỗi ngày theo chuẩn YYYY-MM-DD có thể so sánh trực tiếp.
    // Kiểm tra thêm khoảng ngày/giờ vì thuộc tính required chỉ kiểm tra bỏ trống.
    if (!form.name.trim() || !form.benefit.trim()) {
      setError('Vui lòng nhập tên và quyền lợi có nội dung.')
      return
    }
    if (form.end < form.start) {
      setError('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.')
      return
    }
    if (form.timeTo <= form.timeFrom) {
      setError('Giờ kết thúc phải sau giờ bắt đầu trong cùng ngày.')
      return
    }
    setStage('preview')
  }
  function saveDraft() {
    // Chỉ cập nhật state của layout. Không gọi API và không giả lập thông báo lưu server.
    setCampaigns((current) => [
      {
        ...form,
        name: form.name.trim(),
        benefit: form.benefit.trim(),
        id: `local-${crypto.randomUUID()}`,
        status: 'draft',
        redemptions: 0
      },
      ...current
    ])
    setFilter('draft')
    setNotice(
      'Đã thêm bản nháp vào phiên trình diễn. Bản nháp chưa lưu lên máy chủ và sẽ mất khi tải lại trang.'
    )
    closeForm()
  }

  return (
    <>
      <PageHeading
        eyebrow="KẾT NỐI VỚI ĐÚNG KHÁCH HÀNG"
        title="Chiến dịch"
        description="Biến những khung giờ còn trống thành cơ hội kết nối mới."
      >
        <button className="mp-button" onClick={openForm}>
          <Plus size={18} />
          Tạo chiến dịch
        </button>
      </PageHeading>
      <DemoNotice />
      <div className="mp-campaign-summary">
        {Object.entries(campaignStatuses).map(([key, label]) => (
          <div key={key}>
            <span className={`mp-status-dot ${key}`} />
            <span>{label}</span>
            <strong>
              {campaigns
                .filter((item) => item.status === key)
                .length.toString()
                .padStart(2, '0')}
            </strong>
          </div>
        ))}
      </div>
      <div className="mp-tabs" role="group" aria-label="Lọc trạng thái chiến dịch">
        {[['all', 'Tất cả'], ...Object.entries(campaignStatuses)].map(([key, label]) => (
          <button
            key={key}
            aria-pressed={filter === key}
            className={filter === key ? 'active' : ''}
            onClick={() => setFilter(key)}
          >
            {label}
            <span>
              {key === 'all'
                ? campaigns.length
                : campaigns.filter((item) => item.status === key).length}
            </span>
          </button>
        ))}
      </div>
      {notice && (
        <p className="mp-success" role="status">
          {notice}
        </p>
      )}
      <div className="mp-campaign-grid">
        {visible.map((campaign) => {
          const venue = merchantVenues.find((item) => item.id === campaign.venueId)
          return (
            <article className="mp-campaign-card" key={campaign.id}>
              <div className="mp-campaign-card-top">
                <span className="mp-feature-icon">
                  <Megaphone size={20} />
                </span>
                <span className={`mp-badge ${campaign.status}`}>
                  {campaignStatuses[campaign.status]}
                </span>
              </div>
              <p className="mp-eyebrow">{venue.name}</p>
              <h2>{campaign.name}</h2>
              <p className="mp-icon-text">
                <Users size={16} />
                {campaign.audience}
              </p>
              <p className="mp-icon-text">
                <CalendarDays size={16} />
                {formatDate(campaign.start)} – {formatDate(campaign.end)}
              </p>
              <p className="mp-icon-text">
                <Clock3 size={16} />
                {campaign.timeFrom} – {campaign.timeTo}
              </p>
              <p className="mp-campaign-benefit">{campaign.benefit}</p>
              <div className="mp-campaign-card-footer">
                <small>{campaign.redemptions} lượt dùng minh họa</small>
                <button className="mp-text-button" onClick={() => setPreview(campaign)}>
                  Xem trước <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {!visible.length && (
        <div className="mp-empty">
          <Megaphone size={28} />
          <h2>Chưa có chiến dịch ở trạng thái này</h2>
          <p>Bắt đầu với một ý tưởng dành cho cộng đồng sinh viên.</p>
          <button className="mp-button" onClick={openForm}>
            Tạo bản nháp đầu tiên
          </button>
        </div>
      )}
      <div className="mp-note">
        <strong>Thử nghiệm ý tưởng trước khi phát hành</strong>
        <p>
          Chiến dịch mới chỉ là bản nháp trong phiên trình diễn. Phát hành, QR và xác nhận sử dụng
          sẽ được phát triển sau Checkpoint 3.
        </p>
      </div>
      <Dialog
        open={creating}
        onClose={closeForm}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { className: 'mp-dialog' } }}
        aria-labelledby="mp-create-title"
      >
        <DialogTitle id="mp-create-title">
          {stage === 'edit' ? 'Tạo chiến dịch mẫu' : 'Xem trước chiến dịch mới'}
        </DialogTitle>
        <DialogContent>
          {stage === 'edit' ? (
            <form id="mp-campaign-form" className="mp-form" onSubmit={review}>
              <p className="mp-note">
                Chỉ trình diễn giao diện. Các trường đều bắt buộc; chưa có dữ liệu nào được gửi lên
                máy chủ.
              </p>
              <button className="mp-button secondary" type="button" onClick={fillSample}>
                Điền dữ liệu mẫu
              </button>
              <label>
                Tên chiến dịch
                <input
                  autoFocus
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Ví dụ: Chiều học nhóm, thêm cảm hứng"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Địa điểm
                <select name="venueId" value={form.venueId} onChange={update}>
                  {merchantVenues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Đối tượng hướng đến
                <select name="audience" value={form.audience} onChange={update}>
                  <option>Sinh viên học nhóm</option>
                  <option>Sinh viên học tập cá nhân</option>
                  <option>Nhóm bạn gặp gỡ</option>
                </select>
              </label>
              <div className="mp-form-row">
                <label>
                  Ngày bắt đầu
                  <input type="date" name="start" value={form.start} onChange={update} required />
                </label>
                <label>
                  Ngày kết thúc
                  <input
                    type="date"
                    name="end"
                    value={form.end}
                    min={form.start || undefined}
                    onChange={update}
                    required
                  />
                </label>
              </div>
              <div className="mp-form-row">
                <label>
                  Giờ bắt đầu
                  <input
                    type="time"
                    name="timeFrom"
                    value={form.timeFrom}
                    onChange={update}
                    required
                  />
                </label>
                <label>
                  Giờ kết thúc
                  <input type="time" name="timeTo" value={form.timeTo} onChange={update} required />
                </label>
              </div>
              <label>
                Quyền lợi chiến dịch
                <textarea
                  name="benefit"
                  rows={3}
                  value={form.benefit}
                  onChange={update}
                  placeholder="Ví dụ: Ưu tiên bàn nhóm từ 4 người, gần ổ cắm điện."
                  required
                  maxLength={500}
                />
              </label>
              {error && (
                <p className="mp-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <CampaignDetails campaign={{ ...form, status: 'draft' }} />
          )}
        </DialogContent>
        <DialogActions>
          <button
            className="mp-button secondary"
            onClick={stage === 'edit' ? closeForm : () => setStage('edit')}
          >
            {stage === 'edit' ? 'Hủy' : 'Quay lại sửa'}
          </button>
          {stage === 'edit' ? (
            <button className="mp-button" type="submit" form="mp-campaign-form">
              Xem trước chiến dịch
            </button>
          ) : (
            <button className="mp-button" onClick={saveDraft}>
              Thêm bản nháp vào phiên demo
            </button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { className: 'mp-dialog' } }}
        aria-labelledby="mp-campaign-preview-title"
      >
        <DialogTitle id="mp-campaign-preview-title">Xem trước chiến dịch</DialogTitle>
        <DialogContent>{preview && <CampaignDetails campaign={preview} />}</DialogContent>
        <DialogActions>
          <button className="mp-button secondary" onClick={() => setPreview(null)}>
            Đóng xem trước
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
