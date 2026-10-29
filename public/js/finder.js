// Yazı bulucu: soru sayfa yenilenmeden gönderilir, cevap sohbet balonu olarak eklenir.
// JavaScript kapalıysa form normal biçimde gönderilir ve sayfa cevapla birlikte yeniden yüklenir.
(() => {
  const form = document.querySelector('.finder-form');
  if (!form) return;
  const log = document.querySelector('.finder-log');
  const input = form.querySelector('textarea');
  const button = form.querySelector('button');
  const failed = {
    tr: 'Şu anda yazılar aranamıyor. Lütfen biraz sonra tekrar deneyin.',
    de: 'Die Suche ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut.',
    en: 'The search is not available right now. Please try again later.',
    nl: 'Zoeken is op dit moment niet beschikbaar. Probeer het later opnieuw.',
  }[form.elements.dil.value];

  const bubble = (cls, html) => {
    const div = document.createElement('div');
    div.className = `msg ${cls}`;
    div.innerHTML = html;
    log.append(div);
    return div;
  };
  const scrollToEnd = () => log.scrollTo({ top: log.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  // Enter gönderir, Shift+Enter yeni satır açar.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    button.disabled = true;
    const waiting = bubble('msg-bot msg-wait', '<p><span></span><span></span><span></span></p>');
    scrollToEnd();
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(new FormData(form)),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { html } = await res.json();
      waiting.remove();
      log.insertAdjacentHTML('beforeend', html);
      input.value = '';
    } catch {
      waiting.remove();
      const p = document.createElement('p');
      p.textContent = failed;
      bubble('msg-bot', '').append(p);
    }
    button.disabled = false;
    scrollToEnd();
    input.focus();
  });
})();
