// @ts-check
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import HeroNavbar from './HeroNavbar'
import Reveal from './Reveal'

export default function HeroSection() {
  const { t, isEn } = useLanguage()

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroNavbar />
        <div className="hero-stage">
          <Reveal tag="h1" onLoad distance={20} scale={0.96} id="hero-title" className="hero-artwork">
            <img
              src={`${import.meta.env.BASE_URL}poster%20ngangtrongsuot.png`}
              alt="DISCOVER THE PATH"
              width="2245"
              height="1587"
              fetchPriority="high"
              decoding="async"
            />
          </Reveal>
          <Reveal tag="p" onLoad delay={0.12} className="hero-subtitle">
            {isEn
              ? 'Context-aware place recommendations for exactly what you need right now.'
              : 'Gợi ý địa điểm theo ngữ cảnh, phù hợp với điều bạn cần ngay lúc này.'}
          </Reveal>
          <Reveal onLoad delay={0.24} distance={16}>
            <Link className="hero-primary" to="/login">
              {t('getStartedCTA')}<ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
