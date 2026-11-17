# Project: Volt Wave Tech — SEO Architecture Modernization & Social Sharing Implementation

## Role and Responsibilities

Act as a Senior Full-Stack Software Architect and SEO Technical Specialist with strong production experience in:

- Next.js, React, TypeScript, and server-side rendering.
- Laravel REST API architecture.
- Technical SEO and search engine optimization.
- E-commerce SEO and structured data.
- Open Graph, Twitter Cards, and social media link previews.
- Performance optimization and Core Web Vitals.
- Production deployment, caching, and security.

You are working on an existing, completed commerce and operations platform named **Volt Wave Tech (VWT)**.

Your responsibility is to modernize its public-facing frontend architecture to achieve production-grade SEO while preserving all existing business functionality.

This is an implementation task, not a theoretical consultation. Inspect the existing repository, understand its architecture, formulate a migration plan, and implement the required changes.

---

# 1. Existing Project Architecture

The repository structure is:

```text
vwt/
├── .agents/
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   └── README.md
├── deployment/
│   ├── Jenkinsfile.backend
│   └── Jenkinsfile.frontend
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── scripts/
├── backup/
├── prompts/
├── README.md
├── run.sh
└── run.bat
```

## Existing frontend stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- i18next and react-i18next
- Framer Motion
- Lucide React
- Axios
- Tiptap
- html2canvas
- jsPDF
- React Hot Toast

## Existing backend stack

- PHP 8.2+
- Laravel 12
- Laravel Sanctum and JWT authentication
- Eloquent ORM
- MySQL
- Spatie Laravel Permission
- Queue and Artisan support
- PHPUnit
- Laravel Pint

## Existing application functionality

### Public storefront

- Product catalog and product details.
- Service listings and service details.
- Contact form and inquiry submission.
- Banner and blog content.
- Customer order placement.
- Order tracking.
- Shopping cart.
- Quotation creation.
- Public website settings and configuration.

### Admin dashboard

- Product and service management.
- Order and invoice management.
- Quotation management.
- Web and general settings.
- Contact message management.
- User and role management.
- Permission management.
- Accounting management.
- Banner management.
- Blog and content management.

**Important:** The existing Laravel backend is the source of truth for business logic and application data.

Do not unnecessarily rewrite, replace, or duplicate Laravel business logic.

---

# 2. Primary Objective

Modernize the existing React + Vite frontend into a modern, SEO-friendly Next.js application.

Recommended target stack:

- Latest stable Next.js version compatible with the project.
- Next.js App Router.
- React and TypeScript.
- Tailwind CSS.
- Zustand where client-side state management is required.
- Axios or native fetch for API communication.
- Existing i18next functionality or an appropriate Next.js-compatible internationalization implementation.
- Framer Motion where appropriate.
- Lucide React.
- Existing Tiptap functionality where required.
- Existing notification and form-handling functionality.

Use server-side rendering, static generation, dynamic rendering, and incremental revalidation according to the needs of individual pages.

Do not blindly migrate every page to client-side rendering.

The primary goal is to ensure that search engine crawlers and social media crawlers receive meaningful, fully rendered HTML containing the relevant page content and metadata.

---

# 3. Repository Inspection — Mandatory First Phase

Before modifying anything, inspect the entire existing frontend and backend architecture.

Analyze:

1. Frontend routing and page structure.
2. Existing layouts and reusable components.
3. API service and Axios configuration.
4. Zustand stores.
5. Authentication and authorization flows.
6. Localization and translation implementation.
7. Product and service data structures.
8. Product and service detail page implementations.
9. Existing SEO-related functionality.
10. Laravel API routes and relevant controllers.
11. Product and service models and relationships.
12. Banner, blog, and website settings implementations.
13. Image storage and public image URL generation.
14. Existing Jenkins deployment pipelines.
15. Existing environment configurations.

Identify which existing features can be migrated directly and which require architectural changes.

Create an implementation document:

`prompts/SEO_MIGRATION_PLAN.md`

It should contain:

- Existing architecture assessment.
- Target architecture.
- Migration strategy.
- Existing functionality mapping.
- Required API changes.
- SEO implementation strategy.
- Database changes, if necessary.
- Deployment changes.
- Risks and mitigation strategies.
- Implementation phases and completion criteria.

Do not start rewriting the application before understanding its existing functionality.

---

# 4. Next.js Frontend Architecture

Migrate the existing frontend to Next.js App Router.

Use a maintainable, scalable folder structure.

Suggested architecture:

```text
frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (storefront)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── services/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   ├── blogs/
│   │   │   │   ├── contact/
│   │   │   │   └── about/
│   │   │   └── (admin)/
│   │   ├── api/
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── services/
│   │   ├── seo/
│   │   └── admin/
│   ├── features/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

This is a suggested structure, not a rigid requirement. Adjust it according to the actual application.

## Migration requirements

- Preserve the existing visual design and brand identity.
- Preserve all existing routes and user-facing functionality.
- Preserve Bengali as the default language and English as the secondary language.
- Preserve existing API contracts wherever possible.
- Maintain existing cart, quotation, and order workflows.
- Preserve customer and admin authentication.
- Preserve admin permissions and protected routes.
- Preserve existing form validation and error handling.
- Preserve responsive layouts.
- Avoid unnecessary UI redesign.

Prefer Server Components by default.

Use Client Components only when browser-side interaction is required, such as:

- Shopping cart interactions.
- Product variants and quantity selection.
- Interactive filters.
- Authentication forms.
- Admin dashboard functionality.
- Rich text editors.
- Modal dialogs.
- Interactive navigation.

Avoid unnecessary use of `"use client"` at the root layout level.

---

# 5. Comprehensive Technical SEO Implementation

Implement a complete SEO foundation.

## 5.1 Dynamic metadata

Use Next.js Metadata API.

Implement:

- Dynamic page titles.
- Meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Twitter/X card metadata.
- Robots directives.
- Language alternates.
- Dynamic product metadata.
- Dynamic service metadata.
- Dynamic blog metadata.
- Category metadata.
- Homepage metadata.

Product and service pages must retrieve their metadata from the Laravel API.

Example:

```typescript
export async function generateMetadata({ params }) {
    const product = await getProduct(params.slug);

    return {
        title: product.meta_title || product.name_en,
        description: product.meta_description || product.short_description,
        alternates: {
            canonical: `/products/${product.slug}`,
        },
        openGraph: {
            title: product.meta_title || product.name_en,
            description: product.meta_description || product.short_description,
            images: [
                {
                    url: product.featured_image,
                    width: 1200,
                    height: 630,
                    alt: product.name_en,
                },
            ],
        },
    };
}
```

Adapt this example to the actual project types, route parameters, localization, and metadata configuration.

Never assume fields exist without inspecting the actual API response.

## 5.2 Technical SEO requirements

Implement:

- Semantic HTML5.
- Proper heading hierarchy.
- Descriptive page titles.
- Unique meta descriptions.
- Canonical URLs.
- Correct HTTP status codes.
- Proper 404 handling.
- Search engine crawlability.
- Internal linking.
- Breadcrumb navigation.
- Image alt attributes.
- Responsive image optimization.
- Lazy loading for non-critical images.
- Appropriate indexing directives.
- Clean URL structures.
- Redirect handling when existing URLs change.

Avoid duplicate metadata and duplicate indexable pages.

Do not expose internal admin pages to search engines.

## 5.3 International SEO

The application supports Bengali and English.

Implement correct language-specific URLs and metadata.

Suggested URL structure:

```text
/bn
/bn/products
/bn/products/product-slug

/en
/en/products
/en/products/product-slug
```

Requirements:

- Bengali remains the default locale.
- English remains available.
- Implement `hreflang` alternates.
- Implement canonical URLs correctly.
- Use appropriate language attributes.
- Ensure equivalent Bengali and English pages reference each other.
- Avoid duplicate-content problems.
- Preserve language preference during navigation.

Do not assume that translating the URL slug is necessary. Use the existing slug strategy where appropriate.

---

# 6. Dynamic Sitemap and Robots Configuration

Implement Next.js sitemap generation.

The sitemap must include relevant public pages:

- Homepage.
- Product listing pages.
- Individual product pages.
- Service listing pages.
- Individual service pages.
- Blog listing pages.
- Individual published blog pages.
- Public category pages.

Requirements:

- Retrieve dynamic records from Laravel.
- Include canonical URLs.
- Include accurate `lastModified` values when available.
- Exclude unpublished and inactive content.
- Exclude admin routes.
- Exclude authentication pages.
- Exclude cart, checkout, and private account pages.
- Exclude duplicate and non-indexable URLs.

Implement robots.txt using Next.js metadata routes.

Allow public storefront crawling while disallowing private and administrative routes.

Do not block static resources or public images required for rendering.

If the catalog becomes large, implement sitemap index and pagination rather than generating an excessively large sitemap.

---

# 7. Structured Data / JSON-LD

Implement valid Schema.org structured data.

Prioritize:

### Organization

- Organization name.
- Logo.
- Website URL.
- Contact information.
- Social profiles where available.

### WebSite

- Website name.
- URL.
- Language information.

### Product

- Product name.
- Description.
- Images.
- SKU.
- Brand, if available.
- Product category.
- Price.
- Currency.
- Availability.
- Product URL.

Use `Offer` and appropriate availability properties when actual pricing and stock information are available.

### Service

Use the most appropriate Schema.org service representation.

### BreadcrumbList

Implement breadcrumbs on:

- Product pages.
- Service pages.
- Category pages.
- Blog pages.

### BlogPosting

Include:

- Headline.
- Description.
- Author.
- Published date.
- Modified date.
- Featured image.

Requirements:

- JSON-LD must be generated dynamically from actual content.
- Do not fabricate ratings, reviews, prices, or availability.
- Avoid duplicate structured data.
- Ensure valid JSON serialization.
- Sanitize or safely serialize user-controlled content.
- Validate structured data against Google's supported specifications.

---

# 8. Product and Service Social Sharing

This is a major functional requirement.

Implement a reusable social-sharing solution for both product and service cards and their detail pages.

## 8.1 Share button locations

Add a share button to:

1. Product cards.
2. Product detail pages.
3. Service cards.
4. Service detail pages.

The design must remain consistent with the existing UI.

Use an appropriate Lucide share icon.

The button must not accidentally trigger the parent product or service card navigation.

## 8.2 Sharing functionality

Implement a reusable component:

`ShareButton`

Supported sharing methods:

- Native Web Share API.
- Copy link.
- Facebook sharing.
- WhatsApp sharing.
- Messenger sharing where supported.
- LinkedIn sharing.
- X/Twitter sharing.

Requirements:

- Detect browser support for Web Share API.
- Use native sharing on supported mobile browsers.
- Provide a fallback dropdown or dialog on desktop.
- Display a successful copy confirmation.
- Handle sharing errors gracefully.
- Ensure keyboard accessibility.
- Maintain responsive behavior.

The shared content should contain:

- Product or service name.
- Short description.
- Public canonical URL.
- Relevant featured image where the sharing platform supports preview extraction.

Do not use client-side image generation for social previews.

---

# 9. Open Graph and Social Preview Images

This is one of the most important requirements.

When someone shares a product or service URL through WhatsApp, Facebook, Messenger, LinkedIn, or another platform, the shared link should automatically display:

- Product/service featured image.
- Product/service name.
- Short description.
- Website or brand identity.
- Canonical URL.

Example desired preview:

```text
Volt Wave Tech

[Product Featured Image]

Premium LED Panel Light

High-quality energy-efficient LED panel
light for residential and commercial use.

volt-wave-tech.com
```

## Implementation requirements

Implement dynamic Open Graph metadata for every individual product and service page.

Use:

- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `og:image:width`
- `og:image:height`
- `og:image:alt`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Use absolute, publicly accessible HTTPS image URLs.

Prefer a 1200 × 630 social preview image.

Where appropriate, use Next.js dynamic Open Graph image generation with `ImageResponse`.

Create reusable dynamic OG image generation for products and services if the existing featured images are insufficient.

However, prioritize using the actual product image rather than replacing it with an unrelated generic image.

The social preview must work without JavaScript execution.

**Critical:** Social media crawlers often do not execute client-side JavaScript. Therefore, metadata must be present in the initial server-generated HTML.

Ensure that:

- Product pages are server-rendered.
- Service pages are server-rendered.
- Metadata is generated on the server.
- OG image URLs are publicly accessible.
- Image URLs do not require authentication.
- The API does not block crawler requests.
- Preview images do not expire unexpectedly.
- No client-side-only metadata injection is used.

Do not assume that implementing a Share button alone will generate social previews. The destination page's server-rendered Open Graph metadata is what enables preview extraction.

---

# 10. Laravel API Review and Improvements

Inspect the existing Laravel API before adding endpoints.

Only introduce backend changes when necessary.

Review whether public endpoints expose the information needed by Next.js:

- Product details by slug.
- Product listing and pagination.
- Product featured images.
- Product SEO fields.
- Product stock and pricing.
- Service details by slug.
- Service SEO fields.
- Published blog details.
- Category information.
- Website settings.
- Public banner information.

If SEO-specific fields are missing, implement appropriate database migrations and model/controller changes.

Suggested optional fields:

```text
meta_title
meta_description
meta_keywords
og_image
canonical_url
is_indexable
```

Use the existing naming conventions and avoid unnecessary redundant fields.

SEO metadata should be manageable through the existing admin panel where appropriate.

For product and service management, consider adding:

- SEO title.
- SEO description.
- SEO image.
- Indexing toggle.
- Canonical URL override, if genuinely required.

Requirements:

- Validate all incoming values.
- Sanitize user-controlled content.
- Preserve backward compatibility where possible.
- Use appropriate API Resources.
- Avoid N+1 queries.
- Use caching for public catalog endpoints.
- Invalidate relevant caches when products or services are updated.
- Do not expose private business data.

---

# 11. Performance Optimization

Optimize the public storefront for Core Web Vitals.

Focus on:

- Largest Contentful Paint (LCP).
- Interaction to Next Paint (INP).
- Cumulative Layout Shift (CLS).

Implement:

- Next.js Image optimization.
- Proper image dimensions.
- Responsive image delivery.
- Modern image formats where supported.
- Server-side data fetching.
- Appropriate caching.
- Static generation for suitable public pages.
- Incremental Static Regeneration where appropriate.
- Lazy loading for below-the-fold images.
- Font optimization.
- Code splitting.
- Dynamic imports for heavy client-side components.
- Bundle optimization.

Avoid:

- Excessive client-side JavaScript.
- Unnecessary hydration.
- Large blocking scripts.
- Layout shifts caused by images.
- Repeated API requests.
- Uncontrolled cache invalidation.

Do not compromise functional correctness for marginal performance gains.

---

# 12. Data Fetching and Caching Strategy

Establish a consistent data-fetching architecture.

Use server-side fetching for public SEO-critical pages.

Suggested approach:

| Page | Rendering Strategy |
|---|---|
| Homepage | Static / ISR |
| Product listing | Dynamic or ISR |
| Product detail | ISR with on-demand revalidation |
| Service listing | ISR |
| Service detail | ISR |
| Blog listing | ISR |
| Blog detail | ISR |
| Contact page | Static |
| Cart | Client-side |
| Checkout | Dynamic |
| Customer account | Dynamic |
| Admin dashboard | Dynamic, protected |

Adapt this strategy based on the actual data freshness requirements.

Requirements:

- Prevent stale pricing and stock from affecting checkout.
- Never trust cached client-side prices for order creation.
- Revalidate product and service pages after relevant backend updates.
- Avoid caching authenticated or user-specific responses publicly.
- Handle API errors and missing records correctly.
- Implement proper loading and error states.

Consider Laravel webhook-based cache invalidation or another secure mechanism if necessary.

---

# 13. Admin SEO Management

If the existing admin dashboard has suitable content management interfaces, extend them to manage SEO information.

For products, services, and blog posts, provide:

- SEO title.
- Meta description.
- Featured/OG image.
- Search engine indexing control.
- Search preview.
- Character count guidance.

The SEO preview should resemble a typical search result.

Allow the administrator to understand how the content will appear in search engines before publishing.

Maintain existing authorization and permission checks.

Do not allow unauthorized users to modify SEO metadata.

---

# 14. Deployment and Infrastructure

Review the existing Jenkins deployment configuration.

Update deployment pipelines to support the Next.js frontend.

Consider:

- Production build.
- Environment variables.
- Node.js runtime.
- Next.js standalone output where appropriate.
- Static assets.
- Image optimization.
- Reverse proxy configuration.
- HTTPS.
- API connectivity.
- Production caching.

The application must work correctly behind the intended production web server or reverse proxy.

Do not assume that a static Vite deployment configuration will work unchanged for a server-rendered Next.js application.

Update:

- `deployment/Jenkinsfile.frontend`
- Frontend environment configuration.
- Root README.
- Frontend README.
- Run scripts, where required.

Keep Laravel deployment independent from frontend deployment.

---

# 15. Testing and Quality Assurance

Implement appropriate tests.

## Frontend

Test:

- Public page rendering.
- Dynamic metadata.
- Product detail metadata.
- Service detail metadata.
- Canonical URLs.
- Language alternates.
- Sitemap generation.
- Robots configuration.
- Structured data.
- Share button behavior.
- Copy-link functionality.
- Web Share API fallback.
- 404 behavior.
- Authentication and protected routes.

## Backend

Test any newly introduced:

- SEO fields.
- API Resources.
- Validation.
- Public endpoints.
- Cache invalidation.
- Authorization rules.

## SEO validation

Use the following tools during QA:

- Google Search Console.
- Google Rich Results Test.
- Schema.org Validator.
- Lighthouse.
- PageSpeed Insights.
- Facebook Sharing Debugger.
- LinkedIn Post Inspector.
- Open Graph metadata inspection.

Verify the actual HTML response rather than relying exclusively on browser-rendered DOM.

Verify that public social crawlers can access product and service pages and their featured images.

---

# 16. Migration Safety and Non-Negotiable Constraints

These requirements are mandatory.

1. Do not rewrite the Laravel backend unnecessarily.
2. Do not remove existing business functionality.
3. Do not redesign the entire application.
4. Do not introduce a second source of truth for business data.
5. Do not break existing API contracts without a documented reason.
6. Do not remove existing authentication and authorization.
7. Do not expose protected pages or private data.
8. Do not fabricate SEO metadata or structured data.
9. Do not use client-side-only rendering for SEO-critical content.
10. Do not leave placeholder implementations.
11. Do not silently ignore failing tests.
12. Do not delete the old frontend until the replacement has been verified.
13. Do not commit environment secrets or credentials.
14. Do not claim completion without validating the implementation.

Preserve existing customer and admin workflows throughout the migration.

---

# 17. Implementation Workflow

Execute the work in the following phases.

### Phase 1 — Audit and planning

- Inspect the complete repository.
- Document the existing architecture.
- Identify SEO limitations.
- Identify migration risks.
- Create `prompts/SEO_MIGRATION_PLAN.md`.

### Phase 2 — Next.js foundation

- Initialize the Next.js application.
- Configure TypeScript and Tailwind CSS.
- Establish App Router architecture.
- Configure internationalization.
- Configure environment variables.
- Configure Laravel API integration.
- Establish reusable layouts and components.

### Phase 3 — Frontend migration

- Migrate the public storefront.
- Migrate product and service listings.
- Migrate product and service detail pages.
- Migrate blog and content pages.
- Migrate authentication and customer functionality.
- Migrate admin dashboard.
- Preserve all existing functionality.

### Phase 4 — SEO foundation

- Implement metadata.
- Implement canonical URLs.
- Implement hreflang.
- Implement sitemap.
- Implement robots.txt.
- Implement JSON-LD.
- Implement breadcrumbs.
- Implement indexing rules.

### Phase 5 — Social sharing

- Implement reusable ShareButton.
- Add sharing to product cards.
- Add sharing to service cards.
- Add sharing to product detail pages.
- Add sharing to service detail pages.
- Implement dynamic OG metadata.
- Implement dynamic OG image generation if necessary.
- Verify WhatsApp and Facebook previews.

### Phase 6 — Laravel integration

- Add missing SEO fields if necessary.
- Update API Resources and endpoints.
- Add admin SEO management.
- Implement cache invalidation.
- Preserve existing API functionality.

### Phase 7 — Performance and deployment

- Optimize rendering.
- Optimize images.
- Optimize caching.
- Update Jenkins pipelines.
- Update production deployment documentation.
- Verify production environment compatibility.

### Phase 8 — Testing and final verification

- Run frontend build.
- Run frontend tests.
- Run Laravel tests.
- Run code formatting and static checks.
- Validate metadata and structured data.
- Test social sharing.
- Verify all existing application workflows.

---

# 18. Final Deliverables

At completion, provide:

1. Complete Next.js frontend implementation.
2. Preserved existing Laravel backend.
3. SEO-friendly public storefront.
4. Dynamic product and service metadata.
5. Dynamic sitemap and robots configuration.
6. Schema.org structured data.
7. Bengali and English SEO support.
8. Reusable social-sharing components.
9. Working product and service Open Graph previews.
10. Admin SEO management functionality.
11. Optimized production deployment configuration.
12. Updated documentation.
13. Test results.
14. A migration and implementation summary.

Create a final document:

`prompts/SEO_IMPLEMENTATION_REPORT.md`

Include:

- Architecture changes.
- Implemented features.
- Modified files.
- New API endpoints or database changes.
- SEO capabilities.
- Social sharing behavior.
- Performance optimizations.
- Test results.
- Deployment instructions.
- Remaining limitations or external configuration requirements.

---

# 19. Definition of Done

The project is considered complete only when all of the following are satisfied:

- Public pages render meaningful HTML on the server.
- Product and service pages have unique dynamic metadata.
- Search engines can discover public catalog pages.
- Sitemap contains valid public URLs.
- Robots rules are correct.
- Bengali and English pages have correct language metadata.
- Structured data is valid and based on actual records.
- Product and service cards have functional share buttons.
- Product and service detail pages have functional share buttons.
- Copy-link functionality works.
- Native sharing works where supported.
- WhatsApp and Facebook generate the correct product/service previews.
- OG images are publicly accessible.
- Existing customer and admin functionality remains operational.
- Production builds succeed.
- Tests pass or documented pre-existing failures are clearly identified.
- Deployment documentation reflects the new architecture.

**Final instruction:** Work systematically and prioritize correctness, maintainability, security, and SEO effectiveness. Do not stop after creating the Next.js project skeleton. Complete the actual migration and integration, validate the result, and document any requirement that cannot be completed because of missing infrastructure or unavailable external configuration.