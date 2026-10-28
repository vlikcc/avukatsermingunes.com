// Yasal metinler: Yasal bilgiler / Impressum, Gizlilik / Datenschutz, Çerez politikası.
// ÖNEMLİ: Bu metinler taslaktır ve yayından önce hukuki incelemeden geçirilmelidir.

import config from '../site.config.js';
import { paths } from './i18n.js';
import { layout, h, missing } from './layout.js';

const L = config.lawyer;
const C = config.contact;
const P = config.privacy;

const val = (v, lang) => (v ? h(v) : missing(lang));
const addrDe = `${h(C.addressDe.street)}<br>${h(C.addressDe.city)}<br>${h(C.addressDe.country)}`;

function contactLines(lang) {
  const de = lang === 'de';
  return `${de ? 'E-Mail' : 'E-posta'}: ${C.email ? `<a href="mailto:${h(C.email)}">${h(C.email)}</a>` : missing(lang)}<br>
    ${de ? 'Telefon' : 'Telefon'}: ${val(C.phoneDe, lang)}`;
}

function imprint(lang) {
  if (lang === 'de') {
    return {
      title: 'Impressum',
      body: `
<h2>Angaben gemäß § 5 DDG</h2>
<p>${h(L.name)}<br>Avukat (Türkei)<br>${addrDe}</p>
<h2>Kontakt</h2>
<p>${contactLines(lang)}</p>
<h2>Berufsbezeichnung und berufsrechtliche Angaben</h2>
<p>Berufsbezeichnung: <strong>Avukat (Türkei)</strong>. Die Berufsbezeichnung wurde in der Republik Türkei verliehen.</p>
<p>Frau ${h(L.name)} ist Mitglied der Rechtsanwaltskammer İzmir (İzmir Barosu), Türkei${L.barTr.registryNo ? `, Registernummer ${h(L.barTr.registryNo)}` : ''}, und gemäß § 206 BRAO Mitglied der</p>
<p>Rechtsanwaltskammer Düsseldorf<br>${val(L.barDe.address, lang)}<br><a href="${h(L.barDe.url)}" rel="noopener" target="_blank">${h(L.barDe.url.replace('https://', ''))}</a><br>Mitgliedsnummer: ${h(L.barDe.memberNo)}</p>
<p>Gemäß § 206 BRAO ist sie in Deutschland zur Rechtsbesorgung auf den Gebieten des Rechts des Herkunftsstaates (türkisches Recht) und des Völkerrechts befugt. Sie ist keine in Deutschland zugelassene Rechtsanwältin und berät nicht im deutschen Recht.</p>
<h3>Berufsrechtliche Regelungen</h3>
<p>In Deutschland: Bundesrechtsanwaltsordnung (BRAO), Berufsordnung für Rechtsanwälte (BORA), Rechtsanwaltsvergütungsgesetz (RVG). Die Regelungen sind auf der Website der Bundesrechtsanwaltskammer unter <a href="https://www.brak.de" rel="noopener" target="_blank">brak.de</a> abrufbar.</p>
<p>In der Türkei: Avukatlık Kanunu (Gesetz Nr. 1136 über die Anwaltschaft) und die Berufsregeln der Union der türkischen Anwaltskammern (Türkiye Barolar Birliği), abrufbar unter <a href="https://www.barobirlik.org.tr" rel="noopener" target="_blank">barobirlik.org.tr</a>.</p>
<h2>Berufshaftpflichtversicherung</h2>
<p>Versicherer: ${val(config.insurance.insurer, lang)}<br>Anschrift: ${val(config.insurance.address, lang)}<br>Räumlicher Geltungsbereich: ${val(config.insurance.scope, lang)}</p>
${config.vatId ? `<h2>Umsatzsteuer-Identifikationsnummer</h2><p>${h(config.vatId)}</p>` : ''}
<h2>Verbraucherstreitbeilegung</h2>
<p>Bei vermögensrechtlichen Streitigkeiten aus dem Mandatsverhältnis besteht die Möglichkeit eines außergerichtlichen Streitschlichtungsverfahrens bei der Schlichtungsstelle der Rechtsanwaltschaft (<a href="https://www.s-d-r.org" rel="noopener" target="_blank">s-d-r.org</a>).</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>${h(L.name)}, Anschrift wie oben.</p>
<h2>Haftung für Inhalte</h2>
<p>Die Inhalte dieser Website dienen der allgemeinen Information und stellen keine Rechtsberatung dar. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird trotz sorgfältiger Prüfung keine Gewähr übernommen. Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.</p>`,
    };
  }
  return {
    title: 'Yasal Bilgiler',
    body: `
<h2>Avukat bilgileri</h2>
<p>Av. ${h(L.name)}<br>İzmir Barosu${L.barTr.registryNo ? `, sicil no. ${h(L.barTr.registryNo)}` : `, sicil no. ${missing(lang)}`}<br>Ruhsat tarihi: 30.01.2018<br>Hukuk bürosu: ${h(L.office)}${C.addressTr ? `, ${h(C.addressTr.street)}, ${h(C.addressTr.city)}` : ''}</p>
<h2>Almanya’daki kayıt</h2>
<p>Rechtsanwaltskammer Düsseldorf, üyelik no. ${h(L.barDe.memberNo)}, kayıt tarihi 31.10.2024.<br>Almanya’daki mesleki unvan: <strong>Avukat (Türkei)</strong> — § 206 BRAO kapsamında kayıtlı Türk avukat.</p>
<p>§ 206 BRAO uyarınca Almanya’daki hukuki danışmanlık yetkisi Türk hukuku ve uluslararası hukuk alanlarıyla sınırlıdır. Alman hukukuna ilişkin danışmanlık ve temsil hizmeti verilmez.</p>
<h2>Mesleki adres ve iletişim</h2>
<p>${addrDe}</p>
<p>${contactLines(lang)}</p>
<h2>Meslek kuralları</h2>
<p>Türkiye’de: 1136 sayılı Avukatlık Kanunu, Türkiye Barolar Birliği Meslek Kuralları ve Reklam Yasağı Yönetmeliği (<a href="https://www.barobirlik.org.tr" rel="noopener" target="_blank">barobirlik.org.tr</a>).<br>
Almanya’da: Bundesrechtsanwaltsordnung (BRAO) ve Berufsordnung für Rechtsanwälte (BORA) (<a href="https://www.brak.de" rel="noopener" target="_blank">brak.de</a>).</p>
<h2>Mesleki sorumluluk sigortası</h2>
<p>Sigorta şirketi: ${val(config.insurance.insurer, lang)}<br>Adres: ${val(config.insurance.address, lang)}<br>Kapsam: ${val(config.insurance.scope, lang)}</p>
<h2>Sorumluluk</h2>
<p>Bu sitedeki içerikler genel bilgilendirme amacı taşır, reklam niteliğinde değildir ve hukuki danışmanlık yerine geçmez. Site aracılığıyla iletilen mesaj veya randevu talepleri avukat–müvekkil ilişkisi kurmaz.</p>
<p>Almanca Impressum: <a href="${paths.imprint.de}">${paths.imprint.de}</a></p>`,
  };
}

function privacy(lang) {
  const days = P.retentionDays;
  if (lang === 'de') {
    return {
      title: 'Datenschutzerklärung',
      body: `
<h2>1. Verantwortliche</h2>
<p>${h(L.name)}, Avukat (Türkei)<br>${addrDe}<br>${contactLines(lang)}</p>
<h2>2. Grundsätze</h2>
<p>Diese Website kommt ohne Analyse- und Trackingdienste, ohne Social-Media-Plugins und ohne eingebettete Inhalte Dritter aus. Schriftarten werden vom eigenen Server geladen; es findet keine Verbindung zu Google Fonts oder anderen Drittanbietern statt.</p>
<h2>3. Hosting und Server-Logfiles</h2>
<p>Die Website wird gehostet bei: ${val(P.hostingProvider, lang)} (Serverstandort: ${val(P.hostingLocation, lang)}). Beim Aufruf der Website verarbeitet der Server technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Anwendung selbst speichert keine Zugriffsprotokolle; IP-Adressen werden zur Missbrauchsabwehr ausschließlich kurzzeitig im Arbeitsspeicher gehalten.</p>
<h2>4. Kontaktformular und Terminbuchung</h2>
<p>Wenn Sie das Kontaktformular oder die Terminbuchung nutzen, verarbeiten wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Telefonnummer, Rechtsgebiet, gewünschter Termin, Gesprächsart, Ihre Nachricht bzw. Kurzbeschreibung). Zweck ist die Bearbeitung Ihrer Anfrage und die Vereinbarung eines Gesprächstermins.</p>
<p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage). Soweit Sie in der Beschreibung freiwillig besondere Kategorien personenbezogener Daten mitteilen, erfolgt die Verarbeitung auf Grundlage Ihrer ausdrücklichen Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO. Bitte übermitteln Sie über die Website keine vertraulichen Einzelheiten.</p>
<p>Die Daten werden in einer Datenbank auf dem Server der Website gespeichert und automatisch ${days} Tage nach dem Termin bzw. nach Eingang der Nachricht gelöscht, sofern kein Mandat zustande kommt. Kommt ein Mandat zustande, gelten die berufsrechtlichen Aufbewahrungspflichten.</p>
<p>Benachrichtigungen per E-Mail werden über folgenden Dienst versendet: ${val(P.mailProvider, lang)}.</p>
<h2>5. Cookies</h2>
<p>Für Besucherinnen und Besucher setzt diese Website keine Cookies. Lediglich für den passwortgeschützten Verwaltungsbereich wird ein technisch notwendiges Sitzungscookie verwendet (§ 25 Abs. 2 Nr. 2 TDDDG). Siehe <a href="${paths.cookies.de}">Cookie-Richtlinie</a>.</p>
<h2>6. Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
<p>Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (<a href="https://www.ldi.nrw.de" rel="noopener" target="_blank">ldi.nrw.de</a>).</p>
<h2>7. Verschwiegenheit</h2>
<p>Alle Angaben unterliegen der anwaltlichen Verschwiegenheitspflicht.</p>
<p class="muted small">Stand: ${new Date().toISOString().slice(0, 7)}</p>`,
    };
  }
  return {
    title: 'Gizlilik ve KVKK Aydınlatma Metni',
    body: `
<h2>1. Veri sorumlusu</h2>
<p>Av. ${h(L.name)}<br>${addrDe}<br>${contactLines(lang)}</p>
<p>Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) m. 10 ve AB Genel Veri Koruma Tüzüğü (GDPR / DSGVO) kapsamında hazırlanmıştır.</p>
<h2>2. Genel ilkeler</h2>
<p>Bu sitede analiz veya takip araçları, sosyal medya eklentileri ya da üçüncü taraflara ait gömülü içerikler kullanılmaz. Yazı tipleri sitenin kendi sunucusundan yüklenir.</p>
<h2>3. İşlenen kişisel veriler ve amaçlar</h2>
<p>İletişim formu veya randevu sistemi aracılığıyla ilettiğiniz ad soyad, e-posta adresi, telefon numarası, hukuki konu, görüşme türü ve tarihi ile kısa açıklamanız; talebinizin yanıtlanması ve görüşme randevusunun planlanması amacıyla işlenir.</p>
<p>Siteye erişim sırasında sunucu tarafından teknik olarak gerekli veriler (IP adresi, tarih ve saat, ziyaret edilen sayfa, tarayıcı türü) sitenin sunulması ve güvenliği amacıyla işlenir. Uygulama erişim kaydı tutmaz; IP adresleri kötüye kullanımı önlemek amacıyla yalnızca kısa süreli olarak bellekte tutulur.</p>
<h2>4. Hukuki sebepler</h2>
<p>Kişisel verileriniz KVKK m. 5/2-c (bir sözleşmenin kurulmasıyla doğrudan ilgili olması) ve m. 5/2-f (meşru menfaat) ile GDPR m. 6/1-b ve 6/1-f hükümlerine dayanılarak işlenir. Açıklama alanında kendi isteğinizle paylaştığınız özel nitelikli kişisel veriler, açık rızanıza dayanılarak işlenir. Lütfen site üzerinden gizli ayrıntı paylaşmayın.</p>
<h2>5. Aktarım ve saklama</h2>
<p>Site ${val(P.hostingProvider, lang)} tarafından barındırılmaktadır (sunucu konumu: ${val(P.hostingLocation, lang)}). E-posta bildirimleri ${val(P.mailProvider, lang)} üzerinden gönderilir. Sunucunun Türkiye dışında bulunması hâlinde verileriniz KVKK m. 9’daki şartlara uygun olarak yurt dışına aktarılmış olur.</p>
<p>Veriler, avukatlık bürosu bünyesindeki sunucu veritabanında saklanır ve vekâlet ilişkisi kurulmadığı takdirde randevu tarihinden veya mesajın alınmasından ${days} gün sonra otomatik olarak silinir. Vekâlet ilişkisi kurulması hâlinde mevzuattaki saklama yükümlülükleri uygulanır.</p>
<h2>6. Çerezler</h2>
<p>Site ziyaretçiler için çerez kullanmaz. Yalnızca şifre korumalı yönetim alanında teknik olarak zorunlu bir oturum çerezi kullanılır. Ayrıntılar: <a href="${paths.cookies.tr}">Çerez politikası</a>.</p>
<h2>7. Haklarınız</h2>
<p>KVKK m. 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve zararın giderilmesini talep etme haklarına sahipsiniz. GDPR kapsamında da erişim, düzeltme, silme, işlemeyi kısıtlama, veri taşınabilirliği ve itiraz haklarınız bulunmaktadır.</p>
<p>Başvurularınızı yukarıdaki iletişim bilgileri aracılığıyla iletebilirsiniz. Ayrıca Kişisel Verileri Koruma Kurulu’na veya Almanya’da yetkili denetim makamı olan Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen’e şikâyette bulunabilirsiniz.</p>
<h2>8. Sır saklama yükümlülüğü</h2>
<p>İletilen tüm bilgiler avukatlık mesleğinin sır saklama yükümlülüğü kapsamındadır.</p>
<p class="muted small">Güncelleme: ${new Date().toISOString().slice(0, 7)}</p>`,
  };
}

function cookies(lang) {
  if (lang === 'de') {
    return {
      title: 'Cookie-Richtlinie',
      body: `
<p class="lead">Diese Website setzt für Besucherinnen und Besucher keine Cookies und verwendet keine vergleichbaren Speichertechniken zu Analyse- oder Werbezwecken.</p>
<h2>Technisch notwendiges Cookie</h2>
<p>Nur im passwortgeschützten Verwaltungsbereich wird nach der Anmeldung das Sitzungscookie <code>sid</code> gesetzt. Es dient ausschließlich der Anmeldung, ist mit den Attributen HttpOnly und SameSite=Strict versehen und läuft nach spätestens 8 Stunden ab. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG; eine Einwilligung ist nicht erforderlich.</p>
<h2>Kein Cookie-Banner</h2>
<p>Da keine einwilligungspflichtigen Cookies verwendet werden, wird kein Cookie-Banner angezeigt. Sollte sich dies ändern, wird diese Richtlinie angepasst und vorab Ihre Einwilligung eingeholt.</p>`,
    };
  }
  return {
    title: 'Çerez Politikası',
    body: `
<p class="lead">Bu site, ziyaretçiler için çerez veya analiz ve reklam amaçlı benzeri depolama teknolojileri kullanmaz.</p>
<h2>Zorunlu çerez</h2>
<p>Yalnızca şifre korumalı yönetim alanında, giriş yapıldıktan sonra <code>sid</code> adlı oturum çerezi kullanılır. Bu çerez yalnızca oturumun sürdürülmesine hizmet eder, HttpOnly ve SameSite=Strict özellikleriyle tanımlanır ve en geç 8 saat sonra geçerliliğini yitirir.</p>
<h2>Çerez bildirimi</h2>
<p>Onaya tabi çerez kullanılmadığından çerez bildirimi gösterilmez. Bu durum değişirse politika güncellenir ve önceden onayınız alınır.</p>`,
  };
}

const builders = { imprint, privacy, cookies };

export function legalPage(kind, lang) {
  const { title, body } = builders[kind](lang);
  const other = lang === 'tr' ? 'de' : 'tr';
  return layout({
    lang,
    title,
    description: title,
    path: paths[kind][lang],
    altPath: paths[kind][other],
    active: kind,
    body: `<header class="page-head"><div class="wrap"><h1>${h(title)}</h1></div></header>
      <section class="section section-tight"><div class="wrap wrap-narrow prose prose-legal">${body}</div></section>`,
  });
}
