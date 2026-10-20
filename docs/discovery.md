# Authenticated discovery

`/discover` uses a full-width interactive map, floating navigation, and an overlapping search sheet. Landing and login retain their existing designs. No dependencies were added.

- Click, keyboard-activate, or vertically drag the sheet handle to collapse/expand. **View all** expands the recommendations.
- Search accepts up to three removable requirements, with **Add requirement**, **Find places**, **Detailed criteria**, and **Near me** controls. Six filters live in the criteria dialog. Search uses local fixtures in `src/data/venues.js`; the pure boundary in `src/services/discoveryService.js` can be replaced by a recommendation API adapter.
- Hover a card to highlight its marker. Select a card or marker for a compact preview; **View details** opens a right drawer with directions and a place-selection action.
- Hearts persist saved place IDs per user on this device. The account menu opens saved places and logs out.
- Google Maps uses the existing `VITE_GOOGLE_MAPS_API_KEY` setting. The existing Leaflet/OpenStreetMap HOT provider is the keyless fallback. `VITE_GOOGLE_MAPS_MAP_ID` is optional. Map tiles require a network connection.
- Images in `public/images/venues` are illustrative Unsplash placeholders, not verified photographs of the named venues. Ratings, default distances, hours, and descriptions are sample data. **Near me** requests browser location only when clicked, then calculates straight-line distances and sorts results nearest first; distance filters use those updated values. Click the active location control or clear the search to return to sample distances.

## Connect authentication

The original login was UI-only. The route guard and Axios client share the existing `token` storage key.

For local demonstrations with `npm run dev`, sign in with **demo@findgo.local** / **FindGo123!**. This explicitly requested demo account uses the same session flow and needs no backend. It is enabled only in Vite development mode; production builds reject its saved session and never send the demo token to the API. Other accounts still require the backend endpoint below.

Set `VITE_AUTH_LOGIN_PATH` in `.env.local` to the login endpoint relative to `VITE_API_BASE` (for example, `/auth/login`), then restart Vite. The adapter sends `{ email, password }` and expects `{ token, user }` or `{ accessToken, user }`, optionally inside `{ data: ... }`. Adapt `src/services/authService.js` if the backend uses a different contract.

`user` can supply `id`, `name`/`displayName`/`fullName`, `email`, and `avatarUrl`/`picture`. Passwords are never persisted. Successful sign-in navigates to `/merchant` for Merchant users and `/discover` for other roles using `getAccountHome(user)`. Merchant users can still explore the map and return through the account menu's Merchant portal link. Remember me uses local storage; otherwise the session uses session storage. Missing sessions redirect to `/login`. Logout and authenticated API 401 responses clear the session.

The backend must validate tokens and enforce authorization on its endpoints; the client guard is navigation protection. Registration and Google sign-in remain pending backend integration.

## Validation

Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`. Unit tests cover combined search/filter behavior, saved filtering, truthful match reasons, session persistence, and logout cleanup.

Browser verification uses intercepted login responses, not real backend credentials. Real sign-in cannot be verified until the backend endpoint and contract are supplied. The keyless map is tested; the Google Maps branch requires a working API key for live verification.

## Placeholder photo sources

Local images are downloaded from the project's existing Unsplash source, with a pizza image for the restaurant card:

- Workshop: `photo-1554118811-1e0d58224f24`
- Pizza: `photo-1513104890138-7c749659a591`
- Okkio: `photo-1559925393-8be0ec4767c8`
- Rang Rang: `photo-1501339847302-ac426a4a7cbb`
- BiaCraft: `photo-1514933651103-005eec06c04b`
- Morico: `photo-1563805042-7684c019e1cb`
