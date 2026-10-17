import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@mui/material'
import { ArrowUpRight } from 'lucide-react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo-small.webp'
import BrandText from './BrandText'
import Reveal from './Reveal'
import './Footer.css'

function Cityscape({ isEn }) {
  return (
    <svg className="journey-city" viewBox="0 0 1200 350" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="journey-pin" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F97316" /><stop offset="1" stopColor="#EF6B4A" />
        </linearGradient>
        <pattern id="journey-windows" width="24" height="25" patternUnits="userSpaceOnUse">
          <rect x="8" y="8" width="7" height="11" rx="2" fill="#D8BAA5" />
        </pattern>
      </defs>
      {/* A quiet skyline: stepped towers, tube houses, and a Bitexco-inspired silhouette. */}
      <g className="journey-distant" fill="#F0E2D6">
        <path d="M35 254V155h66v99m25 0V120h52v134m29 0V170h78v84M930 254V151h64v103m25 0V110h56v144m27 0V174h75v80" />
        <path d="M782 254V109l28-67 24 67v145z" /><path d="M807 81h52v8h-52z" />
        <path d="M886 254V70h14V35h8v35h16v184z" />
      </g>
      <path d="M0 272C180 247 287 275 430 263S711 247 885 263s206 1 315-9v96H0z" fill="#FFEFE6" />
      <path d="M0 307C180 285 281 307 423 297s294-9 480 7 210-3 297-7" stroke="#E9CBB5" strokeWidth="1.5" />
      <g className="journey-edge" stroke="#C6A68F" strokeWidth="1.5">
        <rect x="57" y="185" width="115" height="83" rx="5" fill="#FAE8DB" />
        <path d="M49 186h131l-14-15H63z" fill="#E9CBB5" />
        <path d="M75 206h22v39H75zm40 0h36v23h-36z" fill="#FFF9F5" />
        <path d="M1072 268V163h76v105" fill="#F7E3D4" />
        <path d="M1067 161h86m-70 19h12v20h-12zm29 0h12v20h-12zm-29 36h12v20h-12zm29 0h12v20h-12z" />
      </g>
      <g className="journey-shop">
        <rect x="345" y="159" width="131" height="111" rx="5" fill="#F8DEC9" stroke="#C6A68F" strokeWidth="1.5" />
        <rect x="356" y="169" width="109" height="24" rx="3" fill="#FFF9F5" />
        <text x="410" y="185" textAnchor="middle" fill="#79543D" fontSize="11" fontWeight="700" letterSpacing="3">CÀ PHÊ</text>
        <path d="M338 202h145l-9-12H347z" fill="#E9A180" />
        <path d="M347 202v10h18v-10m18 0v10h18v-10m18 0v10h18v-10m18 0v10h19v-10" fill="#FFF9F5" />
        <rect x="357" y="221" width="43" height="36" rx="3" fill="#FFF9F5" stroke="#C6A68F" />
        <path d="M414 270v-49h43v49m-22-49v49" stroke="#B98E70" strokeWidth="2" />
        <path d="M378 221v36m-21-18h43" stroke="#D9B99F" />
        <path d="M320 270l5-29h17l5 29z" fill="#E5B491" />
        <path d="M330 242v-28m0 12c-22 0-23-21-23-21 22 0 23 21 23 21m0-5c20 0 22-21 22-21-20 0-22 21-22 21" stroke="#89977B" strokeWidth="5" />
      </g>
      <g className="journey-building">
        <rect x="646" y="136" width="68" height="134" rx="4" fill="#EDD2BC" />
        <rect x="654" y="145" width="52" height="116" fill="url(#journey-windows)" />
        <path d="M640 136h80m-65-9h50" stroke="#C6A68F" strokeWidth="3" />
        <rect x="728" y="188" width="81" height="82" rx="4" fill="#F7E3D4" stroke="#C6A68F" />
        <path d="M740 201h16v21h-16zm30 0h25v21h-25zm-23 69v-35h32v35" fill="#FFF9F5" stroke="#C6A68F" />
      </g>
      <g stroke="#9C9F83" strokeWidth="2">
        <path d="M257 270v-68m-10 68h20M961 270v-92m-9 92h18" />
        <path d="M238 206c0-19 38-19 38 0zM944 182c0-17 34-17 34 0z" fill="#F4DFC3" />
      </g>
      <g className="journey-trees">
        <path d="M204 268v-56m654 56v-54m177 54v-56" stroke="#A09072" strokeWidth="4" />
        <g fill="#B8C0A3"><rect x="182" y="168" width="44" height="66" rx="22" /><rect x="833" y="165" width="50" height="72" rx="25" /><rect x="1014" y="177" width="42" height="57" rx="21" /></g>
        <path d="M204 202v32m654-31v34m177-29v26" stroke="#95A184" strokeWidth="2" />
      </g>
      <g className="journey-edge" stroke="#9C8877" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="548" cy="266" r="9" fill="#FFF9F5" /><circle cx="585" cy="266" r="9" fill="#FFF9F5" />
        <path d="M548 257h25l9-19h-9m-15 11h12m-18 9-4 9h37m-16-11 7 10" />
      </g>
      <path className="journey-route journey-route-desktop" pathLength="1" d="M594 10C630 53 570 77 524 85S282 99 286 156s250 101 287 139 155 37 226 10 116-11 116-61" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <path className="journey-route journey-route-mobile" pathLength="1" d="M594 10C630 53 570 77 524 85S382 99 386 156s150 101 187 139 95 37 146 10 76-11 76-61" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <g className="journey-stop journey-stop-one"><circle cx="524" cy="85" r="9" fill="#FFF9F5" stroke="#F97316" strokeWidth="2" /><circle cx="524" cy="85" r="3" fill="#F97316" /></g>
      <g className="journey-stop journey-stop-two"><circle cx="298" cy="183" r="9" fill="#FFF9F5" stroke="#F97316" strokeWidth="2" /><circle cx="298" cy="183" r="3" fill="#F97316" /></g>
      <g className="journey-stop journey-stop-three"><circle cx="606" cy="316" r="9" fill="#FFF9F5" stroke="#F97316" strokeWidth="2" /><circle cx="606" cy="316" r="3" fill="#F97316" /></g>
      <g className="journey-final-pin">
        <ellipse cx="915" cy="249" rx="23" ry="5" fill="#E5B491" opacity=".4" />
        <path d="M915 245s-27-27-27-46a27 27 0 0 1 54 0c0 19-27 46-27 46z" fill="url(#journey-pin)" />
        <circle cx="915" cy="199" r="11" fill="#FFF9F5" /><path d="m910 200 4 4 7-9" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="861" y="145" width="108" height="24" rx="12" fill="#FFF9F5" stroke="#E9CBB5" />
        <text x="915" y="161" textAnchor="middle" fill="#79543D" fontSize="9" fontWeight="700" letterSpacing="1">{isEn ? 'YOU ARE HERE' : 'BẠN Ở ĐÂY'} ●</text>
      </g>
    </svg>
  )
}

export default function Footer() {
  const { isEn } = useLanguage()
  const footerRef = useRef(null)
  const inView = useInView(footerRef, { once: true, amount: 0.12 })
  const reducedMotion = useReducedMotion()
  const links = [
    ['#venue-search', isEn ? 'Find Places' : 'Tìm địa điểm'],
    ['#discovery-map', isEn ? 'Map' : 'Bản đồ'],
    ['#recommendations-section', isEn ? 'Recommendations' : 'Gợi ý cho bạn'],
  ]
  const followRoute = (event) => {
    const destination = document.getElementById(event.currentTarget.hash.slice(1))
    if (!destination) return
    event.preventDefault()
    window.history.replaceState(null, '', event.currentTarget.hash)
    destination.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    const input = destination.querySelector('input, textarea')
    if (input instanceof HTMLElement) input.focus({ preventScroll: true })
  }

  return (
    <footer ref={footerRef} className={`journey-footer${inView ? ' is-visible' : ''}`} aria-labelledby="journey-title">
      <Container maxWidth="lg">
        <div className="journey-closing">
          <Reveal distance={18}>
            <p className="journey-eyebrow"><span /> {isEn ? 'A LITTLE CURIOSITY. A NEW FAVORITE.' : 'MỘT CHÚT TÒ MÒ. MỘT NƠI THÂN QUEN.'}</p>
            <h2 id="journey-title">{isEn ? <>Your next favorite place<br />might be <span>closer than you think.</span></> : <>Nơi yêu thích tiếp theo<br />có thể <span>gần hơn bạn nghĩ.</span></>}</h2>
            <p className="journey-description">{isEn ? 'Tell FIND&GO what you need, and discover a place that fits the moment.' : 'Cho FIND&GO biết điều bạn cần, và khám phá một nơi phù hợp với khoảnh khắc của bạn.'}</p>
            <Link className="journey-cta" to="/login">{isEn ? 'Find Your Next Place' : 'Tìm điểm đến tiếp theo'}<ArrowUpRight size={20} aria-hidden="true" /></Link>
          </Reveal>
          <div className="journey-coordinate" aria-hidden="true"><span>10.8411° N · 106.8098° E</span><span>HO CHI MINH CITY · VIETNAM</span></div>
        </div>
      </Container>
      <div className="journey-landscape"><Cityscape isEn={isEn} /></div>
      <Container maxWidth="lg">
        <div className="journey-information">
          <a href="#hero-title" onClick={followRoute} className="journey-brand" aria-label="FIND&GO — Discover the Path">
            <img src={logo} width="46" height="46" alt="" loading="lazy" />
            <span><strong><BrandText /></strong><span className="journey-tagline">Discover the Path <span aria-hidden="true">↗</span></span></span>
          </a>
          <nav className="journey-nav" aria-label={isEn ? 'Explore' : 'Khám phá'}>
            <span className="journey-nav-label">{isEn ? 'Explore' : 'Khám phá'}</span>
            <div>{links.map(([href, label]) => <a key={href} href={href} onClick={followRoute}>{label}</a>)}</div>
          </nav>
        </div>
        <div className="journey-bottom"><span>© 2026 FIND&GO</span><span>{isEn ? 'Made for discovering what fits your moment.' : 'Khám phá những nơi phù hợp với khoảnh khắc của bạn.'}</span></div>
      </Container>
    </footer>
  )
}
