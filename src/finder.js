// Yazı bulucu: ziyaretçinin kendi cümleleriyle yazdığı sorunu sitedeki makale ve mevzuat
// yazılarıyla eşleştirir. Harici bir hizmet kullanılmaz, yazılanlar kaydedilmez.
// Hukuki değerlendirme yapmaz; yalnızca ilgili yazıları ve çalışma alanını önerir.
import { posts, headings } from './blog.js';
import { areas } from './content/areas.js';

// Küçük harf, aksansız: "Boşanma" -> "bosanma", "Erbschaft" -> "erbschaft", "İzmir" -> "izmir".
export const fold = (s) =>
  String(s)
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const STOP = new Set(
  [
    // tr
    've ile bir bu şu o da de ki mi mı mu mü ne ya için gibi çok daha ama fakat veya hem ben sen biz siz onlar benim bana beni bizim',
    'nasıl neden niye nerede hangi kadar sonra önce var yok olan olarak oldu olur olmuş olabilir istiyorum ediyorum yapabilirim yapmam',
    'lazım gerek gerekiyor hakkında ilgili şey şimdi hala hâlâ acaba merhaba lütfen teşekkürler sorum sorunum durum durumum',
    // de
    'und oder der die das den dem des ein eine einen einem einer ich mich mir mein meine meinen wir uns ist sind war bin hat habe haben',
    'in im am an auf aus bei mit nach von vor zu zum zur für über unter wie was wer wo wann warum kann können muss müssen nicht kein keine',
    'auch noch schon sehr bitte hallo danke frage problem',
    // en
    'the a an and or of to in on at for with from by is are was were be been have has had my me we our you your it this that what how',
    'why when where which can could should would do does did not no please hello thanks question problem',
    // nl
    'het een en of van te in op aan voor met uit bij is zijn was ben heb heeft hebben mijn wij ons jij u dit dat wat hoe waarom wanneer',
    'waar welke kan kunnen moet moeten niet geen ook nog al heel graag hallo dank vraag probleem',
  ]
    .join(' ')
    .split(/\s+/)
    .map(fold),
);

// Neredeyse her yazıda geçen ülke adları ayırt edici değildir; sorudan çıkarılır ("Türkiye'deki" de dahil).
const COMMON = tokensRaw('türkiye türk türkçe almanya alman hollanda turkey turkish germany german netherlands dutch türkei türkisch deutschland deutsch niederlande turkije turks duitsland duits nederland');

function tokensRaw(s) {
  return fold(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
}
const tokens = (s) => fold(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 2 && !STOP.has(w));

// Türkçe ve Almanca ekler yüzünden kelimeler tam eşleşmez: "boşandım" ~ "boşanma", "vekâlet" ~ "vekâletname".
function similar(a, b) {
  if (a === b) return true;
  const min = Math.min(a.length, b.length);
  if (min < 4 || /^\d/.test(a) || /^\d/.test(b)) return false;
  let p = 0;
  while (p < min && a[p] === b[p]) p++;
  return p >= 5 || p === min;
}

// Aynı konuyu anlatan kelimeler. Bir kelime eşleşirse grubun tamamı aranır; area: önerilecek çalışma alanı.
const GROUPS = [
  {
    area: 'inheritance',
    words: [
      'miras mirasçı mirasçılık veraset veraset ilamı tereke vasiyet vasiyetname vefat ölüm ölen reddi mirasın',
      'erbe erben erbschaft erbrecht erbschein nachlass testament verstorben gestorben tod ausschlagung ausschlagen',
      'inheritance inherit inherited heir heirs estate testament deceased died death renunciation renounce disclaim probate',
      'erfenis erven erfgenaam erfgenamen nalatenschap testament overleden overlijden verwerpen verwerping erfrecht',
    ],
  },
  {
    area: 'family',
    words: [
      'boşanma boşanmak boşandım boşanmış ayrılık ayrılmak eşim eşimden nafaka velayet çocuk mal rejimi evlilik nikah evlenme',
      'scheidung scheiden geschieden trennung ehe ehefrau ehemann unterhalt sorgerecht kinder heirat eheschließung hochzeit',
      'divorce divorced separation spouse wife husband alimony maintenance custody children marriage married wedding',
      'echtscheiding scheiden gescheiden scheiding echtgenoot alimentatie gezag voogdij kinderen huwelijk trouwen getrouwd',
    ],
  },
  {
    area: 'pil',
    words: [
      'tanıma tanınma tanıtma tanıtılması tenfiz',
      'anerkennung anerkennen anerkannt vollstreckbarerklärung',
      'recognition recognise recognize recognised exequatur',
      'erkenning erkennen erkend tenuitvoerlegging exequatur',
    ],
  },
  {
    words: [
      'vekalet vekâlet vekaletname vekâletname vekil konsolosluk noter apostil tercüme',
      'vollmacht bevollmächtigen bevollmächtigt konsulat generalkonsulat notar apostille übersetzung',
      'attorney proxy consulate notary apostille translation authorise authorize',
      'volmacht gevolmachtigde consulaat notaris apostille vertaling machtiging',
    ],
  },
  {
    area: 'realestate',
    words: [
      'tapu taşınmaz gayrimenkul ev daire arsa arazi tarla emlak mülk satış kadastro ortaklığın giderilmesi izale şuyu',
      'grundbuch immobilie immobilien wohnung haus grundstück eigentum kauf verkauf',
      'property real estate land registry title deed house apartment flat plot',
      'vastgoed onroerend woning huis appartement grond kadaster eigendom koop verkoop',
    ],
  },
  {
    area: 'criminal',
    words: [
      'ceza suç savcılık şikayet şikâyet tutuklama gözaltı hapis',
      'strafe strafrecht straftat anzeige staatsanwaltschaft haft festnahme',
      'criminal crime offence offense prosecutor complaint arrest detention prison',
      'strafrecht misdrijf strafbaar aangifte officier justitie aanhouding gevangenis',
    ],
  },
  {
    area: 'labour',
    words: [
      'işçi işveren kıdem ihbar işten çıkarma çıkarıldım maaş ücret fesih',
      'arbeit arbeitgeber arbeitnehmer kündigung gekündigt abfindung lohn gehalt',
      'employment employer employee dismissal dismissed fired severance salary wage',
      'arbeid werkgever werknemer ontslag ontslagen vergoeding loon salaris',
    ],
  },
  {
    area: 'damages',
    words: [
      'tazminat kaza trafik kazası zarar maddi manevi',
      'schadensersatz schmerzensgeld unfall verkehrsunfall schaden',
      'compensation damages accident injury',
      'schadevergoeding smartengeld ongeval ongeluk schade',
    ],
  },
  {
    area: 'enforcement',
    words: [
      'icra iflas haciz borç alacak takip',
      'zwangsvollstreckung pfändung insolvenz schulden forderung',
      'debt collection seizure bankruptcy insolvency creditor',
      'beslag faillissement schuld schulden incasso schuldeiser',
    ],
  },
  {
    area: 'consumer',
    words: ['tüketici ayıplı iade garanti', 'verbraucher mangel gewährleistung garantie', 'consumer defective refund warranty', 'consument gebrek garantie terugbetaling'],
  },
  {
    words: ['süre süresi zamanaşımı', 'frist fristen verjährung', 'deadline time limit limitation', 'termijn verjaring'],
  },
];
const groups = GROUPS.map((g) => ({ area: g.area, words: [...new Set(tokens(g.words.join(' ')))] }));

// Yazı dizini: dil başına bir dakika önbellekte tutulur (zamanlı yayınlar da bu sürede görünür).
const FIELDS = { title: 6, description: 4, headings: 3, body: 1 };
const cache = new Map();
function index(lang) {
  const hit = cache.get(lang);
  if (hit && Date.now() - hit.at < 60_000) return hit.docs;
  const docs = posts(lang).map((p) => ({
    post: p,
    fields: {
      title: new Set(tokens(p.title)),
      description: new Set(tokens(p.description || '')),
      headings: new Set(tokens(headings(p.body).map((x) => x.text).join(' '))),
      body: new Set(tokens(p.body)),
    },
  }));
  cache.set(lang, { at: Date.now(), docs });
  return docs;
}

// Bir kelimenin yazıdaki en güçlü alanı (başlıkta geçmesi gövdede geçmesinden değerlidir).
function fieldWeight(doc, word) {
  for (const [f, w] of Object.entries(FIELDS)) {
    if (/^\d/.test(word) && f === 'body') continue; // madde numaraları yalnızca başlıkta sayılır
    for (const t of doc.fields[f]) if (similar(word, t)) return w;
  }
  return 0;
}

/**
 * @returns {{ results: object[], area: object|null, understood: boolean }}
 *   results: en uygun yazılar (en fazla 5), area: önerilecek çalışma alanı,
 *   understood: sorudan anlamlı bir kelime çıkarılabildi mi
 */
export function findPosts(lang, question) {
  const words = [...new Set(tokens(String(question).slice(0, 500)))].filter((w) => !COMMON.some((c) => similar(w, c))).slice(0, 25);
  // Her sorgu kelimesi bir "kavram": kendisi ve eş anlamlıları. Kavram puanı en iyi eşleşmeden gelir.
  const concepts = words.map((w) => {
    const g = groups.filter((x) => x.words.some((y) => similar(w, y)));
    return { word: w, synonyms: [...new Set(g.flatMap((x) => x.words))].filter((y) => y !== w), areas: g.map((x) => x.area).filter(Boolean) };
  });
  const docs = index(lang);
  // Nadir kelimeler daha belirleyicidir.
  const idf = (w) => {
    const df = docs.filter((d) => fieldWeight(d, w)).length;
    return Math.log(1 + (docs.length + 1) / (df + 1));
  };
  const weights = new Map();
  const wIdf = (w) => (weights.has(w) ? weights.get(w) : weights.set(w, idf(w)).get(w));

  const scored = docs
    .map((d) => {
      let score = 0;
      let matched = 0;
      let strong = false; // kavramlardan biri başlıkta, özette veya ara başlıkta geçiyor mu
      for (const c of concepts) {
        let best = 0;
        for (const [w, f] of [[c.word, 1], ...c.synonyms.map((s) => [s, 0.7])]) {
          const fw = fieldWeight(d, w);
          if (fw >= FIELDS.headings) strong = true;
          best = Math.max(best, f * fw * wIdf(w));
        }
        if (best > 0) matched++;
        score += best;
      }
      // Sorudaki kavramların çoğunu karşılayan yazı öne çıkar.
      return { d, score: strong ? score * (0.5 + matched / concepts.length) : 0 };
    })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);
  const top = scored.length ? scored.filter((x) => x.score >= scored[0].score * 0.4).slice(0, 5) : [];

  // Çalışma alanı: soruda en çok anılan alan.
  const votes = {};
  for (const c of concepts) for (const a of c.areas) votes[a] = (votes[a] || 0) + 1;
  const areaKey = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    results: top.map((x) => x.d.post),
    area: areas.find((a) => a.key === areaKey) || null,
    understood: words.length > 0,
  };
}
