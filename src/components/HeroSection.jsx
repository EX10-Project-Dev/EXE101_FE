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
import { POPULAR_PROMPTS } from '../data/mockVenues'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

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
  const { t, isEn } = useLanguage()
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
          : 'radial-gradient(ellipse 90% 70% at 50% -15%, #FDBA74 0%, #FED7AA 35%, #FFE7D1 70%, #FFF0E2 100%)',
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
            : 'radial-gradient(circle, rgba(249, 115, 22, 0.28) 0%, transparent 70%)',
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
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
              {t('heroBadge')}
            </Typography>
          </Box>

          {/* Main Headline */}
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
            {isEn ? (
              <>
                FIND THE RIGHT PLACE{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #FF802B 0%, #EA580C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  FOR THE RIGHT OCCASION
                </Box>
              </>
            ) : (
              <>
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
              </>
            )}
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
            {t('heroSubtitle')}
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

        {/* Search Box Card (Thu hẹp và căn chỉnh cân đối) */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: { xs: '100%', sm: 640, md: 680 },
            mx: 'auto',
            p: { xs: 2, sm: 2.2 },
            borderRadius: '22px',
            boxShadow: isDark
              ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(234, 88, 12, 0.12)'
              : '0 18px 45px rgba(234, 88, 12, 0.10)',
            border: isDark ? '1.5px solid #3E1F12' : '1.5px solid rgba(253, 186, 116, 0.6)',
            backgroundColor: isDark ? '#201009' : '#ffffff',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Active prompt tags */}
          {prompts.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.8 }}>
              {prompts.map((p, idx) => (
                <Chip
                  key={idx}
                  label={`${idx + 1}. ${p}`}
                  onDelete={() => handleRemovePrompt(idx)}
                  deleteIcon={<span style={{ fontSize: '13px', fontWeight: 800, paddingRight: '2px' }}>✕</span>}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#2D160C' : '#FFF7ED',
                    color: isDark ? '#FED7AA' : '#C2410C',
                    border: isDark ? '1px solid #572A16' : '1px solid #FDBA74',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    py: 1.8
                  }}
                />
              ))}
            </Box>
          )}

          {/* Input row: Căn chỉnh chiều cao đồng đều 48px và tỷ lệ cân đối */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={
                prompts.length === 0
                  ? (isEn ? 'e.g., "Quiet café with power outlets to work..."' : 'Ví dụ: "Cà phê yên tĩnh chạy deadline..."')
                  : prompts.length < 3
                  ? (isEn ? `Add requirement #${prompts.length + 1} (up to 3)...` : `Thêm yêu cầu thứ ${prompts.length + 1} (tối đa 3)...`)
                  : (isEn ? '3 criteria added. Click Search!' : 'Đã đủ 3 yêu cầu. Nhấn Tìm quán!')
              }
              value={currentInput}
              disabled={prompts.length >= 3}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              InputProps={{
                sx: {
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#160B06' : '#FAFAF9',
                  color: isDark ? '#FFFFFF' : '#1C0A00',
                  fontSize: '0.92rem',
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

            {prompts.length < 3 && (
              <Button
                variant="outlined"
                disabled={!currentInput.trim()}
                onClick={handleAddPrompt}
                sx={{
                  height: 48,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  px: 2,
                  minWidth: { xs: '100%', sm: 125 },
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  borderColor: isDark ? '#4D2615' : '#FDBA74',
                  color: isDark ? '#FED7AA' : '#C2410C',
                  backgroundColor: isDark ? '#26130A' : 'transparent',
                  '&:hover': {
                    borderColor: '#EA580C',
                    backgroundColor: isDark ? '#33190E' : '#FFF7ED'
                  },
                  '&:disabled': {
                    opacity: 0.45,
                    borderColor: isDark ? '#33190E' : '#E7E5E4',
                    color: isDark ? '#7E7067' : '#A8A29E'
                  }
                }}
              >
                {t('addCriteriaBtn')}
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
              sx={{
                height: 48,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                px: 2.8,
                minWidth: { xs: '100%', sm: 110 },
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                  boxShadow: '0 6px 20px rgba(249, 115, 22, 0.5)'
                },
                '&:disabled': { opacity: 0.65, color: '#ffffff' }
              }}
            >
              {isLoading ? t('searchingBtn') : t('searchBtn')}
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
                {isEn ? 'Detailed Criteria' : 'Tiêu chí chi tiết'} {criteriaCount > 0 ? `(${criteriaCount})` : ''}
              </Button>

              <Button
                variant="text"
                size="small"
                onClick={handleTriggerLocation}
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
                {locationState ? t('located') : t('nearMe')}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ color: isDark ? '#7E7067' : '#A8A29E', fontWeight: 500 }}
            >
              {isEn ? 'Supports 1 – 3 natural language prompts' : 'Hỗ trợ 1 – 3 lệnh tìm kiếm tự nhiên'}
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
            {isEn ? 'Popular recommendations by locals:' : 'Nhu cầu phổ biến của người Việt:'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {(isEn
              ? [
                  'Quiet café with outlets to meet deadlines for 2',
                  'Cozy and romantic restaurant for tonight’s date',
                  'Spacious spot with great drinks for a 5-person group',
                  'Aesthetic café with nice view and photo spots near me'
                ]
              : POPULAR_PROMPTS
            ).map((promptText, i) => (
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
