# Kebay 🛍️ — Kenya's Marketplace

Built with Astro + Supabase. Mobile-first, WhatsApp-powered buying flow.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **anon public key**

### 3. Configure environment
Rename `.env.example` to `.env` (already created) and fill in:
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the database migration
1. Open your Supabase project → SQL Editor
2. Paste the contents of `supabase/migrations/001_initial.sql`
3. Click **Run**

### 5. Start the dev server
```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## Pages

| Route | Description |
|---|---|
| `/` | Home — categories, deals, trending |
| `/search` | Search & filter products |
| `/product/[id]` | Product detail + WhatsApp Buy button |
| `/cart` | Cart + WhatsApp checkout |
| `/auth/signin` | Sign in |
| `/auth/register` | Register (buyer or seller) |
| `/seller/new-product` | List a product |
| `/seller/dashboard` | Seller dashboard |
| `/orders` | Buyer order tracking |

## WhatsApp Buy Flow

When a buyer clicks **Buy on WhatsApp** on any product page, they are redirected to:
```
https://wa.me/{seller_whatsapp}?text=Hi, I want to buy: {product_name} — Kebay: https://kebay.co.ke/product/{product_id}
```
This opens the seller's WhatsApp DM with a pre-filled message. No payment gateway needed for MVP.

## Currency
All prices displayed in **KSh** (Kenyan Shillings).
