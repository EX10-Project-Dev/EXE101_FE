import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import {
  LayoutDashboard,
  Store,
  Megaphone,
  ChartNoAxesCombined,
  Menu,
  ArrowUpRight,
  X,
  FlaskConical
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import BrandText from '../../components/BrandText'
import logo from '../../assets/logo-small.webp'
import { createDemoCampaigns } from '../../data/merchantDemo'
import './merchant.css'

const navigation = [
  { to: '/merchant', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/merchant/venues', label: 'Địa điểm của tôi', icon: Store },
  { to: '/merchant/campaigns', label: 'Chiến dịch', icon: Megaphone },
  { to: '/merchant/analytics', label: 'Phân tích & nhu cầu', icon: ChartNoAxesCombined }
]

function Sidebar({ onNavigate }) {
  return (
    <>
      <Link to="/merchant" className="mp-brand" onClick={onNavigate}>
        <img src={logo} alt="" />
        <span>
          <BrandText />
          <small>DÀNH CHO ĐỐI TÁC</small>
        </span>
      </Link>
      <p className="mp-nav-caption">KHÔNG GIAN QUẢN LÝ</p>
      <nav aria-label="Điều hướng đối tác">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => `mp-nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mp-sidebar-bottom">
        <div className="mp-pilot">
          <FlaskConical size={21} />
          <strong>Cùng phát triển FIND&GO</strong>
          <p>Khám phá cách kết nối không gian của bạn với cộng đồng sinh viên.</p>
        </div>
        <Link className="mp-back" to="/discover">
          Khám phá FIND&GO <ArrowUpRight size={16} />
        </Link>
      </div>
    </>
  )
}

export default function MerchantLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  // State đặt ở layout để bản nháp vẫn còn khi chuyển trang con.
  // Không ghi localStorage hay gọi API: tải lại trang sẽ khôi phục dữ liệu mẫu.
  const [campaigns, setCampaigns] = useState(createDemoCampaigns)
  const { user } = useAuth()
  const { pathname } = useLocation()
  const currentPage = navigation.find((item) => item.to === pathname)?.label || 'Đối tác'
  const name = user?.fullName || user?.name || 'Đối tác FIND&GO'
  return (
    <div className="mp-shell">
      <a className="mp-skip" href="#merchant-main">
        Đến nội dung chính
      </a>
      <aside className="mp-sidebar">
        <Sidebar />
      </aside>
      {/* Desktop và Drawer dùng chung Sidebar để thứ tự menu luôn đồng nhất.
          Chọn mục trong Drawer sẽ đóng menu, tránh che nội dung trang vừa mở. */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{ paper: { className: 'mp-mobile-drawer', sx: { width: 'min(290px, 90vw)' } } }}
      >
        <button
          className="mp-icon-button mp-close-menu"
          onClick={() => setMenuOpen(false)}
          aria-label="Đóng menu"
        >
          <X size={21} />
        </button>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </Drawer>
      <div className="mp-workspace">
        <header className="mp-topbar">
          <div className="mp-topbar-left">
            <button
              className="mp-icon-button mp-menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Mở menu điều hướng"
              aria-expanded={menuOpen}
            >
              <Menu size={22} />
            </button>
            <span>
              Cổng đối tác <span className="mp-breadcrumb">/ {currentPage}</span>
            </span>
          </div>
          <div className="mp-account">
            <span className="mp-avatar">{name.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{name}</strong>
              <small>Không gian đối tác · MVP</small>
            </div>
          </div>
        </header>
        <main id="merchant-main" className="mp-main">
          <Outlet context={{ campaigns, setCampaigns }} />
        </main>
        <footer className="mp-footer">
          <span>© 2026 FIND&GO · Kết nối đúng không gian.</span>
          <span>Checkpoint 3 · Bản trình diễn</span>
        </footer>
      </div>
    </div>
  )
}
