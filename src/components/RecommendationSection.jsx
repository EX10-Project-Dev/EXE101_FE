import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Button
} from '@mui/material'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { MOCK_VENUES } from '../data/mockVenues'

const INTENTS_DATA = [
  {
    id: 'work',
    tabVi: 'Cà phê làm việc',
    tabEn: 'Focus & Work',
    score: '9.8 / 10',
    scoreColor: '#22C55E',
    descriptionVi: (
      <>
        Quán cà phê này{' '}
        <strong>
          hoàn hảo cho công việc với Wi-Fi tốc độ cao, ổ cắm điện đầy đủ tại từng bàn
        </strong>{' '}
        và <strong>không gian yên tĩnh tối đa</strong>. Bàn gỗ rộng rãi cho phép bạn thoải mái để laptop và tài liệu.{' '}
        <strong>Lựa chọn hàng đầu cho freelancer và người chạy deadline.</strong>
      </>
    ),
    descriptionEn: (
      <>
        This specialty café is{' '}
        <strong>
          optimized for focused deep work with high-speed Wi-Fi and power outlets at every seat
        </strong>
        . Spacious wooden tables comfortably fit your laptop and notes.{' '}
        <strong>Top choice for remote workers and students meeting deadlines.</strong>
      </>
    ),
    tagsVi: [
      { label: 'Bàn rộng & ổ cắm' },
      { label: 'Yên tĩnh tuyệt đối' },
      { label: 'Wi-Fi cáp quang' }
    ],
    tagsEn: [
      { label: 'Spacious & Outlets' },
      { label: 'Dead Quiet' },
      { label: 'Fiber Wi-Fi' }
    ],
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    venueId: 'venue-1'
  },
  {
    id: 'dog',
    tabVi: 'Mang thú cưng',
    tabEn: 'Pet Friendly',
    score: '6.5 / 10',
    scoreColor: '#EAB308',
    descriptionVi: (
      <>
        Quán cà phê ấm cúng này{' '}
        <strong>
          không phù hợp mang chó mèo vì tiếng sủa có thể phá vỡ bầu không khí tĩnh lặng
        </strong>
        . Toàn bộ chỗ ngồi máy lạnh bên trong được tối ưu cho người cần yên tĩnh.{' '}
        <strong>Tốt nhất bạn nên để cún cưng ở nhà để có trải nghiệm thư thái nhất.</strong>
      </>
    ),
    descriptionEn: (
      <>
        This cozy space is{' '}
        <strong>
          not recommended for pets as barking could disrupt the quiet study ambiance
        </strong>
        . All indoor air-conditioned seating is focused on deep study.{' '}
        <strong>Best to leave furry friends at home for the most peaceful experience.</strong>
      </>
    ),
    tagsVi: [
      { label: 'Không tối ưu thú cưng' },
      { label: 'Phòng kín cần yên tĩnh' },
      { label: 'Thư giãn yên bình' }
    ],
    tagsEn: [
      { label: 'Not Pet Ideal' },
      { label: 'Quiet Indoor' },
      { label: 'Peaceful Focus' }
    ],
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    venueId: 'venue-1'
  },
  {
    id: 'date',
    tabVi: 'Hẹn hò đầu tiên',
    tabEn: 'First Date',
    score: '8.2 / 10',
    scoreColor: '#FF7A1A',
    descriptionVi: (
      <>
        Ánh sáng vàng ấm và{' '}
        <strong>kiến trúc gác xép cổ điển tạo cảm giác thân mật, tinh tế</strong>. Cà phê Specialty pha thủ công và bánh ngọt nướng trong ngày là{' '}
        <strong>chủ đề mở đầu câu chuyện rất tự nhiên cho hai người</strong>.{' '}
        <strong>Rất thích hợp cho buổi hẹn cà phê nhẹ nhàng buổi tối.</strong>
      </>
    ),
    descriptionEn: (
      <>
        Warm amber lighting and{' '}
        <strong>heritage attic aesthetics create an intimate, elegant date atmosphere</strong>. Specialty coffee and fresh pastries serve as{' '}
        <strong>effortless conversation starters</strong>.{' '}
        <strong>Ideal for relaxed evening dates.</strong>
      </>
    ),
    tagsVi: [
      { label: 'Không gian ấm cúng' },
      { label: 'Cà phê & Bánh ngọt' },
      { label: 'Hợp buổi tối' }
    ],
    tagsEn: [
      { label: 'Cozy Ambiance' },
      { label: 'Coffee & Treats' },
      { label: 'Evening Friendly' }
    ],
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    venueId: 'venue-1'
  }
]

export default function RecommendationSection({ onOpenDetail }) {
  const { isDark } = useTheme()
  const { t, isEn } = useLanguage()
  const [activeIntentIndex, setActiveIntentIndex] = useState(1)

  const currentIntent = INTENTS_DATA[activeIntentIndex]
  const currentVenue =
    MOCK_VENUES.find((v) => v.id === currentIntent.venueId) || MOCK_VENUES[0]

  const handleOpenGoogleMaps = () => {
    const url =
      currentVenue.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        currentVenue.name + ' ' + currentVenue.address
      )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Box
      id="recommendations-section"
      sx={{
        py: { xs: 5, md: 7 },
        background: isDark
          ? 'linear-gradient(180deg, #150A05 0%, #1A0D07 50%, #120803 100%)'
          : 'linear-gradient(180deg, #FFF4EB 0%, #FFE9D6 50%, #FFF2E6 100%)',
        borderTop: isDark ? '1px solid #28140B' : '1px solid #FDBA74',
        borderBottom: isDark ? '1px solid #28140B' : '1px solid #FDBA74',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Form nhỏ gọn với maxWidth="md" (~900px) */}
      <Container maxWidth="md">
        {/* 1. Header nhỏ gọn tinh tế */}
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-1px',
              fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.6rem' },
              lineHeight: 1.12,
              color: isDark ? '#FFFFFF' : '#1C0A00',
              textTransform: 'uppercase',
              mb: 1.2
            }}
          >
            ONE PLACE. THREE DIFFERENT ANSWERS.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#C7BEB7' : '#57534E',
              fontSize: { xs: '0.88rem', sm: '0.98rem' },
              maxWidth: 640,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {isEn
              ? 'The exact same place: perfect for work, not ideal with pets, and solid for a first date. Pick an occasion to watch the match score and rationale dynamically adapt.'
              : 'Cùng một quán: hoàn hảo để làm việc, nhưng không hợp mang thú cưng, và vừa đủ ổn cho buổi hẹn đầu. Chọn nhu cầu để thấy điểm số và lý do thay đổi tức thì.'}
          </Typography>
        </Box>

        {/* 2. Three Intent Tabs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 3 },
            flexWrap: 'wrap',
            mb: 3.5,
            borderBottom: isDark ? '1px solid #2E170C' : '1px solid #FDE8CC',
            pb: 1.2
          }}
        >
          {INTENTS_DATA.map((intent, idx) => {
            const isActive = activeIntentIndex === idx
            return (
              <Box
                key={intent.id}
                onClick={() => setActiveIntentIndex(idx)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.8,
                  px: { xs: 1, sm: 1.5 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: isActive ? '2.5px solid #FF7A1A' : '2.5px solid transparent',
                  mb: '-11px',
                  '&:hover': { color: '#FF7A1A' }
                }}
              >
                <Typography
                  sx={{
                    fontWeight: isActive ? 800 : 600,
                    fontSize: { xs: '0.82rem', sm: '0.92rem' },
                    color: isActive ? '#FF7A1A' : isDark ? '#D6CDC6' : '#57534E',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isEn ? intent.tabEn : intent.tabVi}
                </Typography>
              </Box>
            )
          })}
        </Box>

        {/* 3. The Interactive Showcase Card: Bố cục NẰM NGANG so với ảnh từ màn hình sm (>=600px) */}
        <Box
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: isDark ? '#22120B' : '#FFFFFF',
            border: isDark ? '1.5px solid #3E1F12' : '1px solid #FDE8CC',
            boxShadow: isDark
              ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(249, 115, 22, 0.12)'
              : '0 16px 40px rgba(120, 53, 15, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Đảm bảo NẰM NGANG
            alignItems: 'stretch',
            minHeight: { sm: 360, md: 380 }
          }}
        >
          {/* CỘT TRÁI: Hình ảnh quán (chiếm ~44% bề ngang) */}
          <Box
            sx={{
              flex: { xs: 'none', sm: '0 0 44%' },
              position: 'relative',
              minHeight: { xs: 200, sm: 'auto' },
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={currentIntent.image}
              alt={currentVenue.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Tag tên quán ở góc dưới ảnh */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                px: 1.4,
                py: 0.5,
                borderRadius: '10px',
                backgroundColor: 'rgba(20, 9, 4, 0.82)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(87, 42, 22, 0.5)',
                color: '#ffffff'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#FED7AA',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  display: 'block',
                  textTransform: 'uppercase'
                }}
              >
                Quán mẫu
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                {currentVenue.name}
              </Typography>
            </Box>
          </Box>

          {/* CỘT PHẢI: Chi tiết quán NẰM NGANG bên cạnh ảnh (chiếm ~56% còn lại) */}
          <Box
            sx={{
              flex: '1 1 auto',
              p: { xs: 2.5, sm: 3, md: 3.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: isDark ? '#22120B' : '#F8FAFC'
            }}
          >
            <Box>
              {/* Match Score Line */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: currentIntent.scoreColor,
                      fontWeight: 900,
                      fontSize: '1.15rem',
                      mr: 0.5
                    }}
                  >
                    {currentIntent.score}
                  </Box>
                  {isEn ? 'match for' : 'cho nhu cầu'}
                </Typography>
              </Box>

              {/* Intent Title */}
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.25rem', sm: '1.45rem' },
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  mb: 1.5,
                  lineHeight: 1.2
                }}
              >
                {isEn ? currentIntent.tabEn : currentIntent.tabVi}
              </Typography>

              {/* Dynamic Evidence Description */}
              <Typography
                sx={{
                  color: isDark ? '#D6CDC6' : '#334155',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  mb: 2,
                  '& strong': {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontWeight: 800
                  }
                }}
              >
                {isEn ? currentIntent.descriptionEn : currentIntent.descriptionVi}
              </Typography>
            </Box>

            {/* Bottom Tags & Buttons */}
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.2 }}>
                {(isEn ? currentIntent.tagsEn : currentIntent.tagsVi).map((tag, idx) => (
                  <Chip
                    key={idx}
                    size="small"
                    label={tag.label}
                    sx={{
                      borderRadius: '16px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      backgroundColor: isDark ? '#2C170E' : '#FFFFFF',
                      color: isDark ? '#E5DDD7' : '#1E293B',
                      border: isDark ? '1px solid #482516' : '1px solid #E2E8F0',
                      py: 1.8
                    }}
                  />
                ))}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.2,
                  pt: 1.8,
                  borderTop: isDark ? '1px solid #331A0F' : '1px solid #E2E8F0',
                  flexWrap: 'wrap'
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onOpenDetail && onOpenDetail(currentVenue)}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    px: 1.8,
                    py: 0.7,
                    borderColor: isDark ? '#4D2615' : '#CBD5E1',
                    color: isDark ? '#E5DDD7' : '#334155',
                    backgroundColor: isDark ? '#25130A' : '#FFFFFF',
                    '&:hover': {
                      borderColor: '#FF7A1A',
                      color: '#FF7A1A',
                      backgroundColor: isDark ? '#30180D' : '#FFF7ED'
                    }
                  }}
                >
                  {t('viewDetails')}
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenGoogleMaps}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    px: 2,
                    py: 0.7,
                    background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
                    boxShadow: '0 3px 12px rgba(249, 115, 22, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)'
                    }
                  }}
                >
                  {isEn ? 'Open Google Maps' : 'Mở Google Maps'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
