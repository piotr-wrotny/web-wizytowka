// Motion runtime. Runs only when index.html added `js-motion` (no reduced-motion preference).
// One job: drive word-by-word lighting from scroll position by setting --p on each [data-words] wrapper.
// Everything else (hero sequence, header compaction, reveals, the green pour, the pinned method scene) is CSS.
export function initMotion() {
  if (!document.documentElement.classList.contains('js-motion')) return () => {};
  const words = Array.from(document.querySelectorAll('[data-words]'));
  if (!words.length) return () => {};
  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of words) {
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.88 - rect.top) / (vh * 0.42)));
      el.style.setProperty('--p', p.toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}
