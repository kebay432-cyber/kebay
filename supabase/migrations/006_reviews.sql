CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id text NOT NULL,
  buyer_name text NOT NULL,
  stars integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (true);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
