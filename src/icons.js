// Çalışma alanı simgeleri: 24×24, ince çizgi, rengi CSS'teki currentColor'dan alır.
// Talimat gereği terazi, tokmak ve sütun simgeleri kullanılmaz.

const paths = {
  // Aile: iki kişi
  family:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.3c2.2.7 3.5 2.8 3.5 5.7"/>',
  // Miras: anahtar
  inheritance:
    '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 20 3"/><path d="M16.5 6.5 19 9"/><path d="M14 9l2 2"/>',
  // Gayrimenkul: ev
  realestate: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h14V9"/><path d="M10 21v-6h4v6"/>',
  // Ceza: kalkan
  criminal: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3z"/><path d="m9 12 2 2 4-4"/>',
  // İş: çanta
  labour: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  // İcra ve iflas: mühür
  enforcement:
    '<path d="M5 21.5h14"/><path d="M19.3 14.5H4.7A1.7 1.7 0 0 0 3 16.2V19h18v-2.8a1.7 1.7 0 0 0-1.7-1.7z"/><path d="M14 14.5v-3.2c0-1.1.7-2 1.3-2.9a4 4 0 1 0-6.6 0c.6.9 1.3 1.8 1.3 2.9v3.2"/>',
  // Tazminat: madenî paralar
  damages: '<circle cx="9" cy="9" r="6"/><path d="M18.1 10.4a6 6 0 1 1-7.7 7.7"/><path d="M8 7h1.5v4"/><path d="m16.7 13.9.7.7-2.8 2.8"/>',
  // Ticaret ve sözleşmeler: imzalı belge
  contracts:
    '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 16.5c1-1.5 2-2 2.5-1s1 1.5 2 0 1.5-1 2.5 0"/>',
  // Tüketici: alışveriş çantası
  consumer: '<path d="M5 7h14l-1 14H6L5 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  // Milletlerarası özel hukuk: dünya
  pil: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
};

export const areaIcon = (key) =>
  paths[key]
    ? `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[key]}</svg>`
    : '';
