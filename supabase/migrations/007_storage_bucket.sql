-- Create product-images storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- Allow public read of all product images
create policy "Product images are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'product-images');

-- Allow owners to update/delete their own files
create policy "Users can update own product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Enable banners public read (anon can read active banners)
alter table public.banners enable row level security;
create policy "Active banners are public" on public.banners
  for select using (is_active = true);
create policy "Admins manage banners" on public.banners
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
