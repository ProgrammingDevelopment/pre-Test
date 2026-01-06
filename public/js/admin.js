// Admin Dashboard Functions

document.getElementById('productSelect').addEventListener('change', function () {
    const productId = this.value;
    if (productId) {
        loadProductStock(productId);
    } else {
        document.getElementById('stockInfo').value = '';
    }
});

document.getElementById('purchaseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    createPurchase();
});

function loadProductStock(productId) {
    fetch('/admin/products')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (product) {
                document.getElementById('stockInfo').value = `${product.stock} units`;
            }
        })
        .catch(err => console.error('Error loading products:', err));
}

function createPurchase() {
    const productId = document.getElementById('productSelect').value;
    const quantity = document.getElementById('quantity').value;

    if (!productId || !quantity) {
        alert('Please fill all fields');
        return;
    }

    fetch('/admin/purchases/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity: parseInt(quantity) })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Purchase created successfully! ID: ' + data.purchase_id);
                document.getElementById('purchaseForm').reset();
                document.getElementById('stockInfo').value = '';
                setTimeout(() => location.reload(), 1000);
            } else {
                alert('Error: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to create purchase');
        });
}

function cancelPurchase(purchaseId) {
    if (confirm('Are you sure you want to cancel this purchase?')) {
        fetch(`/admin/purchases/${purchaseId}/cancel`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Failed to cancel purchase');
            });
    }
}

function confirmPurchase(purchaseId) {
    if (confirm('Confirm this purchase?')) {
        fetch(`/admin/purchases/${purchaseId}/confirm`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Failed to confirm purchase');
            });
    }
}

function filterPurchases(status) {
    const rows = document.querySelectorAll('.purchase-row');

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter rows
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Load stock info for all products on page load
document.addEventListener('DOMContentLoaded', function () {
    fetch('/admin/products')
        .then(res => res.json())
        .then(products => {
            const stockBadges = document.querySelectorAll('.stock-badge');
            stockBadges.forEach(badge => {
                const productId = badge.dataset.productId;
                const product = products.find(p => p.id == productId);
                if (product) {
                    badge.textContent = `${product.stock} units`;
                }
            });
        })
        .catch(err => console.error('Error loading stock:', err));
});
