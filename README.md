# NP Book Store — Next.js Storefront

The customer-facing storefront for the **book_store** e-commerce API. This project
started as a Vite + React SPA and has been migrated to the **Next.js App Router**
with a production-oriented setup.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui + Radix |
| State | Redux Toolkit + React Redux |
| Forms | React Hook Form + Zod |
| Realtime | Firebase Cloud Messaging (optional) |
| HTTP | Native `fetch` against the Spring Boot API |

## Getting started

Requirements: **Node.js >= 20.9** and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>. The API is expected at <http://localhost:8080>
unless `NEXT_PUBLIC_API_BASE_URL` points elsewhere.

### Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (Next.js core-web-vitals + TypeScript)
npm run typecheck  # tsc --noEmit
```

## Environment variables

All variables are build-time public values (prefix `NEXT_PUBLIC_`).

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Spring Boot API origin |
| `NEXT_PUBLIC_API_VERSION` | `v1` | API version segment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URL used by metadata, sitemap |
| `NEXT_PUBLIC_FIREBASE_*` | empty | Web push configuration; FCM is skipped when empty |

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time. Rebuild
(or pass Docker build args) after changing them.

## Routes

```
/                        Home
/products                Catalogue with filters
/search?title=...        Search results
/books/[id]              Book detail, reviews, suggestions
/contact-us              Contact page

/signin  /signup  /forgot-password     Guest-only routes

/profile                 Account profile
/addresses               Address book
/carts                   Cart
/wishlists               Wishlist
/checkout                Checkout + PayOS redirect
/orders  /orders/[id]    Order history / detail
/order-success/[id]      Payment success callback
/order-failed/[id]       Payment failure callback
/notifications           Notification centre
```

Private pages are wrapped by an `AuthGuard` (route group `(shop)/(protected)`)
that waits for client hydration before redirecting to
`/signin?continue=<path>`. Guest-only pages use `GuestGuard`.

## Project structure

```
app/
  layout.tsx              Root layout, metadata, providers
  providers.tsx           Redux store per session + auth hydration + FCM
  (shop)/                 Navbar / footer shell
    (protected)/          AuthGuard-protected routes
  (auth)/                 Blank auth layout
  globals.css             Tailwind 4 theme and design tokens
src/
  components/             Pages, layout partials and shadcn/ui primitives
  redux/                  Store and slices (auth, cart, orders, ...)
  hooks/                  fetch/post/put/delete hooks
  lib/                    Router compatibility hooks (`useNavigate`, `useSearchParams`)
  constants/              API endpoints and app constants
  utils/                  Auth, formatting, storage helpers
public/                   Fonts, logo, Firebase service worker
```

### Migration notes (Vite → Next.js)

- `react-router-dom` was replaced by the App Router. `Link` uses `next/link`,
  `NavLink` is implemented in `src/components/nav-link.tsx`, and small
  compatibility hooks preserve the original call sites.
- `import.meta.env.VITE_*` became `process.env.NEXT_PUBLIC_*`.
- The Redux store is created once per browser session instead of at module
  scope, and auth state is hydrated after mount to keep SSR safe.
- Global CSS moved to `app/globals.css`; metadata/SEO, sitemap, robots and PWA
  manifest are App Router files.

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://shop.example.com \
  -t book-store-web .
docker run --rm -p 3000:3000 book-store-web
```

The image uses Next.js `output: "standalone"`, runs as a non-root user, and
includes a health check.

## Production checklist

- Set `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL` and Firebase values.
- Add the storefront origin to the backend `CORS_ALLOWED_ORIGINS`.
- Serve over HTTPS; update backend `FRONTEND_URL` / OAuth redirect URIs.
- Run `npm run lint`, `npm run typecheck` and `npm run build` in CI.
- Firebase web keys are public identifiers; restrict them by HTTP referrer in
  Google Cloud Console. Service-account credentials belong only to the backend.

## Backend

The API lives in the sibling **book_store** repository (Spring Boot 3.5, Java 21,
MySQL, Redis). See its README for Docker Compose instructions.

## License

MIT
