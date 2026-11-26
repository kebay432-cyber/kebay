Add real-time reactive updates to every page of the Kebay e-commerce app at `c:\Users\ian\ECOM WEBSITE\kebay`. Build check: `node_modules\.bin\astro.cmd build`.

## The core problem
The app uses static/demo data hardcoded in each page. When a seller lists a product it appears in the database but pages don't update because they never re-fetch from Supabase. Every page needs to:
1. Load real data from Supabase on page load (replacing demo data)
2. Subscribe to Supabase Realtime channels so changes appear instantly without any page reload
3. Use smooth CSS transitions when items appear/update/disappear

## Supabase credentials
- URL: read from `import.meta.env.PUBLIC_SUPABASE_URL`
- Key: read from `import.meta.env.PUBLIC_SUPABASE_ANON_KEY`
- Client: import from `../../lib/supabase` (already configured with persistSession: true)

## Create a shared realtime utility
Create `src/lib/realtime.ts` that exports:
```typescript
// Subscribe to a Supabase table and call callback on any change
export function watchTable(supabase, table: string, callback: () => void) {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}

// Smooth fade-in animation for newly added elements
export function fadeIn(el: HTMLElement) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}
```

## Pages to update

### `src/pages/index.astro` (Home page)
- On load: fetch real products from Supabase `products` table (is_active=true, limit 10, order by created_at desc). Fall back to demoData if fetch fails or returns empty.
- Subscribe to `products` table changes. On any change, re-fetch and re-render the deals grid and "More to Explore" grid with fade-in animation.
- The product cards should use the same `.product-card` CSS class.
- Show a subtle "🔴 Live" badge in the top-right of the deals section header when Supabase realtime is connected.

### `src/pages/search.astro` (Search/filter)
- On load: fetch ALL active products from Supabase. Fall back to the hardcoded ALL_PRODUCTS array if Supabase fails.
- Subscribe to `products` table. On change, re-fetch and re-apply current filters without resetting them.
- When a new product appears that matches current filters, it fades in at the top of the grid.
- Show product count updating live.

### `src/pages/seller/dashboard.astro` (Seller dashboard)
- Listings tab: already fetches from Supabase. Add realtime subscription so if another device lists a product, it appears instantly.
- Orders tab: subscribe to `orders` table filtered by `seller_id`. New orders fade in at the top with a brief highlight animation (orange border flash).
- Stats cards: re-calculate from live data on each update.

### `src/pages/buyer/dashboard.astro` (Buyer dashboard)
- Orders tab: subscribe to `orders` table filtered by `buyer_id`. When seller updates order status, the status badge updates live with a smooth color transition.
- No page reload needed when status changes.

### `src/pages/orders.astro` (Order tracking)
- Subscribe to `orders` table for the current buyer.
- When order status changes (e.g. seller marks as shipped), the progress tracker updates smoothly — the step dot animates from grey to orange.
- Show a toast notification: "📦 Your order status updated to Shipped!" that appears for 3 seconds then fades out.

### `src/pages/cart.astro` (Cart)
- Cart items are in localStorage — no Supabase subscription needed here.
- BUT: subscribe to `products` table. If a product in the cart goes out of stock (stock=0) or gets deactivated, show a warning badge on that cart item: "⚠️ No longer available".
- Cart badge in header already updates via `kebay:cart-updated` event — keep that.

### `src/pages/admin/dashboard.astro` (Admin dashboard)
- All tabs already use `dbFetch`. Add realtime subscriptions:
  - Overview tab: subscribe to `products`, `orders`, `profiles` — update stat numbers live.
  - Orders tab: subscribe to `orders` — new orders flash in at top.
  - Products tab: subscribe to `products` — new listings appear instantly.
  - Users tab: subscribe to `profiles` — new registrations appear.
- Show a "● Live" indicator in the admin top bar when realtime is connected.

## Toast notification system
Create a global toast system in `src/components/Toast.astro`:
```html
<div id="toastContainer" style="position:fixed;bottom:80px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;"></div>
```
Export a `showToast(message, type='info', duration=3000)` function via a `<script>` tag that:
- Creates a toast div with the message
- Types: 'info' (blue), 'success' (green), 'warning' (orange), 'error' (red)
- Fades in, stays for `duration`ms, then fades out and removes itself
- Max 3 toasts visible at once

Add `<Toast />` component to `src/layouts/Layout.astro`.

## Realtime connection status
Add a small connection indicator to the Header component:
- A 6px dot next to the logo
- Green = Supabase realtime connected
- Grey = disconnected/demo mode
- It pulses gently when connected

## Implementation notes
- All Supabase fetches must have try/catch with demo data fallback
- Realtime subscriptions must be cleaned up on page unload (`window.addEventListener('beforeunload', () => channel.unsubscribe())`)
- Use the existing `supabase` client from `src/lib/supabase.ts` — do NOT create new clients
- Product cards rendered by JS must match the existing `.product-card` CSS class exactly
- KSh formatting: `KSh ${n.toLocaleString('en-KE')}`
- All animations should respect `prefers-reduced-motion` media query

## Verification
- `node_modules\.bin\astro.cmd build` must pass with 0 errors
- Home page must show real Supabase products when available
- Listing a new product on `/seller/new-product` must make it appear on `/` and `/search` within 2 seconds without any page reload
- Order status changes must update on `/orders` without reload
