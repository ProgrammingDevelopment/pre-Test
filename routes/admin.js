const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Dashboard
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return res.status(500).render('error', { message: 'Database error' });
    }

    db.all('SELECT * FROM purchases ORDER BY created_at DESC', (err, purchases) => {
      if (err) {
        return res.status(500).render('error', { message: 'Database error' });
      }

      res.render('admin/dashboard', { products, purchases });
    });
  });
});

// Get products with stock
router.get('/products', (req, res) => {
  const query = `
    SELECT p.*, ps.quantity as stock
    FROM products p
    LEFT JOIN product_stock ps ON p.id = ps.product_id
  `;

  db.all(query, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(products);
  });
});

// Add purchase
router.post('/purchases/add', (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Check stock
  db.get(
    'SELECT quantity FROM product_stock WHERE product_id = ?',
    [product_id],
    (err, row) => {
      if (err || !row) {
        return res.status(400).json({ error: 'Product not found' });
      }

      if (row.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      // Get product price
      db.get('SELECT price FROM products WHERE id = ?', [product_id], (err, product) => {
        if (err || !product) {
          return res.status(400).json({ error: 'Product not found' });
        }

        const total_price = product.price * quantity;

        // Insert purchase
        db.run(
          'INSERT INTO purchases (product_id, quantity, total_price, status) VALUES (?, ?, ?, ?)',
          [product_id, quantity, total_price, 'pending'],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create purchase' });
            }

            // Update stock
            db.run(
              'UPDATE product_stock SET quantity = quantity - ? WHERE product_id = ?',
              [quantity, product_id],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to update stock' });
                }
                res.json({ success: true, purchase_id: this.lastID });
              }
            );
          }
        );
      });
    }
  );
});

// Get purchase details
router.get('/purchases/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT p.*, pr.name, pr.price
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    WHERE p.id = ?
  `;

  db.get(query, [id], (err, purchase) => {
    if (err || !purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(purchase);
  });
});

// Cancel purchase
router.post('/purchases/:id/cancel', (req, res) => {
  const { id } = req.params;

  // Get purchase details
  db.get('SELECT * FROM purchases WHERE id = ?', [id], (err, purchase) => {
    if (err || !purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    if (purchase.status === 'cancelled') {
      return res.status(400).json({ error: 'Purchase already cancelled' });
    }

    // Update purchase status
    db.run('UPDATE purchases SET status = ? WHERE id = ?', ['cancelled', id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to cancel purchase' });
      }

      // Return stock to inventory
      db.run(
        'UPDATE product_stock SET quantity = quantity + ? WHERE product_id = ?',
        [purchase.quantity, purchase.product_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to return stock' });
          }
          res.json({ success: true, message: 'Purchase cancelled successfully' });
        }
      );
    });
  });
});

// Confirm purchase
router.post('/purchases/:id/confirm', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE purchases SET status = ? WHERE id = ?', ['confirmed', id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to confirm purchase' });
    }
    res.json({ success: true, message: 'Purchase confirmed' });
  });
});

module.exports = router;
