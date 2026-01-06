# Xionco Furniture - Admin Panel & AI Chatbot

Sistem admin panel untuk manajemen pesanan furnitur dan chatbot terintegrasi dengan AI.

## 🎯 Fitur

### Admin Panel

- **Dashboard**: Lihat ringkasan pembelian dan stok produk
- **Manajemen Pembelian**: Buat, konfirmasi, dan batalkan pembelian
- **Database Produk**: 10 produk dengan informasi harga dan stock
- **Manajemen Stock**: Tracking real-time stok produk
- **Riwayat Transaksi**: Lihat semua pembelian dengan status

### AI Chatbot

- **Asisten Belanja**: Tanya jawab tentang produk dan rekomendasi
- **Multi-AI Support**: Deepseek, Gemini, OpenAI ChatGPT, Ollama
- **Interface User-Friendly**: Chat interaktif yang responsif
- **Integrasi API**: Terhubung langsung dengan AI services

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: EJS (Template Engine), HTML5, CSS3, Vanilla JavaScript
- **Database**: SQLite3
- **AI Integration**:
  - Deepseek API
  - Google Gemini API
  - OpenAI ChatGPT API
  - Ollama (Local)
- **HTTP Client**: Axios

## 📋 Prasyarat

- Node.js (v14+)
- npm atau yarn
- API Key dari salah satu layanan AI (optional)

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pre-test.git
cd pre-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
PORT=3000
AI_API=deepseek

# Jika menggunakan Deepseek
DEEPSEEK_API_KEY=sk-your_deepseek_api_key_here

# Jika menggunakan Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Jika menggunakan OpenAI ChatGPT
OPENAI_API_KEY=sk-your_openai_api_key_here

# Jika menggunakan Ollama (local)
OLLAMA_URL=http://localhost:11434
```

### 4. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📱 Cara Penggunaan

### Admin Panel

1. Buka browser dan navigasi ke `http://localhost:3000/admin`
2. Gunakan form untuk membuat pembelian baru
3. Pilih produk dan masukkan jumlah
4. Lihat riwayat pembelian dan manage status (pending, confirmed, cancelled)

### Chatbot

1. Buka `http://localhost:3000`
2. Scroll ke bagian Chatbot
3. Ketik pesan dan tekan Enter atau klik tombol Send
4. Chatbot akan merespons dengan bantuan AI

## 📦 Database Schema

### Tabel Products

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tabel Product Stock

```sql
CREATE TABLE product_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
)
```

### Tabel Purchases

```sql
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
)
```

## 🔌 Konfigurasi AI Service

### Menggunakan Deepseek

1. Daftar di https://platform.deepseek.com
2. Dapatkan API Key
3. Set `AI_API=deepseek` di .env
4. Masukkan API Key ke `DEEPSEEK_API_KEY`

### Menggunakan Google Gemini

1. Daftar di https://makersuite.google.com/app/apikey
2. Dapatkan API Key
3. Set `AI_API=gemini` di .env
4. Masukkan API Key ke `GEMINI_API_KEY`

### Menggunakan OpenAI ChatGPT

1. Daftar di https://platform.openai.com
2. Dapatkan API Key
3. Set `AI_API=openai` di .env
4. Masukkan API Key ke `OPENAI_API_KEY`

### Menggunakan Ollama (Local - Free)

1. Install Ollama dari https://ollama.ai
2. Jalankan: `ollama run llama2`
3. Set `AI_API=ollama` di .env
4. Pastikan Ollama berjalan di `http://localhost:11434`

## 📁 Struktur Folder

```
pre-test/
├── app.js                 # Main application
├── package.json
├── .env                   # Environment variables (create locally)
├── .gitignore
├── README.md
├── config/
│   └── database.js       # Database configuration
├── routes/
│   ├── admin.js          # Admin panel routes
│   └── chatbot.js        # Chatbot routes
├── views/
│   ├── index.ejs         # Home page
│   ├── 404.ejs           # 404 page
│   ├── error.ejs         # Error page
│   └── admin/
│       └── dashboard.ejs # Admin dashboard
├── public/
│   ├── css/
│   │   └── style.css     # Stylesheet
│   └── js/
│       ├── admin.js      # Admin panel scripts
│       └── chatbot.js    # Chatbot scripts
└── data/
    └── store.db          # SQLite database (auto-created)
```

## 🎨 UI Design

- **Responsif**: Desain mobile-first yang responsive di semua ukuran layar
- **Modern**: Gradient backgrounds, smooth animations, dan layout yang clean
- **User-Friendly**: Interface intuitif untuk navigasi dan penggunaan

## 🔐 Keamanan

- Environment variables untuk menyimpan API Keys (jangan commit .env)
- Input validation pada form
- Error handling yang proper
- SQL dari parameterized queries untuk prevent injection

## 📝 API Endpoints

### Admin Routes

- `GET /admin` - Dashboard admin
- `GET /admin/products` - Daftar produk dengan stock
- `POST /admin/purchases/add` - Buat pembelian baru
- `GET /admin/purchases/:id` - Detail pembelian
- `POST /admin/purchases/:id/cancel` - Batalkan pembelian
- `POST /admin/purchases/:id/confirm` - Konfirmasi pembelian

### Chatbot Routes

- `POST /api/chat` - Kirim pesan ke chatbot

## 🐛 Troubleshooting

### Chatbot tidak merespons

- Pastikan API Key sudah dimasukkan ke .env
- Cek koneksi internet
- Pastikan AI service yang dipilih available
- Lihat console untuk error messages

### Database error

- Pastikan folder `data/` ada
- Cek permissions untuk read/write file
- Hapus `data/store.db` dan restart server untuk reset database

### Port sudah digunakan

- Ubah PORT di .env ke port yang berbeda
- Atau kill process yang menggunakan port 3000

## 🤝 Contributing

Silakan fork repository dan buat pull request untuk improvements.

## 📄 License

MIT License

## 👤 Author

Created for pre-test purposes

---

**Dibuat dengan ❤️ menggunakan Node.js & Express**
