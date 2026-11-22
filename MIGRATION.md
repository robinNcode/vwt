# Next.js Migration State
## Current Phase: P3 ✅
## Decisions
- Styling: Added `./views/**/*.{js,ts,jsx,tsx}` to `tailwind.config.js` content array; aligned `SiteChrome` background (`bg-slate-50` on Home, `bg-white` elsewhere) and `ThemeContext` default behavior to match React SPA.
- Public pages are Server Components with metadata (title, description, canonical, OG, Twitter).
- Products & services slug pages use ISR (`revalidate = 120`), `generateStaticParams`, `notFound()`, and schema.org JSON-LD.
- Interactive controls (cart, gallery, share) delegated to `"use client"` leaf components.
## Next: P4 Private/interactive pages and share feature (cart, checkout, account routes with robots noindex, ShareButton).
