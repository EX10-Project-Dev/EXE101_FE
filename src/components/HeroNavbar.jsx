import { ArrowUpRight } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import useAuth from '../hooks/useAuth'
import logo from '../assets/logo-small.webp'
import BrandText from './BrandText'
import { getAccountHome } from '../utils/accountNavigation'

export default function HeroNavbar() {
  const { language, toggleLanguage, t } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const label = isAuthenticated
    ? (user?.fullName || user?.name || t('findVenuesCTA'))
    : t('findVenuesCTA')

  return (
    <header className="hero-top">
      <Link className="hero-brand" to="/" aria-label="FIND&GO">
        <img src={logo} alt="" width="44" height="44" />
        <span><BrandText /></span>
      </Link>
      <div className="hero-actions">
        <button className="hero-language" onClick={toggleLanguage} aria-label={t('switchLangTooltip')}>
          <span className={language === 'vi' ? 'is-active' : ''}>VI</span>
          <span className="hero-language-divider" aria-hidden="true">/</span>
          <span className={language === 'en' ? 'is-active' : ''}>EN</span>
        </button>
        <NavLink to="/partners" className="hero-partners">{language === 'en' ? 'For partners' : 'Cho đối tác'}</NavLink>
        <Link className="hero-secondary" to={isAuthenticated ? getAccountHome(user) : '/login'}>
          {label}<ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
