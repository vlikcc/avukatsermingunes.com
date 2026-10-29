// Kanun maddeleri: TMK ve MÖHUK maddeleri tek tek, güncel metin, resmî gerekçe ve açıklamayla.
// Yalnızca Türkçe. Maddeler content/kanunlar/<kanun>/<no>.md dosyalarından sunucu açılırken okunur.
//
// Dosya biçimi:
// ---
// kanun: tmk
// no: 166                    (geçici maddelerde gecici-1)
// baslik: Evlilik birliğinin sarsılması
// kenar: Boşanma sebepleri › Evlilik birliğinin sarsılması
// bolum: İkinci Kitap – Aile Hukuku › Birinci Kısım – Evlilik Hukuku › İkinci Bölüm – Boşanma
// tasari_no: 166             (gerekçenin ait olduğu tasarı maddesi)
// gerekce_not: …             (isteğe bağlı)
// ---
// ## Madde metni / ## Dipnotlar / ## Gerekçe / ## Açıklama
import fs from 'node:fs';
import path from 'node:path';
import { paths } from './i18n.js';

const ROOT = path.resolve(import.meta.dirname, '../content/kanunlar');

export const KANUNLAR = {
  tmk: {
    key: 'tmk',
    kisa: 'TMK',
    ad: 'Türk Medeni Kanunu',
    no: '4721',
    rg: 'Resmî Gazete: 8/12/2001, Sayı: 24607',
    guncel: '2026-10-29', // madde metinlerinin mevzuat.gov.tr ile son karşılaştırıldığı gün
    kaynak: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4721&MevzuatTur=1&MevzuatTertip=5',
    gerekceKaynak: 'Türk Medenî Kanunu Tasarısı ve Adalet Komisyonu Raporu, TBMM 21. Dönem, S. Sayısı 723',
    gerekceUrl: 'https://www5.tbmm.gov.tr/tutanaklar/TUTANAK/TBMM/d21/c073/tbmm21073011ss0723.pdf',
    gerekceSozluk: 'Gerekçede geçen “yürürlükteki Kanun” 743 sayılı Türk Kanunu Medenîsi, “kaynak Kanun” İsviçre Medenî Kanunudur.',
    ozet: 'Kişiler, aile, miras ve eşya hukukunu düzenleyen temel kanun: ehliyet, evlilik ve boşanma, velayet, mal rejimleri, mirasçılık, tapu ve mülkiyet.',
  },
  mohuk: {
    key: 'mohuk',
    kisa: 'MÖHUK',
    ad: 'Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanun',
    no: '5718',
    rg: 'Resmî Gazete: 12/12/2007, Sayı: 26728',
    guncel: '2026-10-29',
    kaynak: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5718&MevzuatTur=1&MevzuatTertip=5',
    gerekceKaynak: 'Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanun Tasarısı ve Adalet Komisyonu Raporu, TBMM 23. Dönem, S. Sayısı 47',
    gerekceUrl: 'https://www5.tbmm.gov.tr/tutanaklar/TUTANAK/TBMM/d23/c005/tbmm23005024ss0047.pdf',
    gerekceSozluk: 'Gerekçede geçen 2675 sayılı Kanun, bu Kanundan önce yürürlükte olan 1982 tarihli Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanundur; gerekçedeki madde numaraları tasarıya aittir.',
    ozet: 'Yabancılık unsuru taşıyan işlemlerde uygulanacak hukuk, Türk mahkemelerinin milletlerarası yetkisi ve yabancı mahkeme kararlarının tanınması ile tenfizi.',
  },
};

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const sections = {};
  for (const part of m[2].split(/^## /m).slice(1)) {
    const nl = part.indexOf('\n');
    sections[part.slice(0, nl).trim()] = part.slice(nl + 1).trim();
  }
  return {
    ...meta,
    kenar: meta.kenar ? meta.kenar.split(' › ') : [],
    bolum: meta.bolum ? meta.bolum.split(' › ') : [],
    metin: sections['Madde metni'] || '',
    dipnotlar: sections['Dipnotlar'] || '',
    gerekce: sections['Gerekçe'] || '',
    aciklama: sections['Açıklama'] || '',
  };
}

// Sıralama: geçici maddeler numaralı maddelerden sonra.
const order = (no) => (no.startsWith('gecici-') ? 100_000 + Number(no.slice(7)) : Number(no));

const maddeler = {};
for (const key of Object.keys(KANUNLAR)) {
  const dir = path.join(ROOT, key);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  maddeler[key] = files
    .map((f) => parse(path.join(dir, f)))
    .filter(Boolean)
    .sort((a, b) => order(a.no) - order(b.no));
}

export const maddeList = (kanun) => maddeler[kanun] || [];
export const findMadde = (kanun, no) => maddeList(kanun).find((m) => m.no === no);
export const maddeSlug = (no) => `madde-${no}`;
export const kanunUrl = (kanun) => `${paths.mevzuat.tr}/${kanun}`;
export const maddeUrl = (m) => `${kanunUrl(m.kanun)}/${maddeSlug(m.no)}`;
export const maddeLabel = (m) => (m.no.startsWith('gecici-') ? `Geçici Madde ${m.no.slice(7)}` : `Madde ${m.no}`);
export const maddeTitle = (m) => `${KANUNLAR[m.kanun].kisa} ${maddeLabel(m)}${m.baslik ? ` – ${m.baslik}` : ''}`;

export function neighbours(m) {
  const list = maddeList(m.kanun);
  const i = list.indexOf(m);
  return { prev: list[i - 1], next: list[i + 1] };
}

// /yayinlar/mevzuat/tmk/madde-166 -> madde
export function maddeFromPath(pathname) {
  for (const key of Object.keys(KANUNLAR)) {
    const base = kanunUrl(key) + '/';
    if (pathname.startsWith(base)) {
      const slug = pathname.slice(base.length);
      const m = slug.match(/^madde-((?:gecici-)?\d+)$/);
      return m ? findMadde(key, m[1]) : null;
    }
  }
  return null;
}
