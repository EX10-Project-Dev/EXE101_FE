# Google Sign-In

## Architecture

- Login/register UI: `src/pages/LoginPage.jsx`, within the existing authentication dialog.
- Auth state: `src/hooks/useAuth.js` subscribes to `sessionStore.js` using `useSyncExternalStore`.
- Shared Axios instance/interceptors: `src/services/api.js`.
- Session keys: `token` and `findgo:user`. Remember me uses localStorage; otherwise sessionStorage.
- Both email and Google login use `completeSignIn` in `authService.js`, normalize the backend user, save the session, and redirect to `/discover`.
- `GoogleAuthProvider` wraps the app through `main.jsx`; it reads only the public `VITE_GOOGLE_CLIENT_ID` and handles SDK loading failures. Without configuration, email/password remains available.

## Configuration

Set `VITE_GOOGLE_CLIENT_ID` locally and in the Vercel production environment, then restart Vite/redeploy. Vite environment variables are embedded at build time. Never put a Google client secret in frontend variables or source.

In the Google OAuth **Web application** client, register both Authorized JavaScript origins:

- `http://localhost:5173`
- `https://findgo-ochre.vercel.app`

The integration uses the official GIS popup button with `continue_with` text, white outline and rounded corners, preserving the existing form layout. Google renders/localizes the button. There is no redirect URI used by this popup callback flow.

## Backend contract (required)

The existing Axios base (`VITE_API_BASE`, default `http://localhost:5128/api`) must end in `/api`. Frontend posts to `/auth/google` relative to that base, giving **POST /api/auth/google**, with JSON:

```json
{ "credential": "<Google ID token>" }
```

Backend must implement this endpoint and verify the credential's signature, issuer, audience and expiry before returning the application's own session. The frontend never decodes it to authenticate and never stores Google's credential.

Accepted responses match email login: `{ accessToken, user }` or `{ token, user }`, optionally wrapped in `{ data: ... }`. The user can contain `userId/fullName` or `id/name`, plus email/avatar/role; normalization preserves additional fields.

Production `VITE_API_BASE` must reference the reachable HTTPS backend API (not localhost). Backend must allow CORS for both origins above. This repository contains frontend only; backend endpoint availability and Google Cloud configuration require an actual integration check.

## Failures and cancellation

Missing client ID and SDK load failure/timeout show inline errors without blocking password login. Google errors or missing credentials do not create a session. Backend 401, missing endpoint (404/405/501), network failure and incomplete responses show errors without saving a session.

GIS ID-token buttons do not expose a popup-close callback. The UI displays a retry hint when clicked and only locks submission after receiving a credential. Closing/blocking the popup makes no backend request and leaves both login methods usable. This intentionally avoids polling popup windows or confusing OAuth access tokens with ID tokens.

## Manual integration checks

On localhost and the production origin, verify account selection → backend request → `/discover`; repeat with Remember me selected/unselected. Also check popup cancellation, rejected credential, unavailable endpoint, offline mode, missing client ID and email/password login/register. Successful real Google login requires the configured OAuth client and a working backend; automated tests exercise the backend adapter and session behavior without making a Google login.
