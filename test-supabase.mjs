import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://cagxsfmgsijzdqyulvta.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZ3hzZm1nc2lqemRxeXVsdnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2MTA2NDAsImV4cCI6MjExMTE4NjY0MH0.ADBAOfaQ0nzi7kdPv1CS3CQv0Zn81H_mwZgKfehVlWI'
);

console.log('--- KEBAY SUPABASE TEST ---');

// Step 1: Sign in - replace with your actual credentials
const { data: auth, error: authErr } = await sb.auth.signInWithPassword({
  email: 'ianmuiruri.business@gmail.com',
  password: 'Kebay@2026'
});

if (authErr) {
  console.log('❌ AUTH FAILED:', authErr.message);
  process.exit(1);
}
console.log('✅ Signed in as:', auth.user.email, '| ID:', auth.user.id);

// Step 2: Check profile
const { data: profile, error: profErr } = await sb
  .from('profiles')
  .select('*')
  .eq('id', auth.user.id)
  .single();

if (profErr) console.log('❌ Profile read error:', profErr.message, profErr.code);
else console.log('✅ Profile:', profile.full_name, '| Role:', profile.role);

// Step 3: Try inserting a product
const { data: product, error: prodErr } = await sb
  .from('products')
  .insert({
    seller_id: auth.user.id,
    title: 'Test Product - Delete Me',
    category: 'phones',
    price: 1000,
    description: 'Test',
    images: [],
    stock: 1,
    is_active: true
  })
  .select()
  .single();

if (prodErr) {
  console.log('❌ Product insert FAILED:');
  console.log('   Message:', prodErr.message);
  console.log('   Code:', prodErr.code);
  console.log('   Details:', prodErr.details);
  console.log('   Hint:', prodErr.hint);
} else {
  console.log('✅ Product inserted! ID:', product.id);
  await sb.from('products').delete().eq('id', product.id);
  console.log('✅ Test product cleaned up.');
}
