// Hukuki çalışma alanları. Her alan için Türkçe (TR), Almanca (DE), İngilizce (EN) ve Felemenkçe (NL) içerik.
// Almanca, İngilizce ve Felemenkçe metinler, § 206 BRAO gereği Türk hukuku çerçevesinde yazılmıştır.

export const areas = [
  {
    key: 'family',
    slug: { tr: 'aile-hukuku', de: 'familienrecht', en: 'family-law', nl: 'familierecht' },
    title: { tr: 'Aile Hukuku', de: 'Familienrecht', en: 'Family Law', nl: 'Familierecht' },
    summary: {
      tr: 'Boşanma, velayet, nafaka ve mal rejimi uyuşmazlıkları.',
      de: 'Scheidung, Sorgerecht, Unterhalt und Güterrecht nach türkischem Recht.',
      en: 'Divorce, custody, maintenance and matrimonial property under Turkish law.',
      nl: 'Echtscheiding, gezag, alimentatie en huwelijksvermogensrecht naar Turks recht.',
    },
    intro: {
      tr: [
        'Aile hukuku uyuşmazlıkları, tarafların ve çocukların yaşamını doğrudan etkiler. Bu nedenle her dosya; ailenin somut durumu, çocuğun üstün yararı ve tarafların hukuki hakları birlikte gözetilerek değerlendirilir.',
        'Boşanma sürecinde velayet, nafaka ve mal rejiminin tasfiyesi çoğu zaman birbiriyle bağlantılıdır. Taleplerin baştan doğru kurulması, sürecin sağlıklı ilerlemesi için önemlidir.',
      ],
      de: [
        'Familienrechtliche Streitigkeiten betreffen das Leben der Beteiligten und ihrer Kinder unmittelbar. Jede Angelegenheit wird daher unter Berücksichtigung der konkreten Familiensituation, des Kindeswohls und der Rechte der Beteiligten nach türkischem Recht geprüft.',
        'Im Scheidungsverfahren hängen Sorgerecht, Unterhalt und güterrechtliche Auseinandersetzung häufig zusammen. Eine sorgfältige Formulierung der Anträge von Beginn an ist für einen geordneten Verfahrensablauf wesentlich.',
      ],
      en: [
        'Family law disputes directly affect the lives of the parties and their children. Each matter is therefore assessed under Turkish law, taking into account the specific family situation, the best interests of the child and the rights of those involved.',
        'In divorce proceedings, custody, maintenance and the division of matrimonial property are often interlinked. Framing the applications carefully from the outset is essential for the proceedings to run in an orderly manner.',
      ],
      nl: [
        'Familierechtelijke geschillen raken rechtstreeks het leven van de betrokkenen en hun kinderen. Elke zaak wordt daarom naar Turks recht beoordeeld, met inachtneming van de concrete gezinssituatie, het belang van het kind en de rechten van de betrokkenen.',
        'In een echtscheidingsprocedure hangen gezag, alimentatie en de verdeling van het huwelijksvermogen vaak met elkaar samen. Een zorgvuldige formulering van de verzoeken vanaf het begin is van wezenlijk belang voor een ordelijk verloop van de procedure.',
      ],
    },
    items: {
      tr: [
        'Çekişmeli boşanma',
        'Anlaşmalı boşanma',
        'Velayet',
        'Nafaka',
        'Mal rejiminin tasfiyesi',
        'Aile hukukundan kaynaklanan tazminat talepleri',
        'Yurt dışı bağlantılı aile hukuku uyuşmazlıkları',
      ],
      de: [
        'Streitige Scheidung',
        'Einvernehmliche Scheidung',
        'Sorgerecht',
        'Unterhalt',
        'Güterrechtliche Auseinandersetzung',
        'Schadensersatzansprüche im Zusammenhang mit der Ehe',
        'Familienrechtliche Streitigkeiten mit Auslandsbezug',
      ],
      en: [
        'Contested divorce',
        'Divorce by mutual consent',
        'Custody',
        'Maintenance',
        'Division of matrimonial property',
        'Claims for damages in connection with the marriage',
        'Family law disputes with a foreign element',
      ],
      nl: [
        'Betwiste echtscheiding',
        'Echtscheiding met wederzijds goedvinden',
        'Gezag',
        'Alimentatie',
        'Verdeling van het huwelijksvermogen',
        'Schadevorderingen in verband met het huwelijk',
        'Familierechtelijke geschillen met een internationaal element',
      ],
    },
    crossBorder: {
      tr: 'Eşlerden birinin veya her ikisinin Almanya’da yaşadığı durumlarda, Türk mahkemelerinin yetkisi ve uygulanacak hukuk ayrıca incelenir. Almanya’da verilmiş boşanma kararlarının Türkiye’de tanınması da bu kapsamdadır.',
      de: 'Leben ein oder beide Ehegatten in Deutschland, sind die Zuständigkeit der türkischen Gerichte und das anwendbare Recht gesondert zu prüfen. Dazu gehört auch die Anerkennung deutscher Scheidungsurteile in der Türkei.',
      en: 'Where one or both spouses live in Germany, the jurisdiction of the Turkish courts and the applicable law must be examined separately. This includes the recognition of German divorce judgments in Türkiye.',
      nl: 'Wonen een of beide echtgenoten in Duitsland, dan moeten de bevoegdheid van de Turkse rechter en het toepasselijke recht afzonderlijk worden onderzocht. Daartoe behoort ook de erkenning van Duitse echtscheidingsvonnissen in Turkije.',
    },
  },
  {
    key: 'inheritance',
    slug: { tr: 'miras-hukuku', de: 'erbrecht', en: 'inheritance-law', nl: 'erfrecht' },
    title: { tr: 'Miras Hukuku', de: 'Erbrecht', en: 'Inheritance Law', nl: 'Erfrecht' },
    summary: {
      tr: 'Mirasçılık belgesi, mirasın reddi, paylaşım ve vasiyetname uyuşmazlıkları.',
      de: 'Erbschein, Ausschlagung, Erbauseinandersetzung und Testamente nach türkischem Recht.',
      en: 'Certificates of inheritance, disclaimers, distribution of estates and wills under Turkish law.',
      nl: 'Verklaring van erfrecht, verwerping, verdeling van de nalatenschap en testamenten naar Turks recht.',
    },
    intro: {
      tr: [
        'Miras hukukuna ilişkin işlemler çoğu zaman süreye bağlıdır ve birden fazla mirasçıyı ilgilendirir. Mirasın reddi gibi bazı haklar, kanunda öngörülen süreler içinde kullanılmadığında kaybedilebilir.',
        'Mirasçılık belgesinin alınmasından terekenin paylaşımına kadar her aşama, mirasçılar arasındaki ilişki ve terekenin niteliği dikkate alınarak planlanır.',
      ],
      de: [
        'Erbrechtliche Angelegenheiten sind häufig fristgebunden und betreffen mehrere Erben. Manche Rechte, etwa die Ausschlagung der Erbschaft, können verloren gehen, wenn sie nicht innerhalb der gesetzlichen Fristen ausgeübt werden.',
        'Von der Beantragung des Erbscheins (mirasçılık belgesi) bis zur Auseinandersetzung des Nachlasses wird jeder Schritt unter Berücksichtigung der Erbengemeinschaft und der Art des Nachlasses geplant.',
      ],
      en: [
        'Inheritance matters are often subject to time limits and involve several heirs. Some rights, such as disclaiming an inheritance, may be lost if they are not exercised within the statutory time limits.',
        'From the application for a certificate of inheritance (mirasçılık belgesi) to the distribution of the estate, each step is planned with regard to the community of heirs and the nature of the estate.',
      ],
      nl: [
        'Erfrechtelijke zaken zijn vaak aan termijnen gebonden en betreffen meerdere erfgenamen. Sommige rechten, zoals het verwerpen van een nalatenschap, kunnen verloren gaan als zij niet binnen de wettelijke termijnen worden uitgeoefend.',
        'Van de aanvraag van de verklaring van erfrecht (mirasçılık belgesi) tot de verdeling van de nalatenschap wordt elke stap gepland met inachtneming van de gemeenschap van erfgenamen en de aard van de nalatenschap.',
      ],
    },
    items: {
      tr: [
        'Mirasın reddi',
        'Mirasçılık belgesi',
        'Miras paylaşımı',
        'Miras payının devri',
        'Tenkis davaları',
        'Vasiyetname uyuşmazlıkları',
        'Yurt dışında yaşayan mirasçıların Türkiye’deki işlemleri',
      ],
      de: [
        'Ausschlagung der Erbschaft',
        'Erbschein (mirasçılık belgesi)',
        'Erbauseinandersetzung',
        'Übertragung von Erbanteilen',
        'Herabsetzungsklagen (tenkis)',
        'Streitigkeiten über Testamente',
        'Nachlassangelegenheiten in der Türkei für Erben mit Wohnsitz im Ausland',
      ],
      en: [
        'Disclaimer of an inheritance',
        'Certificate of inheritance (mirasçılık belgesi)',
        'Distribution of the estate',
        'Transfer of shares in an estate',
        'Actions for abatement (tenkis)',
        'Disputes concerning wills',
        'Estate matters in Türkiye for heirs resident abroad',
      ],
      nl: [
        'Verwerping van de nalatenschap',
        'Verklaring van erfrecht (mirasçılık belgesi)',
        'Verdeling van de nalatenschap',
        'Overdracht van erfdelen',
        'Vorderingen tot inkorting (tenkis)',
        'Geschillen over testamenten',
        'Nalatenschapszaken in Turkije voor erfgenamen die in het buitenland wonen',
      ],
    },
    crossBorder: {
      tr: 'Türkiye’de bulunan taşınmazlar bakımından miras hukukuna Türk hukuku uygulanır (5718 sayılı MÖHUK m. 20). Almanya’da yaşayan mirasçılar, vekâletname ile Türkiye’deki işlemlerini vekil aracılığıyla yürütebilir.',
      de: 'Für in der Türkei belegene Grundstücke gilt im Erbrecht türkisches Recht (Art. 20 des türkischen IPR-Gesetzes Nr. 5718). In Deutschland lebende Erben können ihre Angelegenheiten in der Türkei mit einer Vollmacht durch eine Bevollmächtigte erledigen lassen.',
      en: 'For immovable property located in Türkiye, Turkish law governs succession (Art. 20 of the Turkish Private International Law Act No. 5718). Heirs living in Germany can have their matters in Türkiye handled by an authorised representative under a power of attorney.',
      nl: 'Voor in Turkije gelegen onroerende zaken geldt in het erfrecht Turks recht (art. 20 van de Turkse wet nr. 5718 inzake internationaal privaatrecht). In Duitsland wonende erfgenamen kunnen hun zaken in Turkije met een volmacht door een gevolmachtigde laten behandelen.',
    },
  },
  {
    key: 'realestate',
    slug: { tr: 'gayrimenkul-hukuku', de: 'immobilienrecht', en: 'real-estate-law', nl: 'vastgoedrecht' },
    title: { tr: 'Gayrimenkul Hukuku', de: 'Immobilienrecht', en: 'Real Estate Law', nl: 'Vastgoedrecht' },
    summary: {
      tr: 'Tapu, ortaklığın giderilmesi, kira ve taşınmaz mülkiyeti uyuşmazlıkları.',
      de: 'Grundbuch, Aufhebung von Miteigentum, Miete und Eigentum an Immobilien in der Türkei.',
      en: 'Land registry, dissolution of co-ownership, tenancy and ownership of property in Türkiye.',
      nl: 'Kadaster, opheffing van mede-eigendom, huur en eigendom van onroerend goed in Turkije.',
    },
    intro: {
      tr: [
        'Taşınmazlara ilişkin uyuşmazlıklarda tapu kayıtları, imar durumu ve taraflar arasındaki sözleşmeler birlikte incelenir. Hukuki sürecin sağlıklı yürütülmesi için belgelerin eksiksiz değerlendirilmesi önemlidir.',
        'Paylı mülkiyetteki taşınmazlar, kira ilişkileri ve inşaat sözleşmeleri gibi farklı konularda dava ve danışmanlık hizmeti verilmektedir.',
      ],
      de: [
        'Bei Streitigkeiten über Immobilien in der Türkei werden Grundbucheinträge (tapu), planungsrechtliche Situation und die Verträge der Beteiligten gemeinsam geprüft. Eine vollständige Auswertung der Unterlagen ist Voraussetzung für ein geordnetes Verfahren.',
        'Beratung und Vertretung erfolgen unter anderem bei Miteigentum, Mietverhältnissen und Bauverträgen nach türkischem Recht.',
      ],
      en: [
        'In disputes concerning property in Türkiye, land registry entries (tapu), the planning situation and the parties’ contracts are examined together. A complete review of the documents is a prerequisite for orderly proceedings.',
        'Advice and representation are provided in matters including co-ownership, tenancies and construction contracts under Turkish law.',
      ],
      nl: [
        'Bij geschillen over onroerend goed in Turkije worden de inschrijvingen in het kadaster (tapu), de planologische situatie en de overeenkomsten van de betrokkenen gezamenlijk onderzocht. Een volledige beoordeling van de stukken is een voorwaarde voor een ordelijke procedure.',
        'Advies en vertegenwoordiging worden onder meer verleend bij mede-eigendom, huurverhoudingen en bouwovereenkomsten naar Turks recht.',
      ],
    },
    items: {
      tr: [
        'Tapu iptal ve tescil',
        'Ortaklığın giderilmesi',
        'Önalım hakkı',
        'Geçit hakkı',
        'Kira tespit davaları',
        'İnşaat sözleşmelerinden kaynaklanan uyuşmazlıklar',
        'Taşınmaz mülkiyetine ilişkin uyuşmazlıklar',
      ],
      de: [
        'Klagen auf Löschung und Eintragung im Grundbuch (tapu iptal ve tescil)',
        'Aufhebung von Miteigentum (ortaklığın giderilmesi)',
        'Vorkaufsrecht',
        'Notwegerecht',
        'Klagen auf Feststellung der Miethöhe',
        'Streitigkeiten aus Bauverträgen',
        'Streitigkeiten über das Eigentum an Grundstücken',
      ],
      en: [
        'Actions for cancellation and registration of title (tapu iptal ve tescil)',
        'Dissolution of co-ownership (ortaklığın giderilmesi)',
        'Right of pre-emption',
        'Right of way of necessity',
        'Actions to determine the rent',
        'Disputes arising from construction contracts',
        'Disputes concerning ownership of land',
      ],
      nl: [
        'Vorderingen tot doorhaling en inschrijving in het kadaster (tapu iptal ve tescil)',
        'Opheffing van mede-eigendom (ortaklığın giderilmesi)',
        'Voorkeursrecht',
        'Recht van noodweg',
        'Vorderingen tot vaststelling van de huurprijs',
        'Geschillen uit bouwovereenkomsten',
        'Geschillen over de eigendom van onroerende zaken',
      ],
    },
    crossBorder: {
      tr: 'Almanya’da yaşayan malikler ve mirasçılar için Türkiye’deki taşınmazlara ilişkin işlemler, vekâletname ile vekil aracılığıyla takip edilebilir.',
      de: 'Für Eigentümer und Erben mit Wohnsitz in Deutschland können Angelegenheiten zu Immobilien in der Türkei mit einer Vollmacht durch eine Bevollmächtigte betreut werden.',
      en: 'For owners and heirs resident in Germany, matters relating to property in Türkiye can be handled by an authorised representative under a power of attorney.',
      nl: 'Voor eigenaren en erfgenamen die in Duitsland wonen, kunnen zaken met betrekking tot onroerend goed in Turkije met een volmacht door een gevolmachtigde worden behandeld.',
    },
  },
  {
    key: 'criminal',
    slug: { tr: 'ceza-hukuku', de: 'strafrecht', en: 'criminal-law', nl: 'strafrecht' },
    title: { tr: 'Ceza Hukuku', de: 'Strafrecht', en: 'Criminal Law', nl: 'Strafrecht' },
    summary: {
      tr: 'Soruşturma ve kovuşturma aşamalarında müdafilik ve vekillik.',
      de: 'Verteidigung und Vertretung in türkischen Ermittlungs- und Strafverfahren.',
      en: 'Defence and representation in Turkish criminal investigations and proceedings.',
      nl: 'Verdediging en vertegenwoordiging in Turkse opsporingsonderzoeken en strafprocedures.',
    },
    intro: {
      tr: [
        'Ceza yargılamasında savunma hakkı, soruşturmanın ilk anından itibaren önem taşır. İfade ve sorgu süreçlerinde hukuki yardım almak, şüpheli ve sanığın temel haklarındandır.',
        'Soruşturma ve kovuşturma aşamalarında şüpheli ve sanık müdafiliği ile mağdur ve müşteki vekilliği yürütülmektedir.',
      ],
      de: [
        'Im türkischen Strafverfahren ist das Recht auf Verteidigung von Beginn der Ermittlungen an von Bedeutung. Anwaltlicher Beistand bei Vernehmungen gehört zu den grundlegenden Rechten von Beschuldigten.',
        'Übernommen werden Verteidigungen im Ermittlungs- und Hauptverfahren sowie die Vertretung von Geschädigten und Anzeigeerstattern vor türkischen Gerichten.',
      ],
      en: [
        'In Turkish criminal proceedings, the right to a defence matters from the very start of the investigation. Legal assistance during questioning is one of the fundamental rights of suspects and defendants.',
        'Defence work is undertaken at the investigation and trial stages, as is the representation of injured parties and complainants before the Turkish courts.',
      ],
      nl: [
        'In het Turkse strafproces is het recht op verdediging vanaf het begin van het opsporingsonderzoek van belang. Rechtsbijstand bij verhoren behoort tot de fundamentele rechten van verdachten.',
        'Verdediging wordt verzorgd in het opsporingsonderzoek en in de hoofdprocedure, evenals de vertegenwoordiging van benadeelden en aangevers voor de Turkse rechter.',
      ],
    },
    items: {
      tr: [
        'Soruşturma aşamasında müdafilik',
        'Ceza davalarında savunma',
        'Mağdur ve müşteki vekilliği',
        'İstinaf ve temyiz başvuruları',
        'Ceza yargılamasına ilişkin hukuki danışmanlık',
      ],
      de: [
        'Verteidigung im Ermittlungsverfahren',
        'Verteidigung in Strafverfahren',
        'Vertretung von Geschädigten und Anzeigeerstattern',
        'Berufung und Revision (istinaf und temyiz)',
        'Rechtsberatung zum türkischen Strafverfahren',
      ],
      en: [
        'Defence during the investigation stage',
        'Defence in criminal proceedings',
        'Representation of injured parties and complainants',
        'Appeals (istinaf and temyiz)',
        'Legal advice on Turkish criminal procedure',
      ],
      nl: [
        'Verdediging in het opsporingsonderzoek',
        'Verdediging in strafzaken',
        'Vertegenwoordiging van benadeelden en aangevers',
        'Hoger beroep en cassatie (istinaf en temyiz)',
        'Juridisch advies over het Turkse strafprocesrecht',
      ],
    },
  },
  {
    key: 'labour',
    slug: { tr: 'is-hukuku', de: 'arbeitsrecht', en: 'employment-law', nl: 'arbeidsrecht' },
    title: { tr: 'İş Hukuku', de: 'Arbeitsrecht', en: 'Employment Law', nl: 'Arbeidsrecht' },
    summary: {
      tr: 'İşçilik alacakları, kıdem ve ihbar tazminatı, işe iade ve iş kazaları.',
      de: 'Vergütungsansprüche, Abfindung, Kündigungsschutz und Arbeitsunfälle nach türkischem Recht.',
      en: 'Pay claims, severance pay, protection against dismissal and workplace accidents under Turkish law.',
      nl: 'Loonvorderingen, ontslagvergoeding, ontslagbescherming en arbeidsongevallen naar Turks recht.',
    },
    intro: {
      tr: [
        'İş ilişkisinin sona ermesiyle birlikte işçilik alacakları, tazminatlar ve işe iade gibi talepler gündeme gelebilir. Bu taleplerin bir kısmı kısa hak düşürücü sürelere bağlıdır.',
        'İş hukukunda arabuluculuk, birçok uyuşmazlık için dava şartıdır. Süreç, arabuluculuk aşamasından itibaren planlanır.',
      ],
      de: [
        'Mit dem Ende eines Arbeitsverhältnisses in der Türkei können Vergütungsansprüche, Abfindungen oder eine Klage auf Wiedereinstellung in Betracht kommen. Einige dieser Ansprüche unterliegen kurzen Ausschlussfristen.',
        'Im türkischen Arbeitsrecht ist für viele Streitigkeiten ein Mediationsverfahren Prozessvoraussetzung. Das Vorgehen wird daher bereits ab der Mediationsphase geplant.',
      ],
      en: [
        'When an employment relationship in Türkiye ends, pay claims, severance payments or an action for reinstatement may come into consideration. Some of these claims are subject to short preclusive time limits.',
        'Under Turkish employment law, mediation is a procedural prerequisite for many disputes. The approach is therefore planned from the mediation stage onwards.',
      ],
      nl: [
        'Bij het einde van een arbeidsverhouding in Turkije kunnen loonvorderingen, ontslagvergoedingen of een vordering tot herstel van de arbeidsovereenkomst aan de orde komen. Voor een deel van deze vorderingen gelden korte vervaltermijnen.',
        'In het Turkse arbeidsrecht is mediation voor veel geschillen een ontvankelijkheidsvoorwaarde. De aanpak wordt daarom al vanaf de mediationfase gepland.',
      ],
    },
    items: {
      tr: [
        'İşçilik alacakları',
        'Kıdem ve ihbar tazminatı',
        'İşe iade davaları',
        'İş kazaları',
        'İş sözleşmelerinden kaynaklanan uyuşmazlıklar',
      ],
      de: [
        'Vergütungsansprüche von Arbeitnehmern',
        'Abfindung (kıdem) und Entschädigung für Kündigungsfristen (ihbar)',
        'Klagen auf Wiedereinstellung',
        'Arbeitsunfälle',
        'Streitigkeiten aus Arbeitsverträgen',
      ],
      en: [
        'Employee pay claims',
        'Severance pay (kıdem) and compensation in lieu of notice (ihbar)',
        'Actions for reinstatement',
        'Workplace accidents',
        'Disputes arising from employment contracts',
      ],
      nl: [
        'Loonvorderingen van werknemers',
        'Ontslagvergoeding (kıdem) en vergoeding wegens niet-inachtneming van de opzegtermijn (ihbar)',
        'Vorderingen tot herstel van de arbeidsovereenkomst',
        'Arbeidsongevallen',
        'Geschillen uit arbeidsovereenkomsten',
      ],
    },
  },
  {
    key: 'enforcement',
    slug: {
      tr: 'icra-ve-iflas-hukuku',
      de: 'zwangsvollstreckung-insolvenz',
      en: 'enforcement-insolvency',
      nl: 'executie-insolventie',
    },
    title: {
      tr: 'İcra ve İflas Hukuku',
      de: 'Zwangsvollstreckungs- und Insolvenzrecht',
      en: 'Enforcement and Insolvency Law',
      nl: 'Executie- en insolventierecht',
    },
    summary: {
      tr: 'İcra takipleri, alacak tahsili, itirazın iptali ve haciz işlemleri.',
      de: 'Vollstreckungsverfahren und Forderungseinzug in der Türkei.',
      en: 'Enforcement proceedings and debt recovery in Türkiye.',
      nl: 'Executieprocedures en incasso van vorderingen in Turkije.',
    },
    intro: {
      tr: [
        'Alacağın tahsili için başlatılan icra takiplerinde takip yolunun doğru seçilmesi ve borçlunun itirazlarına karşı zamanında hareket edilmesi önemlidir.',
        'İlamlı ve ilamsız takipler, nafaka alacaklarının icrası ve haciz işlemleri, alacaklı ve borçlu tarafların durumu gözetilerek yürütülür.',
      ],
      de: [
        'Bei der Durchsetzung von Forderungen in der Türkei kommt es auf die Wahl des richtigen Vollstreckungsweges und auf rechtzeitiges Handeln gegen Widersprüche des Schuldners an.',
        'Betreut werden Vollstreckungen mit und ohne Titel, die Vollstreckung von Unterhaltsforderungen und Pfändungsmaßnahmen.',
      ],
      en: [
        'When enforcing claims in Türkiye, it is important to choose the right enforcement route and to act in time against objections raised by the debtor.',
        'Assistance is provided with enforcement with and without an enforceable title, the enforcement of maintenance claims and attachment measures.',
      ],
      nl: [
        'Bij het verhalen van vorderingen in Turkije komt het aan op de keuze van de juiste executieweg en op tijdig optreden tegen bezwaren van de schuldenaar.',
        'Begeleiding wordt geboden bij executie met en zonder executoriale titel, de tenuitvoerlegging van alimentatievorderingen en beslagmaatregelen.',
      ],
    },
    items: {
      tr: [
        'İcra takipleri',
        'Alacak tahsili',
        'İtirazın iptali',
        'Nafaka alacaklarının icrası',
        'Haciz işlemleri',
      ],
      de: [
        'Zwangsvollstreckungsverfahren',
        'Forderungseinzug',
        'Klagen auf Aufhebung des Widerspruchs (itirazın iptali)',
        'Vollstreckung von Unterhaltsforderungen',
        'Pfändungsmaßnahmen',
      ],
      en: [
        'Enforcement proceedings',
        'Debt recovery',
        'Actions to set aside an objection (itirazın iptali)',
        'Enforcement of maintenance claims',
        'Attachment measures',
      ],
      nl: [
        'Executieprocedures',
        'Incasso van vorderingen',
        'Vorderingen tot opheffing van verzet (itirazın iptali)',
        'Tenuitvoerlegging van alimentatievorderingen',
        'Beslagmaatregelen',
      ],
    },
  },
  {
    key: 'damages',
    slug: { tr: 'tazminat-hukuku', de: 'schadensersatzrecht', en: 'compensation-law', nl: 'schadevergoedingsrecht' },
    title: { tr: 'Tazminat Hukuku', de: 'Schadensersatzrecht', en: 'Compensation Law', nl: 'Schadevergoedingsrecht' },
    summary: {
      tr: 'Maddi ve manevi tazminat, haksız fiil ve sözleşmeye aykırılık.',
      de: 'Materieller und immaterieller Schadensersatz nach türkischem Recht.',
      en: 'Compensation for pecuniary and non-pecuniary damage under Turkish law.',
      nl: 'Vergoeding van materiële en immateriële schade naar Turks recht.',
    },
    intro: {
      tr: [
        'Bir zarardan dolayı tazminat talep edilebilmesi; zararın varlığı, kusur ve illiyet bağı gibi unsurların somut olayda birlikte değerlendirilmesini gerektirir.',
        'Haksız fiil ve sözleşmeye aykırılıktan doğan maddi ve manevi tazminat taleplerinde dava ve danışmanlık hizmeti verilmektedir.',
      ],
      de: [
        'Ein Anspruch auf Schadensersatz setzt nach türkischem Recht voraus, dass Schaden, Verschulden und Kausalität im konkreten Fall gemeinsam geprüft werden.',
        'Beratung und Vertretung erfolgen bei Ansprüchen auf materiellen und immateriellen Schadensersatz aus unerlaubter Handlung und Vertragsverletzung.',
      ],
      en: [
        'Under Turkish law, a claim for compensation requires that damage, fault and causation are assessed together in the specific case.',
        'Advice and representation are provided for claims for pecuniary and non-pecuniary damages arising from tort and breach of contract.',
      ],
      nl: [
        'Een vordering tot schadevergoeding vereist naar Turks recht dat schade, schuld en causaal verband in het concrete geval gezamenlijk worden beoordeeld.',
        'Advies en vertegenwoordiging worden verleend bij vorderingen tot vergoeding van materiële en immateriële schade uit onrechtmatige daad en wanprestatie.',
      ],
    },
    items: {
      tr: [
        'Maddi tazminat',
        'Manevi tazminat',
        'Haksız fiil sorumluluğu',
        'Sözleşmeye aykırılıktan kaynaklanan zararlar',
      ],
      de: [
        'Ersatz materieller Schäden',
        'Immaterieller Schadensersatz (manevi tazminat)',
        'Haftung aus unerlaubter Handlung',
        'Schäden aus Vertragsverletzungen',
      ],
      en: [
        'Compensation for pecuniary damage',
        'Non-pecuniary damages (manevi tazminat)',
        'Liability in tort',
        'Damage arising from breach of contract',
      ],
      nl: [
        'Vergoeding van materiële schade',
        'Immateriële schadevergoeding (manevi tazminat)',
        'Aansprakelijkheid uit onrechtmatige daad',
        'Schade door wanprestatie',
      ],
    },
  },
  {
    key: 'contracts',
    slug: {
      tr: 'ticaret-ve-sozlesmeler-hukuku',
      de: 'handels-und-vertragsrecht',
      en: 'commercial-and-contract-law',
      nl: 'handels-en-contractenrecht',
    },
    title: {
      tr: 'Ticaret ve Sözleşmeler Hukuku',
      de: 'Handels- und Vertragsrecht',
      en: 'Commercial and Contract Law',
      nl: 'Handels- en contractenrecht',
    },
    summary: {
      tr: 'Sözleşme hazırlama ve inceleme, ticari uyuşmazlıklar.',
      de: 'Vertragsgestaltung, Vertragsprüfung und Handelsstreitigkeiten nach türkischem Recht.',
      en: 'Contract drafting, contract review and commercial disputes under Turkish law.',
      nl: 'Opstellen en toetsen van contracten en handelsgeschillen naar Turks recht.',
    },
    intro: {
      tr: [
        'Açık ve dengeli hazırlanmış bir sözleşme, ileride doğabilecek uyuşmazlıkların önemli bir kısmını önler. Sözleşmeler, tarafların ticari amacı ve risk dağılımı gözetilerek hazırlanır veya incelenir.',
        'Ticari ilişkilerden doğan uyuşmazlıklarda dava öncesi müzakere, arabuluculuk ve yargı süreçleri birlikte değerlendirilir.',
      ],
      de: [
        'Ein klarer und ausgewogener Vertrag beugt vielen späteren Streitigkeiten vor. Verträge nach türkischem Recht werden unter Berücksichtigung des wirtschaftlichen Ziels und der Risikoverteilung entworfen oder geprüft.',
        'Bei Streitigkeiten aus Handelsbeziehungen werden außergerichtliche Verhandlung, Mediation und gerichtliche Schritte gemeinsam betrachtet.',
      ],
      en: [
        'A clear and balanced contract prevents many later disputes. Contracts under Turkish law are drafted or reviewed with regard to the commercial objective and the allocation of risk.',
        'In disputes arising from commercial relationships, out-of-court negotiation, mediation and court action are considered together.',
      ],
      nl: [
        'Een duidelijk en evenwichtig contract voorkomt veel latere geschillen. Contracten naar Turks recht worden opgesteld of getoetst met inachtneming van het zakelijke doel en de risicoverdeling.',
        'Bij geschillen uit handelsrelaties worden buitengerechtelijke onderhandelingen, mediation en gerechtelijke stappen in samenhang bekeken.',
      ],
    },
    items: {
      tr: [
        'Ticari sözleşmeler',
        'Hizmet sözleşmeleri',
        'Sözleşme hazırlanması',
        'Sözleşmelerin hukuki incelenmesi',
        'Ticari uyuşmazlıklar',
      ],
      de: [
        'Handelsverträge',
        'Dienstleistungsverträge',
        'Vertragsgestaltung',
        'Rechtliche Prüfung von Verträgen',
        'Handelsrechtliche Streitigkeiten',
      ],
      en: [
        'Commercial contracts',
        'Service contracts',
        'Contract drafting',
        'Legal review of contracts',
        'Commercial disputes',
      ],
      nl: [
        'Handelsovereenkomsten',
        'Dienstverleningsovereenkomsten',
        'Opstellen van contracten',
        'Juridische toetsing van contracten',
        'Handelsgeschillen',
      ],
    },
  },
  {
    key: 'consumer',
    slug: { tr: 'tuketici-hukuku', de: 'verbraucherrecht', en: 'consumer-law', nl: 'consumentenrecht' },
    title: { tr: 'Tüketici Hukuku', de: 'Verbraucherrecht', en: 'Consumer Law', nl: 'Consumentenrecht' },
    summary: {
      tr: 'Ayıplı mal ve hizmet, tüketici sözleşmeleri ve hakem heyeti başvuruları.',
      de: 'Mängel, Verbraucherverträge und Verbraucherschiedsstellen in der Türkei.',
      en: 'Defects, consumer contracts and consumer arbitration committees in Türkiye.',
      nl: 'Gebreken, consumentenovereenkomsten en consumentengeschillencommissies in Turkije.',
    },
    intro: {
      tr: [
        'Tüketici işlemlerinden doğan uyuşmazlıklarda, uyuşmazlığın değerine göre tüketici hakem heyetine başvuru veya tüketici mahkemesinde dava yolu izlenir.',
        'Ayıplı mal ve hizmet, abonelik ve diğer tüketici sözleşmelerinden doğan taleplerde hukuki değerlendirme ve başvuru süreçleri yürütülür.',
      ],
      de: [
        'Bei Streitigkeiten aus Verbrauchergeschäften in der Türkei ist je nach Streitwert die Verbraucherschiedsstelle (tüketici hakem heyeti) oder das Verbrauchergericht zuständig.',
        'Beraten wird bei Ansprüchen wegen mangelhafter Waren und Dienstleistungen sowie aus sonstigen Verbraucherverträgen.',
      ],
      en: [
        'In disputes arising from consumer transactions in Türkiye, either the consumer arbitration committee (tüketici hakem heyeti) or the consumer court has jurisdiction, depending on the amount in dispute.',
        'Advice is provided on claims concerning defective goods and services and on claims arising from other consumer contracts.',
      ],
      nl: [
        'Bij geschillen uit consumententransacties in Turkije is, afhankelijk van het belang van de zaak, de consumentengeschillencommissie (tüketici hakem heyeti) of de consumentenrechter bevoegd.',
        'Advies wordt verleend bij vorderingen wegens gebrekkige goederen en diensten en uit andere consumentenovereenkomsten.',
      ],
    },
    items: {
      tr: [
        'Ayıplı mal ve hizmet',
        'Tüketici sözleşmeleri',
        'Tüketici hakem heyeti başvuruları',
        'Tüketici davaları',
      ],
      de: [
        'Mangelhafte Waren und Dienstleistungen',
        'Verbraucherverträge',
        'Anträge bei Verbraucherschiedsstellen',
        'Verbraucherklagen',
      ],
      en: [
        'Defective goods and services',
        'Consumer contracts',
        'Applications to consumer arbitration committees',
        'Consumer litigation',
      ],
      nl: [
        'Gebrekkige goederen en diensten',
        'Consumentenovereenkomsten',
        'Verzoeken aan consumentengeschillencommissies',
        'Consumentenzaken',
      ],
    },
  },
  {
    key: 'pil',
    slug: {
      tr: 'milletlerarasi-ozel-hukuk',
      de: 'internationales-privatrecht',
      en: 'private-international-law',
      nl: 'internationaal-privaatrecht',
    },
    title: {
      tr: 'Milletlerarası Özel Hukuk',
      de: 'Internationales Privatrecht',
      en: 'Private International Law',
      nl: 'Internationaal privaatrecht',
    },
    summary: {
      tr: 'Tanıma ve tenfiz, yabancılık unsuru taşıyan uyuşmazlıklar.',
      de: 'Anerkennung und Vollstreckbarerklärung, Fälle mit Bezug zur Türkei.',
      en: 'Recognition and enforcement, cases with a connection to Türkiye.',
      nl: 'Erkenning en tenuitvoerlegging, zaken met een band met Turkije.',
    },
    intro: {
      tr: [
        'Taraflardan birinin yabancı olduğu, yurt dışında yaşadığı veya uyuşmazlığın başka bir ülkeyle bağlantı taşıdığı durumlarda; yetkili mahkeme, uygulanacak hukuk ve yabancı kararların etkisi ayrıca belirlenir.',
        'Türkiye’de bu konular esas olarak 5718 sayılı Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanun (MÖHUK) ile düzenlenmiştir.',
      ],
      de: [
        'Ist eine Partei ausländisch, lebt sie im Ausland oder hat der Fall Bezüge zu einem anderen Staat, sind zuständiges Gericht, anwendbares Recht und die Wirkung ausländischer Entscheidungen gesondert zu klären.',
        'In der Türkei sind diese Fragen im Wesentlichen im Gesetz Nr. 5718 über das internationale Privat- und Zivilverfahrensrecht (MÖHUK) geregelt.',
      ],
      en: [
        'Where a party is a foreign national, lives abroad or the case has links to another state, the competent court, the applicable law and the effect of foreign decisions must be determined separately.',
        'In Türkiye, these questions are mainly governed by Act No. 5718 on Private International Law and International Civil Procedure (MÖHUK).',
      ],
      nl: [
        'Is een partij buitenlands, woont zij in het buitenland of heeft de zaak banden met een andere staat, dan moeten de bevoegde rechter, het toepasselijke recht en de werking van buitenlandse beslissingen afzonderlijk worden vastgesteld.',
        'In Turkije zijn deze vragen in hoofdzaak geregeld in de wet nr. 5718 inzake internationaal privaatrecht en internationaal procesrecht (MÖHUK).',
      ],
    },
    items: {
      tr: [
        'Tanıma ve tenfiz',
        'Yabancılık unsuru taşıyan hukuki uyuşmazlıklar',
        'Yabancı mahkeme kararlarının Türkiye’deki etkileri',
        'Türkiye bağlantılı uluslararası özel hukuk meseleleri',
      ],
      de: [
        'Anerkennung und Vollstreckbarerklärung in der Türkei',
        'Rechtsstreitigkeiten mit Auslandsbezug',
        'Wirkungen ausländischer Gerichtsentscheidungen in der Türkei',
        'Fragen des internationalen Privatrechts mit Bezug zur Türkei',
      ],
      en: [
        'Recognition and enforcement in Türkiye',
        'Legal disputes with a foreign element',
        'Effects of foreign court decisions in Türkiye',
        'Private international law issues connected with Türkiye',
      ],
      nl: [
        'Erkenning en tenuitvoerlegging in Turkije',
        'Rechtsgeschillen met een internationaal element',
        'Werking van buitenlandse rechterlijke beslissingen in Turkije',
        'Vraagstukken van internationaal privaatrecht met een band met Turkije',
      ],
    },
    crossBorder: {
      tr: 'Almanya’da verilen mahkeme kararlarının Türkiye’de hüküm doğurması için tanıma veya tenfiz kararı gerekir. Şartlar MÖHUK m. 50 ve devamında düzenlenmiştir.',
      de: 'Damit deutsche Gerichtsentscheidungen in der Türkei Wirkung entfalten, ist eine Anerkennungs- oder Vollstreckbarerklärung erforderlich. Die Voraussetzungen regeln Art. 50 ff. MÖHUK.',
      en: 'For German court decisions to take effect in Türkiye, a decision on recognition or enforcement is required. The requirements are set out in Art. 50 et seq. MÖHUK.',
      nl: 'Om Duitse rechterlijke beslissingen in Turkije rechtsgevolg te laten hebben, is een beslissing tot erkenning of tenuitvoerlegging vereist. De voorwaarden zijn geregeld in art. 50 e.v. MÖHUK.',
    },
  },
];

export const findArea = (lang, slug) => areas.find((a) => a.slug[lang] === slug);
