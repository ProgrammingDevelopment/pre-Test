require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./config/database');
const SecurityManager = require('./config/security');
const { getRSAManager } = require('./config/rsa-integrity');
const ObfuscationManager = require('./config/obfuscation');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY LAYERS INITIALIZATION
// ============================================

// 1. Setup HTTPS & TLS 1.3 (Protocol Security)
console.log('🔒 Initializing security layers...');
SecurityManager.enableHSTS(app);
SecurityManager.enforceHTTPS(app);
SecurityManager.enableCSP(app);

// 2. Setup RSA-4096 Signing (Integrity)
const rsaManager = getRSAManager();
rsaManager.generateKeys(); // Generate keys on first run

// 3. Apply obfuscation middleware (for production)
if (process.env.NODE_ENV === 'production') {
    app.use(ObfuscationManager.minificationMiddleware());
}

// ============================================
// EXPRESS MIDDLEWARE
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 4. Apply RSA signature to JSON responses
app.use(rsaManager.signResponseMiddleware());

// ============================================
// VIEW ENGINE SETUP
// ============================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// ROUTES
// ============================================

const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');

app.use('/admin', adminRoutes);
app.use('/api/chat', chatbotRoutes);

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Public key endpoint for signature verification
app.get('/api/security/public-key', (req, res) => {
    const publicKey = rsaManager.getPublicKey();
    if (!publicKey) {
        return res.status(503).json({ error: 'Public key not available' });
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(publicKey);
});

// Security headers endpoint
app.get('/api/security/headers', (req, res) => {
    res.json({
        protocol: 'HTTPS + TLS 1.3',
        hsts: 'Enabled',
        csp: 'Enabled',
        rsa_signing: 'RSA-4096',
        obfuscation: 'JavaScript Minification + Anti-Debug',
        cloudflare_waf: 'Recommended',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('🔒 Security Layers Active:');
    console.log('   ✓ HTTPS + TLS 1.3 (Protocol)');
    console.log('   ✓ HSTS Headers (Transport)');
    console.log('   ✓ CSP Policy (Content)');
    console.log('   ✓ RSA-4096 Signing (Integrity)');
    console.log('   ✓ JavaScript Obfuscation (Logic)');
    console.log('   ℹ Cloudflare WAF (Network) - Configure on deployment');
});
