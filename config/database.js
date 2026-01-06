const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/store.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Buat tabel Produk
    db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) console.error('Error creating products table', err);
    });

    // Buat tabel Stock Produk
    db.run(`
    CREATE TABLE IF NOT EXISTS product_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
        if (err) console.error('Error creating product_stock table', err);
    });

    // Buat tabel Pembelian
    db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
        if (err) console.error('Error creating purchases table', err);

        // Cek apakah produk sudah ada (setelah table dibuat)
        setTimeout(() => {
            db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                if (err) {
                    console.error('Error checking products', err);
                    return;
                }

                if (row && row.count === 0) {
                    // Insert 10 produk furnitur
                    const products = [
                        { name: 'Sofa Modern Minimalis 3 Tempat', description: 'Sofa empuk dengan desain minimalis modern, cocok untuk ruang tamu', category: 'Sofa', price: 4500000 },
                        { name: 'Meja Makan Kayu Jati 6 Kursi', description: 'Meja makan berkualitas tinggi dengan material kayu jati pilihan', category: 'Meja Makan', price: 8500000 },
                        { name: 'Tempat Tidur Minimalis King Size', description: 'Tempat tidur dengan desain elegan dan busa premium', category: 'Tempat Tidur', price: 7200000 },
                        { name: 'Lemari Pakaian 3 Pintu Putih', description: 'Lemari pakaian spacious dengan finishing putih bersih', category: 'Lemari', price: 3500000 },
                        { name: 'Rak Buku Dinding Floating', description: 'Rak buku gantung dengan design kontemporer', category: 'Rak', price: 850000 },
                        { name: 'Kursi Gaming Ergonomis', description: 'Kursi gaming dengan support lumbar dan bahan berkualitas', category: 'Kursi', price: 2500000 },
                        { name: 'Meja Kerja Kayu Walnut', description: 'Meja kerja minimalis dengan kayu walnut alami', category: 'Meja Kerja', price: 3800000 },
                        { name: 'Buffet Kayu 2 Pintu Sliding', description: 'Buffet penyimpanan dengan pintu sliding modern', category: 'Buffet', price: 5500000 },
                        { name: 'Kursi Sofa Tunggal Empuk', description: 'Kursi sofa single dengan cushion empuk dan nyaman', category: 'Sofa', price: 2200000 },
                        { name: 'Meja Kopi Marmer Elegan', description: 'Meja kopi dengan top marmer dan kaki besi modern', category: 'Meja Kopi', price: 1800000 }
                    ];

                    products.forEach(product => {
                        db.run(
                            'INSERT INTO products (name, description, category, price) VALUES (?, ?, ?, ?)',
                            [product.name, product.description, product.category, product.price],
                            function (err) {
                                if (!err) {
                                    // Setiap produk dimasukkan stock awal 20 unit
                                    db.run(
                                        'INSERT INTO product_stock (product_id, quantity) VALUES (?, ?)',
                                        [this.lastID, 20]
                                    );
                                }
                            }
                        );
                    });
                    console.log('✅ 10 produk furnitur berhasil ditambahkan');
                }
            });
        }, 100);
    });
}

module.exports = db;
