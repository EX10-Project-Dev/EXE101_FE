import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack
} from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'

export default function VenueCard({ venue, onOpenDetail }) {
  const { isEn } = useLanguage()
  const reasons = venue.dynamicReasons || venue.reasons || []

  const handleOpenGoogleMaps = (e) => {
    e.stopPropagation()
    const url =
      venue.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        venue.name + ' ' + venue.address
      )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      onClick={() => onOpenDetail(venue)}
      sx={{
        borderRadius: '22px',
        overflow: 'hidden',
        border: '1px solid #FDE8CC',
        boxShadow: '0 4px 18px rgba(120, 53, 15, 0.06)',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 18px 36px rgba(234, 88, 12, 0.14)',
          borderColor: '#FF7A1A'
        }
      }}
    >
      {/* Image area */}
      <Box sx={{ position: 'relative', height: 215 }}>
        <CardMedia
          component="img"
          image={
            venue.images?.[0] ||
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
          }
          alt={venue.name}
          sx={{ height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(20, 9, 4, 0.75) 0%, transparent 52%)'
          }}
        />

        {/* Category chip */}
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip
            label={venue.category}
            size="small"
            sx={{
              backgroundColor: 'rgba(28, 10, 0, 0.72)',
              backdropFilter: 'blur(6px)',
              border: 'none',
              color: '#FED7AA',
              fontWeight: 800,
              fontSize: '0.73rem',
              borderRadius: '8px'
            }}
          />
        </Box>

        {/* Match Score badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            px: 1.3,
            py: 0.5,
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '0.88rem',
              color: '#1C0A00',
              lineHeight: 1
            }}
          >
            {venue.matchScore || '9.5'}
          </Typography>
        </Box>

        {/* Distance */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '0.78rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}
          >
            {isEn ? `${venue.distanceKm} km away` : `Cách bạn ${venue.distanceKm} km`}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            color: '#1C0A00',
            mb: 0.5,
            fontSize: '1.15rem'
          }}
        >
          {venue.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#78716C',
            mb: 2,
            fontSize: '0.87rem',
            lineHeight: 1.45
          }}
        >
          {venue.tagline}
        </Typography>

        {/* Price & hours */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: '#44403C' }}
            >
              Giá: {venue.priceRange}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: '#78716C' }}
            >
              {venue.openingHours}
            </Typography>
          </Box>
        </Box>

        {/* Reasons box */}
        <Box
          sx={{
            p: 1.6,
            borderRadius: '14px',
            backgroundColor: '#FFF7ED',
            border: '1px solid #FDE8CC',
            mb: 2.5,
            flexGrow: 1
          }}
        >
          <Typography
            variant="caption"
            fontWeight={800}
            sx={{
              color: '#92400E',
              display: 'block',
              mb: 0.8
            }}
          >
            {isEn ? 'Why we recommend:' : 'Lý do đề xuất cho bạn:'}
          </Typography>
          <Stack spacing={0.7}>
            {reasons.map((r, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                <Typography sx={{ color: '#FF7A1A', fontWeight: 900, lineHeight: 1.4, fontSize: '0.85rem' }}>•</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#78716C',
                    fontSize: '0.78rem',
                    lineHeight: 1.4
                  }}
                >
                  {r}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetail(venue)
            }}
            sx={{
              borderRadius: '11px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              borderColor: '#E7E5E4',
              color: '#44403C',
              backgroundColor: 'transparent',
              py: 0.9,
              '&:hover': {
                borderColor: '#FF7A1A',
                backgroundColor: '#FFF7ED',
                color: '#FF7A1A'
              }
            }}
          >
            {isEn ? 'View Details' : 'Chi tiết quán'}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenGoogleMaps}
            sx={{
              borderRadius: '11px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              py: 0.9,
              background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
              boxShadow: '0 3px 12px rgba(249, 115, 22, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                boxShadow: '0 5px 18px rgba(249, 115, 22, 0.45)'
              }
            }}
          >
            {isEn ? 'Open Maps' : 'Mở Bản Đồ'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
