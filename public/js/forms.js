// İletişim formu: JSON olarak gönderir, sonucu aynı sayfada gösterir.
(() => {
  const form = document.querySelector('.js-contact');
  if (!form) return;
  const de = document.documentElement.lang === 'de';
  const T = de
    ? { sending: 'Wird gesendet …', ok: 'Vielen Dank. Ihre Nachricht ist eingegangen; Sie erhalten eine Antwort per E-Mail.', invalid: 'Bitte prüfen Sie die markierten Felder.', rate: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.', fail: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' }
    : { sending: 'Gönderiliyor…', ok: 'Teşekkürler. Mesajınız alındı; yanıt e-posta ile iletilecektir.', invalid: 'Lütfen işaretli alanları kontrol edin.', rate: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.', fail: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' };
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const invalid = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
    if (invalid.length) {
      invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
      status.className = 'form-status error';
      status.textContent = T.invalid;
      invalid[0].focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    data.consent = form.elements.consent.checked;
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = T.sending;
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        status.className = 'form-status ok';
        status.textContent = T.ok;
      } else {
        (out.fields || []).forEach((f) => form.elements[f]?.setAttribute('aria-invalid', 'true'));
        status.className = 'form-status error';
        status.textContent = res.status === 422 ? T.invalid : res.status === 429 ? T.rate : T.fail;
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = T.fail;
    } finally {
      button.disabled = false;
    }
  });
})();
