const VENUE_SYMBOLS = {
  Café: '☕', Cafe: '☕', 'Cà phê': '☕',
  Restaurant: '🥘', Food: '🥘', 'Nhà hàng': '🥘',
  Bar: '🍷', 'Other F&B': '🍷', 'Quán bar': '🍷',
  Brunch: '🥞', Dessert: '🍰', 'Tráng miệng': '🍰',
  'Tea & Beverage': '🧋', 'Trà & đồ uống': '🧋',
  'Fast Food': '🍔', 'Đồ ăn nhanh': '🍔',
}

export const venueSymbol = (venue) => venue?.tags?.includes('Italian') ? '🍕' : VENUE_SYMBOLS[venue?.category] || '📍'
