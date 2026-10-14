import { Box, Container, Typography, Avatar, Chip } from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'
import Reveal from './Reveal'
import BrandText from './BrandText'

const COLLECTIONS = [
  {
    id: 'burger',
    titleVi1: 'ĐẠI TIỆC',
    titleVi2: 'BURGER',
    titleEn1: 'THE BURGER',
    titleEn2: 'BREAKDOWN',
    subVi: 'Tuyển chọn từ 18k+ đánh giá bản địa',
    subEn: 'Curated from 18k+ local reviews',
    queryVi: 'Burger và street food hảo hạng',
    queryEn: 'Burger and gourmet street food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'happy-hour',
    titleVi1: 'CHILL SAU',
    titleVi2: 'GIỜ LÀM',
    titleEn1: 'HAPPY HOUR',
    titleEn2: 'HEROES',
    subVi: 'Tuyển chọn từ 22k+ đánh giá bản địa',
    subEn: 'Curated from 22k+ local reviews',
    queryVi: 'Quán pub và bia thủ công chill sau giờ làm',
    queryEn: 'Craft beer and chill evening pub',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    avatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'green-flags',
    titleVi1: 'CHUẨN GU',
    titleVi2: 'SỐNG XANH',
    titleEn1: 'GREEN FLAGS',
    titleEn2: 'ONLY',
    subVi: 'Tuyển chọn từ 15k+ đánh giá bản địa',
    subEn: 'Curated from 15k+ local reviews',
    queryVi: 'Món ăn thanh sạch, brunch không gian xanh',
    queryEn: 'Healthy green dining and open-air brunch',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    avatars: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    ]
  }
]

export default function CuratedCollections({ onSelectCollection }) {
  const { t, isEn } = useLanguage()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: 'transparent',
        color: '#1C0A00',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Subtle warm ambient lights */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-5%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253, 186, 116, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 5, lg: 6 }
          }}
        >
          {/* Cột trái: Tiêu đề lớn & Đoạn văn giới thiệu */}
          <Box sx={{ maxWidth: { xs: '100%', lg: '400px' }, flexShrink: 0 }}>
            <Chip
              component={Reveal}
              distance={10}
              label={t('colBadge')}
              size="small"
              sx={{
                backgroundColor: '#FFF7ED',
                color: '#C2410C',
                fontWeight: 800,
                fontSize: '0.74rem',
                mb: 2.2,
                border: '1px solid #FDBA74'
              }}
            />

            <Typography
              variant="h2"
              component={Reveal}
              tag="h2"
              direction="left"
              delay={0.08}
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#1C0A00',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              {isEn ? (
                <>
                  CURATED
                  <br />
                  COLLECTIONS,
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #FF7A1A 0%, #EA580C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    MADE PERSONAL
                  </Box>
                </>
              ) : (
                <>
                  BỘ SƯU TẬP
                  <br />
                  TUYỂN CHỌN,
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #FF7A1A 0%, #EA580C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    DÀNH RIÊNG CHO BẠN
                  </Box>
                </>
              )}
            </Typography>

            <Typography
              variant="body1"
              component={Reveal}
              direction="left"
              delay={0.2}
              sx={{
                mt: 2.5,
                color: '#57534E',
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                lineHeight: 1.65,
                fontWeight: 400
              }}
            >
              {t('colSubtitle')}
            </Typography>

            <Typography
              variant="caption"
              component={Reveal}
              delay={0.28}
              sx={{
                display: 'block',
                mt: 2,
                color: '#EA580C',
                fontWeight: 800,
                fontSize: '0.8rem',
                letterSpacing: '0.04em'
              }}
            >
              <BrandText text={t('colTag')} />
            </Typography>
          </Box>

          {/* Cột phải: 3 Thẻ hình ảnh tuyển chọn */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2.2, sm: 2.8 },
              width: { xs: '100%', lg: 'auto' },
              overflowX: { xs: 'auto', lg: 'visible' },
              pb: { xs: 2, lg: 0 },
              pt: 1,
              px: { xs: 0.5, lg: 0 },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {COLLECTIONS.map((col, index) => {
              const title1 = isEn ? col.titleEn1 : col.titleVi1
              const title2 = isEn ? col.titleEn2 : col.titleVi2
              const sub = isEn ? col.subEn : col.subVi
              const query = isEn ? col.queryEn : col.queryVi

              return (
                <Box
                  component={Reveal}
                  delay={index * 0.09}
                  scale={0.98}
                  key={col.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      event.currentTarget.click()
                    }
                  }}
                  onClick={() => {
                    if (onSelectCollection) {
                      onSelectCollection({ ...col, query })
                    } else {
                      const el = document.getElementById('hero-search-box') || document.getElementById('recommendations-section')
                      if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
                    }
                  }}
                  sx={{
                    position: 'relative',
                    width: { xs: '220px', sm: '235px', md: '245px' },
                    height: { xs: '330px', sm: '350px', md: '365px' },
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 16px 36px rgba(234, 88, 12, 0.12)',
                    border: '1.5px solid rgba(253, 186, 116, 0.65)',
                    transition: 'translate 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover': {
                      translate: '0 -4px',
                      boxShadow: '0 20px 40px rgba(234, 88, 12, 0.16)',
                      border: '1.5px solid #FF7A1A',
                      '& .card-bg-img': {
                        transform: 'scale(1.02)'
                      }
                    }
                  }}
                >
                  {/* Ảnh nền quán / món ăn */}
                  <Box
                    component="img"
                    className="card-bg-img"
                    src={col.image}
                    alt={`${title1} ${title2}`}
                    loading="lazy"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease-out'
                    }}
                  />

                  {/* Lớp phủ gradient tối dần xuống đáy */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.28) 45%, rgba(18, 8, 3, 0.85) 75%, rgba(12, 5, 2, 0.96) 100%)',
                      zIndex: 1
                    }}
                  />

                  {/* Nội dung text căn giữa phía dưới card */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2.2,
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {/* Tiêu đề 2 dòng chữ in hoa đậm */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '1.15rem', sm: '1.25rem' },
                        lineHeight: 1.15,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {title1}
                      <br />
                      {title2}
                    </Typography>

                    {/* Avatar reviewer xếp chồng và dòng text đánh giá */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.8,
                        mt: 1.4
                      }}
                    >
                      {/* Avatars */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {col.avatars.map((av, idx) => (
                          <Avatar
                            key={idx}
                            src={av}
                            alt="Reviewer"
                            sx={{
                              width: 18,
                              height: 18,
                              ml: idx > 0 ? -0.8 : 0,
                              border: '1.5px solid #FFFFFF',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                            }}
                          />
                        ))}
                      </Box>

                      {/* Dòng chữ đánh giá */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#EFE7E2',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {sub}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
