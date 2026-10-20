# Public partner registration

The landing navbar links to `/partners`, a public Vietnamese/English page with
partnership opportunities, a validated application form, review/edit and proposed
policies. The existing `/merchant` portal and authentication flow are separate.

No B2B intake endpoint exists in the current frontend contract. By default,
review explicitly states that the application has **not been sent** and offers a
JSON download. Form data stays in React memory until navigation or reload; it is
not saved to localStorage. Editing preserves all entered fields.

To connect a confirmed backend endpoint, set `VITE_PARTNER_REGISTRATION_PATH`
relative to `VITE_API_BASE` and rebuild. The review screen then offers explicit
submission using POST JSON without an authentication header. The request times
out after 20 seconds; errors preserve the application and allow retry. A 2xx
response must mean the backend accepted the application, not approved a partner.

Payload fields: `businessName`, `businessType` (`cafe`, `restaurant`, `beverage`,
`chain`, `other`), `address`, `contactName`, `phone`, `email`, `website`, `message`,
`consent` (boolean true), `policyVersion` (`partner-draft-2026-10-20`). Optional
website and message are empty strings when omitted. No account is created and no
merchant role is assigned by this page.

The backend must validate fields and consent, protect public intake against
abuse, store applications and provide a review workflow. The displayed policies
are explicitly proposed business terms; confirm actual terms, privacy handling
and contact channels before accepting live applications.
