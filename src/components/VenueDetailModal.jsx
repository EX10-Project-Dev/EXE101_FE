import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Divider,
  Stack
} from '@mui/material'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function VenueDetailModal({ open, venue, onClose }) {
  const { isDark } = useTheme()
  const { t, isEn } = useLanguage()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [venue?.id])

  if (!venue) return null

  const handleOpenGoogleMaps = () => {
    const url =
      venue.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        venue.name + ' ' + venue.address
      )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const images = venue.images?.length > 0 ? venue.images : [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80'
  ]

  const reasons = venue.dynamicReasons || venue.reasons || []

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          p: 0,
          backgroundColor: isDark ? '#1C0D06' : '#FFFFFF',
          border: isDark ? '1.5px solid #3E1F12' : 'none',
          boxShadow: isDark
            ? '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 24px rgba(234, 88, 12, 0.25)'
            : '0 25px 60px rgba(28, 10, 0, 0.28)'
        }
      }}
    >
      {/* 1. Hero Image Showcase */}
      <Box sx={{ position: 'relative', height: { xs: 260, sm: 340 } }}>
        <Box
          component="img"
          src={images[activeImageIndex] || images[0]}
          alt={venue.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease'
          }}
        />
        {/* Dark Gradient Overlay over Image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(20,9,4,0.95) 0%, rgba(20,9,4,0.4) 60%, transparent 100%)'
          }}
        />

        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            backgroundColor: 'rgba(0,0,0,0.65)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.2rem',
            backdropFilter: 'blur(6px)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.85)' }
          }}
        >
          ✕
        </IconButton>

        {/* Top left badges: Category & Rating */}
        <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
          <Chip
            label={venue.category}
            size="small"
            sx={{
              backgroundColor: '#EA580C',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          />
          {venue.rating && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.2,
                py: 0.4,
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(6px)',
                color: '#FDE047',
                fontSize: '0.78rem',
                fontWeight: 800
              }}
            >
              <span>{venue.rating} / 5.0</span>
            </Box>
          )}
        </Box>

        {/* Multiple image thumbnails row */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 60,
              display: 'flex',
              gap: 0.8
            }}
          >
            {images.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border:
                    activeImageIndex === idx
                      ? '2px solid #FF7A1A'
                      : '1.5px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  opacity: activeImageIndex === idx ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                  '&:hover': { opacity: 1 }
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Hình ảnh ${idx + 1}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Bottom overlay: Name + Match Score */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: { xs: 20, sm: 28 },
            right: { xs: 20, sm: 28 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 1.5
          }}
        >
          <Box sx={{ maxWidth: { xs: '100%', sm: '75%' } }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                color: '#FFFFFF !important',
                fontSize: { xs: '1.4rem', sm: '1.9rem' },
                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                lineHeight: 1.2
              }}
            >
              {venue.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FED7AA !important',
                fontWeight: 600,
                fontSize: '0.88rem',
                mt: 0.5,
                textShadow: '0 1px 3px rgba(0,0,0,0.9)'
              }}
            >
              {venue.tagline}
            </Typography>
          </Box>

          {/* Match Score Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.8,
              py: 0.8,
              borderRadius: '16px',
              backgroundColor: isDark ? '#2B160D' : '#ffffff',
              border: isDark ? '1px solid #4D2615' : 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              flexShrink: 0
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  color: isDark ? '#FFFFFF !important' : '#1C0A00 !important',
                  lineHeight: 1
                }}
              >
                {venue.matchScore || '9.6'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: isDark ? '#FF9A52 !important' : '#C2410C !important',
                  fontWeight: 800
                }}
              >
                {t('modalDetailScore')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 2. Body Content (Ensured dark background in dark mode, light in light mode) */}
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          backgroundColor: isDark ? '#1C0D06' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#1C0A00'
        }}
      >
        <Stack spacing={3}>
          {/* Detailed Description */}
          {venue.description && (
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{
                  color: isDark ? '#FF9A52' : '#1C0A00',
                  mb: 0.6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontSize: '0.75rem'
                }}
              >
                {isEn ? 'ABOUT THIS VENUE' : 'Giới thiệu không gian'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? '#D6CDC6' : '#57534E',
                  lineHeight: 1.75,
                  fontSize: '0.94rem'
                }}
              >
                {venue.description}
              </Typography>
            </Box>
          )}

          {/* Core Info Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              p: 2.2,
              borderRadius: '18px',
              backgroundColor: isDark ? '#26130A' : '#FFF7ED',
              border: isDark ? '1px solid #3E1F12' : '1px solid #FDE8CC'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  display="block"
                  sx={{ color: isDark ? '#A1948B' : '#A8A29E' }}
                >
                  {t('modalDetailAddress')}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: isDark ? '#FFFFFF' : '#1C0A00' }}
                >
                  {venue.address}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  display="block"
                  sx={{ color: isDark ? '#A1948B' : '#A8A29E' }}
                >
                  {isEn ? 'Distance' : 'Khoảng cách'}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: isDark ? '#FFFFFF' : '#1C0A00' }}
                >
                  {isEn ? `Approx. ${venue.distanceKm} km from your location` : `Khoảng ${venue.distanceKm} km từ vị trí của bạn`}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  display="block"
                  sx={{ color: isDark ? '#A1948B' : '#A8A29E' }}
                >
                  {t('modalDetailHours')}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: isDark ? '#FFFFFF' : '#1C0A00' }}
                >
                  {venue.openingHours}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  display="block"
                  sx={{ color: isDark ? '#A1948B' : '#A8A29E' }}
                >
                  {t('modalDetailPrice')}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: isDark ? '#FFFFFF' : '#1C0A00' }}
                >
                  {venue.priceRange}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Explainable Reasons - Tại sao quán này hợp với bạn */}
          <Box
            sx={{
              p: 2.2,
              borderRadius: '16px',
              backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
              border: isDark ? '1.5px solid #4D2615' : '1.5px solid #FDBA74'
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={900}
              sx={{ color: isDark ? '#FF9A52' : '#92400E', mb: 1.2 }}
            >
              {isEn ? 'Why SEEKERS recommends this venue for you' : 'Tại sao SEEKERS đề xuất quán này cho bạn?'}
            </Typography>
            <Stack spacing={1}>
              {reasons.map((reason, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: '#FF7A1A', fontWeight: 900, lineHeight: 1.4, fontSize: '0.95rem' }}>•</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#F5EBE6' : '#7C2D12', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    {reason}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Purpose & Group Size Suitability */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {venue.purposes && venue.purposes.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? '#24120A' : '#FAFAF9',
                  border: isDark ? '1px solid #381C0F' : '1px solid #E7E5E4'
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ color: isDark ? '#FFFFFF' : '#1C0A00', fontSize: '0.85rem' }}
                  >
                    {isEn ? 'Suitable for occasions:' : 'Phù hợp cho mục đích:'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {venue.purposes.map((p, idx) => (
                    <Chip
                      key={idx}
                      label={p}
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#3D1D10' : '#FFF7ED',
                        color: isDark ? '#FED7AA' : '#C2410C',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        border: isDark ? '1px solid #572A16' : '1px solid #FDBA74'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {venue.groupSizes && venue.groupSizes.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? '#24120A' : '#FAFAF9',
                  border: isDark ? '1px solid #381C0F' : '1px solid #E7E5E4'
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ color: isDark ? '#FFFFFF' : '#1C0A00', fontSize: '0.85rem' }}
                  >
                    Quy mô nhóm lý tưởng:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {venue.groupSizes.map((g, idx) => (
                    <Chip
                      key={idx}
                      label={g}
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#1C291F' : '#ECFDF5',
                        color: isDark ? '#86EFAC' : '#065F46',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        border: isDark ? '1px solid #234D2E' : '1px solid #A7F3D0'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Amenities & Atmosphere */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={800}
              sx={{ color: isDark ? '#FFFFFF' : '#1C0A00', mb: 1.2 }}
            >
              {isEn ? 'Key Amenities & Atmosphere' : 'Tiện ích & Không gian nổi bật'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(venue.amenities || []).map((amenity, idx) => (
                <Chip
                  key={idx}
                  label={amenity}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#26130A' : '#F5F5F4',
                    color: isDark ? '#E2D9D2' : '#44403C',
                    border: isDark ? '1px solid #3E1F12' : 'none',
                    fontWeight: 600,
                    fontSize: '0.82rem'
                  }}
                />
              ))}
              {(venue.atmosphere || []).map((atm, idx) => (
                <Chip
                  key={`atm-${idx}`}
                  label={isEn ? `Atmosphere: ${atm}` : `Không khí: ${atm}`}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#2D160C' : '#FFF7ED',
                    color: isDark ? '#FED7AA' : '#C2410C',
                    fontWeight: 700,
                    border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74',
                    fontSize: '0.82rem'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: isDark ? '#33190E' : '#FDE8CC' }} />

      {/* 3. Footer CTA: Google Maps Navigation */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: isDark ? '#150A05' : '#FFFBF8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: isDark ? '#A1948B' : '#A8A29E' }}
        >
          {isEn ? 'Guest Mode • Ready for live navigation' : 'Dành riêng cho khách • Sẵn sàng chuyển sang bản đồ'}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleOpenGoogleMaps}
          sx={{
            borderRadius: '14px',
            textTransform: 'none',
            fontWeight: 900,
            fontSize: '1rem',
            px: 3.5,
            py: 1.2,
            background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
            boxShadow: '0 4px 18px rgba(249, 115, 22, 0.45)',
            '&:hover': {
              background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)'
            }
          }}
        >
          {isEn ? 'Get Directions on Google Maps' : 'Chỉ đường bằng Google Maps'}
        </Button>
      </Box>
    </Dialog>
  )
}
