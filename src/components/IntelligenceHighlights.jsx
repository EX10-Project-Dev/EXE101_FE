import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function IntelligenceHighlights() {
  const { isDark } = useTheme()
  const { t, isEn } = useLanguage()

  const PILLARS = [
    {
      step: '01',
      bgColor: isDark ? '#2D160C' : '#FFF7ED',
      iconColor: '#FF7A1A',
      title: isEn ? 'Transparent Scoring & Clear Rationale' : 'Xếp hạng & Giải thích lý do rõ ràng',
      body: isEn
        ? 'No random listings. Every recommendation comes with clear explanations of why it fits your mood and occasion.'
        : 'Không đưa ra danh sách ngẫu nhiên. Mỗi đề xuất đều kèm theo lý do cụ thể vì sao quán phù hợp với tâm trạng và nhu cầu của bạn.'
    },
    {
      step: '02',
      bgColor: isDark ? '#1C291F' : '#ECFDF5',
      iconColor: '#22C55E',
      title: isEn ? 'Tuned for Vietnamese F&B Culture' : 'Tối ưu theo văn hóa F&B Việt Nam',
      body: isEn
        ? 'From deadline-friendly cafes to gossip boba spots, drinking with friends to romantic dates — accurately mapped to local habits.'
        : 'Từ cà phê chạy deadline, trà sữa tám chuyện, ăn nhậu nhóm bạn đến hẹn hò sang trọng — được phân loại sát với thói quen người Việt.'
    },
    {
      step: '03',
      bgColor: isDark ? '#29182E' : '#FAF5FF',
      iconColor: '#C084FC',
      title: isEn ? 'One-Tap Direct Google Maps Navigation' : 'Một chạm chuyển thẳng sang Google Maps',
      body: isEn
        ? 'Once you find the ideal spot, seamlessly open Google Maps for immediate directions without mandatory sign-in or clutter.'
        : 'Sau khi chọn quán ưng ý, bạn lập tức mở Google Maps để định vị và nhận chỉ đường mà không cần đăng nhập hay thao tác rườm rà.'
    }
  ]

  return (
    <Box
      sx={{
        py: 9,
        background: isDark
          ? 'linear-gradient(180deg, #150A05 0%, #1A0D07 50%, #120803 100%)'
          : 'linear-gradient(180deg, #FFEBD8 0%, #FFF2E6 50%, #FFE9D6 100%)',
        borderTop: isDark ? '1px solid #28140B' : '1px solid #FDBA74',
        borderBottom: isDark ? '1px solid #28140B' : '1px solid #FDBA74',
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        {/* Headline */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            label={t('intelBadge')}
            sx={{
              backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
              color: isDark ? '#FED7AA' : '#C2410C',
              fontWeight: 700,
              fontSize: '0.8rem',
              mb: 2.5,
              border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74'
            }}
          />
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: isDark ? '#FFFFFF' : '#1C0A00',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              mb: 1.5
            }}
          >
            {t('intelTitleMain')}{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF802B 0%, #EA580C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('intelTitleAccent')}
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? '#C7BEB7' : '#57534E',
              maxWidth: 660,
              mx: 'auto',
              fontSize: '1.05rem',
              lineHeight: 1.65
            }}
          >
            {t('intelSubtitle')}
          </Typography>
        </Box>

        <Grid container spacing={5} alignItems="center">
          {/* Left: Pillars */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {PILLARS.map((p, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2.2 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '16px',
                      backgroundColor: p.bgColor,
                      color: p.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : `1.5px solid ${p.iconColor}22`
                    }}
                  >
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: p.iconColor, fontFamily: 'monospace' }}>
                      {p.step}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: isDark ? '#FFFFFF' : '#1C0A00',
                        mb: 0.5
                      }}
                    >
                      {p.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#B8ABA2' : '#57534E',
                        lineHeight: 1.65
                      }}
                    >
                      {p.body}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right: Dark code demo panel */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: '22px',
                backgroundColor: isDark ? '#1C0D06' : '#1C0A00',
                color: '#FFF7ED',
                fontFamily: 'monospace',
                boxShadow: isDark
                  ? '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(234, 88, 12, 0.15)'
                  : '0 24px 48px rgba(120, 53, 15, 0.22)',
                border: isDark ? '1.5px solid #3E1F12' : '1px solid #3D1A00'
              }}
            >
              {/* Traffic lights */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                  {['#EF4444', '#F59E0B', '#10B981'].map((c) => (
                    <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ color: '#FF8A3D', fontFamily: 'monospace', fontWeight: 700 }}>
                  Illustrative AI Response
                </Typography>
              </Box>

              {/* Request bubble */}
              <Box
                sx={{
                  p: 1.8,
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#2B140B' : '#3D1A00',
                  mb: 2.5,
                  border: isDark ? '1px solid #4D2615' : '1px solid #5C2A00'
                }}
              >
                <Typography variant="caption" sx={{ color: '#FF8A3D', fontWeight: 800, display: 'block', mb: 0.3 }}>
                  {isEn ? 'Your request:' : 'Yêu cầu của bạn:'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#FFF7ED', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.88rem' }}
                >
                  {isEn ? '"Quiet café for 2 to meet deadline with power outlets"' : '"Quán cà phê yên tĩnh chạy deadline 2 người có ổ điện"'}
                </Typography>
              </Box>

              {/* JSON response */}
              <pre
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  lineHeight: 1.7,
                  overflowX: 'auto',
                  color: '#FDE8CC'
                }}
              >
                {`{
  "${isEn ? 'venue' : 'dia_diem'}": "The Workshop Coffee",
  "match_score": `}
                <span style={{ color: '#FF7A1A', fontWeight: 800 }}>9.8</span>
                {`,
  "${isEn ? 'purpose' : 'muc_dich'}": "${isEn ? 'Study & Meet Deadlines' : 'Học tập & Chạy deadline'}",
  "${isEn ? 'reasons' : 'ly_do_de_xuat'}": [
    `}
                <span style={{ color: '#FCD34D' }}>
                  {isEn ? '"Spacious work tables, abundant power outlets"' : '"Bàn làm việc lớn, nhiều ổ cắm điện"'}
                </span>
                {`,
    `}
                <span style={{ color: '#FCD34D' }}>
                  {isEn ? '"High-speed Wi-Fi, quiet focused environment"' : '"Wi-Fi tốc độ cao, không gian yên tĩnh"'}
                </span>
                {`,
    `}
                <span style={{ color: '#FCD34D' }}>
                  {isEn ? '"Artisanal handcrafted specialty coffee"' : '"Cà phê Specialty pha thủ công"'}
                </span>
                {`
  ],
  "${isEn ? 'distance' : 'khoang_cach'}": `}
                <span style={{ color: '#86EFAC' }}>"0.8 km"</span>
                {`,
  "${isEn ? 'status' : 'trang_thai'}": `}
                <span style={{ color: '#86EFAC' }}>{isEn ? '"Ready_for_Maps_navigation"' : '"San_sang_chi_duong_Maps"'}</span>
                {`
}`}
              </pre>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
