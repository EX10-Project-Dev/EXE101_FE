import { Box, Typography } from '@mui/material'
import { Sparkles } from 'lucide-react'
import { MOCK_VENUES } from '../data/mockVenues'
import { useTheme } from '../contexts/ThemeContext'

const MARQUEE_TAGLINES = {
  'venue-1': 'Làm việc & Chạy deadline',
  'venue-2': 'Hẹn hò lãng mạn',
  'venue-3': 'Check-in & Thư giãn',
  'venue-4': 'Không gian mở thoáng đãng',
  'venue-5': 'Tụ tập nhóm & Giao lưu',
  'venue-6': 'Bánh ngọt & Matcha Nhật'
}

const MARQUEE_DATA = MOCK_VENUES.map((v) => ({
  ...v,
  marqueeLabel: MARQUEE_TAGLINES[v.id] || v.category
}))

const INFINITE_ITEMS = [...MARQUEE_DATA, ...MARQUEE_DATA]

export default function ScoreMarquee({ onSelectCard }) {
  const { isDark } = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        py: 3.5,
        background: isDark
          ? 'linear-gradient(180deg, #150A05 0%, #1A0D07 50%, #150A05 100%)'
          : 'linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)',
        borderTop: isDark ? '1px solid #28140B' : '1px solid #FDE8CC',
        borderBottom: isDark ? '1px solid #28140B' : '1px solid #FDE8CC',
        position: 'relative',
        '@keyframes marqueeLeft': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }}
    >
      {/* Section label */}
      <Box sx={{ textAlign: 'center', mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: isDark ? '#FF7A1A' : '#C2410C',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.72rem'
          }}
        >
          Địa điểm nổi bật — Bấm vào quán bất kỳ để xem trọn vẹn thông tin
        </Typography>
      </Box>

      {/* Marquee Wrapper with fading edge masks */}
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
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
          sx={{
            display: 'flex',
            gap: 2.5,
            width: 'max-content',
            animation: 'marqueeLeft 28s linear infinite',
            py: 1,
            px: 1,
            willChange: 'transform',
            '&:hover': {
              animationPlayState: 'paused'
            }
          }}
        >
          {INFINITE_ITEMS.map((item, idx) => (
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
                boxShadow: isDark
                  ? '0 8px 24px rgba(0, 0, 0, 0.5)'
                  : '0 6px 24px rgba(120, 60, 20, 0.10)',
                border: isDark ? '1px solid #381C0F' : '1px solid #FDE8CC',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  borderColor: '#FF7A1A',
                  boxShadow: isDark
                    ? '0 16px 36px rgba(249, 115, 22, 0.35)'
                    : '0 16px 36px rgba(234, 88, 12, 0.22)'
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
                  gap: 0.5,
                  px: 1.2,
                  py: 0.45,
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(28, 13, 7, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                  border: isDark ? '1px solid #4D2615' : 'none',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                <Sparkles size={13} color="#FF7A1A" />
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    color: isDark ? '#FFFFFF' : '#1C0A00',
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
                  border: isDark ? '1px solid rgba(77, 38, 21, 0.6)' : 'none',
                  color: '#FED7AA',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}
              >
                {item.category}
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
  )
}
