BosShelf

# BOS Shelf — Resepsiyon Sistemi
QR kod vasitəsilə açılan, əməkdaş və Meeting Room axtarışı edən resepsiyon sistemi.
## Texnologiyalar
- **Backend:** Node.js + Express
- **Verilənlər bazası:** SQLite (`better-sqlite3`) — quraşdırma tələb etmir, fayl əsaslıdır
- **Frontend:** Vanilla HTML/CSS/JavaScript (heç bir build addımı tələb olunmur)
- **Autentifikasiya:** JWT (JSON Web Token) + bcrypt ilə şifrələnmiş şifrələr
- **QR kod:** Server tərəfində avtomatik yaradılır (`qrcode` paketi)
## Qovluq strukturu
```
bos-shelf-reception/
├── backend/
│   ├── server.js          # Əsas server
│   ├── db.js               # SQLite bağlantısı və sxem
│   ├── seed.js              # İlkin admin + nümunə data yaradır
│   ├── routes/
│   │   ├── search.js       # Qonaq axtarış API-si (public)
│   │   ├── admin.js        # Admin CRUD API-si (qorunur)
│   │   ├── auth.js         # Giriş / şifrə dəyişmə
│   │   └── qr.js           # QR kod şəkli yaradır
│   ├── middleware/auth.js  # JWT yoxlaması
│   ├── package.json
│   └── .env.example
├── public/
│   ├── index.html          # Qonaq üçün axtarış səhifəsi (QR bura açılır)
│   ├── admin.html          # Admin panel
│   ├── css/style.css
│   └── js/
│       ├── app.js          # Qonaq səhifəsinin məntiqi
│       └── admin.js        # Admin panelin məntiqi
└── README.md
```
## Quraşdırma
### 1. Tələblər
- Node.js 18 və ya daha yeni versiya ([nodejs.org](https://nodejs.org))
### 2. Asılılıqları quraşdırın
```bash
cd backend
npm install
```
### 3. `.env` faylını yaradın
```bash
cp .env.example .env
```
Sonra `.env` faylını açıb aşağıdakıları öz mühitinizə uyğun dəyişin:
```env
PORT=3000
SITE_URL=http://localhost:3000        # Production-da real domenlə əvəz edin, məs: https://reception.bosshelf.com
JWT_SECRET=çox-uzun-təsadüfi-mətn-buraya-yazın
ADMIN_USERNAME=admin
ADMIN_PASSWORD=güclü-bir-şifrə-seçin
JWT_EXPIRES_IN=12h
```
> ⚠️ **Vacib:** `JWT_SECRET` və `ADMIN_PASSWORD` sahələrini mütləq dəyişin. Təsadüfi açar yaratmaq üçün:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```
### 4. Verilənlər bazasını hazırlayın (admin + nümunə data)
```bash
npm run seed
```
Bu əmr:
- `.env`-də göstərilən istifadəçi adı/şifrə ilə ilk admin hesabını yaradır,
- Test üçün 3 nümunə əməkdaş və 3 nümunə Meeting Room əlavə edir (istəsəniz admin paneldən silə bilərsiniz).
### 5. Serveri işə salın
```bash
npm start
```
Server https://localhost:3000 ünvanında işə düşəcək:
- **Qonaq səhifəsi (QR açılır):** `http://localhost:3000/`
- **Admin panel:** `http://localhost:3000/admin.html`
- **QR kod şəkli:** `http://localhost:3000/api/qr.png`
## QR kodun hazırlanması
QR kod avtomatik yaradılır və birbaşa `SITE_URL` ünvanına yönləndirir:
1. Admin panelə daxil olun → **QR kod** bölməsi.
2. Şəkli yükləyin (`bos-shelf-qr.png`) və çap edin.
3. Resepsiyon masasında görünən yerə qoyun.
QR kod dəyişmir — yalnız verilənlər bazasındakı əməkdaş/otaq siyahısı yenilənir, ona görə bir dəfə çap etdikdən sonra yenidən yaratmağa ehtiyac yoxdur (əgər domen ünvanını dəyişməsəniz).
## Production-a köçürmə (canlıya çıxarma)
1. Serveri istənilən Node.js dəstəkləyən hostinqə yerləşdirin (VPS, Render, Railway, DigitalOcean və s.).
2. `.env` faylında `SITE_URL`-i real domeninizlə əvəz edin (məs: `https://reception.bosshelf.com`), sonra yeni QR kod yükləyin.
3. Prosesi daim aktiv saxlamaq üçün `pm2` kimi bir process manager istifadə edin:
   ```bash
   npm install -g pm2
   pm2 start server.js --name bos-shelf-reception
   pm2 save
   ```
4. HTTPS üçün Nginx/Caddy ilə reverse proxy qurun (Let's Encrypt sertifikatı ilə).
5. `backend/data/reception.db` faylının müntəzəm ehtiyat nüsxəsini (backup) götürün.
## Admin panel imkanları
- Təhlükəsiz giriş (JWT, bcrypt ilə şifrələnmiş parol, brute-force qorunması)
- Əməkdaş əlavə et / redaktə et / sil
- Meeting Room əlavə et / redaktə et / sil
- Ümumi statistika (neçə əməkdaş, neçə otaq)
- QR kodu birbaşa paneldən yükləmək
## Təhlükəsizlik xüsusiyyətləri
- Şifrələr `bcrypt` ilə hash olunur (heç vaxt açıq mətn saxlanmır)
- Admin API-ləri JWT token ilə qorunur
- Giriş cəhdləri limitlənir (15 dəqiqədə maksimum 10 cəhd)
- Bütün API sorğuları üçün ümumi rate-limit tətbiq olunur
- `helmet` middleware ilə HTTP başlıqları gücləndirilir
- SQL inyeksiyasının qarşısı `better-sqlite3`-ün parametrləşdirilmiş sorğuları ilə alınır
- Frontend-də bütün istifadəçi mətni HTML-ə yazılmazdan əvvəl escape olunur (XSS qarşısı)
## Yeni funksiya əlavə etmək
Layihə genişlənməyə uyğun qurulub:
- **Yeni sahə əlavə etmək** (məs. əməkdaşın telefonu): `db.js`-də cədvələ sütun əlavə edin, `routes/admin.js`-də CRUD-a daxil edin, `admin.html`/`admin.js`-də formaya əlavə edin.
- **Şəkil/foto dəstəyi:** `employees` cədvəlində artıq `photo_url` sütunu mövcuddur — statik fayl saxlama (məs. Cloudinary və ya lokal `/public/uploads`) qoşmaq kifayətdir.
- **Çoxdilli dəstək:** frontend mətnləri `public/js/` fayllarında mərkəzləşdirilib, asanlıqla i18n obyektinə çevrilə bilər.
- **Fərqli autentifikasiya rolları:** `admins` cədvəlinə `role` sütunu əlavə edib `middleware/auth.js`-də yoxlama əlavə etmək kifayətdir.
## Nasazlıq həlli

| Problem | Həll |
| :--- | :--- |
| Server işə düşmür, "JWT_SECRET" xətası | `.env` faylının mövcud olduğuna və `JWT_SECRET`-in dolu olduğuna əmin olun |
| Admin panelə daxil ola bilmirəm | `npm run seed` işlədildiyini yoxlayın; `.env`-dəki `ADMIN_USERNAME`/`ADMIN_PASSWORD` dəyərlərini yoxlayın |
| Axtarış heç nə tapmır | Admin paneldən azı bir əməkdaş/otaq əlavə edildiyinə əmin olun |
| QR kod işləmir | `.env`-dəki `SITE_URL`-in server ünvanı ilə eyni olduğunu yoxlayın, sonra QR şəklini yenidən yükləyin |

Yuxarıda qeyd olunan məlumatları hər bir  vəzifə və ya vəzifədə işləyən işçi adı belə hər bir sahəyə aid olan məlumatı ayrı ayrılıqda hər biri üçün QR KOD olaraq yarad, qr kodları mənə təsvir kimi göstər onları kopy edib məlumat mərkəzinə yerləşdirəcəm
Bu məlumatı daha səliqəli düzgün formada yaratdığımız sayta yerləşdirmək üçün mənə göndər
