import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create client with explicit session persistence so auth token
// is always sent with requests after sign-in
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  whatsapp_number: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar_url?: string;
  created_at: string;
};

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  profiles?: Profile;
};

export type CartItem = {
  id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
};

export type Order = {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  whatsapp_message_sent: boolean;
  created_at: string;
  products?: Product;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  cta_text: string;
  cta_link: string;
  bg_color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type WishlistItem = {
  id: string;
  buyer_id: string;
  product_id: string;
  created_at: string;
  products?: Product;
};
