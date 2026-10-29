---
name: humanizer
description: Yapay zekâ ile yazılmış izlenimi veren kalıpları bulup metni bir insanın, burada bir avukatın yazdığı gibi doğal hâle getirir. Türkçe, Almanca, İngilizce ve Hollandaca blog ve mevzuat yazılarını yazarken ve yayından önce son okumada kullan.
---

# Humanizer: metni doğal hâle getirme

Amaç, yazının şablondan çıkmış gibi değil, konuyu bilen bir avukatın okuruna anlattığı gibi okunmasıdır. Bu beceri yalnızca **üslubu** değiştirir. Hukuki içerik, madde numaraları, süreler, kaynaklar ve uyarılar aynen kalır.

## Değiştirilmeyecekler

- Kanun metni alıntıları (`>` ile verilen madde metni) kelimesi kelimesine kalır; bunlara hiç dokunma.
- Madde numaraları, tarihler, süreler, karar künyeleri ve bağlantılar.
- Tartışmalı konu uyarısı ile yazarın görüşü olduğunu belirten ifadeler. Cümleyi daha doğal kurabilirsin ama anlamı (kanunda açık hüküm ve bağlayıcı karar olmadığı, bunun bir görüş olduğu) eksiksiz kalmalı.
- Terim tutarlılığı. Hukuk metninde aynı kavram için hep aynı terimi kullan (“tenfiz” bir yerde “tanıma” olmaz). Çeşitlilik için eş anlamlı kelimeye geçmek burada hatadır.
- Mesleki kurallar: uydurma deneyim, müvekkil hikâyesi, “bir müvekkilim…” gibi anekdotlar ekleme. Doğallık, uydurma ayrıntıyla değil açık ve somut anlatımla sağlanır.

## Aranacak kalıplar

### 1. Önem şişirme ve süslü dil

Bir şeyin önemini söylemek yerine ne olduğunu söyle.

- TR: “büyük önem taşımaktadır”, “kritik bir rol oynar”, “hayati öneme sahiptir”, “göz ardı edilmemelidir”, “altın değerinde”, “kapsamlı bir rehber”
- DE: „spielt eine entscheidende Rolle“, „von zentraler Bedeutung“, „es ist unerlässlich“, „umfassender Leitfaden“
- EN: “plays a crucial role”, “pivotal”, “vital”, “key”, “comprehensive guide”, “navigate the complexities”, “landscape”, “delve into”, “robust”, “seamless”
- NL: „speelt een cruciale rol“, „van essentieel belang“, „uitgebreide gids“

Önce: “Kesinleşme şerhi, tenfiz sürecinde kritik bir rol oynar.”
Sonra: “Mahkeme önce kararın kesinleştiğini gösteren şerhe bakar; şerh yoksa dava ilerlemez.”

### 2. Kalıp giriş ve kapanışlar

- “Günümüzde…”, “Bu yazımızda … ele alacağız”, “Sonuç olarak”, “Özetle”, “Unutulmamalıdır ki”, “Bu bağlamda”
- „Zusammenfassend lässt sich sagen“, „Es ist wichtig zu beachten, dass“, „In diesem Zusammenhang“
- “In conclusion”, “It is important to note that”, “It's worth noting”, “In today's world”
- „Kortom“, „Het is belangrijk om te weten dat“, „In dit artikel bespreken we“

Giriş doğrudan cevapla başlar. Kapanışta yazının özetini tekrar etme.

### 3. Belirsiz kaynak gösterme

“Uzmanlar belirtiyor”, “genel kabul görmektedir”, “sıkça karşılaşılmaktadır”, „Experten zufolge“, “many believe”. Kim söylüyor? Kanun mu, Yargıtay mı, doktrin mi? Kaynağı söyle ya da cümleyi çıkar.

### 4. Üçlemeler ve yapay paralellik

Her şeyi üç sıfat ya da üç madde hâlinde sıralamak (“hızlı, güvenli ve etkili”), “yalnızca … değil, aynı zamanda …”, „nicht nur …, sondern auch …“, “not just X, but Y”, “It's not about X, it's about Y”. Gerçekte kaç unsur varsa o kadarını yaz.

### 5. “-arak / -ing” ile eklenen yüzeysel yorum

Cümlenin sonuna eklenen değerlendirme kuyrukları: “…, bu da sürecin önemini vurgulamaktadır”, “…, highlighting the importance of…”, „…, was die Bedeutung unterstreicht“. Ya somut bir bilgi ver ya kuyruğu sil.

### 6. Dolambaçlı yüklem

- TR: “teşkil etmektedir”, “söz konusu olmaktadır”, “mevcut bulunmaktadır”, “gerçekleştirilmektedir” yerine çoğu zaman “-dır”, “vardır”, “yapılır” yeter. Art arda “-mektedir/-maktadır” zincirini kır; geniş zaman ve “-dır” Türkçe hukuk yazısında doğaldır.
- DE: Nominalstil („die Durchführung der Antragstellung erfolgt“ → „den Antrag stellen Sie …“).
- EN: “serves as”, “stands as”, “boasts” → “is”, “has”.
- NL: „er is sprake van“, „het betreft hier“ gereksizse çıkar.

### 7. Bağlaç ve geçiş zinciri

Her paragrafın “Ayrıca”, “Bunun yanı sıra”, “Öte yandan”, “Nitekim”, “Darüber hinaus”, “Additionally”, “Furthermore”, „Daarnaast“, „Bovendien“ ile başlaması. Cümleler mantıkla bağlanıyorsa geçiş kelimesine gerek yok.

### 8. Biçim aşırılıkları

- Kalın yazıyı her paragrafta kullanma; yalnızca okurun kaçırmaması gereken bir süre ya da şart için.
- “**Başlık:** açıklama” biçimindeki listeleri her bölümde tekrarlama. Bir kısmını düz paragrafa çevir.
- Uzun çizgiyi (—) bağlaç yerine sık kullanma; virgül, noktalı virgül ya da yeni cümle tercih et.
- İngilizce ara başlıklarda her kelimeyi büyük harfle yazma (sentence case).
- Emoji, ünlem, “✓” gibi işaretler kullanma.

### 9. Sohbet robotu kalıntıları

“Umarım bu yazı yardımcı olmuştur”, “Elbette!”, “Harika bir soru”, “Size yardımcı olmaktan memnuniyet duyarız”, “I hope this helps”, “Let's dive in”, bilgi kesme tarihi uyarıları. Hepsi silinir.

### 10. Aşırı temkin ve dolgu

Bir cümlede üst üste “genellikle”, “çoğu zaman”, “belirli durumlarda”, “-ebilir” yığılması. Hukuken belirsiz olan bir şeyi belirsiz yaz, ama bunu bir kez ve gerekçesiyle söyle. Kesin olan şeyi (kanun hükmü) kesin yaz.

Önce: “Bu süre bazı durumlarda genellikle üç ay olarak uygulanabilmektedir.”
Sonra: “Ret süresi üç aydır (TMK m. 606).”

### 11. Tekdüze ritim

Bütün cümleler aynı uzunlukta ve aynı yapıdaysa metin makine gibi okunur. Kısa bir cümleyle bir şartı vurgula, ardından uzun bir cümleyle istisnayı açıkla. Paragraf uzunlukları da birbirinin kopyası olmasın.

### 12. Okura hitap

Okura doğrudan ve saygılı hitap et (TR “siz”, DE „Sie“, NL „u“, EN “you”). Soyut “kişi”, „man“, “one” yerine okurun durumunu anlat: “Almanya’da yaşıyorsanız vekâletnameyi konsoloslukta verebilirsiniz.”

## Diller için notlar

- **Türkçe:** Gereksiz “söz konusu”, “ilgili”, “mevcut” tekrarlarını azalt. Uzun isim tamlaması zincirlerini fiil cümlesine çevir. Edilgen yapı hukukta doğaldır ama her cümle edilgen olmasın.
- **Almanca:** Kısa ana cümleler, gereksiz „bzw.“ ve „sowie“ zincirlerinden kaçın. „Sie“ hitabı. Türkçe terim parantez içinde ilk geçtiği yerde.
- **İngilizce:** Sade, düz İngilizce. Yukarıdaki “AI kelimeleri” (delve, tapestry, landscape, navigate, crucial, pivotal, robust, seamless, foster, underscore, testament) kullanılmaz.
- **Hollandaca:** Ambtelijk taal yerine helder Nederlands; „u“ hitabı; İngilizce kelime karışımı yok.
- Çeviri metni Türkçe metnin cümle yapısını kopyalamasın; her dil kendi doğal sırasıyla kurulsun. İçerik dört dilde aynıdır, cümleler aynı değildir.

## Uygulama adımları

1. Taslağı yaz.
2. Yukarıdaki 12 kalıp için metni tara ve bulduklarını düzelt.
3. Kendine sor: “Bu metnin yapay zekâyla yazıldığını hangi cümle belli ediyor?” Kalan kalıpları kısaca listele.
4. O cümleleri yeniden yaz. Hukuki içeriğin değişmediğini, alıntıların aynı kaldığını kontrol et.
5. Metni sesli okur gibi bir kez daha oku: Bir avukat bunu okuruna böyle anlatır mıydı?
