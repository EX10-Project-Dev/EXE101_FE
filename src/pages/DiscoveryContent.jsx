import { useState, useEffect } from 'react'
import ScoreMarquee from '../components/ScoreMarquee'
import RecommendationSection from '../components/RecommendationSection'
import DiscoveryMapSection from '../components/DiscoveryMapSection'
import CriteriaFilterModal from '../components/CriteriaFilterModal'
import VenueDetailModal from '../components/VenueDetailModal'
import CuratedCollections from '../components/CuratedCollections'
import Footer from '../components/Footer'
import { getRecommendations } from '../services/recommendationService'
import { MOCK_VENUES } from '../data/mockVenues'

export default function DiscoveryContent() {
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
  const [isLoading, setIsLoading] = useState(true)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)

  // Tải danh sách đề xuất ban đầu
  useEffect(() => {
    let cancelled = false
    const hashId = window.location.hash.slice(1)
    const targetId = hashId === 'venue-search' ? 'recommendations-section' : hashId
    if (targetId === 'recommendations-section') {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'instant' })
    }
    getRecommendations({ prompts: [], criteria: {}, location: null })
      .then((results) => { if (!cancelled) setVenues(results) })
      .catch((err) => { if (!cancelled) console.error('Lỗi khi tải gợi ý:', err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
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

  const handleSelectCollection = (col) => {
    if (col.query) {
      setPrompts([col.query])
      setIsLoading(true)
      getRecommendations({
        prompts: [col.query],
        criteria,
        location
      })
        .then((res) => setVenues(res))
        .finally(() => {
          setIsLoading(false)
          const el = document.getElementById('recommendations-section')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        })
    }
  }

  return (
    <>
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

      <DiscoveryMapSection onOpenDetail={(venue) => setSelectedVenue(venue)} />

      {/* 5. Curated Collections Spotlight (Curated Collections, Made Personal) */}
      <CuratedCollections onSelectCollection={handleSelectCollection} />

      {/* 7. Footer */}
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
        key={selectedVenue?.id || 'closed'}
        open={Boolean(selectedVenue)}
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
      />
    </>
  )
}
