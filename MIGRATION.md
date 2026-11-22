# Next.js Migration State
## Current Phase: P3 ✅
## Decisions
- Public pages are Server Components with metadata (title, description, canonical, OG, Twitter).
- Products & services slug pages use ISR (`revalidate = 120`), `generateStaticParams`, `notFound()` on missing items, and schema.org JSON-LD (Product, Service, BreadcrumbList).
- Home & listings embed schema.org WebSite & ItemList JSON-LD.
- Interactive controls (cart, gallery, share) delegated to `"use client"` leaf components.
## Next: P4 Private/interactive pages and share feature (cart, checkout, account, bookings under `(account)` with noindex, ShareButton verification).
