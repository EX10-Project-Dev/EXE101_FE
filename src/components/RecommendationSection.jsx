import { useState } from 'react'
import { Search, Sparkles, Plug, Volume2, Wifi, PawPrint, Trees, Coffee, Heart, Moon } from 'lucide-react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Button
} from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'
import { MOCK_VENUES } from '../data/mockVenues'
import Reveal from './Reveal'

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

const TAG_ICONS = {
  work: [Plug, Volume2, Wifi],
  dog: [PawPrint, Volume2, Trees],
  date: [Heart, Coffee, Moon]
}

export default function RecommendationSection({ onOpenDetail, onFocusOnMap }) {
  const { t, isEn } = useLanguage()
  const [activeIntentIndex, setActiveIntentIndex] = useState(0)

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
      component="section"
      sx={{
        py: { xs: 5, md: 7 },
        background: 'transparent',
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: '1080px !important' }}>
        {/* 1. Header nhỏ gọn tinh tế */}
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography
            variant="h3"
            component={Reveal}
            tag="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.2rem' },
              textWrap: 'balance',
              lineHeight: 1.35,
              color: '#1C0A00',
              textTransform: 'uppercase',
              mb: 1.2
            }}
          >
            {t('recHeadline')}
          </Typography>

          <Typography
            variant="body2"
            component={Reveal}
            delay={0.12}
            sx={{
              color: '#57534E',
              fontSize: { xs: '0.88rem', sm: '0.98rem' },
              maxWidth: 640,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {isEn
              ? 'One place can fit many needs. Tell FIND&GO what you’re looking for, and see the recommendations, match score, and reasons adapt to you.'
              : 'Cùng một quán: hoàn hảo để làm việc, nhưng không hợp mang thú cưng, và vừa đủ ổn cho buổi hẹn đầu. Chọn nhu cầu để thấy điểm số và lý do thay đổi tức thì.'}
          </Typography>
        </Box>

        {/* 2. Three Intent Tabs */}
        <Box
          role="tablist"
          aria-label={isEn ? 'Choose an occasion' : 'Chọn nhu cầu'}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 1, sm: 2 },
            mb: 4
          }}
        >
          {INTENTS_DATA.map((intent, idx) => {
            const isActive = activeIntentIndex === idx
            return (
              <Box
                component={Reveal}
                tag="button"
                delay={0.2 + idx * 0.09}
                scale={0.98}
                type="button"
                role="tab"
                id={`occasion-tab-${intent.id}`}
                aria-selected={isActive}
                aria-controls="occasion-panel"
                key={intent.id}
                onClick={() => setActiveIntentIndex(idx)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  textAlign: 'left',
                  py: 1.6,
                  px: 1.2,
                  minWidth: 0,
                  background: 'transparent',
                  border: 0,
                  color: isActive ? '#B9480B' : '#8A7568',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease, border-color 0.25s ease',
                  borderBottom: isActive ? '2px solid #F97316' : '2px solid #E9DDD4',
                  '&:hover': { color: '#FF7A1A' }
                }}
              >
                <Search size={24} strokeWidth={1.6} aria-hidden="true" style={{ flexShrink: 0 }} />
                <Typography
                  component="span"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: 'inherit'
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
          role="tabpanel"
          id="occasion-panel"
          aria-labelledby={`occasion-tab-${currentIntent.id}`}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 18px 48px rgba(120, 53, 15, 0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            minHeight: { md: 390 }
          }}
        >
          {/* CỘT TRÁI: Hình ảnh quán (chiếm ~44% bề ngang) */}
          <Box
            component={Reveal}
            direction="left"
            sx={{
              flex: { xs: 'none', md: '0 0 46%' },
              position: 'relative',
              height: { xs: 260, sm: 320, md: 'auto' },
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={currentIntent.image}
              alt={currentVenue.name}
              sx={{
                position: { md: 'absolute' },
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Box>

          {/* CỘT PHẢI: Chi tiết quán NẰM NGANG bên cạnh ảnh (chiếm ~56% còn lại) */}
          <Box
            component={Reveal}
            direction="right"
            delay={0.12}
            sx={{
              flex: '1 1 auto',
              minWidth: 0,
              p: { xs: 3, md: 4.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 3,
              backgroundColor: '#F7F8FA'
            }}
          >
            <Box>
              {/* Match Score Line */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Sparkles size={20} color="#F97316" aria-hidden="true" />
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '1.15rem',
                    color: '#0F172A'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: '#0F172A',
                      fontWeight: 500,
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
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', md: '1.35rem' },
                  color: '#0F172A',
                  mb: 2.5,
                  lineHeight: 1.2
                }}
              >
                {isEn ? currentIntent.tabEn : currentIntent.tabVi}
              </Typography>

              {/* Dynamic Evidence Description */}
              <Typography
                sx={{
                  color: '#334155',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  '& strong': {
                    color: '#0F172A',
                    fontWeight: 700
                  }
                }}
              >
                {isEn ? currentIntent.descriptionEn : currentIntent.descriptionVi}
              </Typography>
            </Box>

            {/* Bottom Tags & Buttons */}
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                {(isEn ? currentIntent.tagsEn : currentIntent.tagsVi).map((tag, idx) => {
                  const TagIcon = TAG_ICONS[currentIntent.id][idx]
                  return (
                  <Chip
                    key={idx}
                    size="small"
                    label={tag.label}
                    icon={<TagIcon size={14} aria-hidden="true" />}
                    sx={{
                      borderRadius: '999px',
                      fontWeight: 400,
                      fontSize: '0.78rem',
                      backgroundColor: '#FFFFFF',
                      color: '#1E293B',
                      border: 0,
                      boxShadow: '0 2px 2px rgba(15, 23, 42, 0.12)',
                      height: 36,
                      px: 0.6,
                      '& .MuiChip-icon': { color: '#B9480B', ml: 1 }
                    }}
                  />
                  )
                })}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.2,
                  pt: 0.5,
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
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#FF7A1A',
                      color: '#FF7A1A',
                      backgroundColor: '#FFF7ED'
                    }
                  }}
                >
                  {t('viewDetails')}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onFocusOnMap && onFocusOnMap(currentVenue)}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    px: 1.8,
                    py: 0.7,
                    borderColor: '#FDBA74',
                    color: '#C2410C',
                    backgroundColor: '#FFF7ED',
                    '&:hover': {
                      borderColor: '#EA580C',
                      color: '#9A3412',
                      backgroundColor: '#FED7AA'
                    }
                  }}
                >
                  {isEn ? 'Show on Map 📍' : 'Xem trên bản đồ 📍'}
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
