import { Box, Container, Typography, Divider } from '@mui/material'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo.png'

export default function Footer() {
  const { isDark } = useTheme()
  const { t, isEn } = useLanguage()

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: isDark ? '#0E0603' : '#1C0A00',
        color: '#A8A29E',
        borderTop: isDark ? '1px solid #28140B' : 'none'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            mb: 4
          }}
        >
          {/* Brand */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                component="img"
                src={logo}
                alt="SEEKERS Logo"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(253, 186, 116, 0.4)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#ffffff', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                  SEEKERS
                </Typography>
                <Typography variant="caption" sx={{ color: '#FF8A3D', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                  EXPLORE MORE TOGETHER
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: isDark ? '#8E8178' : '#78716C', maxWidth: 420 }}
            >
              {t('footerDesc')}
            </Typography>
          </Box>

          {/* Task note */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography
              variant="caption"
              sx={{
                color: '#FF8A3D',
                fontWeight: 800,
                display: 'block',
                mb: 0.5,
                letterSpacing: '0.04em'
              }}
            >
              {t('footerTaskBadge')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? '#7A6E66' : '#57534E', display: 'block' }}
            >
              {t('footerNoLogin')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: isDark ? '#261209' : '#3D1A00', mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            fontSize: '0.85rem'
          }}
        >
          <Typography variant="caption" sx={{ color: isDark ? '#7A6E66' : '#57534E' }}>
            © {new Date().getFullYear()} {t('footerCopyright')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: isDark ? '#7A6E66' : '#57534E' }}>
              {t('footerCommunity')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
