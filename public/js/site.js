// Mobil menü
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const label = toggle.querySelector('.nav-toggle-label');
  const texts = { tr: ['Menü', 'Kapat'], de: ['Menü', 'Schließen'], en: ['Menu', 'Close'], nl: ['Menu', 'Sluiten'] }[document.documentElement.lang] || ['Menü', 'Kapat'];
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
  matchMedia('(min-width: 1241px)').addEventListener('change', (e) => e.matches && set(false));
})();

// Dil menüsü: dışarı tıklanınca veya Escape ile kapanır.
(() => {
  const menu = document.querySelector('.lang-menu');
  if (!menu) return;
  document.addEventListener('click', (e) => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      e.stopPropagation();
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();

// Alt menüler (ör. Hukuki Yayınlar → Makaleler, Mevzuat): ok düğmesiyle açılır kapanır,
// dışarı tıklanınca veya Escape ile kapanır. Geniş ekranda fareyle üzerine gelince de açılır (CSS).
(() => {
  const items = [...document.querySelectorAll('.has-sub')];
  const set = (li, open) => {
    li.classList.toggle('open', open);
    li.querySelector('.sub-toggle').setAttribute('aria-expanded', String(open));
  };
  for (const li of items) {
    li.querySelector('.sub-toggle').addEventListener('click', () => {
      const open = !li.classList.contains('open');
      for (const other of items) if (other !== li) set(other, false);
      set(li, open);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && li.classList.contains('open')) {
        e.stopPropagation();
        set(li, false);
        li.querySelector('.sub-toggle').focus();
      }
    });
  }
  document.addEventListener('click', (e) => {
    for (const li of items) if (li.classList.contains('open') && !li.contains(e.target)) set(li, false);
  });
})();

// İçerik koruması: yazı metinleri kopyalanamaz, görseller sağ tıklama veya sürükleme ile kaydedilemez.
(() => {
  const el = (n) => (n instanceof Element ? n : n?.parentElement);
  const guarded = (n) => Boolean(el(n)?.closest('img, .post'));
  for (const type of ['contextmenu', 'dragstart', 'selectstart']) {
    document.addEventListener(type, (e) => guarded(e.target) && e.preventDefault());
  }
  const posts = document.querySelectorAll('.post');
  const touchesPost = () => {
    const sel = getSelection();
    for (let i = 0; i < sel.rangeCount; i++) {
      const r = sel.getRangeAt(i);
      if ([...posts].some((p) => r.intersectsNode(p))) return true;
    }
    return false;
  };
  for (const type of ['copy', 'cut']) {
    document.addEventListener(type, (e) => (guarded(e.target) || touchesPost()) && e.preventDefault());
  }
})();
