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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Buat tabel Stock Produk
  db.run(`
    CREATE TABLE IF NOT EXISTS product_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

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
  `);

  // Cek apakah produk sudah ada
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products', err);
      return;
    }
    
    if (row.count === 0) {
      // Insert 10 produk
      const products = [
        { name: 'Laptop Dell Inspiron', description: 'Laptop 15 inch dengan processor Intel Core i5', price: 8500000 },
        { name: 'Smartphone Samsung Galaxy A52', description: 'Smartphone 5G dengan kamera 64MP', price: 4500000 },
        { name: 'Tablet iPad Pro 11"', description: 'Tablet 2.4K dengan chip A2Z', price: 12000000 },
        { name: 'Monitor LG 27 inch 4K', description: 'Monitor UltraHD untuk gaming dan design', price: 3500000 },
        { name: 'Keyboard Mechanical RGB', description: 'Keyboard gaming dengan switch mechanical', price: 850000 },
        { name: 'Mouse Logitech MX Master 3', description: 'Mouse wireless presisi tinggi', price: 1200000 },
        { name: 'Headphones Sony WH-1000XM4', description: 'Headphone noise-cancelling wireless', price: 3800000 },
        { name: 'SSD Samsung 970 Pro 1TB', description: 'NVMe SSD performa tinggi', price: 1500000 },
        { name: 'Power Bank 20000mAh', description: 'Power bank dengan fast charging', price: 450000 },
        { name: 'Webcam Logitech C920', description: 'Webcam Full HD 1080p', price: 650000 }
      ];

      products.forEach(product => {
        db.run(
          'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
          [product.name, product.description, product.price],
          function(err) {
            if (!err) {
              // Setiap produk dimasukkan stock awal 50 unit
              db.run(
                'INSERT INTO product_stock (product_id, quantity) VALUES (?, ?)',
                [this.lastID, 50]
              );
            }
          }
        );
      });
      console.log('10 produk berhasil ditambahkan');
    }
  });
}

module.exports = db;
