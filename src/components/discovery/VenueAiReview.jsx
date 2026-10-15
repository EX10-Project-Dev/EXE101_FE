import { useLanguage } from '../../contexts/LanguageContext'
import { demoVenueReviews } from '../../data/demoVenueReviews'

export default function VenueAiReview({ venue }) {
  const { language, isEn } = useLanguage()
  const summary = demoVenueReviews[venue.id]?.[language] || (isEn ? venue.description : venue.descriptionVi)
  return <article className="dg-ai-review" aria-label={isEn ? `Demo review of ${venue.name}` : `Đánh giá demo về ${venue.name}`}>
    <header><span aria-hidden="true">💖</span><strong>{venue.matchScore.toFixed(1)}</strong><span>/ 10 {isEn ? 'overall place match' : 'độ phù hợp tổng thể'}</span></header>
    <p>{summary.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}</p>
    <small>{isEn ? 'AI demo · Summary of sample venue data' : 'AI demo · Tổng hợp từ dữ liệu quán mẫu'}</small>
  </article>
}
