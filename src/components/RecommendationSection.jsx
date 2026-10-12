import { Box, Container, Typography, Grid, Skeleton, Button, Chip } from '@mui/material'
import { Sparkles, Frown, RotateCcw } from 'lucide-react'
import VenueCard from './VenueCard'
import { useTheme } from '../contexts/ThemeContext'

export default function RecommendationSection({
  venues,
  isLoading,
  onOpenDetail,
  onResetFilters,
  activePromptCount,
  activeCriteriaCount
}) {
  const { isDark } = useTheme()

  return (
    <Box
      id="recommendations-section"
      sx={{
        py: 7,
        background: isDark
          ? 'linear-gradient(180deg, #150A05 0%, #180D07 50%, #150A05 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #FFFBF8 100%)',
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            mb: 4.5
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
              <Box
                sx={{
                  p: 0.7,
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#26130A' : '#FFF7ED',
                  border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74'
                }}
              >
                <Sparkles size={18} color="#FF7A1A" />
              </Box>
              <Typography variant="h5" fontWeight={900} color={isDark ? '#FFFFFF' : '#1C0A00'}>
                Địa điểm gợi ý cho bạn
              </Typography>
              {venues.length > 0 && !isLoading && (
                <Chip
                  label={`${venues.length} kết quả`}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
                    color: isDark ? '#FED7AA' : '#C2410C',
                    border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74',
                    borderRadius: '8px'
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" color={isDark ? '#9E9188' : '#78716C'}>
              Sắp xếp theo độ tương thích cao nhất với yêu cầu &amp; tâm trạng của bạn
            </Typography>
          </Box>

          {(activePromptCount > 0 || activeCriteriaCount > 0) && (
            <Button
              variant="text"
              size="small"
              onClick={onResetFilters}
              startIcon={<RotateCcw size={15} />}
              sx={{
                textTransform: 'none',
                color: isDark ? '#B3A8A0' : '#78716C',
                fontWeight: 700,
                '&:hover': { color: '#FF7A1A' }
              }}
            >
              Đặt lại tìm kiếm
            </Button>
          )}
        </Box>

        {/* Loading Skeletons */}
        {isLoading && (
          <Grid container spacing={3}>
            {[1, 2, 3].map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n}>
                <Box
                  sx={{
                    borderRadius: '22px',
                    overflow: 'hidden',
                    backgroundColor: isDark ? '#201009' : '#fff',
                    border: isDark ? '1px solid #361A0F' : '1px solid #FDE8CC',
                    p: 2
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={210}
                    sx={{
                      borderRadius: '14px',
                      mb: 2,
                      backgroundColor: isDark ? '#2A150C' : undefined
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="65%"
                    height={30}
                    sx={{ backgroundColor: isDark ? '#2A150C' : undefined }}
                  />
                  <Skeleton
                    variant="text"
                    width="85%"
                    height={20}
                    sx={{ backgroundColor: isDark ? '#2A150C' : undefined }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={84}
                    sx={{
                      borderRadius: '12px',
                      my: 2,
                      backgroundColor: isDark ? '#2B160D' : '#FFF7ED'
                    }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={42}
                    sx={{
                      borderRadius: '11px',
                      backgroundColor: isDark ? '#2A150C' : undefined
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!isLoading && venues.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 9,
              px: 3,
              borderRadius: '28px',
              backgroundColor: isDark ? '#201009' : '#ffffff',
              border: isDark ? '1.5px dashed #4D2615' : '1.5px dashed #FDBA74'
            }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: isDark ? '#281309' : '#FFF7ED',
                border: isDark ? '2px solid #4D2615' : '2px solid #FDBA74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
                color: '#FF7A1A'
              }}
            >
              <Frown size={32} />
            </Box>
            <Typography variant="h6" fontWeight={900} color={isDark ? '#FFFFFF' : '#1C0A00'} mb={1}>
              Không tìm thấy địa điểm phù hợp
            </Typography>
            <Typography
              variant="body2"
              color={isDark ? '#B8ABA2' : '#78716C'}
              sx={{ maxWidth: 440, mx: 'auto', mb: 3 }}
            >
              Thử giảm bớt tiêu chí lọc hoặc thay đổi câu lệnh tìm kiếm để mở rộng kết quả nhé.
            </Typography>
            <Button
              variant="contained"
              onClick={onResetFilters}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)' }
              }}
            >
              Xem tất cả quán gợi ý
            </Button>
          </Box>
        )}

        {/* Venue Grid */}
        {!isLoading && venues.length > 0 && (
          <Grid container spacing={3}>
            {venues.map((venue) => (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <VenueCard venue={venue} onOpenDetail={onOpenDetail} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
