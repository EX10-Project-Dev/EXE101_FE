import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import ScoreMarquee from '../components/ScoreMarquee'
import RecommendationSection from '../components/RecommendationSection'
import CriteriaFilterModal from '../components/CriteriaFilterModal'
import VenueDetailModal from '../components/VenueDetailModal'
import IntelligenceHighlights from '../components/IntelligenceHighlights'
import Footer from '../components/Footer'
import { getRecommendations } from '../services/recommendationService'
import { MOCK_VENUES } from '../data/mockVenues'
import { useTheme } from '../contexts/ThemeContext'

export default function LandingPage() {
  const { isDark } = useTheme()
  const [prompts, setPrompts] = useState([])
  const [criteria, setCriteria] = useState({
    purpose: '',
    budget: '',
    distance: 'near_me',
    groupSize: '',
    category: '',
    atmosphere: '',
    amenities: []
  })
  const [location, setLocation] = useState(null)
  const [venues, setVenues] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)

  // Tải danh sách đề xuất ban đầu
  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const results = await getRecommendations({
        prompts,
        criteria,
        location
      })
      setVenues(results)
    } catch (err) {
      console.error('Lỗi khi tải gợi ý:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilters = () => {
    handleSearch()
    // Cuộn tới danh sách quán
    const el = document.getElementById('recommendations-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleResetFilters = () => {
    setPrompts([])
    setCriteria({
      purpose: '',
      budget: '',
      distance: 'near_me',
      groupSize: '',
      category: '',
      atmosphere: '',
      amenities: []
    })
    setLocation(null)
    setIsLoading(true)
    getRecommendations({ prompts: [], criteria: {}, location: null })
      .then((res) => setVenues(res))
      .finally(() => setIsLoading(false))
  }

  const countActiveCriteria = () => {
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? '#150A05' : '#FFFFFF',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* 1. Header Navigation */}
      <Navbar
        onStartSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {/* 2. Hero Section (Prompt 1-3, GPS Near Me, Quick Suggestion Chips) */}
      <HeroSection
        prompts={prompts}
        setPrompts={setPrompts}
        onSearch={() => {
          handleSearch()
          const el = document.getElementById('recommendations-section')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
        onOpenFilter={() => setFilterModalOpen(true)}
        criteriaCount={countActiveCriteria()}
        onGetLocation={(coords) => {
          setLocation(coords)
          handleSearch()
        }}
        locationState={location}
        isLoading={isLoading}
      />

      {/* 3. Atly-Style Match Score Marquee */}
      <ScoreMarquee
        onSelectCard={(selected) => {
          if (typeof selected === 'object' && selected !== null) {
            setSelectedVenue(selected)
          } else {
            const found =
              venues.find((v) => v.name.toLowerCase().includes(String(selected).toLowerCase())) ||
              MOCK_VENUES.find((v) => v.name.toLowerCase().includes(String(selected).toLowerCase()))
            if (found) setSelectedVenue(found)
          }
        }}
      />

      {/* 4. Recommendation Results Section (Order returned by backend + Match score & reasons) */}
      <RecommendationSection
        venues={venues}
        isLoading={isLoading}
        onOpenDetail={(venue) => setSelectedVenue(venue)}
        onResetFilters={handleResetFilters}
        activePromptCount={prompts.length}
        activeCriteriaCount={countActiveCriteria()}
      />

      {/* 5. Atly Intelligence Inspired Highlights */}
      <IntelligenceHighlights />

      {/* 6. Footer */}
      <Footer />

      {/* Criteria Filter Modal (7 tiêu chí chuẩn từ README.md) */}
      <CriteriaFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        criteria={criteria}
        setCriteria={setCriteria}
        onApply={handleApplyFilters}
      />

      {/* Venue Detail Modal + Direct Google Maps Navigation */}
      <VenueDetailModal
        open={Boolean(selectedVenue)}
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
      />
    </Box>
  )
}
