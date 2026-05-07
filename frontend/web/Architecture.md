# Volt Wave Tech — Architecture & Design System Guide

## Project Overview
Production-grade Next.js 14 app for electrical/electronics eCommerce + service booking.
Localized: Bengali (default) + English.

---

## Tech Stack
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Language**: TypeScript (strict mode)
- **State**: Zustand (cart, auth) + React Query (server data)
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **UI**: Radix UI primitives (headless)

---

## Folder Structure

```
src/
├── app/
│   ├── (public)/              # Public-facing routes
│   │   ├── layout.tsx         # Public layout (Navbar + Footer)
│   │   ├── page.tsx           # Home page
│   │   ├── products/
│   │   │   ├── page.tsx       # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Product detail
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── order-tracking/
│   │   │   └── page.tsx
│   │   ├── quotation/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── (admin)/               # Admin panel routes
│   │   ├── layout.tsx         # Admin layout (Sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                   # Route handlers
│   │   ├── products/
│   │   ├── services/
│   │   └── orders/
│   ├── globals.css
│   └── layout.tsx             # Root layout
│
├── components/
│   ├── ui/                    # Base design system components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Tabs.tsx
│   │   ├── Select.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── MobileNav.tsx
│   ├── public/
│   │   ├── HeroSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CartItem.tsx
│   │   └── QuotationBuilder.tsx
│   └── admin/
│       ├── MetricCard.tsx
│       ├── RevenueChart.tsx
│       ├── OrdersTable.tsx
│       └── StockAlert.tsx
│
├── lib/
│   ├── api.ts                 # API client
│   ├── utils.ts               # Utility functions
│   ├── validations.ts         # Zod schemas
│   └── constants.ts
│
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useServices.ts
│   ├── useOrders.ts
│   └── useLocale.ts
│
├── store/
│   ├── cartStore.ts           # Zustand cart state
│   └── uiStore.ts             # Zustand UI state
│
└── types/
    ├── product.ts
    ├── service.ts
    ├── order.ts
    └── user.ts
```

---

## Design System

### Color Tokens

```css
/* Primary — Electric Blue */
--color-primary-50:  #EFF6FF
--color-primary-100: #DBEAFE
--color-primary-500: #0F4FF0   /* Main brand */
--color-primary-600: #0A35A8
--color-primary-900: #1E3A8A

/* Accent — Amber (electricity/warmth) */
--color-accent-500:  #F5A623
--color-accent-light: #FEF3DC

/* Electric Cyan — hero highlights */
--color-electric: #00D4FF

/* Neutrals */
--color-neutral-50:  #F9FAFB
--color-neutral-100: #F2F4F7
--color-neutral-200: #EAECF0
--color-neutral-300: #D0D5DD
--color-neutral-500: #667085
--color-neutral-700: #344054
--color-neutral-900: #101828

/* Semantic */
--color-success: #12B76A
--color-warning: #F79009
--color-error:   #F04438
```

### Typography Scale

```
Font: Plus Jakarta Sans
Weight: 400 (body), 500 (medium), 700 (bold), 800 (black)

Hero:    clamp(32px, 5vw, 52px) / weight 800 / tracking -1.5px
H1:      32px / 800 / -0.8px
H2:      24px / 700 / -0.5px
H3:      18px / 700 / -0.3px
Body:    15px / 400 / line-height 1.65
Small:   13px / 400
Label:   11px / 700 / uppercase / tracking +0.8px
```

### Spacing Scale (Tailwind)
```
4px  → space-1
8px  → space-2
12px → space-3
16px → space-4
20px → space-5
24px → space-6
32px → space-8
40px → space-10
48px → space-12
64px → space-16
```

### Radius System
```
sm:   6px   → rounded-md
md:   8px   → rounded-lg
lg:   12px  → rounded-xl
xl:   16px  → rounded-2xl
pill: 9999px → rounded-full
```

---

## Component Architecture

### Button Component
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Product Card Props
```typescript
interface ProductCardProps {
  id: string
  slug: string
  name: string       // Bengali name
  nameEn?: string    // English name
  category: string
  price: number
  discountPrice?: number
  image: string
  badge?: 'new' | 'sale' | 'hot'
  rating: number
  reviewCount: number
  inStock: boolean
  onAddToCart?: (id: string) => void
}
```

---

## Key UX Patterns

### Bengali-First Localization
- All UI text stored in `/lib/i18n/bn.ts` (Bengali) and `/lib/i18n/en.ts`
- Currency formatted as `৳X,XXX` with Bangladeshi number system
- Dates formatted in Bengali calendar option

### Performance Strategy
- Product images: Next.js `<Image>` with WebP + AVIF
- Product grid: Virtual scroll for 100+ items
- Below fold: lazy-loaded with IntersectionObserver
- API calls: React Query with stale-while-revalidate

### Cart Persistence
- Zustand store + localStorage sync
- Optimistic updates on add/remove
- Server-side cart merge on login

---

## API Contract (REST)

### Products
```
GET  /api/products?category=&search=&page=&limit=
GET  /api/products/:slug
POST /api/products          (admin)
PUT  /api/products/:id      (admin)
DEL  /api/products/:id      (admin)
```

### Services
```
GET  /api/services?category=
POST /api/bookings          (authenticated)
```

### Orders
```
GET  /api/orders?status=&page=
POST /api/orders            (checkout)
GET  /api/orders/:id        (tracking)
```

---

## Animation Guidelines

### Framer Motion Variants
```typescript
// Page enter
export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } }
}

// Stagger children
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

// Card hover
export const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  hover: { y: -3, boxShadow: '0 8px 24px rgba(15,79,240,0.12)' }
}
```

---

## Accessibility Checklist
- [ ] All images have descriptive `alt` attributes (in Bengali)
- [ ] Focus ring visible on all interactive elements
- [ ] Color not the sole indicator (badges have text + color)
- [ ] Forms have associated labels via `htmlFor`
- [ ] Modal traps focus and restores on close
- [ ] Skip-to-content link for keyboard users
- [ ] ARIA labels on icon-only buttons
- [ ] `aria-live` regions for cart count and toast notifications
- [ ] Contrast ratios: WCAG AA minimum (4.5:1 text, 3:1 UI)

---

## Admin Dashboard Features

### Analytics Cards
- Today's Revenue (BDT)
- Total Orders
- New Customers
- Low Stock Alerts

### Charts (Recharts)
- Weekly Revenue Bar Chart (Products vs Services)
- Monthly Trend Line Chart
- Category Breakdown Donut Chart
- Top Products Table

### Order Management
- Status pipeline: Pending → Confirmed → Processing → Shipped → Delivered
- Bulk status update
- Invoice generation (PDF)
- Customer communication log