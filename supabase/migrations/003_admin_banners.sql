-- Add admin role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('buyer','seller','admin'));

-- Banners table for admin-managed homepage cards
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  subtitle text DEFAULT '',
  body text DEFAULT '',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/search',
  bg_color text DEFAULT '#e8450a',
  icon text DEFAULT '🛍️',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
