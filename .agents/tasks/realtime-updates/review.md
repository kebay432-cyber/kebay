# Real-time reactive updates across all Kebay pages

The codebase was completely static — pages loaded hardcoded demo data and never re-fetched from Supabase. This change replaces that with live Supabase reads and Postgres CDC subscriptions on every page, so a new product listing appears on the home page and search within seconds without any reload. The approach uses a shared `src/lib/realtime.ts` utility that the brief specified, a global `Toast.astro` component wired into `Layout.astro`, and a connection dot in the header. The build passes (`dist/` exists, timestamped after all file edits).

**Watch for:** The admin dashboard creates a **second Supabase client** via dynamic `import('@supabase/supabase-js')` instead of using the shared `src/lib/supabase.ts` client — this is the clearest deviation from the brief's explicit instruction. The orders page and buyer dashboard have a **toaster race condition** where status-change detection compares against a snapshot that may be stale. The cart page's unavailability badge matching uses `img.alt === item.title` which fails for titles containing HTML-unsafe characters or duplicates. These are correctness gaps, not build blockers.

**Verdict**: NEEDS_CHANGES

---

## High-level view

**Shared utility and infrastructure.** `src/lib/realtime.ts` exactly matches the brief's specification. `Toast.astro` provides the fixed-position container and `showToast` global with all four colour types, a 3-toast max, and `prefers-reduced-motion` awareness. `Layout.astro` renders `<Toast />`. The header connection dot includes the pulse animation with a `prefers-reduced-motion` suppression rule.

**Home page and search.** Both pages fetch on load with try/catch fallback to demo arrays, subscribe via `watchTable`, clean up on `beforeunload`, gate animations behind `prefers-reduced-motion`, and render product cards with the `.product-card` CSS class. The home page shows the 🔴 Live badge only when Supabase returns data. KSh formatting uses `KSh ${n.toLocaleString('en-KE')}` throughout. Search preserves filter state across realtime re-fetches.

**Seller and buyer dashboards.** The seller dashboard subscribes to both `products` (filtered to `seller_id`) and `orders` (filtered to `seller_id`), flashes new orders with an orange border, and fires a toast. Stats recalculate from live data. The buyer dashboard subscribes to `orders` filtered by `buyer_id`, detects status changes by diffing a pre-refresh snapshot, and shows the toast. Both clean up channels on `beforeunload`. The brief's orange border highlight on new seller orders is implemented but the new-order detection uses `payload.eventType === 'INSERT'` — if the realtime payload delivers `eventType` as lowercase `insert` in some Supabase versions this silently drops the highlight.

**Orders page.** Subscribes to `orders` for the current buyer, diffs statuses against a pre-snapshot, fires `showToast` with the status label, and updates the progress tracker. The `.step-dot` and `.status-pill` have CSS transitions gated by `prefers-reduced-motion`. The subscription is built inline rather than via `watchTable` — inconsistent with every other page (see Issues).

**Cart page.** Subscribes to `products` via `watchTable` to check availability of real cart items (skips demo IDs), and attaches warning badges to unavailable items. Badge matching uses `img.alt === item.title`, which fails for titles containing HTML-unsafe characters (see Issues).

**Admin dashboard.** The brief called for adding realtime subscriptions to an existing admin dashboard. That is done — four channels cover overview, orders, products, and users, with a `● Live` indicator. However the entire admin dashboard bypasses the shared Supabase client, creates its own client via `import('@supabase/supabase-js')`, and uses raw `fetch` calls against the REST API for all data reads. This was likely a pre-existing pattern that wasn't touched. The brief says "do NOT create new clients" — this violates that rule, though the channels themselves work correctly.

---

<details>
<summary>Issues (5)</summary>

1. **Admin creates second Supabase client** — The realtime block in `admin/dashboard.astro` does `const { createClient } = await import('@supabase/supabase-js')` and builds a new client rather than importing from `src/lib/supabase.ts`. This directly violates the brief's "do NOT create new clients" instruction. Replace the dynamic import with `import { supabase } from '../../lib/supabase'` and remove the local `createClient` call.

2. **Toast race condition on status-change detection** — Both `orders.astro` and `buyer/dashboard.astro` capture `prevStatuses` before the `await` that re-fetches orders, then compare against the refreshed list. If multiple events fire in quick succession, the second handler runs with a `prevStatuses` snapshot built from the already-updated `allOrders`, missing the change. Guard with a debounce or move the snapshot capture outside the async callback.

3. **Cart unavailability badge matching by alt text** — `checkCartAvailability` in `cart.astro` matches DOM elements with `imgEl.alt === item.title`. Product titles containing `"` or `>` will not match after HTML escaping, and two cart items with the same title will both get a badge if either goes unavailable. Match by `data-id` attribute instead of alt text.

4. **Seller new-order flash depends on `payload.eventType` case** — The orange border flash in `seller/dashboard.astro` checks `payload.eventType === 'INSERT'`. The Supabase JS v2 SDK normalises `eventType` to uppercase, but if that ever changes the highlight silently disappears without error. Add a case-insensitive check: `payload.eventType?.toUpperCase() === 'INSERT'`.

5. **`orders.astro` doesn't use `watchTable` helper** — The subscription on the orders page is written inline rather than through the shared `watchTable` helper. This is inconsistent with every other page and makes future changes to the channel configuration harder. Refactor to use `watchTable(supabase, 'orders', callback)` with a `beforeunload` cleanup via the returned channel handle, matching the pattern used on index and search.

</details>

---

<details>
<summary>Details</summary>

### Admin client isolation

The admin dashboard was built as a standalone HTML page (no `Layout.astro`, no Astro component imports) and uses raw `fetch` calls against the REST API — a pre-existing design. The new realtime block follows the same isolation pattern: it dynamically imports `@supabase/supabase-js` and builds a fresh client from DOM meta tags, using only the anon key (no session token) for the realtime connection. This creates two active Supabase connections when a logged-in admin visits, and directly violates the brief's "do NOT create new clients" rule.

### Toast status-change detection timing

In `orders.astro`:
```js
const prevStatuses: Record<string, string> = {};
allOrders.forEach((o: any) => { prevStatuses[o.id] = o.status; });

allOrders = orders?.length ? orders : allOrders;

allOrders.forEach((o: any) => {
  const prev = prevStatuses[o.id];
  if (prev && prev !== o.status) { ... showToast ... }
});
```
The snapshot is captured correctly before the assignment. The race condition occurs when two Postgres change events arrive within the same event-loop tick: the second handler fires before the first has resolved its `await supabase.from('orders')...`, so `allOrders` still reflects the pre-first-event state. `prevStatuses` is therefore identical to the new fetch result and the toast never fires. The same pattern exists in `buyer/dashboard.astro`. A simple debounce (e.g. `clearTimeout` / `setTimeout` 200ms) on the realtime callback would prevent this.

### Cart badge DOM matching

```js
imgs.forEach(img => {
  const imgEl = img as HTMLImageElement;
  const container = imgEl.closest('div[style*="display:flex"]');
  if (container && imgEl.alt === item.title) {
    // attach badge
  }
});
```
`item.title` is the raw string from localStorage. The rendered `alt` attribute will have been HTML-escaped by the browser. For most product names these are identical, but a title like `Samsung 65" TV` stores as `Samsung 65" TV` in localStorage but renders as `Samsung 65&quot; TV` in the DOM. The match fails silently — no badge, no error. A `data-product-id` attribute on each cart item image would make the match reliable.

### `watchTable` consistency

Pages using `watchTable`: index, search, cart.
Pages using inline channel construction: orders, buyer/dashboard, seller/dashboard, admin/dashboard.

The inline constructions are correct, but if the channel naming convention or event filter needs updating there are two code patterns to maintain.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|------|-------------|
| `src/lib/realtime.ts` | New file — `watchTable` and `fadeIn` exports |
| `src/components/Toast.astro` | New file — fixed toast container and `showToast` global |
| `src/layouts/Layout.astro` | Added `<Toast />` import and render |
| `src/components/Header.astro` | Added `#rtDot` connection indicator with pulse animation; added `watchTable`-based heartbeat channel |
| `src/pages/index.astro` | Replaced static demo render with Supabase fetch + `watchTable` subscription + live badge |
| `src/pages/search.astro` | Replaced static render with Supabase fetch + `watchTable` + filter-preserving re-render |
| `src/pages/seller/dashboard.astro` | Added `products` and `orders` realtime subscriptions; new-order flash; `updateStats`; `beforeunload` cleanup |
| `src/pages/buyer/dashboard.astro` | Added `orders` realtime subscription; status-change toast detection |
| `src/pages/orders.astro` | Added inline `orders` realtime subscription; status-change toast; progress tracker CSS transitions |
| `src/pages/cart.astro` | Added `watchTable` subscription on `products`; availability badge logic |
| `src/pages/admin/dashboard.astro` | Added four realtime channels (overview, orders, products, users) and `● Live` indicator via second Supabase client |

Full diff: compare file timestamps in `src/` against `src/pages/seller/new-product.astro` (last modified before this work began).

</details>
