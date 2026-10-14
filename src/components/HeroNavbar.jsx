import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo-small.webp'
import BrandText from './BrandText'

export default function HeroNavbar() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
      <header className="hero-top">
        <a className="hero-brand" href="#" aria-label="FIND&GO">
          <img src={logo} alt="" width="44" height="44" />
          <span><BrandText /></span>
        </a>
        <div className="hero-actions">
          <button className="hero-language" onClick={toggleLanguage} aria-label={t('switchLangTooltip')}>
            <span className={language === 'vi' ? 'is-active' : ''}>VI</span>
            <span className="hero-language-divider" aria-hidden="true">/</span>
            <span className={language === 'en' ? 'is-active' : ''}>EN</span>
          </button>
          <a className="hero-secondary" href="#venue-search">
            {t('findVenuesCTA')}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>
  )
}
