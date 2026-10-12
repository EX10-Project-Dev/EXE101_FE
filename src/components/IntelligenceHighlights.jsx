import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material'
import { Sparkles, Brain, Map, Compass } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function IntelligenceHighlights() {
  const { isDark } = useTheme()

  const PILLARS = [
    {
      icon: <Sparkles size={24} />,
      bgColor: isDark ? '#2D160C' : '#FFF7ED',
      iconColor: '#FF7A1A',
      title: 'Xếp hạng & Giải thích lý do rõ ràng',
      body: 'Không đưa ra danh sách ngẫu nhiên. Mỗi đề xuất đều kèm theo lý do cụ thể vì sao quán phù hợp với tâm trạng và nhu cầu của bạn.'
    },
    {
      icon: <Compass size={24} />,
      bgColor: isDark ? '#1C291F' : '#ECFDF5',
      iconColor: '#22C55E',
      title: 'Tối ưu theo văn hóa F&B Việt Nam',
      body: 'Từ cà phê chạy deadline, trà sữa tám chuyện, ăn nhậu nhóm bạn đến hẹn hò sang trọng — được phân loại sát với thói quen người Việt.'
    },
    {
      icon: <Map size={24} />,
      bgColor: isDark ? '#29182E' : '#FAF5FF',
      iconColor: '#C084FC',
      title: 'Một chạm chuyển thẳng sang Google Maps',
      body: 'Sau khi chọn quán ưng ý, bạn lập tức mở Google Maps để định vị và nhận chỉ đường mà không cần đăng nhập hay thao tác rườm rà.'
    }
  ]

  return (
    <Box
      sx={{
        py: 9,
        background: isDark
          ? 'linear-gradient(180deg, #150A05 0%, #1A0D07 50%, #120803 100%)'
          : 'linear-gradient(180deg, #FFFBF8 0%, #FFF7ED 100%)',
        borderTop: isDark ? '1px solid #28140B' : '1px solid #FDE8CC',
        borderBottom: isDark ? '1px solid #28140B' : '1px solid #FDE8CC',
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        {/* Headline */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            icon={<Brain size={15} color="#FF7A1A" />}
            label="Lấy cảm hứng từ Context-Aware Intelligence"
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
            color={isDark ? '#FFFFFF' : '#1C0A00'}
            sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 1.5 }}
          >
            Hiểu đúng nơi chốn.{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF802B 0%, #EA580C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Không chỉ là tọa độ bản đồ.
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? '#B3A8A0' : '#57534E'}
            sx={{ maxWidth: 660, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.65 }}
          >
            Mỗi quán mang ý nghĩa khác nhau tùy vào việc bạn đi cùng ai và làm gì.
            FIND&amp;GO phân tích ngữ cảnh để trả về danh sách có điểm số và lý do minh bạch.
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
                    {p.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={isDark ? '#FFFFFF' : '#1C0A00'}
                      mb={0.5}
                    >
                      {p.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isDark ? '#B8ABA2' : '#57534E'}
                      lineHeight={1.65}
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
                  Yêu cầu của bạn:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#FFF7ED', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.88rem' }}
                >
                  "Quán cà phê yên tĩnh chạy deadline 2 người có ổ điện"
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
  "dia_diem": "The Workshop Coffee",
  "match_score": `}
                <span style={{ color: '#FF7A1A', fontWeight: 800 }}>9.8</span>
                {`,
  "muc_dich": "Học tập & Chạy deadline",
  "ly_do_de_xuat": [
    `}
                <span style={{ color: '#FCD34D' }}>"Bàn làm việc lớn, nhiều ổ cắm điện"</span>
                {`,
    `}
                <span style={{ color: '#FCD34D' }}>"Wi-Fi tốc độ cao, không gian yên tĩnh"</span>
                {`,
    `}
                <span style={{ color: '#FCD34D' }}>"Cà phê Specialty pha thủ công"</span>
                {`
  ],
  "khoang_cach": `}
                <span style={{ color: '#86EFAC' }}>"0.8 km"</span>
                {`,
  "trang_thai": `}
                <span style={{ color: '#86EFAC' }}>"San_sang_chi_duong_Maps"</span>
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
