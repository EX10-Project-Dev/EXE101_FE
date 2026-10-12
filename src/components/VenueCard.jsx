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
import {
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  DollarSign
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function VenueCard({ venue, onOpenDetail }) {
  const { isDark } = useTheme()
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
        border: isDark ? '1.5px solid #361A0F' : '1px solid #FDE8CC',
        boxShadow: isDark
          ? '0 8px 24px rgba(0, 0, 0, 0.5)'
          : '0 4px 18px rgba(120, 53, 15, 0.06)',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? '#201009' : '#FFFFFF',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: isDark
            ? '0 18px 40px rgba(0, 0, 0, 0.7), 0 0 16px rgba(249, 115, 22, 0.25)'
            : '0 18px 36px rgba(234, 88, 12, 0.14)',
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
              backgroundColor: isDark ? 'rgba(28, 13, 7, 0.85)' : 'rgba(28, 10, 0, 0.72)',
              backdropFilter: 'blur(6px)',
              border: isDark ? '1px solid rgba(87, 42, 22, 0.7)' : 'none',
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
            gap: 0.5,
            px: 1.3,
            py: 0.5,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(28, 13, 7, 0.92)' : 'rgba(255, 255, 255, 0.96)',
            border: isDark ? '1px solid #4D2615' : 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Sparkles size={13} color="#FF7A1A" />
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '0.88rem',
              color: isDark ? '#FFFFFF' : '#1C0A00',
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
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <MapPin size={13} color="#FF8A3D" />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '0.78rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}
          >
            Cách bạn {venue.distanceKm} km
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          fontWeight={900}
          color={isDark ? '#FFFFFF' : '#1C0A00'}
          sx={{ mb: 0.5, fontSize: '1.15rem' }}
        >
          {venue.name}
        </Typography>

        <Typography
          variant="body2"
          color={isDark ? '#B8ABA2' : '#78716C'}
          sx={{ mb: 2, fontSize: '0.87rem', lineHeight: 1.45 }}
        >
          {venue.tagline}
        </Typography>

        {/* Price & hours */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DollarSign size={14} color="#22C55E" />
            <Typography variant="caption" fontWeight={700} color={isDark ? '#D8CFCA' : '#44403C'}>
              {venue.priceRange}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={13} color={isDark ? '#8A7C73' : '#A8A29E'} />
            <Typography variant="caption" color={isDark ? '#9E9188' : '#78716C'}>
              {venue.openingHours}
            </Typography>
          </Box>
        </Box>

        {/* Reasons box */}
        <Box
          sx={{
            p: 1.6,
            borderRadius: '14px',
            backgroundColor: isDark ? '#29140B' : '#FFF7ED',
            border: isDark ? '1px solid #432112' : '1px solid #FDE8CC',
            mb: 2.5,
            flexGrow: 1
          }}
        >
          <Typography
            variant="caption"
            fontWeight={800}
            color={isDark ? '#FF9A52' : '#92400E'}
            sx={{ display: 'block', mb: 0.8 }}
          >
            Lý do đề xuất cho bạn:
          </Typography>
          <Stack spacing={0.7}>
            {reasons.map((r, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                <CheckCircle2 size={13} color="#FF7A1A" style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography
                  variant="caption"
                  color={isDark ? '#D6CCC5' : '#78716C'}
                  sx={{ fontSize: '0.78rem', lineHeight: 1.4 }}
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
              borderColor: isDark ? '#432112' : '#E7E5E4',
              color: isDark ? '#E5DDD7' : '#44403C',
              backgroundColor: isDark ? '#231108' : 'transparent',
              py: 0.9,
              '&:hover': {
                borderColor: '#FF7A1A',
                backgroundColor: isDark ? '#2E170C' : '#FFF7ED',
                color: '#FF7A1A'
              }
            }}
          >
            Chi tiết quán
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenGoogleMaps}
            endIcon={<ExternalLink size={14} />}
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
            Mở Bản Đồ
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
