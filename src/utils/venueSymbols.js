const VENUE_SYMBOLS = {
  Café: '☕', Cafe: '☕', Restaurant: '🥘', Food: '🥘', Bar: '🍷',
  'Other F&B': '🍷', Brunch: '🥞', Dessert: '🍰',
  'Tea & Beverage': '🧋', 'Fast Food': '🍔',
}

export const venueSymbol = (venue) => venue?.tags?.includes('Italian') ? '🍕' : VENUE_SYMBOLS[venue?.category] || '📍'
