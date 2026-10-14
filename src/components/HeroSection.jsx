// @ts-check
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo-small.webp'

export default function HeroSection() {
  const { language, toggleLanguage, t, isEn } = useLanguage()

  return (
    <section className="hero" aria-labelledby="hero-title">
      <header className="hero-top">
        <a className="hero-brand" href="#" aria-label="Seekers">
          <img src={logo} alt="" width="44" height="44" />
          <span>SEEKERS<span className="hero-brand-dot">.</span></span>
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

      <div className="hero-stage">
        <h1 id="hero-title" className="hero-artwork">
          <img
            src={`${import.meta.env.BASE_URL}poster%20ngangtrongsuot.png`}
            alt="DISCOVER THE PATH"
            width="2245"
            height="1587"
            fetchPriority="high"
            decoding="async"
          />
        </h1>
        <p className="hero-subtitle">
          {isEn
            ? 'Context-aware place recommendations for exactly what you need right now.'
            : 'Gợi ý địa điểm theo ngữ cảnh, phù hợp với điều bạn cần ngay lúc này.'}
        </p>
        <a className="hero-primary" href="#venue-search">
          {t('getStartedCTA')}<ArrowUpRight size={22} aria-hidden="true" />
        </a>
      </div>

    </section>
  )
}
