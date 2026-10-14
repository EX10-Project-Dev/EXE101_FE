import { useState, useRef, useEffect } from 'react'
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
import { POPULAR_PROMPTS, MOCK_VENUES } from '../data/mockVenues'
import { useLanguage } from '../contexts/LanguageContext'

export default function SearchSection({
  prompts,
  setPrompts,
  onSearch,
  onOpenFilter,
  criteriaCount,
  onGetLocation,
  locationState,
  isLoading,
  venues = MOCK_VENUES,
  onSelectSuggestedVenue
}) {
  const { t, isEn } = useLanguage()
  const [currentInput, setCurrentInput] = useState('')
  const [locationAlert, setLocationAlert] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef(null)

  // Filter matching venues for live suggestion dropdown
  const matchingVenues = currentInput.trim()
    ? (venues || MOCK_VENUES).filter((v) => {
        const q = currentInput.trim().toLowerCase()
        return (
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          (v.tagline && v.tagline.toLowerCase().includes(q)) ||
          (v.address && v.address.toLowerCase().includes(q)) ||
          (v.purposes && v.purposes.some((p) => p.toLowerCase().includes(q))) ||
          (v.reasons && v.reasons.some((r) => r.toLowerCase().includes(q)))
        )
      }).slice(0, 5)
    : []

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddPrompt = () => {
    const text = currentInput.trim()
    if (!text || prompts.length >= 3) return
    setPrompts([...prompts, text])
    setCurrentInput('')
    setShowSuggestions(false)
  }

  const handleRemovePrompt = (index) => {
    setPrompts(prompts.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setShowSuggestions(false)
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
    // Automatically find best venue and focus on map
    const textLower = quickText.toLowerCase()
    const matched = (venues || MOCK_VENUES).find((v) =>
      (v.purposes && v.purposes.some((p) => textLower.includes(p.toLowerCase()))) ||
      v.reasons.some((r) => textLower.includes(r.toLowerCase())) ||
      v.name.toLowerCase().includes(textLower)
    )
    if (matched && onSelectSuggestedVenue) {
      onSelectSuggestedVenue(matched)
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
            <Box ref={searchContainerRef} sx={{ position: 'relative', flex: 1, width: '100%' }}>
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
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setCurrentInput(e.target.value)
                  setShowSuggestions(true)
                }}
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

              {/* Floating live suggestion dropdown */}
              {showSuggestions && matchingVenues.length > 0 && (
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 35,
                    mt: 1,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1.5px solid #FDBA74',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 16px 40px rgba(234, 88, 12, 0.2)'
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: '#FFF7ED',
                      borderBottom: '1px solid #FED7AA',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                      {isEn ? 'Suggested matching spots' : 'Địa điểm gợi ý phù hợp'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9A3412', fontSize: '0.74rem' }}>
                      {isEn ? 'Click to show on map' : 'Nhấn để hiện trên bản đồ'}
                    </Typography>
                  </Box>

                  {matchingVenues.map((venue) => (
                    <Box
                      key={venue.id}
                      onClick={() => {
                        onSelectSuggestedVenue?.(venue)
                        setCurrentInput('')
                        setShowSuggestions(false)
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.2,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        borderBottom: '1px solid #F5F5F4',
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover': {
                          backgroundColor: '#FFF7ED'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            backgroundColor: '#FFF0E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0
                          }}
                        >
                          {venue.category === 'Café'
                            ? '☕'
                            : venue.category === 'Restaurant'
                            ? '🍕'
                            : venue.category === 'Dessert'
                            ? '🍰'
                            : '🍻'}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1C0A00' }} noWrap>
                            {venue.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#78716C', display: 'block' }} noWrap>
                            {venue.address} • {venue.distanceKm} km
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 1.5 }}>
                        <Chip
                          label={`${venue.matchScore.toFixed(1)} / 10`}
                          size="small"
                          sx={{
                            backgroundColor: '#FFF7ED',
                            color: '#C2410C',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            border: '1px solid #FDBA74'
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.78rem',
                            color: '#EA580C',
                            fontWeight: 700,
                            display: { xs: 'none', sm: 'inline' }
                          }}
                        >
                          {isEn ? 'Map ➔' : 'Xem map ➔'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

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
