# Av. Sermin Güneş Keçeci — web sitesi ve randevu sistemi

Türkçe (ana dil) ve Almanca mesleki web sitesi; online randevu sistemi, iletişim formu, hukuki yayınlar ve yönetim paneli.

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

- Site: http://localhost:3000 — Almanca: http://localhost:3000/de/
- Yönetim paneli: http://localhost:3000/yonetim

## Klasör yapısı

| Yol | İçerik |
| --- | --- |
| `site.config.js` | Avukat, baro, iletişim, sigorta ve randevu ayarları — **tek yapılandırma dosyası** |
| `src/content/areas.js` | Çalışma alanları (TR/DE) |
| `src/content/crossborder.js` | Türkiye–Almanya başlıkları ve mesleki değerler |
| `src/pages.js` | Sayfa şablonları |
| `src/legal.js` | Impressum, gizlilik/KVKK ve çerez metinleri |
| `content/posts/tr`, `content/posts/de` | Hukuki yayınlar (Markdown) |
| `public/` | CSS, JavaScript, logo, yazı tipleri |
| `data/site.db` | Randevular ve mesajlar (yedekleyin; paylaşmayın) |

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

## Yeni hukuki yayın eklemek

`content/posts/tr/` (veya `de/`) içine yeni bir `.md` dosyası ekleyin:

```
---
title: Yazının başlığı
description: Arama sonuçlarında görünecek kısa açıklama
date: 2026-11-15
slug: yazinin-adresi
pair: ortak-anahtar
---

Metin… ## ile ara başlık, - ile liste, **kalın**, [bağlantı](https://...)
```

`pair` değeri Türkçe ve Almanca yazıda aynı olursa dil değiştirici iki yazıyı birbirine bağlar. `draft: true` eklenen yazı yayımlanmaz. Yeni yazılar 30 saniye içinde sitede görünür.

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
- [ ] Randevu sayfasındaki “görüşmenin kapsamı ve ücretine ilişkin bilgi onayla birlikte iletilir” ifadesi — uygulamanızla örtüşmüyorsa değiştirin (`src/pages.js`)

### 3. Diğer
- [ ] Haftalık çalışma saatlerini (`booking.weekly`) kendi takviminize göre ayarlayın
- [ ] Profesyonel portre fotoğrafı eklenecekse `public/img/` içine koyun; şu an logodaki illüstrasyon kullanılıyor

## Sunucuya kurulum

Site, Node.js çalıştırabilen her sunucuda (ör. Almanya’da bir VPS) çalışır:

1. Dosyaları sunucuya kopyalayın (`node_modules`, `data`, `.env` hariç), `npm install --omit=dev` çalıştırın.
2. `.env` dosyasında `NODE_ENV=production`, `PUBLIC_URL`, `TRUST_PROXY=true` ve SMTP bilgilerini ayarlayın.
3. Uygulamayı bir süreç yöneticisiyle (systemd, pm2) başlatın: `node server.js`
4. Önüne HTTPS sertifikalı bir ters vekil sunucu (nginx, Caddy) koyun. Canlıda HTTPS zorunludur; yönetim çerezi yalnızca HTTPS üzerinden gönderilir.
5. `data/site.db` dosyasını düzenli olarak yedekleyin.
