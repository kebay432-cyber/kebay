-- Run in Supabase Dashboard: Storage → New bucket → name: "product-images" → Public: ON
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Sellers can upload product images" ON storage.objects;
CREATE POLICY "Sellers can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sellers can delete own images" ON storage.objects;
CREATE POLICY "Sellers can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
