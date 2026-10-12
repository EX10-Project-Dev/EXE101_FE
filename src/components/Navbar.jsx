import { Box, Container, Typography, Button, Chip, IconButton } from '@mui/material'
import { Compass, Sparkles, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar({ onStartSearch }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        backdropFilter: 'blur(18px)',
        backgroundColor: isDark ? 'rgba(21, 10, 5, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderBottom: isDark ? '1px solid rgba(65, 33, 19, 0.65)' : '1px solid rgba(253, 186, 116, 0.35)',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 1px 12px rgba(234, 88, 12, 0.06)',
        transition: 'all 0.25s ease-in-out'
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.8 }}
      >
        {/* Logo & Brand */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Glowing Orange Pin Icon like Spotly */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '13px',
              background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.45)',
              flexShrink: 0
            }}
          >
            <Compass size={22} strokeWidth={2.6} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  fontSize: '1.3rem',
                  lineHeight: 1,
                  color: isDark ? '#FFFFFF' : '#1C0A00'
                }}
              >
                FIND<span style={{ color: '#FF7A1A' }}>&amp;GO</span>
              </Typography>
              <Chip
                label="Khách trải nghiệm"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
                  color: isDark ? '#FED7AA' : '#C2410C',
                  border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74'
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: isDark ? '#A1948B' : '#78716C', display: { xs: 'none', sm: 'block' }, fontSize: '0.73rem' }}
            >
              Gợi ý địa điểm F&amp;B thông minh theo ngữ cảnh
            </Typography>
          </Box>
        </Box>

        {/* Right Actions: Theme Toggle + CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Theme Toggle Button */}
          <IconButton
            onClick={toggleTheme}
            title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối (Dark Mode)'}
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              backgroundColor: isDark ? '#26130A' : '#FFF7ED',
              border: isDark ? '1px solid #442214' : '1px solid #FDBA74',
              color: isDark ? '#FED7AA' : '#EA580C',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? '#331A0E' : '#FED7AA',
                transform: 'scale(1.05)'
              }
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>

          {/* CTA Button matching Spotly "GET THE APP" style */}
          <Button
            variant="contained"
            onClick={onStartSearch}
            startIcon={<Sparkles size={16} />}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 800,
              px: { xs: 2, sm: 2.8 },
              py: 0.9,
              fontSize: '0.9rem',
              background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
              boxShadow: '0 4px 18px rgba(249, 115, 22, 0.45)',
              '&:hover': {
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                boxShadow: '0 6px 22px rgba(249, 115, 22, 0.55)'
              }
            }}
          >
            Tìm quán ngay
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
