// Unutulan yönetim şifresini sıfırlar: panelden belirlenen şifre silinir ve
// giriş yeniden ADMIN_PASSWORD ortam değişkenindeki şifreyle yapılır.
//
// Kullanım (sunucuda, uygulama klasöründe):  node scripts/sifre-sifirla.js

import { db } from '../src/db.js';

const r = db.prepare("DELETE FROM settings WHERE key = 'admin_password'").run();
console.log(
  r.changes
    ? 'Panelden belirlenen şifre silindi. Giriş artık ADMIN_PASSWORD ile yapılır.'
    : 'Panelden belirlenmiş bir şifre yok; giriş zaten ADMIN_PASSWORD ile yapılıyor.',
);
