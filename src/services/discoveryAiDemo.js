import { normalizeSearch } from '../utils/localization.js'

// Local demo only. No model or customer-review provider is called here.
const intents = [
  { words: ['cafe', 'coffee', 'ca phe'], category: true, matches: v => v.category === 'Café' },
  { words: ['pizza', 'nha hang', 'restaurant'], category: true, matches: v => v.category === 'Restaurant' },
  { words: ['bia', 'beer', 'bar'], category: true, matches: v => v.category === 'Other F&B' },
  { words: ['matcha', 'dessert', 'trang mieng', 'banh ngot'], category: true, matches: v => v.category === 'Dessert' },
  { words: ['date', 'hen ho', 'romantic', 'lang man'], matches: v => v.purposes.includes('Date') },
  { words: ['work', 'study', 'deadline', 'lam viec', 'hoc'], matches: v => v.purposes.includes('Study / Work') },
  { words: ['quiet', 'yen tinh'], matches: v => v.atmosphere.includes('Quiet') },
  { words: ['cozy', 'am cung'], matches: v => v.atmosphere.includes('Cozy') },
  { words: ['group', 'nhom', 'ban be', 'friends'], matches: v => v.groupSizes.includes('3-5 people') },
  { words: ['outdoor', 'ngoai troi'], matches: v => v.atmosphere.includes('Outdoor') },
  { words: ['outlet', 'outlets', 'o cam'], matches: v => v.amenities.includes('Power outlets') },
  { words: ['wifi', 'wi fi', 'wi-fi'], matches: v => v.amenities.includes('Wi-Fi') },
]

function contains(text, phrase) {
  return ` ${text} `.includes(` ${phrase} `)
}

export function rankDemoVenues(candidates, prompts) {
  const text = normalizeSearch(prompts.slice(0, 3).join(' ')).replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()
  const active = intents.filter(intent => intent.words.some(word => contains(text, word)))
  const categories = active.filter(intent => intent.category)
  const named = candidates.filter(v => contains(text, normalizeSearch(v.name)))
  return candidates.flatMap(venue => {
    if (named.length && !named.includes(venue)) return []
    if (categories.length && !categories.some(intent => intent.matches(venue))) return []
    const matched = active.filter(intent => intent.matches(venue)).length
    const lexicalMatch = text && normalizeSearch([venue.name, venue.description, venue.descriptionVi, ...venue.tags].join(' ')).includes(text)
    if (text && !matched && !lexicalMatch && !named.includes(venue)) return []
    const coverage = active.length ? matched / active.length : 1
    const matchScore = Math.min(9.8, Math.round((6.5 + coverage * 3 + venue.rating * 0.05) * 10) / 10)
    return [{ ...venue, matchScore, reviewSource: 'demo' }]
  }).sort((a, b) => b.matchScore - a.matchScore || a.distanceKm - b.distanceKm)
}

export function searchWithDemoAi({ candidates, prompts, signal, delayMs = 1800 }) {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Search cancelled', 'AbortError')) }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve(rankDemoVenues(candidates, prompts))
    }, delayMs)
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}
