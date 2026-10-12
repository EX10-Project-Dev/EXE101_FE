import { Box, Container, Typography, Button, Chip } from '@mui/material'
import { Lightbulb, LightbulbOff } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo.png'

export default function Navbar({ onStartSearch }) {
  const { isDark, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        backdropFilter: 'blur(18px)',
        backgroundColor: isDark ? 'rgba(21, 10, 5, 0.92)' : 'rgba(255, 246, 237, 0.94)',
        borderBottom: isDark ? '1px solid rgba(65, 33, 19, 0.65)' : '1px solid rgba(253, 186, 116, 0.55)',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 14px rgba(234, 88, 12, 0.08)',
        transition: 'all 0.25s ease-in-out'
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.6 }}
      >
        {/* Logo & Brand */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Brand Logo Emblem */}
          <Box
            component="img"
            src={logo}
            alt="SEEKERS Logo"
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover',
              border: isDark ? '1.5px solid rgba(253, 186, 116, 0.35)' : '1.5px solid #FDBA74',
              boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 3px 12px rgba(249, 115, 22, 0.25)',
              backgroundColor: '#FFFFFF',
              flexShrink: 0
            }}
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  fontSize: '1.28rem',
                  lineHeight: 1,
                  color: isDark ? '#FFFFFF' : '#1C0A00'
                }}
              >
                SEEKERS
              </Typography>
              <Chip
                label={t('guestBadge')}
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
              sx={{ color: isDark ? '#A1948B' : '#78716C', display: { xs: 'none', sm: 'block' }, fontSize: '0.73rem', mt: 0.2 }}
            >
              {t('brandTagline')}
            </Typography>
          </Box>
        </Box>

        {/* Right Actions: Language Toggle + Theme Toggle + CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          {/* Language Toggle Button (VI / EN) */}
          <Button
            onClick={toggleLanguage}
            size="small"
            title={t('switchLangTooltip')}
            sx={{
              height: 38,
              px: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              backgroundColor: isDark ? '#26130A' : '#FFF7ED',
              border: isDark ? '1px solid #442214' : '1px solid #FDBA74',
              color: isDark ? '#FED7AA' : '#EA580C',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? '#331A0E' : '#FED7AA'
              }
            }}
          >
            <span style={{ opacity: language === 'vi' ? 1 : 0.4, fontWeight: language === 'vi' ? 900 : 500 }}>VI</span>
            <span style={{ opacity: 0.35 }}>/</span>
            <span style={{ opacity: language === 'en' ? 1 : 0.4, fontWeight: language === 'en' ? 900 : 500 }}>EN</span>
          </Button>

          {/* Theme Toggle Button with Lightbulb icon */}
          <Button
            onClick={toggleTheme}
            size="small"
            title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            sx={{
              height: 38,
              px: 1.6,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              backgroundColor: isDark ? '#26130A' : '#FFF7ED',
              border: isDark ? '1px solid #442214' : '1px solid #FDBA74',
              color: isDark ? '#FED7AA' : '#EA580C',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? '#331A0E' : '#FED7AA'
              }
            }}
          >
            {isDark ? (
              <Lightbulb size={16} strokeWidth={2.3} style={{ color: '#FDBA74' }} />
            ) : (
              <LightbulbOff size={16} strokeWidth={2.3} style={{ color: '#EA580C' }} />
            )}
            {isDark ? t('lightMode') : t('darkMode')}
          </Button>

          {/* CTA Button without icon */}
          <Button
            variant="contained"
            onClick={onStartSearch}
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
            {t('findVenuesCTA')}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
