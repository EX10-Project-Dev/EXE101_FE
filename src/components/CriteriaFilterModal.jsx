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
import { FILTER_OPTIONS } from '../data/mockVenues'
import { useLanguage } from '../contexts/LanguageContext'

const EN_OPTION_LABELS = {
  // Purposes
  'Study / Work': { label: 'Study & Work' },
  'Eat & Drink': { label: 'Good Food & Dining' },
  'Hangout': { label: 'Coffee & Catch-up' },
  'Date': { label: 'Romantic Date' },
  'Group Gathering': { label: 'Group Gathering' },
  'Explore': { label: 'Explore New Spots' },

  // Budget
  '<50k': { label: 'Under 50k', desc: 'Budget friendly' },
  '50k-100k': { label: '50k - 100k', desc: 'Standard café & tea' },
  '100k-250k': { label: '100k - 250k', desc: 'Mid-range bistro' },
  '250k-500k': { label: '250k - 500k', desc: 'Date night, upscale' },
  '>500k': { label: 'Above 500k', desc: 'Premium & fine dining' },

  // Distance
  'near_me': { label: 'Closest to me (< 1 km)' },
  '3km': { label: 'Within 3 km' },
  '5km': { label: 'Within 5 km' },
  '10km': { label: 'City-wide (< 10 km)' },

  // Group size
  'Solo': { label: 'Solo (1 person)' },
  '2 people': { label: '2 people (Couple / Friends)' },
  '3-5 people': { label: '3 - 5 people (Small group)' },
  '6+ people': { label: '6+ people (Large group)' },

  // Categories
  'Café': { label: 'Café' },
  'Restaurant': { label: 'Restaurant' },
  'Tea & Beverage': { label: 'Tea & Beverages' },
  'Dessert': { label: 'Dessert & Bakery' },
  'Fast Food': { label: 'Fast Food' },
  'Other F&B': { label: 'Craft Beer / Bar / Other' },

  // Atmosphere
  'Quiet': { label: 'Quiet & Focused' },
  'Cozy': { label: 'Cozy & Intimate' },
  'Social': { label: 'Lively & Social' },
  'Spacious': { label: 'Spacious & Airy' },
  'Outdoor': { label: 'Outdoor / Rooftop' },
  'Aesthetic': { label: 'Aesthetic & Photogenic' },

  // Amenities
  'Wi-Fi': { label: 'High-speed Wi-Fi' },
  'Power Outlets': { label: 'Power Outlets' },
  'Group Seating': { label: 'Group Seating' },
  'Air Conditioning': { label: 'Air Conditioning' },
  'Parking': { label: 'Spacious Parking' },
  'Restroom': { label: 'Clean Restroom' }
}

  const SectionTitle = ({ num, label }) => (
    <Typography
      variant="subtitle2"
      fontWeight={800}
      sx={{ color: '#1C0A00', mb: 1.2 }}
    >
      {num}. {label}
    </Typography>
  )

  const ChipGroup = ({ options, field, criteria, isEn, handleToggleSingle, chipSx }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((opt) => {
        const val = opt.id
        const selected = criteria[field] === val
        const enMeta = EN_OPTION_LABELS[val]
        const labelText = isEn && enMeta?.label ? enMeta.label : opt.label
        const descText = isEn && enMeta?.desc ? enMeta.desc : opt.desc
        return (
          <Chip
            key={val}
            label={labelText + (descText ? ` (${descText})` : '')}
            onClick={() => handleToggleSingle(field, val)}
            variant={selected ? 'filled' : 'outlined'}
            sx={chipSx(selected)}
          />
        )
      })}
    </Box>
  )


export default function CriteriaFilterModal({ open, onClose, criteria, setCriteria, onApply }) {
  const { isEn } = useLanguage()

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
      : 'transparent',
    color: selected
      ? '#ffffff'
      : '#44403C',
    borderColor: selected
      ? '#EA580C'
      : '#D6D3D1',
    '&:hover': {
      backgroundColor: selected
        ? '#C2410C'
        : '#FFF7ED',
      borderColor: '#FDBA74'
    }
  })

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
          backgroundColor: '#FFFFFF',
          border: '1px solid #FDE8CC',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Box>
          <Typography
            variant="h6"
            fontWeight={900}
            sx={{ color: '#1C0A00' }}
          >
            {isEn ? '7 Venue Criteria Filters' : 'Bộ lọc tiêu chí tìm kiếm'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#78716C' }}
          >
            {isEn
              ? 'Customize 7 criteria to discover spots tailored to your exact mood'
              : 'Tùy chỉnh 7 tiêu chí để FIND&GO tìm quán chuẩn gu nhất'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: '#78716C', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}
        >
          ✕
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: '#FDE8CC' }} />

      <DialogContent sx={{ py: 2.5, backgroundColor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <SectionTitle num={1} label={isEn ? 'Purpose' : 'Mục đích đi quán'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.purposes} field="purpose" />
          </Box>
          <Box>
            <SectionTitle num={2} label={isEn ? 'Budget per Person' : 'Ngân sách mỗi người'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.budget} field="budget" />
          </Box>
          <Box>
            <SectionTitle num={3} label={isEn ? 'Distance & Radius' : 'Khoảng cách & Bán kính'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.distance} field="distance" />
          </Box>
          <Box>
            <SectionTitle num={4} label={isEn ? 'Group Size' : 'Số lượng người'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.groupSizes} field="groupSize" />
          </Box>
          <Box>
            <SectionTitle num={5} label={isEn ? 'Category' : 'Thể loại địa điểm'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.categories} field="category" />
          </Box>
          <Box>
            <SectionTitle num={6} label={isEn ? 'Atmosphere' : 'Không gian & Bầu không khí'} />
            <ChipGroup criteria={criteria} isEn={isEn} handleToggleSingle={handleToggleSingle} chipSx={chipSx} options={FILTER_OPTIONS.atmosphere} field="atmosphere" />
          </Box>

          {/* Amenities (multi-select) */}
          <Box>
            <SectionTitle num={7} label={isEn ? 'Amenities (Select multiple)' : 'Tiện ích cần có (Chọn nhiều)'} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {FILTER_OPTIONS.amenities.map((am) => {
                const selected = (criteria.amenities || []).includes(am.id)
                const enMeta = EN_OPTION_LABELS[am.id]
                const labelText = isEn && enMeta?.label ? enMeta.label : am.label
                return (
                  <Chip
                    key={am.id}
                    label={labelText}
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

      <Divider sx={{ borderColor: '#FDE8CC' }} />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
        <Button
          onClick={handleReset}
          sx={{ textTransform: 'none', color: '#78716C', fontWeight: 700 }}
        >
          {isEn ? 'Reset Filters' : 'Đặt lại bộ lọc'}
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none', color: '#78716C' }}
          >
            {isEn ? 'Cancel' : 'Hủy'}
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
            {isEn
              ? `Apply ${countActiveFilters() > 0 ? `(${countActiveFilters()})` : ''}`
              : `Áp dụng ${countActiveFilters() > 0 ? `(${countActiveFilters()})` : ''}`}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
