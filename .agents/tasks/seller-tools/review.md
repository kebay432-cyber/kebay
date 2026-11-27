# Seller Tools Review

## Evidence Summary

| Check | Result |
|---|---|
| 006_reviews.sql exists | ✅ |
| getStaticPaths covers demo-1 to demo-20 | ✅ via `getStaticProductPaths()` returning all 20 DEMO_PRODUCTS |
| WhatsApp `wa.me/254XXXXXXXXX` format in all 6 files | ✅ All 6 files have `normalizeWA()` and `https://wa.me/` |
| Image upload zone in new-product.astro | ✅ Drag-and-drop zone, file validation (image/*, <5MB), URL.createObjectURL fallback, progress display |
| AI description button in new-product.astro | ✅ Mistral-7B-Instruct-v0.2 call, 8s timeout, spinner text, fallback template |
| 7 CSS filter buttons in new-product.astro | ✅ Original/Bright/Contrast/Vivid/Warm/Cool/Sharp |
| Remove.bg integration | ✅ Uses PUBLIC_REMOVE_BG_KEY env var |
| Review system wired up in product/[id].astro | ✅ localStorage persistence, star selector, avg calculation, Supabase insert with graceful fallback |
| Build passed 0 errors | ⚠️ git not in PATH; no commit log or build log accessible. Code assessed directly. |

---

## Blockers

### B1 — `waSavedBadge` renders visible on initial load regardless of profile state

**File:** `src/pages/seller/new-product.astro`, line 124

**Evidence:**
```html
<div id="waSavedBadge" style="display:none;padding:10px 14px;...;display:flex;align-items:center;gap:10px;">
```

The inline `style` attribute contains `display:none` followed by `display:flex`. In CSS, when two declarations for the same property appear in the same inline style string, the **last one wins** (cascade within a declaration block). So the computed value is `display:flex` from the moment the HTML is parsed, before any JavaScript runs.

**Consequence:** Every seller who visits `/seller/new-product` sees the WhatsApp saved-badge — an empty green box with no number text — before the async profile check completes. For sellers with no saved WhatsApp number, the badge never gets hidden by JS (the JS at line 173 only enters the `if (profile?.whatsapp_number)` branch), so it stays permanently visible and empty. The requirement is "wa-saved-badge if number exists" — the current code shows it when no number exists.

**Correction:** Remove the duplicate `display:flex` from the HTML `style` attribute, keeping only `display:none`:
```html
<div id="waSavedBadge" style="display:none;padding:10px 14px;background:#f0fff4;border:1px solid #c6f6d5;border-radius:10px;margin-bottom:16px;">
```
The flex layout properties (`align-items:center;gap:10px`) can be preserved by wrapping in a class or by keeping them in a separate rule; they do not conflict with `display:none` visibility.

---

### B2 — Five of seven required pages do not import from `demoData.ts`

**Files:** `src/pages/search.astro`, `src/pages/cart.astro`, `src/pages/orders.astro`, `src/pages/buyer/dashboard.astro`, `src/pages/seller/dashboard.astro`

**Task requirement:** "All 7 pages (index.astro, search.astro, product/[id].astro, cart.astro, orders.astro, buyer/dashboard.astro, seller/dashboard.astro) must import from this file."

**Evidence:**
- `search.astro`: defines `ALL_PRODUCTS_DEMO` as an inline 20-entry literal array (line 93–113) — no import from `demoData.ts`.
- `cart.astro`: defines `demoRecommended` as a 4-entry inline literal (lines 7–11) — no import.
- `orders.astro`: defines `demoOrders` as an inline literal — no import.
- `buyer/dashboard.astro`: defines `demoOrders` as an inline literal — no import.
- `seller/dashboard.astro`: defines `demoProducts` and `demoOrders` as inline literals — no import.
- `index.astro`: imports `{ DEMO_PRODUCTS, ksh }` from `'../lib/demoData'` ✅
- `product/[id].astro`: imports `{ getDemoProductById, getStaticProductPaths }` from `'../../lib/demoData'` ✅

**Consequence:** The five non-importing pages each maintain their own independent demo product definitions with different titles, images, and IDs from the canonical `demoData.ts` set. Data is inconsistent across pages (e.g. `search.astro` has "iPhone 14 Pro Max" while `demoData.ts` has "iPhone 15 Pro"; `search.astro` has 20 products but different field shapes). The requirement for a single source of truth is not met.

**Correction:** Each of the five pages must add an import from `demoData.ts` and replace their inline arrays with the canonical exports. For example, `search.astro` should replace its inline `ALL_PRODUCTS_DEMO` with `import { DEMO_PRODUCTS } from '../lib/demoData'` and reference `DEMO_PRODUCTS`. Similarly for the others.

---

## Non-blocking observations (out of scope per instructions — recorded for completeness)

- `.env.example` lists both `REMOVE_BG_API_KEY` and `PUBLIC_REMOVE_BG_KEY`; the error message in `new-product.astro` tells the developer to add `REMOVE_BG_API_KEY` but the code reads `PUBLIC_REMOVE_BG_KEY`. This creates confusing developer guidance but does not break functionality.
