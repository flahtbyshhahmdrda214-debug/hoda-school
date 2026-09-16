# وب‌سایت رسمی و سامانه مدیریت محتوای مجتمع آموزشی قرآنی هدی
> سامانه معرفی، برندینگ و مدیریت محتوای یکپارچه مجتمع آموزشی قرآنی هدی (پیش‌دبستان، دبستان و دبیرستان پسرانه و دخترانه)

---

## 🏛️ ساختار معماری پروژه (Full-Stack Monorepo)

این پروژه از دو بخش اصلی تشکیل شده است:
1. **Frontend (پایگاه وب کاربری و پرتال معرفی مدارس):**
   - توسعه داده‌شده با **React 19** + **Vite 8** + **Tailwind CSS** + **React Router 7**
   - حفظ ۱۰۰٪ هویت بصری، کارت‌های ۳بعدی و شناور مدارس، لوگوی شیشه‌ای کریستالی، و نوار متحرک افتخارات
   - معماری چندصفحه‌ای با قابلیت مسیریابی مستقیم (`/schools/:slug`، `/news`، `/credentials`، `/about`)
   - قابلیت **Graceful Fallback**: در صورت خاموش بودن سرور بک‌اند، سایت به طور خودکار از داده‌های محلی استفاده کرده و بدون قطعی نمایش داده می‌شود.

2. **Backend & CMS (سرور API و پنل ادمین اختصاصی):**
   - توسعه داده‌شده با **Fastify 5** (مبتنی بر Node.js با بالاترین کارایی و سرعت پاسخ‌دهی)
   - پایگاه داده با **Prisma ORM 6**:
     - دیتابیس لوکال برای توسعه: **SQLite** بدون نیاز به نصب نرم‌افزار اضافی (`file:./dev.db`)
     - دیتابیس سرور Production: **PostgreSQL 16** (`schema.postgresql.prisma`)
   - احراز هویت امن با **Argon2id** و نشست مبتنی بر **JWT** با کوکی HTTP-Only و امضاشده
   - کنترل دسترسی بر مبنای نقش (**RBAC**): `SUPERADMIN`، `SCHOOL_ADMIN`، `EDITOR`
   - مدیریت رسانه هوشمند با **Sharp** (تبدیل خودکار تصاویر به فرمت WebP، پاکسازی متادیتاهای EXIF و ساخت تامبنیل)
   - پاکسازی کدهای مخرب و جلوگیری از حملات XSS در ویرایشگر اخبار با **sanitize-html**
   - ثبت کلیه وقایع مدیریتی در **Audit Logs**

---

## 🚀 راهنمای راه‌اندازی سریع توسعه (Development Setup)

### پیش‌نیازها
- **Node.js** نسخه 20 به بالا
- **npm** نسخه 10 به بالا

### ۱. نصب وابستگی‌های فرانت‌اند و بک‌اند
```bash
# در پوشه اصلی پروژه:
npm install

# در پوشه سرور:
cd server
npm install
cd ..
```

### ۲. مقداردهی پایگاه داده و بارگذاری داده‌های اولیه (Seed Data)
```bash
cd server
npx prisma db push
npm run prisma:seed
cd ..
```
*با اجرای Seed Data، کاربر مدیر ارشد (`admin`)، ۴ مدرسه زیرمجموعه، معلمان، امکانات، اخبار و مدارک رسمی بارگذاری خواهند شد.*

### ۳. اجرای همزمان فرانت‌اند و بک‌اند
- **اجرای سرور بک‌اند (پورت 4000):**
  ```bash
  npm run server:dev
  ```
- **اجرای فرانت‌اند (پورت 5173):**
  ```bash
  npm run dev
  ```
- فرانت‌اند روی نشانی `http://localhost:5173` و سرور API روی `http://localhost:4000` در دسترس خواهند بود. (درخواست‌های `/api` فرانت‌اند به صورت خودکار به پورت 4000 پروکسی می‌شوند).

---

## 🔐 اطلاعات حساب کاربری مدیر ارشد (SuperAdmin)

- **نشانی ورود به پنل مدیریت:** `http://localhost:5173/admin/login`
- **نام کاربری:** `admin`
- **ایمیل:** `admin@hodaschool.ir`
- **کلمه عبور پیش‌فرض:** `AdminHoda2026!#`

> ⚠️ **نکته امنیتی:** پس از اولین ورود به پنل، حتماً کلمه عبور پیش‌فرض را از بخش تنظیمات حساب تغییر دهید.

---

## 🧭 نقشه مسیرها و صفحات سامانه (Routes)

### صفحات عمومی کاربران:
- `/` : صفحه اصلی مجتمع، بنر سینمایی، لوگوی کریستالی ۳بعدی، درگاه مدارس چهارگانه، هویت سازمانی و اخبار مهم
- `/schools/boys-elementary` : درگاه اختصاصی دبستان پسرانه هدی
- `/schools/boys-highschool` : درگاه اختصاصی دبیرستان پسرانه هدی
- `/schools/girls-elementary` : درگاه اختصاصی دبستان دخترانه هدی
- `/schools/girls-highschool` : درگاه اختصاصی دبیرستان دخترانه هدی
- `/news` : آرشیو کامل اخبار و اطلاعیه‌ها همراه با جست‌وجو و دسته‌بندی
- `/news/:slug` : مشاهده کامل متن و تصاویر یک خبر یا رویداد
- `/credentials` : نمایش کامل مجوزهای رسمی، رتبه الف کیفیت و استانداردهای ایزو
- `/about` : معرفی جامع مجتمع، چشم‌انداز، رسالت و تاریخچه

### صفحات پنل مدیریت (`/admin`):
- `/admin` : پیشخوان آماری، میانبرها و آخرین لاگ‌های امنیتی
- `/admin/schools` : ویرایش مشخصات مدارس و طرح‌های تربیتی
- `/admin/news` : ایجاد، ویرایش و حذف اخبار با ویرایشگر غنی
- `/admin/teachers` : مدیریت معلمان و اساتید با تصویر پرسنلی
- `/admin/facilities` : مدیریت آزمایشگاه‌ها، کتابخانه‌ها و سالن‌ها
- `/admin/documents` : مدیریت مجوزها و گواهینامه‌های رسمی
- `/admin/media` : آپلودسنتر فایل‌ها و بهینه‌سازی خودکار WebP
- `/admin/settings` : مدیریت شماره‌های تماس، نشانی مرکزی و شبکه‌های اجتماعی
- `/admin/users` : مدیریت حساب‌ها و سطوح دسترسی (فقط مدیر ارشد)
- `/admin/audit-logs` : گزارش وقایع و لاگ‌های امنیتی (فقط مدیر ارشد)

---

## 🌐 راهنمای استقرار در محیط عملیاتی (Production Deployment)

### ۱. پیکربندی سرور لینوکس (Ubuntu 22.04 / 24.04)
```bash
# نصب PostgreSQL و Node.js
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx

# ایجاد دیتابیس در PostgreSQL
sudo -u postgres psql
CREATE DATABASE hoda_db;
CREATE USER hoda_user WITH ENCRYPTED PASSWORD 'StrongPasswordHere123!';
GRANT ALL PRIVILEGES ON DATABASE hoda_db TO hoda_user;
\q
```

### ۲. ساخت نسخه Production فرانت‌اند
```bash
npm run build
```
پوشه `dist` تولیدشده را در مسیر `/var/www/hoda-school/dist` کپی کنید.

### ۳. راه‌اندازی سرویس بک‌اند با PM2
```bash
cd server
npm install --omit=dev
# تنظیم متغیرهای محیطی در .env
# استفاده از schema.postgresql.prisma
npx prisma db push --schema=prisma/schema.postgresql.prisma
npm install -g pm2
pm2 start server.js --name "hoda-api"
pm2 save
pm2 startup
```

### ۴. پیکربندی وب‌سرور Nginx
یک فایل پیکربندی در `/etc/nginx/sites-available/hoda` ایجاد کنید:
```nginx
server {
    listen 80;
    server_name hodaschool.ir www.hodaschool.ir;

    # Static Frontend
    location / {
        root /var/www/hoda-school/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Endpoints Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded Static Files
    location /uploads/ {
        alias /var/www/hoda-school/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```
سپس Nginx را ری‌استارت کرده و گواهی رایگان SSL فعال کنید:
```bash
sudo ln -s /etc/nginx/sites-available/hoda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d hodaschool.ir -d www.hodaschool.ir
```

---

## 📄 مالکیت و حقوق نشر
تمامی حقوق این سامانه متعلق به **مجتمع آموزشی قرآنی هدی** می‌باشد.
