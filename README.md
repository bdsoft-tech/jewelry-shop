# Aurelle Jewelry Shop

A Next.js App Router storefront for a fine jewelry catalog. The project uses
TypeScript, Tailwind CSS, local product data, and browser storage for the cart.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm build
```

## Current Scope

- Product catalog data lives in `app/data/products.ts`.
- Product listing and detail pages are statically generated from local data.
- Cart state is stored in the browser with no backend or database.
- Checkout is a frontend-only flow ready for a future payment/order service.
