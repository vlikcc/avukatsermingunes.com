// Mobil menü
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const label = toggle.querySelector('.nav-toggle-label');
  const texts = document.documentElement.lang === 'de' ? ['Menü', 'Schließen'] : ['Menü', 'Kapat'];
  const set = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = texts[open ? 1 : 0];
  };
  toggle.addEventListener('click', () => set(!nav.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      set(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && set(false));
})();
