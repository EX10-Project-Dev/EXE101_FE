import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import { MOCK_VENUES } from '../data/mockVenues'
import { useLanguage } from '../contexts/LanguageContext'
import Reveal from './Reveal'

const MARQUEE_TAGLINES_VI = {
  'venue-1': 'Làm việc & Chạy deadline',
  'venue-2': 'Hẹn hò lãng mạn',
  'venue-3': 'Check-in & Thư giãn',
  'venue-4': 'Không gian mở thoáng đãng',
  'venue-5': 'Tụ tập nhóm & Giao lưu',
  'venue-6': 'Bánh ngọt & Matcha Nhật'
}

const MARQUEE_TAGLINES_EN = {
  'venue-1': 'Work & Study Haven',
  'venue-2': 'Romantic Date Spot',
  'venue-3': 'Aesthetic & Chill',
  'venue-4': 'Spacious Open Air',
  'venue-5': 'Group Gathering & Drinks',
  'venue-6': 'Japanese Matcha & Sweets'
}

export default function ScoreMarquee({ onSelectCard, venues }) {
  const { isEn, tx } = useLanguage()
  const track = useRef(null)
  const inView = useInView(track)
  const reducedMotion = useReducedMotion()

  const venueList = venues?.length > 0 ? venues : MOCK_VENUES
  const MARQUEE_DATA = venueList.map((v) => ({
    ...v,
    marqueeLabel: isEn ? (MARQUEE_TAGLINES_EN[v.id] || v.tagline || v.category) : (MARQUEE_TAGLINES_VI[v.id] || v.tagline || v.category)
  }))

  const INFINITE_ITEMS = [...MARQUEE_DATA, ...MARQUEE_DATA]
  // Adjust duration proportionally to number of items so speed stays comfortably slow (approx 3.5s - 4s per item)
  const marqueeDuration = Math.max(35, MARQUEE_DATA.length * 3.8)

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        py: 3.5,
        background: 'transparent',
        position: 'relative',
        '@keyframes marqueeLeft': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }}
    >
      {/* Section label */}
      <Box sx={{ textAlign: 'center', mb: 2.5, px: 2 }}>
        <Typography
          component={Reveal}
          distance={16}
          variant="caption"
          sx={{
            color: '#C2410C',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            fontSize: '0.8rem',
            lineHeight: 1.7,
            textWrap: 'balance'
          }}
        >
          {isEn
            ? 'FEATURED VENUES — CLICK ANY CARD TO VIEW FULL DETAILS'
            : 'Địa điểm nổi bật — Bấm vào quán bất kỳ để xem trọn vẹn thông tin'}
        </Typography>
      </Box>

      {/* Marquee Wrapper with fading edge masks */}
      <Box
        ref={track}
        sx={{
          width: '100%',
          overflowX: reducedMotion ? 'auto' : 'hidden',
          position: 'relative',
          maskImage: {
            xs: 'none',
            sm: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          },
          WebkitMaskImage: {
            xs: 'none',
            sm: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          }
        }}
      >
        <Box
          component={Reveal}
          distance={16}
          delay={0.12}
        >
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            width: 'max-content',
            animation: `marqueeLeft ${marqueeDuration}s linear infinite`,
            animationPlayState: inView && !reducedMotion ? 'running' : 'paused',
            py: 1,
            px: 1,
            willChange: 'transform',
            '&:hover': {
              animationPlayState: 'paused'
            },
            '&:focus-within': {
              animationPlayState: 'paused'
            }
          }}
        >
          {(reducedMotion ? MARQUEE_DATA : INFINITE_ITEMS).map((item, idx) => (
            <Box
              key={`${item.id}-${idx}`}
              onClick={() => onSelectCard && onSelectCard(item)}
              title={`Nhấp để xem chi tiết ${item.name}`}
              sx={{
                flexShrink: 0,
                width: { xs: 236, sm: 272 },
                height: 196,
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(120, 60, 20, 0.10)',
                border: '1px solid #FDE8CC',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: '#FF7A1A',
                  boxShadow: '0 16px 36px rgba(234, 88, 12, 0.22)'
                }
              }}
            >
              <Box
                component="img"
                src={item.images?.[0]}
                alt={item.name}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(18, 8, 3, 0.92) 0%, rgba(18, 8, 3, 0.25) 55%, transparent 100%)'
                }}
              />

              {/* Score badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.2,
                  py: 0.45,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    color: '#1C0A00',
                    lineHeight: 1
                  }}
                >
                  {item.matchScore}
                </Typography>
              </Box>

              {/* Category chip top left */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  px: 1,
                  py: 0.3,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(18, 8, 3, 0.75)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  color: '#FED7AA',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}
              >
                {tx(item.category)}
              </Box>

              {/* Bottom text */}
              <Box sx={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#FF8A3D',
                    fontWeight: 800,
                    fontSize: '0.73rem',
                    mb: 0.3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {item.marqueeLabel}
                </Typography>
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.97rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        </Box>
      </Box>
    </Box>
  )
}
