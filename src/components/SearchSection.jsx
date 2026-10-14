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
import { useLanguage } from '../contexts/LanguageContext'

export default function SearchSection({
  prompts,
  setPrompts,
  onSearch,
  onOpenFilter,
  criteriaCount,
  onGetLocation,
  locationState,
  isLoading
}) {
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
    <section id="venue-search" className="venue-search" aria-label={t('findVenuesCTA')}>
      <Container maxWidth="md">
        {/* Location alert */}
        {locationAlert && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: '14px',
              backgroundColor: '#FFF7ED',
              color: '#C2410C',
              border: '1px solid #FDBA74'
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
            boxShadow: '0 18px 45px rgba(234, 88, 12, 0.10)',
            border: '1.5px solid rgba(253, 186, 116, 0.6)',
            backgroundColor: '#ffffff',
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
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    color: '#C2410C',
                    border: '1px solid #FDBA74',
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
              slotProps={{
                htmlInput: { 'aria-label': isEn ? 'Describe your occasion' : 'Mô tả nhu cầu tìm quán' },
                input: { sx: {
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#FAFAF9',
                  color: '#1C0A00',
                  fontSize: '0.92rem',
                  '& fieldset': {
                    borderColor: '#E7E5E4'
                  },
                  '&:hover fieldset': {
                    borderColor: '#EA580C'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF7A1A'
                  },
                  '& input::placeholder': {
                    color: '#A8A29E',
                    opacity: 1
                  }
                } }
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
                  borderColor: '#FDBA74',
                  color: '#C2410C',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    borderColor: '#EA580C',
                    backgroundColor: '#FFF7ED'
                  },
                  '&:disabled': {
                    opacity: 0.45,
                    borderColor: '#E7E5E4',
                    color: '#A8A29E'
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
                  color: criteriaCount > 0 ? '#FF7A1A' : '#57534E',
                  borderRadius: '8px',
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: '#FFF7ED',
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
                  color: locationState ? '#22C55E' : '#57534E',
                  borderRadius: '8px',
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: '#F0FDF4'
                  }
                }}
              >
                {locationState ? t('located') : t('nearMe')}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ color: '#A8A29E', fontWeight: 500 }}
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
              color: '#78716C',
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
                  backgroundColor: '#FFFFFF',
                  color: '#44403C',
                  border: '1px solid #E7E5E4',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: '#FFF7ED',
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
    </section>
  )
}
