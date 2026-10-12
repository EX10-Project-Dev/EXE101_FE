import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Divider
} from '@mui/material'
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { FILTER_OPTIONS } from '../data/mockVenues'
import { useTheme } from '../contexts/ThemeContext'

export default function CriteriaFilterModal({ open, onClose, criteria, setCriteria, onApply }) {
  const { isDark } = useTheme()

  const handleToggleSingle = (field, value) => {
    setCriteria((prev) => ({ ...prev, [field]: prev[field] === value ? '' : value }))
  }

  const handleToggleAmenity = (amenityId) => {
    setCriteria((prev) => {
      const current = prev.amenities || []
      const updated = current.includes(amenityId)
        ? current.filter((item) => item !== amenityId)
        : [...current, amenityId]
      return { ...prev, amenities: updated }
    })
  }

  const handleReset = () => {
    setCriteria({
      purpose: '',
      budget: '',
      distance: 'near_me',
      groupSize: '',
      category: '',
      atmosphere: '',
      amenities: []
    })
  }

  const countActiveFilters = () => {
    let count = 0
    if (criteria.purpose) count++
    if (criteria.budget) count++
    if (criteria.distance && criteria.distance !== 'near_me') count++
    if (criteria.groupSize) count++
    if (criteria.category) count++
    if (criteria.atmosphere) count++
    if (criteria.amenities?.length) count += criteria.amenities.length
    return count
  }

  const chipSx = (selected) => ({
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.84rem',
    backgroundColor: selected
      ? '#EA580C'
      : isDark
      ? '#24120A'
      : 'transparent',
    color: selected
      ? '#ffffff'
      : isDark
      ? '#DCD2CB'
      : '#44403C',
    borderColor: selected
      ? '#EA580C'
      : isDark
      ? '#3E1F12'
      : '#D6D3D1',
    '&:hover': {
      backgroundColor: selected
        ? '#C2410C'
        : isDark
        ? '#30180D'
        : '#FFF7ED',
      borderColor: '#FDBA74'
    }
  })

  const SectionTitle = ({ num, label }) => (
    <Typography
      variant="subtitle2"
      fontWeight={800}
      color={isDark ? '#FFFFFF' : '#1C0A00'}
      mb={1.2}
    >
      {num}. {label}
    </Typography>
  )

  const ChipGroup = ({ options, field }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((opt) => {
        const val = opt.id
        const selected = criteria[field] === val
        return (
          <Chip
            key={val}
            label={opt.label + (opt.desc ? ` (${opt.desc})` : '')}
            onClick={() => handleToggleSingle(field, val)}
            variant={selected ? 'filled' : 'outlined'}
            sx={chipSx(selected)}
          />
        )
      })}
    </Box>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: { xs: 1, sm: 2 },
          backgroundColor: isDark ? '#1C0D06' : '#FFFFFF',
          border: isDark ? '1.5px solid #3E1F12' : '1px solid #FDE8CC',
          boxShadow: isDark
            ? '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 24px rgba(234, 88, 12, 0.15)'
            : '0 20px 40px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '12px',
              backgroundColor: isDark ? '#2B160D' : '#FFF7ED',
              border: isDark ? '1px solid #4D2615' : '1px solid #FDBA74',
              color: '#FF7A1A',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SlidersHorizontal size={20} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={900} color={isDark ? '#FFFFFF' : '#1C0A00'}>
              Bộ lọc tiêu chí tìm kiếm
            </Typography>
            <Typography variant="caption" color={isDark ? '#A1948B' : '#78716C'}>
              Tùy chỉnh 7 tiêu chí để FIND&amp;GO tìm quán chuẩn gu nhất
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: isDark ? '#A1948B' : '#78716C' }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: isDark ? '#33190E' : '#FDE8CC' }} />

      <DialogContent sx={{ py: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <SectionTitle num={1} label="Mục đích đi quán (Purpose)" />
            <ChipGroup options={FILTER_OPTIONS.purposes} field="purpose" />
          </Box>
          <Box>
            <SectionTitle num={2} label="Ngân sách mỗi người (Budget)" />
            <ChipGroup options={FILTER_OPTIONS.budget} field="budget" />
          </Box>
          <Box>
            <SectionTitle num={3} label="Khoảng cách & Bán kính (Distance)" />
            <ChipGroup options={FILTER_OPTIONS.distance} field="distance" />
          </Box>
          <Box>
            <SectionTitle num={4} label="Số lượng người (Group Size)" />
            <ChipGroup options={FILTER_OPTIONS.groupSizes} field="groupSize" />
          </Box>
          <Box>
            <SectionTitle num={5} label="Thể loại địa điểm (Category)" />
            <ChipGroup options={FILTER_OPTIONS.categories} field="category" />
          </Box>
          <Box>
            <SectionTitle num={6} label="Không gian & Bầu không khí (Atmosphere)" />
            <ChipGroup options={FILTER_OPTIONS.atmosphere} field="atmosphere" />
          </Box>

          {/* Amenities (multi-select) */}
          <Box>
            <SectionTitle num={7} label="Tiện ích cần có (Amenities — Chọn nhiều)" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {FILTER_OPTIONS.amenities.map((am) => {
                const selected = (criteria.amenities || []).includes(am.id)
                return (
                  <Chip
                    key={am.id}
                    label={am.label}
                    onClick={() => handleToggleAmenity(am.id)}
                    variant={selected ? 'filled' : 'outlined'}
                    sx={chipSx(selected)}
                  />
                )
              })}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: isDark ? '#33190E' : '#FDE8CC' }} />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleReset}
          startIcon={<RotateCcw size={16} />}
          sx={{ textTransform: 'none', color: isDark ? '#A1948B' : '#78716C', fontWeight: 700 }}
        >
          Đặt lại bộ lọc
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none', color: isDark ? '#A1948B' : '#78716C' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onApply()
              onClose()
            }}
            sx={{
              borderRadius: '12px',
              px: 3,
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #FF6E1A 0%, #EA580C 100%)',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)'
              }
            }}
          >
            Áp dụng {countActiveFilters() > 0 ? `(${countActiveFilters()})` : ''}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
