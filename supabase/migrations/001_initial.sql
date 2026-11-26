-- Kebay Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default '',
  whatsapp_number text default '',
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  avatar_url text,
  created_at timestamptz default now()
);

-- Categories
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  icon_url text,
  created_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  price numeric(12,2) not null check (price > 0),
  original_price numeric(12,2),
  images text[] default '{}',
  category text not null,
  stock integer not null default 1 check (stock >= 0),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Cart items
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(buyer_id, product_id)
);

-- Orders
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null not null,
  product_id uuid references public.products(id) on delete set null not null,
  quantity integer not null default 1,
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered')),
  whatsapp_message_sent boolean default false,
  created_at timestamptz default now()
);

-- Wishlists
create table if not exists public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(buyer_id, product_id)
);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.wishlists enable row level security;

-- Profiles: users can read all profiles, only update their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Products: anyone can view active products; sellers manage their own
create policy "Active products are public" on public.products for select using (is_active = true);
create policy "Sellers can view own products" on public.products for select using (auth.uid() = seller_id);
create policy "Sellers can insert products" on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products" on public.products for update using (auth.uid() = seller_id);
create policy "Sellers can delete own products" on public.products for delete using (auth.uid() = seller_id);

-- Cart: users manage own cart
create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = buyer_id);

-- Orders: buyers see own orders; sellers see orders for their products
create policy "Buyers see own orders" on public.orders for select using (auth.uid() = buyer_id);
create policy "Sellers see own orders" on public.orders for select using (auth.uid() = seller_id);
create policy "Buyers create orders" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "Sellers update order status" on public.orders for update using (auth.uid() = seller_id);

-- Wishlists: users manage own
create policy "Users manage own wishlist" on public.wishlists for all using (auth.uid() = buyer_id);

-- ============================================
-- Seed Categories
-- ============================================
insert into public.categories (name, slug, icon_url) values
  ('Phones', 'phones', '📱'),
  ('Computers', 'computers', '💻'),
  ('Electronics', 'electronics', '⚡'),
  ('Fashion', 'fashion', '👗'),
  ('Home & Garden', 'home', '🏠'),
  ('Motors', 'motors', '🚗'),
  ('Sporting Goods', 'sporting', '⚽'),
  ('Toys & Hobbies', 'toys', '🎮'),
  ('Collectibles & Art', 'collectibles', '🎨')
on conflict (slug) do nothing;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, whatsapp_number, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
