const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Security Helper Module
 * Implements multiple security layers for Xionco Furniture
 */

class SecurityManager {
    /**
     * Setup HTTPS with TLS 1.3
     * @param {Object} app - Express app
     * @param {number} port - HTTPS port
     * @returns {Object} HTTPS server
     */
    static setupHTTPS(app, port = 443) {
        try {
            const certPath = path.join(__dirname, '../certs');

            // Check if certificates exist
            if (!fs.existsSync(certPath)) {
                console.warn('⚠️  SSL certificates not found at', certPath);
                console.warn('💡 For production, use Let\'s Encrypt or similar');
                console.warn('📝 Falling back to HTTP for development');
                return null;
            }

            const options = {
                key: fs.readFileSync(path.join(certPath, 'private-key.pem')),
                cert: fs.readFileSync(path.join(certPath, 'certificate.pem')),
                // TLS 1.3 configuration
                minVersion: 'TLSv1.3',
                maxVersion: 'TLSv1.3',
                ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256',
                honorCipherOrder: true,
                sessionTimeout: 86400, // 24 hours
            };

            const httpsServer = https.createServer(options, app);
            console.log('✅ HTTPS with TLS 1.3 configured');
            return httpsServer;
        } catch (error) {
            console.error('❌ Error setting up HTTPS:', error.message);
            return null;
        }
    }

    /**
     * Apply HSTS (HTTP Strict Transport Security) headers
     * @param {Object} app - Express app
     * @param {Object} options - Configuration options
     */
    static enableHSTS(app, options = {}) {
        const {
            maxAge = 31536000, // 1 year in seconds
            includeSubDomains = true,
            preload = true,
        } = options;

        app.use((req, res, next) => {
            // HSTS header
            let hstsValue = `max-age=${maxAge}`;
            if (includeSubDomains) hstsValue += '; includeSubDomains';
            if (preload) hstsValue += '; preload';

            res.setHeader('Strict-Transport-Security', hstsValue);

            // Additional security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

            next();
        });

        console.log('✅ HSTS and security headers enabled');
    }

    /**
     * Enforce HTTPS redirect
     * @param {Object} app - Express app
     */
    static enforceHTTPS(app) {
        app.use((req, res, next) => {
            if (process.env.NODE_ENV === 'production' && !req.secure) {
                return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
            }
            next();
        });
        console.log('✅ HTTPS enforcement enabled');
    }

    /**
     * Get CSP (Content Security Policy) header
     * @returns {string} CSP header value
     */
    static getCSPHeader() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // For EJS templates
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ');
    }

    /**
     * Apply CSP headers
     * @param {Object} app - Express app
     */
    static enableCSP(app) {
        app.use((req, res, next) => {
            res.setHeader('Content-Security-Policy', this.getCSPHeader());
            next();
        });
        console.log('✅ Content Security Policy (CSP) enabled');
    }
}

module.exports = SecurityManager;
