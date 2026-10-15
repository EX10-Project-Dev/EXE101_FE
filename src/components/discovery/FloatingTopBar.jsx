import { useLanguage } from '../../contexts/LanguageContext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, MapPin } from 'lucide-react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import BrandText from '../BrandText'

export default function FloatingTopBar({ user, onLogout, onRecenter, savedOnly, onSavedOnly }) {
  const { tx, toggleLanguage, t, isEn } = useLanguage()
  const [userAnchor, setUserAnchor] = useState(null)
  const name = user?.name || user?.displayName || user?.fullName || user?.email?.split('@')[0] || tx('Your account')
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const avatar = user?.avatarUrl || user?.picture

  return (
    <header className="dg-topbar">
      <div className="dg-map-toolbar">
        <span className="dg-location"><MapPin size={15} aria-hidden="true" /><span>{tx('Ho Chi Minh City')}{user?.isDemo ? (isEn ? ' · Demo map' : ' · Bản đồ demo') : ''}</span></span>
        <div className="dg-map-toolbar-actions"><button type="button" className="dg-top-recenter" onClick={onRecenter} aria-label={tx('Recenter')}><Compass size={15} aria-hidden="true" /><span>{isEn ? 'Recenter' : 'Trung tâm'}</span></button>
      <button type="button" className="dg-user-trigger" onClick={(event) => setUserAnchor(event.currentTarget)} aria-label={tx('Open account menu for {name}', { name })} aria-haspopup="menu" aria-expanded={Boolean(userAnchor)}>
        <span className="dg-avatar">{avatar ? <img src={avatar} alt="" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = 'none' }} /> : null}<span>{initials}</span></span>
      </button>
        </div>
      </div>
      <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)} slotProps={{ paper: { className: 'dg-user-menu' } }}>
        <Link to="/" className="dg-menu-brand" onClick={() => setUserAnchor(null)}><BrandText /></Link>
        <div className="dg-user-info"><strong>{name}</strong>{user?.email && <span>{user.email}</span>}</div>
        <MenuItem selected={!savedOnly} onClick={() => { onSavedOnly(false); setUserAnchor(null) }}>{tx('Discover')}</MenuItem>
        <MenuItem selected={savedOnly} onClick={() => { onSavedOnly(true); setUserAnchor(null) }}>{tx('Saved places')}</MenuItem>
        <MenuItem onClick={toggleLanguage}>{t('switchLangTooltip')}</MenuItem>
        <MenuItem onClick={onLogout}>{tx('Log out')}</MenuItem>
      </Menu>
    </header>
  )
}
