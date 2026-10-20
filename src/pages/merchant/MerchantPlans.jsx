import { useState } from 'react'
import { Check, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DemoNotice, PageHeading } from '../../components/merchant/MerchantUi'
import { merchantPlans } from '../../data/merchantDemo'

export default function MerchantPlans() {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <PageHeading
        eyebrow="ĐỒNG HÀNH CÙNG KHÔNG GIAN CỦA BẠN"
        title="Một khởi đầu, nhiều tiềm năng"
        description="Các gói dịch vụ đề xuất, đang được nghiên cứu cùng đối tác."
      />
      <DemoNotice />
      <div className="mp-pricing-grid">
        {merchantPlans.map((plan, index) => (
          <article className={`mp-pricing-card${index === 1 ? ' featured' : ''}`} key={plan.name}>
            {index === 1 && <span className="mp-plan-ribbon">CHƯƠNG TRÌNH THỬ NGHIỆM</span>}
            <p className="mp-eyebrow">{plan.name}</p>
            <h2>{plan.name}</h2>
            <p>{plan.subtitle}</p>
            <div className="mp-price">
              Chưa công bố<small>Giá dự kiến · chờ kiểm chứng mô hình</small>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={17} />
                  {feature}
                </li>
              ))}
            </ul>
            {index === 0 ? (
              <Link className="mp-button secondary" to="/merchant/venues">
                {plan.cta}
                <ArrowUpRight size={16} />
              </Link>
            ) : (
              <button
                className={`mp-button${index === 1 ? '' : ' secondary'}`}
                onClick={() => setSelected(plan.name)}
              >
                {plan.cta}
                <ArrowUpRight size={16} />
              </button>
            )}
          </article>
        ))}
      </div>
      {selected && (
        <div className="mp-note" role="status">
          <strong>Gói {selected} · Đang nghiên cứu</strong>
          <p>
            Đây là đề xuất phục vụ Checkpoint 3. Đăng ký và kích hoạt gói chưa khả dụng; chưa có yêu
            cầu hay thanh toán nào được gửi.
          </p>
          <button className="mp-text-button" onClick={() => setSelected(null)}>
            Đóng thông tin
          </button>
        </div>
      )}
      <div className="mp-pricing-footnote">
        <h2>Cùng xây một nền tảng hữu ích hơn</h2>
        <p>
          Các tính năng và mức giá sẽ được điều chỉnh sau khi kiểm chứng nhu cầu thực tế. Bản trình
          diễn hiện chưa hỗ trợ đăng ký hoặc thanh toán.
        </p>
      </div>
    </>
  )
}
