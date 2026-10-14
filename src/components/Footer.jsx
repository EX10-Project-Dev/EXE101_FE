import { Box, Container, Typography } from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'
import logo from '../assets/logo-small.webp'
import Reveal from './Reveal'
import BrandText from './BrandText'

export default function Footer() {
  const { t, isEn } = useLanguage()

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: 'transparent',
        color: '#68564B'
      }}
    >
      <Container maxWidth="lg" component={Reveal} distance={16}>
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
                alt="FIND&GO Logo"
                width={42}
                height={42}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(253, 186, 116, 0.4)',
                  boxShadow: '0 4px 14px rgba(113, 60, 27, 0.08)',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#34251E', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                  <BrandText />
                </Typography>
                <Typography variant="caption" sx={{ color: '#B9480B', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                  EXPLORE MORE TOGETHER
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: '#78716C', maxWidth: 420 }}
            >
              {t('footerDesc')}
            </Typography>
          </Box>

          {/* Task note */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography
              variant="caption"
              sx={{
                color: '#B9480B',
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
              sx={{ color: '#57534E', display: 'block' }}
            >
              {t('footerNoLogin')}
            </Typography>
          </Box>
        </Box>

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
          <Typography variant="caption" sx={{ color: '#57534E' }}>
            © {new Date().getFullYear()} <BrandText text={t('footerCopyright')} />
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#57534E' }}>
              {t('footerCommunity')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
