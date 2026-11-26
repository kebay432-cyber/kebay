CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON public.settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);
-- Seed defaults
INSERT INTO public.settings (key, value) VALUES
  ('site_name', 'Kebay'),
  ('tagline', 'Kenya''s Marketplace'),
  ('contact_email', ''),
  ('support_whatsapp', ''),
  ('primary_color', '#e8450a'),
  ('whatsapp_template', 'Hi {seller_name}, I want to buy: {product_name} — {product_link}'),
  ('maintenance_mode', 'false'),
  ('meta_title', 'Kebay — Kenya''s Marketplace'),
  ('meta_description', 'Buy and sell anything in Kenya. Connect directly on WhatsApp.')
ON CONFLICT (key) DO NOTHING;
