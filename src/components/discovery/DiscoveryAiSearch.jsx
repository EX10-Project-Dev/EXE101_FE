import { X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import VenueAiReview from './VenueAiReview'

export default function DiscoveryAiSearch({ search, venue, onCancel, onRetry }) {
  const { isEn } = useLanguage()
  const pending = search.status === 'loading'
  return <section className="dg-ai-search" aria-busy={pending}>
    <header className="dg-ai-search-heading"><div><small>{isEn ? 'Matches for' : 'Kết quả phù hợp với'}</small><h2>{search.query}</h2></div><span className="dg-ai-demo-label">AI demo</span><button type="button" onClick={onCancel} aria-label={isEn ? 'Close search results' : 'Đóng kết quả tìm kiếm'}><X size={21} /></button></header>
    {pending && <><div className="dg-ai-processing" role="status"><span className="dg-ai-sparkles" aria-hidden="true">✦<i>✦</i><b>✦</b></span><div><strong>{isEn ? `Matching results for “${search.query}”` : `Đang tìm kết quả cho “${search.query}”`}</strong><p>{isEn ? 'Comparing your request with sample venue data…' : 'Đang đối chiếu nhu cầu với dữ liệu quán mẫu…'}</p><div className="dg-ai-progress" aria-hidden="true"><span /></div></div></div><div className="dg-ai-skeletons" aria-hidden="true">{[0, 1, 2].map(i => <div key={i}><span /><span /><span /></div>)}</div></>}
    {search.status === 'error' && <div className="dg-ai-search-error" role="alert"><p>{isEn ? 'Could not finish this search. Please try again.' : 'Chưa thể hoàn tất tìm kiếm. Bạn thử lại nhé.'}</p><button type="button" onClick={onRetry}>{isEn ? 'Try again' : 'Thử lại'}</button></div>}
    {search.status === 'success' && venue && <><p className="dg-ai-venue-name">{venue.name}</p><VenueAiReview venue={venue} /></>}
  </section>
}
