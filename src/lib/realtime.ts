// Subscribe to a Supabase table and call callback on any change
export function watchTable(supabase: any, table: string, callback: (payload: any) => void) {
  return supabase
    .channel(`public:${table}:${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}

// Smooth fade-in — respects prefers-reduced-motion
export function fadeIn(el: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}
