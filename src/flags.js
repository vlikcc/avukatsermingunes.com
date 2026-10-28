// Dil menüsündeki ülke bayrakları: satır içi SVG (emoji bayraklar Windows'ta görünmez).
// İngilizce için Birleşik Krallık bayrağı kullanılır.

const flags = {
  tr: {
    viewBox: '0 0 30 20',
    body: '<rect width="30" height="20" fill="#E30A17"/><circle cx="10.625" cy="10" r="5" fill="#fff"/><circle cx="11.875" cy="10" r="4" fill="#E30A17"/><path fill="#fff" d="M14.583 10l4.523 1.469-2.795-3.847v4.756l2.795-3.847z"/>',
  },
  de: {
    viewBox: '0 0 30 20',
    body: '<rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/>',
  },
  en: {
    viewBox: '0 0 60 30',
    body: '<rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>',
  },
  nl: {
    viewBox: '0 0 30 20',
    body: '<rect width="30" height="6.67" fill="#AE1C28"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468B"/>',
  },
};

export const flag = (lang) =>
  flags[lang]
    ? `<svg class="flag" viewBox="${flags[lang].viewBox}" width="20" height="14" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${flags[lang].body}</svg>`
    : '';
