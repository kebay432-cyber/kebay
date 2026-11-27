# Real-time reactive updates across Kebay pages

The codebase was updated to replace all hardcoded demo data with live Supabase fetches and to subscribe every relevant page to Postgres change events so listings, orders, and status changes appear without a page reload. A shared `src/lib/realtime.ts` utility provides the `watchTable` and `fadeIn` helpers. A global `Toast` component and a header connection dot complete the visible real-time affordances. The commit message records a build pass with 0 errors after a first-pass review addressed five earlier findings.

**Watch for:** The admin dashboard still creates a second Supabase client via a dynamic `import('@supabase/supabase-js')` in its realtime block rather than reusing the shared client — this contradicts the brief's explicit "do NOT create new clients" rule and breaks the first-pass fix claim. The `fadeIn` helper in `realtime.ts` does not gate on `prefers-reduced-motion`, leaving animation skipping entirely to each call site, which the seller dashboard and admin dashboard miss for their new-order flash. The admin dashboard does not use `Layout.astro` or the `Toast` component, so global toast functionality is absent there despite the brief requiring it everywhere.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The home page, search page, cart, and orders page all import `watchTable` and `fadeIn`, subscribe on load, and clean up with `beforeunload`. Index and search gate `fadeIn` calls on `prefers-reduced-motion` at the call site, which works but means the guard lives outside the helper.

The seller and buyer dashboards skip `watchTable` and build their channels directly with `supabase.channel(...)`. The channels are functionally equivalent, but they diverge from the brief's specified helper pattern and will silently drift if the helper's config changes.

The `Toast` component is inserted in `Layout.astro` and all five pages using `Layout` inherit it. The admin dashboard is a standalone HTML document — it does not use `Layout`, contains no `Toast`, and never defines `window.showToast`, so admin users receive no toast notifications.

The admin dashboard's realtime block creates a second Supabase client via `import('@supabase/supabase-js')` and `createClient(supabaseUrl, supabaseKey)`. The commit message claims this was fixed in the prior pass, but both `createClient` calls are still present in the file.

The admin's KSh formatting calls `.toLocaleString()` without the `'en-KE'` locale argument in the orders table and expanded order panel, deviating from the brief's explicit requirement and every other page in the codebase.

The orders page and buyer dashboard debounce their realtime callbacks 200ms before the status-change snapshot comparison. Without this, two rapid Postgres events would let the first callback mutate `allOrders` before the second captures its snapshot, producing spurious "status changed" toasts.

---

<details>
<summary>Issues (5)</summary>

1. **Admin creates a second Supabase client** — The admin dashboard's realtime IIFE does `const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(supabaseUrl, supabaseKey)` rather than reusing the shared client. This directly violates the brief's "do NOT create new clients" rule and was listed as fixed in the commit message but is not fixed. Replace the `createClient` block with the shared client, threading it into the admin IIFE from a module-level `import`.

2. **Admin missing Toast** — The admin dashboard does not use `Layout.astro` and includes no `Toast` component. The realtime order-flash event calls `showToast` via `(window as any).showToast?.()` on other pages, but that function is never defined in the admin context. Add `Toast.astro` inline in `admin/dashboard.astro`'s `<body>` or extract it as a standalone script tag so admin users receive new-order notifications.

3. **`fadeIn` in `realtime.ts` ignores `prefers-reduced-motion`** — The `fadeIn` export sets transitions unconditionally. Call sites in `index.astro` and `search.astro` correctly gate on `reduced` before calling it, but any future call site (or the brief's intended usage pattern) will animate unless the caller manually checks. Move the `prefers-reduced-motion` guard into `fadeIn` itself to make the helper safe by default.

4. **Admin KSh formatting missing locale** — Several `toLocaleString()` calls in `admin/dashboard.astro` omit the `'en-KE'` locale (e.g. orders table, revenue totals). Change them to `toLocaleString('en-KE')` per the brief's explicit requirement.

5. **Seller and buyer dashboards bypass `watchTable`** — Both dashboards build their channels directly with `supabase.channel(...).on(...)` instead of the shared `watchTable` helper. This is not a runtime bug but diverges from the brief's specified pattern. If the helper's channel naming or config changes in the future, these two pages will silently diverge. Refactor to use `watchTable` for consistency.

</details>

<details>
<summary>Details</summary>

### Admin dashboard: second Supabase client

The admin realtime block does:

```js
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient(supabaseUrl, supabaseKey);
```

The brief says explicitly "do NOT create new clients — use the existing `supabase` client from `src/lib/supabase.ts`." The commit message claims this was fixed in the prior pass, but both `createClient` calls remain. Because the admin page is a bare HTML document, the shared client module needs to be pulled in via `<script type="module">` rather than an Astro import — but a second client is never the right answer. — **confirmed**: two `createClient` occurrences in the admin script block.

### Admin dashboard: missing Toast

The admin file is a standalone `<!DOCTYPE html>` document — no `Layout.astro`, no `Toast.astro`. Unlike the seller dashboard, which calls `(window as any).showToast?.('🛒 New order received!', 'success', 3000)`, the admin realtime handlers never call `showToast`, and even if they did `window.showToast` is never defined here. Copy the `Toast.astro` `<div>` and `<script>` block into `admin/dashboard.astro`'s `<body>`. — **confirmed**: no `toastContainer` and no `showToast` in `admin/dashboard.astro`.

### `watchTable` helper not used in seller/buyer dashboards

The seller dashboard builds two channels:

```js
const productsChannel = supabase.channel('seller-products').on(...).subscribe();
const ordersChannel = supabase.channel('seller-orders').on(...).subscribe();
```

The buyer dashboard builds one at line 350. All three `beforeunload` cleanup calls are present. The brief specifies `watchTable` for all subscriptions; if the helper's channel naming or config changes, these two pages diverge silently. — **confirmed**: `watchTable` appears zero times in both dashboard files.

### `fadeIn` and `prefers-reduced-motion`

`fadeIn` in `realtime.ts` unconditionally sets opacity, transform, and transition. `index.astro` and `search.astro` check `matchMedia('(prefers-reduced-motion: reduce)').matches` before calling it, but a future caller that skips that check will animate users who opted out. Moving the guard into the helper makes the right behavior the default. — **confirmed**: `realtime.ts` contains no `prefers-reduced-motion` reference.

### Admin KSh formatting

The orders table and expanded order panel both render:

```js
`KSh ${(o.total||0).toLocaleString()}`
```

The brief specifies `toLocaleString('en-KE')`. Without the locale argument the output depends on the browser locale — inconsistent with every other page. — **confirmed**: two bare `toLocaleString()` calls in `admin/dashboard.astro`.

</details>

---

<details>
<summary>Files changed</summary>

| File | Change |
|---|---|
| `src/lib/realtime.ts` | New: `watchTable` and `fadeIn` shared helpers |
| `src/components/Toast.astro` | New: global toast container and `window.showToast` |
| `src/layouts/Layout.astro` | Added `<Toast />` import and component |
| `src/components/Header.astro` | Added `#rtDot` connection indicator with pulse animation |
| `src/pages/index.astro` | Live Supabase fetch with demo fallback; `watchTable` subscription; prefers-reduced-motion guards |
| `src/pages/search.astro` | Live fetch; `watchTable` subscription; filter-preserving re-render |
| `src/pages/seller/dashboard.astro` | Realtime channels for products and orders; new-order flash; toast; stats recalc |
| `src/pages/buyer/dashboard.astro` | Realtime orders channel; debounced status-change toast |
| `src/pages/orders.astro` | `watchTable` subscription; debounced status-change toast; progress tracker transitions |
| `src/pages/cart.astro` | `watchTable` on products; availability badge for out-of-stock cart items |
| `src/pages/admin/dashboard.astro` | Realtime channels for overview/orders/products/users; live indicator; second client (unfixed) |

Full diff: single commit `037b119` — "fix: resolve 5 review findings in realtime-updates implementation"
</details>
