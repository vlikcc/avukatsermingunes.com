// Yasal metinler: Yasal bilgiler / Impressum / Legal notice / Colofon, gizlilik ve çerez politikası.
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
  const [email, phone] = { tr: ['E-posta', 'Telefon'], de: ['E-Mail', 'Telefon'], en: ['Email', 'Telephone'], nl: ['E-mail', 'Telefoon'] }[lang];
  return `${email}: ${C.email ? `<a href="mailto:${h(C.email)}">${h(C.email)}</a>` : missing(lang)}<br>
    ${phone}: ${val(C.phoneDe, lang)}`;
}

// İngilizce ve Felemenkçe yasal metinler çeviridir; bağlayıcı olan Almanca metindir.
const translationNote = (lang, kind) =>
  ({
    en: `<p class="muted small">This is an English translation provided for convenience. The <a href="${paths[kind].de}" hreflang="de" lang="de">German version</a> is legally binding.</p>`,
    nl: `<p class="muted small">Dit is een Nederlandse vertaling, uitsluitend ter informatie. De <a href="${paths[kind].de}" hreflang="de" lang="de">Duitse versie</a> is juridisch bindend.</p>`,
  })[lang] || '';

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
  if (lang === 'en') {
    return {
      title: 'Legal Notice',
      body: `${translationNote(lang, 'imprint')}
<h2>Information pursuant to § 5 DDG (German Digital Services Act)</h2>
<p>${h(L.name)}<br>Avukat (Türkei)<br>${addrDe}</p>
<h2>Contact</h2>
<p>${contactLines(lang)}</p>
<h2>Professional title and regulatory information</h2>
<p>Professional title: <strong>Avukat (Türkei)</strong>. The professional title was conferred in the Republic of Türkiye.</p>
<p>Ms ${h(L.name)} is a member of the İzmir Bar Association (İzmir Barosu), Türkiye${L.barTr.registryNo ? `, registration no. ${h(L.barTr.registryNo)}` : ''}, and, under § 206 BRAO, a member of the</p>
<p>Rechtsanwaltskammer Düsseldorf (Düsseldorf Bar)<br>${val(L.barDe.address, lang)}<br><a href="${h(L.barDe.url)}" rel="noopener" target="_blank">${h(L.barDe.url.replace('https://', ''))}</a><br>Membership no.: ${h(L.barDe.memberNo)}</p>
<p>Under § 206 BRAO she is authorised to provide legal services in Germany in the law of her home country (Turkish law) and in public international law. She is not admitted as a Rechtsanwältin in Germany and does not advise on German law.</p>
<h3>Professional rules</h3>
<p>In Germany: Federal Lawyers’ Act (BRAO), Professional Code for Lawyers (BORA), Lawyers’ Remuneration Act (RVG). These rules are available on the website of the German Federal Bar at <a href="https://www.brak.de" rel="noopener" target="_blank">brak.de</a>.</p>
<p>In Türkiye: Avukatlık Kanunu (Attorneys’ Act No. 1136) and the professional rules of the Union of Turkish Bar Associations (Türkiye Barolar Birliği), available at <a href="https://www.barobirlik.org.tr" rel="noopener" target="_blank">barobirlik.org.tr</a>.</p>
<h2>Professional liability insurance</h2>
<p>Insurer: ${val(config.insurance.insurer, lang)}<br>Address: ${val(config.insurance.address, lang)}<br>Territorial scope: ${val(config.insurance.scope, lang)}</p>
${config.vatId ? `<h2>VAT identification number</h2><p>${h(config.vatId)}</p>` : ''}
<h2>Consumer dispute resolution</h2>
<p>For disputes over financial matters arising from the lawyer–client relationship, out-of-court dispute resolution is available through the Arbitration Board of the German Bar (Schlichtungsstelle der Rechtsanwaltschaft, <a href="https://www.s-d-r.org" rel="noopener" target="_blank">s-d-r.org</a>).</p>
<h2>Responsible for content under § 18(2) MStV</h2>
<p>${h(L.name)}, address as above.</p>
<h2>Liability for content</h2>
<p>The content of this website is for general information only and does not constitute legal advice. Despite careful review, no guarantee is given that the content is accurate, complete or up to date. The operators of linked external websites are solely responsible for their content.</p>`,
    };
  }
  if (lang === 'nl') {
    return {
      title: 'Colofon',
      body: `${translationNote(lang, 'imprint')}
<h2>Gegevens volgens § 5 DDG (Duitse wet digitale diensten)</h2>
<p>${h(L.name)}<br>Avukat (Türkei)<br>${addrDe}</p>
<h2>Contact</h2>
<p>${contactLines(lang)}</p>
<h2>Beroepstitel en beroepsrechtelijke gegevens</h2>
<p>Beroepstitel: <strong>Avukat (Türkei)</strong>. De beroepstitel is verleend in de Republiek Turkije.</p>
<p>Mevrouw ${h(L.name)} is lid van de Orde van Advocaten in İzmir (İzmir Barosu), Turkije${L.barTr.registryNo ? `, registratienummer ${h(L.barTr.registryNo)}` : ''}, en op grond van § 206 BRAO lid van de</p>
<p>Rechtsanwaltskammer Düsseldorf (Orde van Advocaten Düsseldorf)<br>${val(L.barDe.address, lang)}<br><a href="${h(L.barDe.url)}" rel="noopener" target="_blank">${h(L.barDe.url.replace('https://', ''))}</a><br>Lidmaatschapsnummer: ${h(L.barDe.memberNo)}</p>
<p>Op grond van § 206 BRAO is zij in Duitsland bevoegd juridische diensten te verlenen op het gebied van het recht van haar land van herkomst (Turks recht) en het internationaal publiekrecht. Zij is niet toegelaten als Rechtsanwältin in Duitsland of als advocaat in Nederland en adviseert niet over Duits of Nederlands recht.</p>
<h3>Beroepsregels</h3>
<p>In Duitsland: Bundesrechtsanwaltsordnung (BRAO), Berufsordnung für Rechtsanwälte (BORA), Rechtsanwaltsvergütungsgesetz (RVG). Deze regels zijn te raadplegen op de website van de Duitse Orde van Advocaten, <a href="https://www.brak.de" rel="noopener" target="_blank">brak.de</a>.</p>
<p>In Turkije: Avukatlık Kanunu (advocatenwet nr. 1136) en de beroepsregels van de Unie van Turkse Ordes van Advocaten (Türkiye Barolar Birliği), te raadplegen op <a href="https://www.barobirlik.org.tr" rel="noopener" target="_blank">barobirlik.org.tr</a>.</p>
<h2>Beroepsaansprakelijkheidsverzekering</h2>
<p>Verzekeraar: ${val(config.insurance.insurer, lang)}<br>Adres: ${val(config.insurance.address, lang)}<br>Territoriale dekking: ${val(config.insurance.scope, lang)}</p>
${config.vatId ? `<h2>Btw-identificatienummer</h2><p>${h(config.vatId)}</p>` : ''}
<h2>Geschillenbeslechting voor consumenten</h2>
<p>Bij vermogensrechtelijke geschillen uit de opdrachtrelatie is buitengerechtelijke geschillenbeslechting mogelijk via de geschillencommissie van de Duitse advocatuur (Schlichtungsstelle der Rechtsanwaltschaft, <a href="https://www.s-d-r.org" rel="noopener" target="_blank">s-d-r.org</a>).</p>
<h2>Verantwoordelijk voor de inhoud volgens § 18 lid 2 MStV</h2>
<p>${h(L.name)}, adres zoals hierboven.</p>
<h2>Aansprakelijkheid voor de inhoud</h2>
<p>De inhoud van deze website is uitsluitend bedoeld als algemene informatie en vormt geen juridisch advies. Ondanks zorgvuldige controle wordt niet ingestaan voor de juistheid, volledigheid en actualiteit van de inhoud. Voor de inhoud van externe links zijn uitsluitend de beheerders daarvan verantwoordelijk.</p>`,
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
  if (lang === 'en') {
    return {
      title: 'Privacy Policy',
      body: `${translationNote(lang, 'privacy')}
<h2>1. Controller</h2>
<p>${h(L.name)}, Avukat (Türkei)<br>${addrDe}<br>${contactLines(lang)}</p>
<h2>2. Principles</h2>
<p>This website does not use analytics or tracking services, social media plugins or embedded third-party content. Fonts are loaded from our own server; no connection is made to Google Fonts or other third-party providers.</p>
<h2>3. Hosting and server log files</h2>
<p>The website is hosted by: ${val(P.hostingProvider, lang)} (server location: ${val(P.hostingLocation, lang)}). When you visit the website, the server processes technically necessary data (IP address, date and time, page requested, browser type) in order to deliver the website and ensure its security. The legal basis is Art. 6(1)(f) GDPR. The application itself does not store access logs; IP addresses are held only briefly in memory to prevent misuse.</p>
<h2>4. Contact form and appointment booking</h2>
<p>If you use the contact form or appointment booking, we process the data you provide (name, email address, telephone number, practice area, requested appointment, type of consultation, your message or brief description). The purpose is to handle your enquiry and arrange a consultation.</p>
<p>The legal basis is Art. 6(1)(b) GDPR (pre-contractual measures taken at your request). Where you voluntarily include special categories of personal data in your description, they are processed on the basis of your explicit consent under Art. 9(2)(a) GDPR. Please do not send confidential details through the website.</p>
<p>The data is stored in a database on the website’s server and automatically deleted ${days} days after the appointment or after receipt of the message, unless a lawyer–client relationship is established. If a relationship is established, the statutory professional retention obligations apply.</p>
<p>Email notifications are sent via the following service: ${val(P.mailProvider, lang)}.</p>
<h2>5. Cookies</h2>
<p>This website does not set any cookies for visitors. A technically necessary session cookie is used only in the password-protected administration area (§ 25(2) no. 2 TDDDG). See the <a href="${paths.cookies.en}">cookie policy</a>.</p>
<h2>6. Your rights</h2>
<p>You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and objection (Art. 21). You may withdraw any consent you have given at any time with effect for the future.</p>
<p>You also have the right to lodge a complaint with a data protection supervisory authority, in particular in the EU member state of your habitual residence. The authority responsible for us is the Data Protection and Freedom of Information Commissioner of North Rhine-Westphalia (Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, <a href="https://www.ldi.nrw.de" rel="noopener" target="_blank">ldi.nrw.de</a>).</p>
<h2>7. Confidentiality</h2>
<p>All information is subject to the lawyer’s duty of professional confidentiality.</p>
<p class="muted small">Last updated: ${new Date().toISOString().slice(0, 7)}</p>`,
    };
  }
  if (lang === 'nl') {
    return {
      title: 'Privacyverklaring',
      body: `${translationNote(lang, 'privacy')}
<h2>1. Verwerkingsverantwoordelijke</h2>
<p>${h(L.name)}, Avukat (Türkei)<br>${addrDe}<br>${contactLines(lang)}</p>
<h2>2. Uitgangspunten</h2>
<p>Deze website gebruikt geen analyse- of trackingdiensten, geen social-media-plug-ins en geen ingesloten inhoud van derden. Lettertypen worden vanaf onze eigen server geladen; er wordt geen verbinding gemaakt met Google Fonts of andere externe aanbieders.</p>
<h2>3. Hosting en serverlogbestanden</h2>
<p>De website wordt gehost door: ${val(P.hostingProvider, lang)} (serverlocatie: ${val(P.hostingLocation, lang)}). Bij een bezoek aan de website verwerkt de server technisch noodzakelijke gegevens (IP-adres, datum en tijd, opgevraagde pagina, browsertype) om de website te leveren en de beveiliging ervan te waarborgen. De rechtsgrondslag is art. 6 lid 1 sub f AVG. De applicatie zelf slaat geen toegangslogs op; IP-adressen worden ter voorkoming van misbruik alleen kortstondig in het werkgeheugen bewaard.</p>
<h2>4. Contactformulier en afspraken</h2>
<p>Als u het contactformulier of de afsprakenmodule gebruikt, verwerken wij de gegevens die u opgeeft (naam, e-mailadres, telefoonnummer, rechtsgebied, gewenste afspraak, soort gesprek, uw bericht of korte omschrijving). Het doel is de behandeling van uw vraag en het plannen van een gesprek.</p>
<p>De rechtsgrondslag is art. 6 lid 1 sub b AVG (precontractuele maatregelen op uw verzoek). Voor zover u in de omschrijving vrijwillig bijzondere categorieën van persoonsgegevens vermeldt, gebeurt de verwerking op basis van uw uitdrukkelijke toestemming volgens art. 9 lid 2 sub a AVG. Stuur via de website geen vertrouwelijke details.</p>
<p>De gegevens worden opgeslagen in een database op de server van de website en automatisch ${days} dagen na de afspraak of na ontvangst van het bericht verwijderd, tenzij er een opdrachtrelatie tot stand komt. In dat geval gelden de beroepsrechtelijke bewaarplichten.</p>
<p>E-mailmeldingen worden verstuurd via de volgende dienst: ${val(P.mailProvider, lang)}.</p>
<h2>5. Cookies</h2>
<p>Deze website plaatst geen cookies bij bezoekers. Alleen in het met een wachtwoord beveiligde beheergedeelte wordt een technisch noodzakelijke sessiecookie gebruikt (§ 25 lid 2 nr. 2 TDDDG). Zie het <a href="${paths.cookies.nl}">cookiebeleid</a>.</p>
<h2>6. Uw rechten</h2>
<p>U hebt recht op inzage (art. 15 AVG), rectificatie (art. 16), wissing (art. 17), beperking van de verwerking (art. 18), overdraagbaarheid van gegevens (art. 20) en bezwaar (art. 21). Een gegeven toestemming kunt u op elk moment met werking voor de toekomst intrekken.</p>
<p>U hebt bovendien het recht een klacht in te dienen bij een toezichthoudende autoriteit, met name in de EU-lidstaat waar u woont; in Nederland is dat de Autoriteit Persoonsgegevens (<a href="https://www.autoriteitpersoonsgegevens.nl" rel="noopener" target="_blank">autoriteitpersoonsgegevens.nl</a>). Voor ons bevoegd is de toezichthouder van Noordrijn-Westfalen (Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, <a href="https://www.ldi.nrw.de" rel="noopener" target="_blank">ldi.nrw.de</a>).</p>
<h2>7. Geheimhouding</h2>
<p>Alle gegevens vallen onder de beroepsgeheimhoudingsplicht van de advocaat.</p>
<p class="muted small">Bijgewerkt: ${new Date().toISOString().slice(0, 7)}</p>`,
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
  if (lang === 'en') {
    return {
      title: 'Cookie Policy',
      body: `${translationNote(lang, 'cookies')}
<p class="lead">This website does not set any cookies for visitors and does not use comparable storage technologies for analytics or advertising.</p>
<h2>Technically necessary cookie</h2>
<p>Only in the password-protected administration area is the session cookie <code>sid</code> set after login. It is used solely for authentication, carries the HttpOnly and SameSite=Strict attributes and expires after 8 hours at the latest. The legal basis is § 25(2) no. 2 TDDDG; consent is not required.</p>
<h2>No cookie banner</h2>
<p>As no cookies requiring consent are used, no cookie banner is shown. Should this change, this policy will be updated and your consent obtained in advance.</p>`,
    };
  }
  if (lang === 'nl') {
    return {
      title: 'Cookiebeleid',
      body: `${translationNote(lang, 'cookies')}
<p class="lead">Deze website plaatst geen cookies bij bezoekers en gebruikt geen vergelijkbare opslagtechnieken voor analyse- of advertentiedoeleinden.</p>
<h2>Technisch noodzakelijke cookie</h2>
<p>Alleen in het met een wachtwoord beveiligde beheergedeelte wordt na het inloggen de sessiecookie <code>sid</code> geplaatst. Deze dient uitsluitend voor het inloggen, heeft de kenmerken HttpOnly en SameSite=Strict en verloopt uiterlijk na 8 uur. De rechtsgrondslag is § 25 lid 2 nr. 2 TDDDG; toestemming is niet vereist.</p>
<h2>Geen cookiemelding</h2>
<p>Omdat er geen cookies worden gebruikt waarvoor toestemming nodig is, wordt geen cookiemelding getoond. Mocht dit veranderen, dan wordt dit beleid aangepast en vooraf uw toestemming gevraagd.</p>`,
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
  return layout({
    lang,
    title,
    description: title,
    path: paths[kind][lang],
    alt: paths[kind],
    active: kind,
    body: `<header class="page-head"><div class="wrap"><h1>${h(title)}</h1></div></header>
      <section class="section section-tight"><div class="wrap wrap-narrow prose prose-legal">${body}</div></section>`,
  });
}
