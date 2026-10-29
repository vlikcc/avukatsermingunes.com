# Av. Sermin Güneş Keçeci — web sitesi ve randevu sistemi

Türkçe (ana dil), Almanca, İngilizce ve Hollandaca (Felemenkçe) mesleki web sitesi; online randevu sistemi, iletişim formu, hukuki yayınlar ve yönetim paneli.

- Node.js 22.13 veya üzeri (yerleşik SQLite kullanılır, ayrı veritabanı kurulumu gerekmez)
- Harici takip, analiz, Google Fonts veya CDN yok; yazı tipleri sitenin kendi sunucusundan yüklenir (DSGVO).

## Çalıştırma

```bash
npm install
```

```bash
cp .env.example .env
```

`.env` içinde en az `ADMIN_PASSWORD` ve `SESSION_SECRET` değerlerini doldurun, ardından:

```bash
npm start
```

- Site: http://localhost:3000 — Almanca: /de/, İngilizce: /en/, Hollandaca: /nl/
- Yönetim paneli: http://localhost:3000/yonetim

## Klasör yapısı

| Yol | İçerik |
| --- | --- |
| `site.config.js` | Avukat, baro, iletişim, sigorta ve randevu ayarları — **tek yapılandırma dosyası** |
| `src/i18n.js` | Dil listesi, sayfa yolları ve arayüz metinleri (TR/DE/EN/NL) |
| `src/content/areas.js` | Çalışma alanları (TR/DE/EN/NL) |
| `src/content/crossborder.js` | Türkiye–Almanya başlıkları ve mesleki değerler |
| `src/pages.js` | Sayfa şablonları |
| `src/legal.js` | Impressum, gizlilik/KVKK ve çerez metinleri |
| `content/posts/{tr,de,en,nl}` | Veritabanına aktarılan yazılar (Markdown; yayın rutini buraya ekler) |
| `content/RUTIN.md`, `content/yayin-plani.md` | Yayın rutininin kuralları, mevzuat sırası ve kayıtları |
| `public/` | CSS, JavaScript, logo, yazı tipleri |
| `data/site.db` | Randevular, mesajlar, blog yazıları ve yönetim şifresi (yedekleyin; paylaşmayın) |

## Randevu sistemi

1. Ziyaretçi görüşme türünü (online, telefon, Düsseldorf’ta yüz yüze) ve konuyu seçer.
2. Takvimde boş günleri ve saatleri görür. Saatler Almanya saatiyle, yanında Türkiye saatiyle gösterilir.
3. Bilgilerini girip talep gönderir; talep “onay bekliyor” durumunda kaydedilir ve o saat başkasına kapanır.
4. Yönetim panelinden talep **onaylanır** veya **iptal edilir**; SMTP tanımlıysa müvekkile e-posta (onayda takvim dosyasıyla) gider.
5. Müvekkil, aldığı iptal bağlantısıyla randevuyu kendisi iptal edebilir.

Ayarlar `site.config.js` → `booking`: haftalık çalışma saatleri, görüşme süresi, en az kaç saat önceden randevu alınabileceği, kaç gün ileriye randevu verileceği, görüşme türleri. İzmir’de yüz yüze görüşme türü hazırdır; `enabled: true` yapılarak açılabilir.

Tatil, duruşma veya seyahat günleri yönetim panelindeki **Kapalı günler** sayfasından kapatılır.

Randevu ve mesaj kayıtları, `privacy.retentionDays` (varsayılan 180 gün) sonunda otomatik silinir.

## E-posta bildirimleri

`.env` içinde `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` ve `NOTIFY_EMAIL` doldurulduğunda:
- müvekkile talep alındı / onaylandı / iptal edildi e-postaları,
- size yeni randevu ve yeni mesaj bildirimleri gönderilir.

SMTP tanımlı değilse sistem çalışmaya devam eder; talepler yalnızca yönetim panelinde görünür.

## Blog (Hukuki Yayınlar)

Yazılar yönetim panelindeki **Yazılar** sayfasından yazılır, düzenlenir ve silinir; veritabanında (`data/site.db`) saklanır.

- **Durum:** “Taslak” yazılar sitede görünmez, “Yayında” olanlar dilin yayınlar sayfasında listelenir. Taslaklar **Önizle** bağlantısıyla görülebilir.
- **Dil:** Her yazı tek bir dildedir (Türkçe, Almanca, İngilizce, Hollandaca).
- **Çevirisi olduğu yazı:** Aynı yazının başka dildeki hâli seçilirse sitedeki dil seçici bu yazıları birbirine bağlar.
- **Adres:** Boş bırakılırsa başlıktan üretilir. Yayındaki bir yazının adresini değiştirmek eski bağlantıları bozar.
- **Metin biçimi:** `##` ara başlık, `-` liste, `**kalın**`, `*italik*`, `[bağlantı](https://...)`. Editördeki “Biçimlendirme yardımı” bölümünde özet vardır.

- **Bölüm:** “Makale” yazıları `/yayinlar/makaleler`, “Mevzuat” yazıları (kanun maddesi açıklamaları) `/yayinlar/mevzuat` altında listelenir. `/yayinlar` sayfası iki bölümün son yazılarını alt alta gösterir.
- **Yazı bulucu:** `/yayinlar` sayfasındaki sohbet kutusuna ziyaretçi sorununu yazar; sitedeki makale ve mevzuat yazılarından uygun olanlar, ilgili çalışma alanı ve randevu bağlantısı önerilir. Arama sitenin kendi sunucusunda yapılır (harici yapay zekâ hizmeti yok), yazılanlar kaydedilmez. Eş anlamlı kelimeler (ör. miras, veraset, tereke; Erbe, Nachlass) `src/finder.js` içindeki `GROUPS` listesindedir; yeni konularda yazı yayımlandıkça bu liste genişletilebilir.
- **Yayın saati (Türkiye saati):** Doluysa yazı “Yayında” olsa bile o tarih ve saatten önce sitede görünmez.
- **Tüm dilleriyle yayınla:** Taslak listesindeki bu düğme, yazıyı ve bağlı çevirilerini birlikte yayına alır.

`content/posts/{tr,de,en,nl}/` klasörüne eklenen her yeni Markdown dosyası, sunucu açılırken bir kez veritabanına aktarılır (panelden silinen yazı geri gelmez). Aktarılan yeni yazılar `NOTIFY_EMAIL` adresine bildirilir.

### Yayın rutini

Her gün Türkiye saatiyle 18:00’de (ve eksikleri tamamlamak için 20:00’de) bulutta bir Claude rutini çalışır, ertesi gün için dört dilde (TR/DE/EN/NL) her gün beş mevzuat yazısı (sırayla MÖHUK, TMK, TCK), iki günde bir makale ve uygun bir Google Trends konusu varsa gündem makalesi hazırlar ve bunları `content/posts/` altına **taslak** olarak, 08:00 yayın saatiyle ekleyip `master` dalına gönderir. Site yeniden kurulur, taslaklar panele düşer ve e-posta gelir. Yazıları okuyup doğruladıktan sonra “Tüm dilleriyle yayınla” ile onaylayın; ertesi sabah 08:00’de görünürler.

- Kurallar (konu seçimi, doğruluk, reklam yasağı, SEO, kapanış bölümü, dosya biçimi): `content/RUTIN.md`
- Üslup: `.claude/skills/humanizer/SKILL.md` (yapay zekâ izlenimi veren kalıpları ayıklayan yazım becerisi)
- Onay bekleyen bir taslağın dosyası değişirse (ör. rutin ya da depo üzerinden düzeltme), site yeniden kurulduğunda paneldeki taslak da güncellenir. Panelden düzenlenmiş ya da yayımlanmış yazılara dokunulmaz.
- Mevzuat sırası ve yayın kayıtları: `content/yayin-plani.md`
- Rutinin kendisi: https://claude.ai/code/routines

## Yönetim şifresi

İlk giriş `.env` içindeki `ADMIN_PASSWORD` ile yapılır. Şifre panelin **Şifre** sayfasından değiştirilebilir; yeni şifre veritabanında özetlenmiş (scrypt) olarak saklanır ve diğer cihazlardaki oturumlar kapanır.

Şifre unutulursa sunucuda uygulama klasöründe şu komut çalıştırılır; giriş yeniden `ADMIN_PASSWORD` ile yapılır:

```bash
node scripts/sifre-sifirla.js
```

## Yayına almadan önce yapılacaklar

### 1. Eksik bilgiler (`site.config.js`)
Aşağıdaki bilgiler bende yoktu; uydurulmadı. Sitede sarı **[eklenecek]** işaretiyle görünürler:

- [ ] `siteUrl` — alan adı (canonical, hreflang, sitemap ve e-posta bağlantıları için)
- [ ] `contact.email` ve `contact.phoneDe` — Impressum için zorunlu
- [ ] `contact.phoneTr`, `contact.addressTr` — İzmir büro adresi ve telefonu (varsa)
- [ ] `lawyer.barTr.registryNo` — İzmir Barosu sicil numarası
- [ ] `insurance` — mesleki sorumluluk sigortası: şirket, adres, coğrafi kapsam (§ 2 DL-InfoV)
- [ ] `vatId` — USt-IdNr. (varsa)
- [ ] `privacy.hostingProvider`, `privacy.hostingLocation`, `privacy.mailProvider`
- [ ] `lawyer.barDe.address` — Rechtsanwaltskammer Düsseldorf adresi (girildi, lütfen doğrulayın)

### 2. Hukuki inceleme
Tüm metinler taslaktır ve **yayından önce hukuki incelemeden geçmelidir**. Özellikle:

- [ ] § 206 BRAO kapsam açıklaması ve “Avukat (Türkei)” unvan kullanımı (`src/i18n.js` → `scopeNotice`, Impressum)
- [ ] Impressum (§ 5 DDG), Schlichtungsstelle der Rechtsanwaltschaft ifadesi
- [ ] Datenschutzerklärung ve KVKK aydınlatma metni; Türkiye dışında barındırma hâlinde KVKK m. 9 yurt dışı aktarım değerlendirmesi
- [ ] TBB Reklam Yasağı Yönetmeliği’ne uygunluk (tüm sayfa metinleri)
- [ ] Örnek yayınlar (`content/posts/`): tanıma–tenfiz ve vekâletname yazılarındaki madde atıfları ve uygulama bilgileri
- [ ] İngilizce ve Hollandaca çeviriler (`src/i18n.js`, `src/pages.js`, `src/legal.js`, `src/content/`, `src/mail.js`): özellikle Hollandaca metinlerde unvan kullanımı (Hollanda’da “advocaat” korumalı unvandır; metinlerde “Avukat (Türkei)” ve “in Turkije toegelaten advocaat” ifadeleri kullanıldı)
- [ ] İngilizce ve Hollandaca yasal metinlerde “bağlayıcı olan Almanca metindir” notu bulunur; bu yaklaşımın uygunluğu
- [ ] Randevu sayfasındaki “görüşmenin kapsamı ve ücretine ilişkin bilgi onayla birlikte iletilir” ifadesi — uygulamanızla örtüşmüyorsa değiştirin (`src/pages.js`)

### 3. Diğer
- [ ] Haftalık çalışma saatlerini (`booking.weekly`) kendi takviminize göre ayarlayın
- [ ] Profesyonel portre fotoğrafı eklenecekse `public/img/` içine koyun; şu an logodaki illüstrasyon kullanılıyor

## SEO notları

- `www.` adresine gelen istekler `PUBLIC_URL` adresine 301 ile yönlendirilir.
- Sitemap’teki sabit sayfa tarihleri `src/lastmod.json` dosyasından gelir. Sayfa metinlerini değiştirdiğinizde commit’ten önce `npm run lastmod` çalıştırın. Yazıların tarihleri veritabanından gelir.
- `/llms.txt` yapay zekâ araçları için kısa bir site özeti sunar; `site.config.js` ve çalışma alanlarından üretilir.
- Site çerez ve analiz kullanmaz. Cloudflare panelindeki **Web Analytics** kapalı tutulmalıdır; açık olursa Cloudflare sayfalara betik ekler, güvenlik politikası (CSP) bunu engeller ve gizlilik metinleriyle çelişir.

## Sunucuya kurulum

Site, Node.js çalıştırabilen her sunucuda (ör. Almanya’da bir VPS) çalışır:

1. Dosyaları sunucuya kopyalayın (`node_modules`, `data`, `.env` hariç), `npm install --omit=dev` çalıştırın.
2. `.env` dosyasında `NODE_ENV=production`, `PUBLIC_URL`, `TRUST_PROXY=true` ve SMTP bilgilerini ayarlayın.
3. Uygulamayı bir süreç yöneticisiyle (systemd, pm2) başlatın: `node server.js`
4. Önüne HTTPS sertifikalı bir ters vekil sunucu (nginx, Caddy) koyun. Canlıda HTTPS zorunludur; yönetim çerezi yalnızca HTTPS üzerinden gönderilir.
5. `data/site.db` dosyasını düzenli olarak yedekleyin.
