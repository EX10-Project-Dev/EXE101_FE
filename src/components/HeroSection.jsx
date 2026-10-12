import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Alert
} from '@mui/material'
import {
  Search,
  Plus,
  Trash2,
  SlidersHorizontal,
  Sparkles,
  Navigation
} from 'lucide-react'
import { POPULAR_PROMPTS } from '../data/mockVenues'
import { useTheme } from '../contexts/ThemeContext'

export default function HeroSection({
  prompts,
  setPrompts,
  onSearch,
  onOpenFilter,
  criteriaCount,
  onGetLocation,
  locationState,
  isLoading
}) {
  const { isDark } = useTheme()
  const [currentInput, setCurrentInput] = useState('')
  const [locationAlert, setLocationAlert] = useState('')

  const handleAddPrompt = () => {
    const text = currentInput.trim()
    if (!text || prompts.length >= 3) return
    setPrompts([...prompts, text])
    setCurrentInput('')
  }

  const handleRemovePrompt = (index) => {
    setPrompts(prompts.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentInput.trim() && prompts.length < 3) {
        handleAddPrompt()
      } else {
        onSearch()
      }
    }
  }

  const handleSelectQuickPrompt = (quickText) => {
    if (!prompts.includes(quickText) && prompts.length < 3) {
      setPrompts([...prompts, quickText])
    }
  }

  const handleTriggerLocation = () => {
    if (!navigator.geolocation) {
      setLocationAlert('Trình duyệt không hỗ trợ định vị GPS.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onGetLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationAlert('Đã nhận diện vị trí hiện tại!')
        setTimeout(() => setLocationAlert(''), 4000)
      },
      () => {
        setLocationAlert('Không lấy được vị trí. Vui lòng cấp quyền truy cập vị trí.')
        setTimeout(() => setLocationAlert(''), 5000)
      }
    )
  }

  return (
    <Box
      sx={{
        pt: { xs: 7, md: 10 },
        pb: { xs: 7, md: 9 },
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 90% 65% at 50% -10%, #2A140A 0%, #170B06 50%, #120803 100%)'
          : 'radial-gradient(ellipse 80% 60% at 50% -10%, #FED7AA 0%, #FFF7ED 55%, #FFFFFF 100%)',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Decorative Warm Ambient Glows */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 500,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 107, 0, 0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251, 146, 60, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top Badge */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.7,
              borderRadius: '50px',
              backgroundColor: isDark ? 'rgba(45, 22, 13, 0.8)' : '#FFF7ED',
              color: isDark ? '#FED7AA' : '#C2410C',
              border: isDark ? '1px solid rgba(89, 43, 24, 0.8)' : '1px solid #FDBA74',
              mb: 2.5,
              boxShadow: isDark
                ? '0 2px 14px rgba(0, 0, 0, 0.4)'
                : '0 2px 8px rgba(234, 88, 12, 0.10)'
            }}
          >
            <Sparkles size={15} color="#FF7A1A" />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
              Trí tuệ AI gợi ý F&amp;B theo đúng ngữ cảnh &amp; tâm trạng
            </Typography>
          </Box>

          {/* Main Headline (Bold white like SPOTLY "KNOW WHERE TO GO") */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: '-1.5px',
              fontSize: { xs: '2.3rem', sm: '3.1rem', md: '3.8rem' },
              lineHeight: 1.1,
              color: isDark ? '#FFFFFF' : '#1C0A00',
              mb: 2.2,
              textTransform: 'uppercase'
            }}
          >
            Tìm đúng quán{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF802B 0%, #EA580C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              cho đúng nhu cầu
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: isDark ? '#C7BEB7' : '#57534E',
              fontSize: { xs: '1rem', sm: '1.15rem' },
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.65
            }}
          >
            Context-aware place recommendations for exactly what you need right now.
            Chỉ cần nhập dịp gặp mặt hoặc điều bạn muốn — hệ thống xếp hạng &amp; giải thích lý do tức thì.
          </Typography>
        </Box>

        {/* Location alert */}
        {locationAlert && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: '14px',
              backgroundColor: isDark ? '#23120A' : '#FFF7ED',
              color: isDark ? '#FED7AA' : '#C2410C',
              border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74'
            }}
            onClose={() => setLocationAlert('')}
          >
            {locationAlert}
          </Alert>
        )}

        {/* Search Box Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.2, sm: 3 },
            borderRadius: '28px',
            boxShadow: isDark
              ? '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 20px rgba(234, 88, 12, 0.15)'
              : '0 20px 60px rgba(234, 88, 12, 0.12)',
            border: isDark ? '1.5px solid #3E1F12' : '1.5px solid rgba(253, 186, 116, 0.6)',
            backgroundColor: isDark ? '#201009' : '#ffffff',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Active prompt tags */}
          {prompts.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {prompts.map((p, idx) => (
                <Chip
                  key={idx}
                  label={`${idx + 1}. ${p}`}
                  onDelete={() => handleRemovePrompt(idx)}
                  deleteIcon={<Trash2 size={13} />}
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: isDark ? '#2D160C' : '#FFF7ED',
                    color: isDark ? '#FED7AA' : '#C2410C',
                    border: isDark ? '1px solid #572A16' : '1px solid #FDBA74',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    py: 2.2
                  }}
                />
              ))}
            </Box>
          )}

          {/* Input row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: 'stretch'
            }}
          >
            <TextField
              fullWidth
              placeholder={
                prompts.length === 0
                  ? 'Ví dụ: "Quán cà phê yên tĩnh chạy deadline 2 người có ổ điện..."'
                  : prompts.length < 3
                  ? `Thêm yêu cầu thứ ${prompts.length + 1} (tối đa 3)...`
                  : 'Đã đủ 3 yêu cầu. Nhấn Tìm quán!'
              }
              value={currentInput}
              disabled={prompts.length >= 3}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: '14px',
                  backgroundColor: isDark ? '#160B06' : '#FAFAF9',
                  color: isDark ? '#FFFFFF' : '#1C0A00',
                  fontSize: '0.97rem',
                  '& fieldset': {
                    borderColor: isDark ? '#381C10' : '#E7E5E4'
                  },
                  '&:hover fieldset': {
                    borderColor: '#EA580C'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF7A1A'
                  },
                  '& input::placeholder': {
                    color: isDark ? '#82746B' : '#A8A29E',
                    opacity: 1
                  }
                }
              }}
            />

            {prompts.length < 3 && currentInput.trim() && (
              <Button
                variant="outlined"
                onClick={handleAddPrompt}
                startIcon={<Plus size={16} />}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  whiteSpace: 'nowrap',
                  borderColor: isDark ? '#4D2615' : '#FDBA74',
                  color: isDark ? '#FED7AA' : '#C2410C',
                  backgroundColor: isDark ? '#26130A' : 'transparent',
                  '&:hover': {
                    borderColor: '#EA580C',
                    backgroundColor: isDark ? '#33190E' : '#FFF7ED'
                  }
                }}
              >
                Thêm yêu cầu
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => {
                if (currentInput.trim() && prompts.length < 3) {
                  setPrompts([...prompts, currentInput.trim()])
                  setCurrentInput('')
                }
                onSearch()
              }}
              disabled={isLoading}
              startIcon={<Search size={18} />}
              sx={{
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                px: 3.5,
                py: { xs: 1.3, sm: 1.5 },
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
                boxShadow: '0 4px 18px rgba(249, 115, 22, 0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                  boxShadow: '0 6px 24px rgba(249, 115, 22, 0.55)'
                },
                '&:disabled': { opacity: 0.65, color: '#ffffff' }
              }}
            >
              {isLoading ? 'Đang phân tích...' : 'Tìm quán'}
            </Button>
          </Box>

          {/* Quick tools row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
              pt: 1.5,
              borderTop: isDark ? '1px solid #331A0F' : '1px solid #F5F5F4',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                variant="text"
                size="small"
                onClick={onOpenFilter}
                startIcon={<SlidersHorizontal size={15} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: criteriaCount > 0 ? '#FF7A1A' : isDark ? '#B3A8A0' : '#57534E',
                  borderRadius: '8px',
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
                    color: '#FF7A1A'
                  }
                }}
              >
                Tiêu chí chi tiết {criteriaCount > 0 ? `(${criteriaCount})` : ''}
              </Button>

              <Button
                variant="text"
                size="small"
                onClick={handleTriggerLocation}
                startIcon={<Navigation size={15} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: locationState ? '#22C55E' : isDark ? '#B3A8A0' : '#57534E',
                  borderRadius: '8px',
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: isDark ? '#1C291F' : '#F0FDF4'
                  }
                }}
              >
                {locationState ? 'Đã bật vị trí' : 'Gần tôi (GPS)'}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ color: isDark ? '#7E7067' : '#A8A29E', fontWeight: 500 }}
            >
              Hỗ trợ 1 – 3 lệnh tìm kiếm tự nhiên
            </Typography>
          </Box>
        </Paper>

        {/* Quick prompt suggestions */}
        <Box sx={{ mt: 3.5, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: isDark ? '#9E9289' : '#78716C',
              display: 'block',
              mb: 1.2,
              fontWeight: 600
            }}
          >
            Nhu cầu phổ biến của người Việt:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {POPULAR_PROMPTS.map((promptText, i) => (
              <Chip
                key={i}
                label={promptText}
                onClick={() => handleSelectQuickPrompt(promptText)}
                clickable
                sx={{
                  borderRadius: '20px',
                  backgroundColor: isDark ? '#1E0F08' : '#FFFFFF',
                  color: isDark ? '#D8CFCA' : '#44403C',
                  border: isDark ? '1px solid #361B0F' : '1px solid #E7E5E4',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
                    color: '#FF7A1A',
                    borderColor: '#EA580C',
                    boxShadow: '0 3px 12px rgba(249, 115, 22, 0.25)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
