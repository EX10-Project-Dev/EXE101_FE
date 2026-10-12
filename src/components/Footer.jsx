import { Box, Container, Typography, Divider } from '@mui/material'
import { Compass, Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.45)'
                }}
              >
                <Compass size={19} />
              </Box>
              <Typography variant="h6" fontWeight={900} color="#ffffff">
                FIND<span style={{ color: '#FF8A3D' }}>&amp;GO</span>
              </Typography>
            </Box>
            <Typography variant="body2" color={isDark ? '#8E8178' : '#78716C'} sx={{ maxWidth: 400 }}>
              Nền tảng tìm kiếm và gợi ý địa điểm F&amp;B thông minh theo ngữ cảnh, cảm xúc và nhu cầu thực tế của người dùng.
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
              FE TASK — LUỒNG KHÁCH CHƯA ĐĂNG NHẬP
            </Typography>
            <Typography variant="caption" color={isDark ? '#7A6E66' : '#57534E'} display="block">
              Không lưu dữ liệu cá nhân • Trải nghiệm tức thì không cần tài khoản
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
          <Typography variant="caption" color={isDark ? '#7A6E66' : '#57534E'}>
            © {new Date().getFullYear()} FIND&amp;GO — Dự án công nghệ F&amp;B.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color={isDark ? '#7A6E66' : '#57534E'}>
              Được thiết kế với
            </Typography>
            <Heart size={13} color="#EF4444" fill="#EF4444" />
            <Typography variant="caption" color={isDark ? '#7A6E66' : '#57534E'}>
              cho cộng đồng ẩm thực Việt Nam
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
