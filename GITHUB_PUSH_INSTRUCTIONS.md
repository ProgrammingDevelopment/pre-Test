# INSTRUKSI PUSH KE GITHUB

Proyek "pre-test" sudah siap untuk di-push ke GitHub. Ikuti langkah-langkah berikut:

## 1. Persiapan di GitHub

1. Login ke GitHub (https://github.com)
2. Klik "+" di navbar atas, pilih "New repository"
3. Isi form:
   - Repository name: `pre-test`
   - Description: `Store Management System with AI Chatbot`
   - Public (agar bisa diakses oleh orang lain)
   - JANGAN initialize dengan README, .gitignore, atau LICENSE
4. Klik "Create repository"

## 2. Push Repository ke GitHub

Di terminal/PowerShell, jalankan command berikut:

```bash
cd C:\Users\user\Desktop\pre-test

# Jika belum ada remote, tambahkan remote
git remote add origin https://github.com/YOURUSERNAME/pre-test.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

Ganti `YOURUSERNAME` dengan username GitHub Anda.

## 3. Setelah Push Berhasil

Repository akan tersedia di: `https://github.com/YOURUSERNAME/pre-test`

## 4. Setup untuk Pengguna Lain

Orang lain bisa clone dengan:

```bash
git clone https://github.com/YOURUSERNAME/pre-test.git
cd pre-test
npm install
```

Kemudian buat file .env dengan API key mereka.

---

## File Structure yang sudah dibuat:

```
pre-test/
├── .env                          # Konfigurasi environment (jangan di-push)
├── .gitignore                    # File yang diabaikan git
├── README.md                     # Dokumentasi project
├── package.json                  # Dependencies
├── package-lock.json             # Lock file
├── app.js                        # Main server file
│
├── config/
│   └── database.js              # Database initialization & connection
│
├── routes/
│   ├── admin.js                 # Admin panel API routes
│   └── chatbot.js               # Chatbot API route
│
├── views/
│   ├── index.ejs                # Home & Chatbot page
│   ├── 404.ejs                  # 404 page
│   ├── error.ejs                # Error page
│   └── admin/
│       └── dashboard.ejs        # Admin panel page
│
├── public/
│   ├── css/
│   │   └── style.css           # All styles (responsive design)
│   └── js/
│       ├── admin.js            # Admin panel functionality
│       └── chatbot.js          # Chatbot functionality
│
└── data/
    └── store.db                # SQLite database (auto-created)
```

## Database dengan 10 Produk:

1. Laptop Dell Inspiron - $8,500,000
2. Smartphone Samsung Galaxy A52 - $4,500,000
3. Tablet iPad Pro 11" - $12,000,000
4. Monitor LG 27 inch 4K - $3,500,000
5. Keyboard Mechanical RGB - $850,000
6. Mouse Logitech MX Master 3 - $1,200,000
7. Headphones Sony WH-1000XM4 - $3,800,000
8. SSD Samsung 970 Pro 1TB - $1,500,000
9. Power Bank 20000mAh - $450,000
10. Webcam Logitech C920 - $650,000

Setiap produk dengan stock awal 50 unit.

## API yang Didukung untuk Chatbot:

1. **Deepseek** (Recommended)

   - Website: https://platform.deepseek.com
   - API Key: sk-...

2. **Google Gemini**

   - Website: https://makersuite.google.com/app/apikey
   - Free tier tersedia

3. **OpenAI ChatGPT**

   - Website: https://platform.openai.com
   - Bayar per token

4. **Ollama** (Local - Gratis)
   - Website: https://ollama.ai
   - Tidak perlu internet setelah setup

## Testing Aplikasi:

Ketika server berjalan (npm start):

1. **Home & Chatbot**: http://localhost:3000
2. **Admin Panel**: http://localhost:3000/admin

Sudah termasuk:
✅ Responsive design (mobile-friendly)
✅ Dashboard dengan statistics
✅ Form tambah pembelian
✅ Tabel produk & stock
✅ Tabel riwayat pembelian
✅ Filter pembelian (all, pending, confirmed, cancelled)
✅ Aksi confirm & cancel untuk setiap pembelian
✅ Chatbot dengan AI integration
✅ Modern UI dengan gradients & animations

---

Selamat! Proyek sudah siap untuk di-push ke GitHub! 🚀
