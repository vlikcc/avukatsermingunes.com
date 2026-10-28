// Randevu formu: takvim, saat seçimi ve gönderim.
(() => {
  const form = document.querySelector('.js-booking');
  if (!form) return;

  const lang = form.dataset.lang;
  const de = lang === 'de';
  const locale = de ? 'de-DE' : 'tr-TR';
  const tz = form.dataset.tz;
  const tz2 = form.dataset.tz2;
  const T = de
    ? {
        loading: 'Freie Termine werden geladen …',
        none: 'Derzeit sind keine freien Termine verfügbar. Bitte nutzen Sie das Kontaktformular.',
        pickDay: 'Bitte zuerst ein Datum wählen.',
        slotsFor: (d) => `Freie Zeiten am ${d}`,
        tr: 'Türkei',
        pickSlot: 'Bitte wählen Sie Datum und Uhrzeit.',
        invalid: 'Bitte prüfen Sie die markierten Felder.',
        sending: 'Wird gesendet …',
        taken: 'Dieser Termin wurde soeben vergeben. Bitte wählen Sie eine andere Uhrzeit.',
        rate: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
        fail: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        loadFail: 'Die Termine konnten nicht geladen werden. Bitte laden Sie die Seite neu.',
        summary: 'Ihre Auswahl',
        doneTitle: 'Ihre Terminanfrage ist eingegangen',
        doneText: 'Die Anfrage wird geprüft. Die Bestätigung erhalten Sie per E-Mail. Bitte bewahren Sie die Referenz auf.',
        ref: 'Referenz',
        when: 'Termin',
        type: 'Gesprächsart',
        cancel: 'Stornieren',
        cancelText: 'Über diesen Link können Sie den Termin bei Bedarf stornieren:',
        german: 'deutsche Zeit',
      }
    : {
        loading: 'Uygun saatler yükleniyor…',
        none: 'Şu anda uygun randevu saati bulunmuyor. Lütfen iletişim formunu kullanın.',
        pickDay: 'Önce bir tarih seçin.',
        slotsFor: (d) => `${d} için uygun saatler`,
        tr: 'TR',
        pickSlot: 'Lütfen tarih ve saat seçin.',
        invalid: 'Lütfen işaretli alanları kontrol edin.',
        sending: 'Gönderiliyor…',
        taken: 'Bu saat az önce doldu. Lütfen başka bir saat seçin.',
        rate: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.',
        fail: 'Talep gönderilemedi. Lütfen tekrar deneyin.',
        loadFail: 'Uygun saatler yüklenemedi. Lütfen sayfayı yenileyin.',
        summary: 'Seçiminiz',
        doneTitle: 'Randevu talebiniz alındı',
        doneText: 'Talebiniz incelendikten sonra onay e-posta ile iletilecektir. Lütfen referans numaranızı saklayın.',
        ref: 'Referans',
        when: 'Tarih',
        type: 'Görüşme türü',
        cancel: 'İptal',
        cancelText: 'Gerekirse randevuyu bu bağlantıdan iptal edebilirsiniz:',
        german: 'Almanya saati',
      };

  const cal = form.querySelector('.cal');
  const grid = form.querySelector('.cal-grid');
  const monthLabel = form.querySelector('.cal-month');
  const navBtns = form.querySelectorAll('.cal-nav');
  const slotsTitle = form.querySelector('.slots-title');
  const slotList = form.querySelector('.slot-list');
  const summary = form.querySelector('.bk-summary');
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const done = document.querySelector('.booking-done');

  let days = {};
  let month = null; // { y, m } (m: 0-11)
  let selectedDay = null;
  let selectedSlot = null;

  // Konu, çalışma alanı sayfasından gelindiyse önceden seçilir.
  const pre = new URLSearchParams(location.search).get('konu');
  if (pre && form.elements.topic.querySelector(`option[value="${CSS.escape(pre)}"]`)) form.elements.topic.value = pre;

  const todayKey = () => new Date().toLocaleDateString('en-CA', { timeZone: tz });
  const keyToDate = (k) => new Date(k + 'T12:00:00Z');
  const fmtDay = (k, opts) => keyToDate(k).toLocaleDateString(locale, { timeZone: 'UTC', ...opts });
  const time2 = (iso) => new Date(iso).toLocaleTimeString(locale, { timeZone: tz2, hour: '2-digit', minute: '2-digit' });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  async function load() {
    slotsTitle.textContent = T.loading;
    try {
      const res = await fetch('/api/availability', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      days = (await res.json()).days || {};
    } catch {
      slotsTitle.textContent = T.loadFail;
      return;
    }
    const keys = Object.keys(days).sort();
    if (!keys.length) {
      slotsTitle.textContent = T.none;
      cal.hidden = true;
      return;
    }
    if (selectedDay && !days[selectedDay]) selectedDay = null;
    if (!month) {
      const d = keyToDate(keys[0]);
      month = { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    }
    renderCalendar();
    if (selectedDay) renderSlots();
    else slotsTitle.textContent = T.pickDay;
  }

  function renderCalendar() {
    const keys = Object.keys(days).sort();
    const first = keyToDate(keys[0]);
    const last = keyToDate(keys[keys.length - 1]);
    const start = new Date(Date.UTC(month.y, month.m, 1));
    monthLabel.textContent = start.toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    navBtns[0].disabled = month.y * 12 + month.m <= first.getUTCFullYear() * 12 + first.getUTCMonth();
    navBtns[1].disabled = month.y * 12 + month.m >= last.getUTCFullYear() * 12 + last.getUTCMonth();

    const html = [];
    // Pazartesi ile başlayan hafta
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.UTC(2024, 0, 1 + i)); // 1 Ocak 2024 Pazartesi
      html.push(`<span class="cal-dow" aria-hidden="true">${d.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }).replace('.', '')}</span>`);
    }
    const offset = (start.getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) html.push('<span></span>');
    const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
    const today = todayKey();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${month.y}-${String(month.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const label = fmtDay(key, { weekday: 'long', day: 'numeric', month: 'long' });
      const cls = `cal-day${key === today ? ' today' : ''}`;
      if (days[key]) {
        html.push(`<button type="button" class="${cls} available" data-day="${key}" aria-pressed="${key === selectedDay}" aria-label="${esc(label)}">${d}</button>`);
      } else {
        html.push(`<span class="${cls}" aria-hidden="true">${d}</span>`);
      }
    }
    grid.innerHTML = html.join('');
  }

  function renderSlots() {
    const list = days[selectedDay] || [];
    slotsTitle.textContent = T.slotsFor(fmtDay(selectedDay, { weekday: 'long', day: 'numeric', month: 'long' }));
    slotList.innerHTML = list
      .map(
        (s) => `<button type="button" class="slot" role="radio" data-start="${s.start}" aria-checked="${selectedSlot?.start === s.start}">
          ${s.time}<small>${T.tr} ${time2(s.start)}</small></button>`,
      )
      .join('');
  }

  function renderSummary() {
    if (!selectedSlot) {
      summary.hidden = true;
      return;
    }
    const type = form.querySelector('input[name="type"]:checked');
    const typeText = type ? type.closest('label').textContent.trim() : '';
    summary.hidden = false;
    summary.innerHTML = `<p><strong>${T.summary}:</strong> ${esc(fmtDay(selectedDay, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}, ${selectedSlot.time} (${T.german}) · ${esc(typeText)}</p>`;
  }

  navBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const n = month.y * 12 + month.m + Number(b.dataset.dir);
      month = { y: Math.floor(n / 12), m: n % 12 };
      renderCalendar();
    }),
  );

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-day]');
    if (!b) return;
    selectedDay = b.dataset.day;
    selectedSlot = null;
    renderCalendar();
    renderSlots();
    renderSummary();
    grid.querySelector(`[data-day="${selectedDay}"]`)?.focus();
  });

  slotList.addEventListener('click', (e) => {
    const b = e.target.closest('[data-start]');
    if (!b) return;
    selectedSlot = days[selectedDay].find((s) => s.start === b.dataset.start);
    slotList.querySelectorAll('.slot').forEach((el) => el.setAttribute('aria-checked', String(el === b)));
    renderSummary();
  });

  form.addEventListener('change', (e) => {
    if (e.target.name === 'type') renderSummary();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const invalid = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    if (!selectedSlot) {
      status.className = 'form-status error';
      status.textContent = T.pickSlot;
      (grid.querySelector('.available') || cal).focus();
      return;
    }
    if (invalid.length) {
      status.className = 'form-status error';
      status.textContent = T.invalid;
      invalid[0].focus();
      return;
    }

    const fd = new FormData(form);
    const data = Object.fromEntries(fd);
    data.consent = form.elements.consent.checked;
    data.start = selectedSlot.start;
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = T.sending;
    try {
      const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (res.ok) return showDone(out, data);
      status.className = 'form-status error';
      if (res.status === 409) {
        status.textContent = T.taken;
        selectedSlot = null;
        renderSummary();
        await load();
      } else if (res.status === 422) {
        (out.fields || []).forEach((f) => form.elements[f]?.setAttribute?.('aria-invalid', 'true'));
        status.textContent = T.invalid;
      } else {
        status.textContent = res.status === 429 ? T.rate : T.fail;
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = T.fail;
    } finally {
      button.disabled = false;
    }
  });

  function showDone(out, data) {
    const type = form.querySelector('input[name="type"]:checked').closest('label').textContent.trim();
    const cancelUrl = `${location.origin}${form.dataset.cancelPath}/${out.token}`;
    done.innerHTML = `<h2>${T.doneTitle}</h2>
      <p>${T.doneText}</p>
      <dl>
        <dt>${T.ref}</dt><dd><strong>${esc(out.ref)}</strong></dd>
        <dt>${T.when}</dt><dd>${esc(fmtDay(selectedDay, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}, ${selectedSlot.time} (${T.german}) · ${T.tr} ${time2(selectedSlot.start)}</dd>
        <dt>${T.type}</dt><dd>${esc(type)}</dd>
      </dl>
      <p class="small">${T.cancelText}<br><a href="${esc(cancelUrl)}">${esc(cancelUrl)}</a></p>`;
    void data;
    form.hidden = true;
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  load();
})();
