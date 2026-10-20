import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, Download, MapPin, ShieldCheck, Store, Users } from 'lucide-react'
import HeroNavbar from '../components/HeroNavbar'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../services/api'
import './PartnersPage.css'

const registrationPath = import.meta.env.VITE_PARTNER_REGISTRATION_PATH?.trim()
const policyVersion = 'partner-draft-2026-10-20'

export default function PartnersPage() {
  const { isEn } = useLanguage()
  const text = (vi, en) => isEn ? en : vi
  const [application, setApplication] = useState(null)
  const [status, setStatus] = useState('editing')
  const [error, setError] = useState('')
  const resultRef = useRef(null)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    if (status === 'review' || status === 'sent') resultRef.current?.focus()
  }, [status])

  const benefits = [
    [MapPin, text('Đúng khách, đúng nhu cầu', 'The right guests, the right moment'), text('Giới thiệu không gian của bạn theo nhu cầu làm việc, hẹn hò hay gặp gỡ.', 'Introduce your space to people looking to work, date or get together.')],
    [Store, text('Kể câu chuyện của quán', 'Let your venue shine'), text('Mang những điểm riêng về không gian, thực đơn và tiện ích đến khách hàng.', 'Help guests discover your space, menu and distinctive amenities.')],
    [Users, text('Cùng xây dựng kết nối', 'Build connections together'), text('Trao đổi cơ hội hợp tác phù hợp với mô hình và định hướng của thương hiệu.', 'Explore collaboration that fits your business and brand direction.')],
  ]
  const policies = [
    [text('01. Đối tượng hợp tác', '01. Who can partner'), text('Dành cho chủ sở hữu hoặc người được ủy quyền của quán cà phê, nhà hàng, thương hiệu đồ uống và đơn vị kinh doanh F&B. Thông tin đăng ký cần chính xác và có thể xác minh.', 'For owners or authorized representatives of cafés, restaurants, beverage brands and F&B businesses. Application details must be accurate and verifiable.')],
    [text('02. Thông tin & nội dung địa điểm', '02. Venue information & content'), text('Đối tác chịu trách nhiệm về quyền sử dụng hình ảnh, nội dung và độ chính xác của địa chỉ, giá, giờ mở cửa, tiện ích. Không cung cấp nội dung gây hiểu nhầm; cập nhật khi thông tin thay đổi.', 'Partners are responsible for content and image permissions, and accurate addresses, prices, opening hours and amenities. Avoid misleading content and keep information current.')],
    [text('03. Xét duyệt & kích hoạt', '03. Review & activation'), text('Đăng ký là bước đề nghị hợp tác, chưa tự động tạo tài khoản đối tác hoặc đưa địa điểm lên nền tảng. FIND&GO sẽ cần xác minh thông tin và thống nhất phạm vi hợp tác trước khi kích hoạt.', 'An application is an expression of interest. It does not automatically create a partner account or publish a venue. Information verification and agreement on the scope of collaboration are required before activation.')],
    [text('04. Phí & tính minh bạch', '04. Fees & transparency'), text('Gói dịch vụ, chi phí và các quyền lợi cụ thể sẽ được trao đổi, thống nhất riêng trước khi sử dụng. Việc đăng ký không đồng nghĩa với cam kết về thứ hạng, lượt khách hoặc doanh thu.', 'Service plans, fees and specific benefits will be discussed and agreed separately before use. Applying does not guarantee ranking, visitor numbers or revenue.')],
    [text('05. Sử dụng thông tin liên hệ', '05. Use of contact information'), text('Thông tin trong hồ sơ được đề nghị sử dụng để đánh giá đăng ký và liên hệ về việc hợp tác. Không nhập dữ liệu nhạy cảm hoặc thông tin khách hàng. Nếu muốn sửa hoặc rút hồ sơ đã gửi, hãy đề nghị qua kênh liên hệ của nhóm phụ trách khi nhận phản hồi.', 'Application information is intended for application review and partnership contact. Do not include sensitive data or customer information. To correct or withdraw a submitted application, contact the team through the channel used in its response.')],
  ]

  function review(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const phone = String(data.phone).trim()
    const digitCount = phone.replace(/\D/g, '').length
    if (!/^\+?[\d\s().-]+$/.test(phone) || digitCount < 9 || digitCount > 15) {
      setError(text('Vui lòng nhập số điện thoại hợp lệ gồm 9–15 chữ số.', 'Please enter a valid phone number with 9–15 digits.'))
      form.elements.namedItem('phone')?.focus()
      return
    }
    if (['businessName', 'address', 'contactName'].some(key => !String(data[key]).trim())) {
      setError(text('Vui lòng điền đầy đủ thông tin, không chỉ khoảng trắng.', 'Please enter complete details, not just spaces.'))
      return
    }
    setApplication({ ...Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value).trim()])), policyVersion, consent: true })
    setError('')
    setStatus('review')
  }

  async function submit() {
    if (!registrationPath || status === 'sending') return
    setError('')
    setStatus('sending')
    try {
      await api.post(registrationPath, application, { skipAuth: true, timeout: 20000 })
      setStatus('sent')
    } catch {
      setError(text('Chưa gửi được hồ sơ. Vui lòng thử lại; thông tin bạn đã nhập vẫn được giữ trên trang.', 'Your application could not be sent. Please retry; your details are still on this page.'))
      setStatus('review')
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(application, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'findgo-partner-application.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <main className="partner-page">
      <div className="partner-nav"><HeroNavbar /></div>
      <section className="partner-intro" aria-labelledby="partner-title">
        <div>
          <p className="partner-eyebrow">FIND&GO FOR PARTNERS</p>
          <h1 id="partner-title">{text('Quán của bạn.', 'Your place.')}<br /><span>{text('Điểm đến tiếp theo.', 'Their next favorite.')}</span></h1>
          <p className="partner-lead">{text('Cùng FIND&GO kết nối không gian của bạn với những người đang tìm kiếm một nơi phù hợp.', 'Connect your space with people looking for a place that fits their moment, together with FIND&GO.')}</p>
          <a className="partner-button" href="#partner-register">{text('Đăng ký hợp tác', 'Become a partner')}<ArrowUpRight size={20} aria-hidden="true" /></a>
          <a className="partner-text-link" href="#partner-policy">{text('Tìm hiểu chính sách', 'Explore our policies')}<ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <aside className="partner-invite">
          <div className="partner-store-icon"><Store size={40} strokeWidth={1.4} aria-hidden="true" /></div>
          <p className="partner-eyebrow">YOUR SPACE. OUR NEXT CHAPTER.</p>
          <h2>{text('Một không gian hay, xứng đáng được tìm thấy.', 'A great space deserves to be discovered.')}</h2>
          <p>{text('Cà phê · Nhà hàng · Trà & đồ uống · Chuỗi F&B', 'Cafés · Restaurants · Tea & beverages · F&B chains')}</p>
          <span className="partner-invite-tag"><span />{text('Chào đón đối tác F&B', 'Open to F&B partnerships')}</span>
        </aside>
      </section>
      <section className="partner-benefits" aria-label={text('Cơ hội hợp tác', 'Partnership opportunities')}>
        {benefits.map(([Icon, title, body]) => <article key={title}><Icon size={24} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <div className="partner-application-layout">
        <section id="partner-register" className="partner-form-card" aria-labelledby="partner-form-title">
          <p className="partner-eyebrow">LET’S GROW TOGETHER</p>
          <h2 id="partner-form-title">{text('Bắt đầu từ một kết nối.', 'Start with a connection.')}</h2>
          <p className="partner-section-description">{text('Chia sẻ đôi nét về doanh nghiệp và nhu cầu hợp tác của bạn.', 'Tell us a little about your business and how you would like to collaborate.')}</p>
          <form onSubmit={review} className="partner-form" hidden={status !== 'editing'}>
            <p className="partner-required">{text('* Thông tin bắt buộc', '* Required fields')}</p>
            <div className="partner-fields">
              <label>{text('Tên doanh nghiệp / thương hiệu *', 'Business / brand name *')}<input name="businessName" required maxLength={160} autoComplete="organization" placeholder={text('Ví dụ: Cà phê Mộc', 'e.g. Moc Coffee')} /></label>
              <label>{text('Loại hình kinh doanh *', 'Business type *')}<select name="businessType" required defaultValue=""><option value="" disabled>{text('Chọn loại hình', 'Select a type')}</option><option value="cafe">{text('Quán cà phê', 'Café')}</option><option value="restaurant">{text('Nhà hàng / Quán ăn', 'Restaurant')}</option><option value="beverage">{text('Trà / Đồ uống', 'Tea / Beverages')}</option><option value="chain">{text('Chuỗi F&B', 'F&B chain')}</option><option value="other">{text('Khác', 'Other')}</option></select></label>
              <label className="partner-full">{text('Địa chỉ kinh doanh *', 'Business address *')}<input name="address" required maxLength={300} autoComplete="street-address" placeholder={text('Số nhà, đường, phường/xã, tỉnh/thành phố', 'Street address, ward, city / province')} /></label>
              <label>{text('Người liên hệ *', 'Contact person *')}<input name="contactName" required maxLength={100} autoComplete="name" /></label>
              <label>{text('Số điện thoại *', 'Phone number *')}<input name="phone" type="tel" required autoComplete="tel" maxLength={24} /></label>
              <label className="partner-full">{text('Email liên hệ *', 'Contact email *')}<input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="you@company.com" /></label>
              <label className="partner-full">{text('Website / Trang mạng xã hội', 'Website / Social page')}<input name="website" type="url" maxLength={500} placeholder="https://" /></label>
              <label className="partner-full">{text('Bạn mong muốn hợp tác như thế nào?', 'How would you like to collaborate?')}<textarea name="message" rows={4} maxLength={2000} placeholder={text('Giới thiệu quán, số chi nhánh hoặc nhu cầu của bạn…', 'Introduce your venue, number of locations or partnership goals…')} /></label>
            </div>
            <label className="partner-consent"><input type="checkbox" name="consent" required /><span>{text('Tôi đã đọc ', 'I have read the ')}<a href="#partner-policy">{text('chính sách hợp tác dự kiến', 'proposed partnership policies')}</a>{text(' và đồng ý sử dụng thông tin trong hồ sơ để xem xét, liên hệ về đăng ký hợp tác.', ' and agree to the use of my application details for partnership review and contact.')}</span></label>
            {error && <p className="partner-error" role="alert">{error}</p>}
            <button className="partner-button" type="submit">{text('Xem lại hồ sơ đăng ký', 'Review application')}<ArrowUpRight size={18} aria-hidden="true" /></button>
            <p className="partner-small">{text('Hồ sơ chỉ được gửi sau khi bạn xem lại và xác nhận.', 'Your application is only sent after you review and confirm.')}</p>
          </form>
          {status !== 'editing' && <div className="partner-review" ref={resultRef} tabIndex={-1} aria-busy={status === 'sending'}>
            <h3><Check size={22} aria-hidden="true" />{status === 'sent' ? text('Đã gửi hồ sơ đăng ký', 'Application sent') : text('Kiểm tra thông tin của bạn', 'Review your details')}</h3>
            <dl>{[['businessName', text('Doanh nghiệp', 'Business')], ['businessType', text('Loại hình', 'Business type')], ['address', text('Địa chỉ', 'Address')], ['contactName', text('Người liên hệ', 'Contact')], ['phone', text('Điện thoại', 'Phone')], ['email', 'Email'], ['website', 'Website'], ['message', text('Nhu cầu hợp tác', 'Partnership goals')]].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{application[key] || '—'}</dd></div>)}</dl>
            {status === 'sent' ? <p role="status">{text('Hồ sơ đã được chuyển đến hệ thống tiếp nhận để xem xét. Đăng ký chưa đồng nghĩa với việc được duyệt làm đối tác.', 'Your application has been sent for review. Submission does not mean your partnership has been approved.')}</p> : <>
              {!registrationPath && <p className="partner-notice">{text('Kênh tiếp nhận đăng ký trực tuyến đang được chuẩn bị. Hồ sơ chưa được gửi đến FIND&GO. Bạn có thể tải bản hồ sơ về để lưu lại.', 'Online application intake is being prepared. Your application has not been sent to FIND&GO. You can download a copy for your records.')}</p>}
              {error && <p className="partner-error" role="alert">{error}</p>}
              <div className="partner-review-actions"><button type="button" className="partner-edit" disabled={status === 'sending'} onClick={() => { setStatus('editing'); setError('') }}>{text('Chỉnh sửa', 'Edit details')}</button>{registrationPath ? <button type="button" className="partner-button" disabled={status === 'sending'} onClick={submit}>{status === 'sending' ? text('Đang gửi…', 'Sending…') : text('Xác nhận gửi đăng ký', 'Submit application')}<ArrowUpRight size={18} aria-hidden="true" /></button> : <button type="button" className="partner-button" onClick={download}><Download size={18} aria-hidden="true" />{text('Tải hồ sơ', 'Download application')}</button>}</div>
            </>}
          </div>}
        </section>
        <aside id="partner-policy" className="partner-policies" aria-labelledby="partner-policy-title">
          <ShieldCheck size={28} aria-hidden="true" />
          <h2 id="partner-policy-title">{text('Minh bạch từ bước đầu.', 'Clarity from day one.')}</h2>
          <p className="partner-section-description">{text('Chính sách hợp tác dự kiến · Vui lòng đọc trước khi đăng ký. Điều khoản chính thức sẽ được thống nhất khi triển khai hợp tác.', 'Proposed partnership policies · Please read before applying. Final terms will be agreed when the partnership is established.')}</p>
          {policies.map(([title, body], index) => <details key={index} open={index === 0 ? true : undefined}><summary>{title}</summary><p>{body}</p></details>)}
          <p className="partner-small">{text('Đăng ký không yêu cầu thanh toán hoặc thông tin thẻ ngân hàng.', 'No payment or bank card information is required to apply.')}</p>
        </aside>
      </div>
      <footer className="partner-footer"><span>© 2026 FIND&GO</span><span>{text('Cùng nhau tạo nên những điểm đến đáng nhớ.', 'Creating memorable destinations, together.')}</span></footer>
    </main>
  )
}
