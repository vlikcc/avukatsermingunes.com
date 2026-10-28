// Hukuki çalışma alanları. Her alan için Türkçe ve Almanca içerik.
// Almanca metinler, § 206 BRAO gereği Türk hukuku çerçevesinde yazılmıştır.

export const areas = [
  {
    key: 'family',
    slug: { tr: 'aile-hukuku', de: 'familienrecht' },
    title: { tr: 'Aile Hukuku', de: 'Familienrecht' },
    summary: {
      tr: 'Boşanma, velayet, nafaka ve mal rejimi uyuşmazlıkları.',
      de: 'Scheidung, Sorgerecht, Unterhalt und Güterrecht nach türkischem Recht.',
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
    },
    crossBorder: {
      tr: 'Eşlerden birinin veya her ikisinin Almanya’da yaşadığı durumlarda, Türk mahkemelerinin yetkisi ve uygulanacak hukuk ayrıca incelenir. Almanya’da verilmiş boşanma kararlarının Türkiye’de tanınması da bu kapsamdadır.',
      de: 'Leben ein oder beide Ehegatten in Deutschland, sind die Zuständigkeit der türkischen Gerichte und das anwendbare Recht gesondert zu prüfen. Dazu gehört auch die Anerkennung deutscher Scheidungsurteile in der Türkei.',
    },
  },
  {
    key: 'inheritance',
    slug: { tr: 'miras-hukuku', de: 'erbrecht' },
    title: { tr: 'Miras Hukuku', de: 'Erbrecht' },
    summary: {
      tr: 'Mirasçılık belgesi, mirasın reddi, paylaşım ve vasiyetname uyuşmazlıkları.',
      de: 'Erbschein, Ausschlagung, Erbauseinandersetzung und Testamente nach türkischem Recht.',
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
    },
    crossBorder: {
      tr: 'Türkiye’de bulunan taşınmazlar bakımından miras hukukuna Türk hukuku uygulanır (5718 sayılı MÖHUK m. 20). Almanya’da yaşayan mirasçılar, vekâletname ile Türkiye’deki işlemlerini vekil aracılığıyla yürütebilir.',
      de: 'Für in der Türkei belegene Grundstücke gilt im Erbrecht türkisches Recht (Art. 20 des türkischen IPR-Gesetzes Nr. 5718). In Deutschland lebende Erben können ihre Angelegenheiten in der Türkei mit einer Vollmacht durch eine Bevollmächtigte erledigen lassen.',
    },
  },
  {
    key: 'realestate',
    slug: { tr: 'gayrimenkul-hukuku', de: 'immobilienrecht' },
    title: { tr: 'Gayrimenkul Hukuku', de: 'Immobilienrecht' },
    summary: {
      tr: 'Tapu, ortaklığın giderilmesi, kira ve taşınmaz mülkiyeti uyuşmazlıkları.',
      de: 'Grundbuch, Aufhebung von Miteigentum, Miete und Eigentum an Immobilien in der Türkei.',
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
    },
    crossBorder: {
      tr: 'Almanya’da yaşayan malikler ve mirasçılar için Türkiye’deki taşınmazlara ilişkin işlemler, vekâletname ile vekil aracılığıyla takip edilebilir.',
      de: 'Für Eigentümer und Erben mit Wohnsitz in Deutschland können Angelegenheiten zu Immobilien in der Türkei mit einer Vollmacht durch eine Bevollmächtigte betreut werden.',
    },
  },
  {
    key: 'criminal',
    slug: { tr: 'ceza-hukuku', de: 'strafrecht' },
    title: { tr: 'Ceza Hukuku', de: 'Strafrecht' },
    summary: {
      tr: 'Soruşturma ve kovuşturma aşamalarında müdafilik ve vekillik.',
      de: 'Verteidigung und Vertretung in türkischen Ermittlungs- und Strafverfahren.',
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
    },
  },
  {
    key: 'labour',
    slug: { tr: 'is-hukuku', de: 'arbeitsrecht' },
    title: { tr: 'İş Hukuku', de: 'Arbeitsrecht' },
    summary: {
      tr: 'İşçilik alacakları, kıdem ve ihbar tazminatı, işe iade ve iş kazaları.',
      de: 'Vergütungsansprüche, Abfindung, Kündigungsschutz und Arbeitsunfälle nach türkischem Recht.',
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
    },
  },
  {
    key: 'enforcement',
    slug: { tr: 'icra-ve-iflas-hukuku', de: 'zwangsvollstreckung-insolvenz' },
    title: { tr: 'İcra ve İflas Hukuku', de: 'Zwangsvollstreckungs- und Insolvenzrecht' },
    summary: {
      tr: 'İcra takipleri, alacak tahsili, itirazın iptali ve haciz işlemleri.',
      de: 'Vollstreckungsverfahren und Forderungseinzug in der Türkei.',
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
    },
  },
  {
    key: 'damages',
    slug: { tr: 'tazminat-hukuku', de: 'schadensersatzrecht' },
    title: { tr: 'Tazminat Hukuku', de: 'Schadensersatzrecht' },
    summary: {
      tr: 'Maddi ve manevi tazminat, haksız fiil ve sözleşmeye aykırılık.',
      de: 'Materieller und immaterieller Schadensersatz nach türkischem Recht.',
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
    },
  },
  {
    key: 'contracts',
    slug: { tr: 'ticaret-ve-sozlesmeler-hukuku', de: 'handels-und-vertragsrecht' },
    title: { tr: 'Ticaret ve Sözleşmeler Hukuku', de: 'Handels- und Vertragsrecht' },
    summary: {
      tr: 'Sözleşme hazırlama ve inceleme, ticari uyuşmazlıklar.',
      de: 'Vertragsgestaltung, Vertragsprüfung und Handelsstreitigkeiten nach türkischem Recht.',
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
    },
  },
  {
    key: 'consumer',
    slug: { tr: 'tuketici-hukuku', de: 'verbraucherrecht' },
    title: { tr: 'Tüketici Hukuku', de: 'Verbraucherrecht' },
    summary: {
      tr: 'Ayıplı mal ve hizmet, tüketici sözleşmeleri ve hakem heyeti başvuruları.',
      de: 'Mängel, Verbraucherverträge und Verbraucherschiedsstellen in der Türkei.',
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
    },
  },
  {
    key: 'pil',
    slug: { tr: 'milletlerarasi-ozel-hukuk', de: 'internationales-privatrecht' },
    title: { tr: 'Milletlerarası Özel Hukuk', de: 'Internationales Privatrecht' },
    summary: {
      tr: 'Tanıma ve tenfiz, yabancılık unsuru taşıyan uyuşmazlıklar.',
      de: 'Anerkennung und Vollstreckbarerklärung, Fälle mit Bezug zur Türkei.',
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
    },
    crossBorder: {
      tr: 'Almanya’da verilen mahkeme kararlarının Türkiye’de hüküm doğurması için tanıma veya tenfiz kararı gerekir. Şartlar MÖHUK m. 50 ve devamında düzenlenmiştir.',
      de: 'Damit deutsche Gerichtsentscheidungen in der Türkei Wirkung entfalten, ist eine Anerkennungs- oder Vollstreckbarerklärung erforderlich. Die Voraussetzungen regeln Art. 50 ff. MÖHUK.',
    },
  },
];

export const findArea = (lang, slug) => areas.find((a) => a.slug[lang] === slug);
