const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * RSA-4096 Signing Module for API Integrity
 * Signs all API responses with RSA private key
 * Allows client to verify authenticity with public key
 */

class RSAIntegrityManager {
    constructor() {
        this.keySize = 4096;
        this.algorithm = 'sha256';
        this.publicKeyPath = path.join(__dirname, '../certs/rsa-public.pem');
        this.privateKeyPath = path.join(__dirname, '../certs/rsa-private.pem');
    }

    /**
     * Generate RSA-4096 key pair
     * Run this ONCE to generate keys
     */
    generateKeys() {
        try {
            // Check if keys already exist
            if (fs.existsSync(this.publicKeyPath) && fs.existsSync(this.privateKeyPath)) {
                console.log('✅ RSA keys already exist');
                return;
            }

            console.log('🔑 Generating RSA-4096 key pair... (this may take a moment)');

            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: this.keySize,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            // Ensure certs directory exists
            const certsDir = path.dirname(this.publicKeyPath);
            if (!fs.existsSync(certsDir)) {
                fs.mkdirSync(certsDir, { recursive: true });
            }

            fs.writeFileSync(this.publicKeyPath, publicKey);
            fs.writeFileSync(this.privateKeyPath, privateKey);
            fs.chmodSync(this.privateKeyPath, 0o600); // Private key read-only

            console.log('✅ RSA-4096 keys generated successfully');
            console.log(`📁 Public key: ${this.publicKeyPath}`);
            console.log(`📁 Private key: ${this.privateKeyPath}`);
        } catch (error) {
            console.error('❌ Error generating RSA keys:', error.message);
        }
    }

    /**
     * Sign API response with RSA-4096 private key
     * @param {Object} data - Data to sign
     * @returns {string} Signature in base64
     */
    signResponse(data) {
        try {
            if (!fs.existsSync(this.privateKeyPath)) {
                console.warn('⚠️  Private key not found. Skipping signature.');
                return null;
            }

            const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
            const dataString = JSON.stringify(data);

            const signature = crypto.sign(
                this.algorithm,
                Buffer.from(dataString),
                privateKey
            );

            return signature.toString('base64');
        } catch (error) {
            console.error('❌ Error signing response:', error.message);
            return null;
        }
    }

    /**
     * Verify signature with RSA-4096 public key
     * @param {Object} data - Original data
     * @param {string} signature - Signature in base64
     * @returns {boolean} Is valid
     */
    verifySignature(data, signature) {
        try {
            if (!fs.existsSync(this.publicKeyPath)) {
                console.warn('⚠️  Public key not found');
                return false;
            }

            const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
            const dataString = JSON.stringify(data);

            const isValid = crypto.verify(
                this.algorithm,
                Buffer.from(dataString),
                publicKey,
                Buffer.from(signature, 'base64')
            );

            return isValid;
        } catch (error) {
            console.error('❌ Error verifying signature:', error.message);
            return false;
        }
    }

    /**
     * Create signed response with integrity header
     * @param {Object} data - Response data
     * @param {string} timestamp - Request timestamp
     * @returns {Object} Response with X-Signature header
     */
    createSignedResponse(data, timestamp = null) {
        const responseData = {
            data,
            timestamp: timestamp || new Date().toISOString(),
            version: '1.0',
        };

        const signature = this.signResponse(responseData);

        return {
            body: responseData,
            headers: {
                'X-Signature': signature,
                'X-Signature-Algorithm': `RSA-${this.keySize}`,
                'X-Signature-Hash': this.algorithm.toUpperCase(),
            },
        };
    }

    /**
     * Express middleware to sign all JSON responses
     * @returns {Function} Middleware function
     */
    signResponseMiddleware() {
        return (req, res, next) => {
            const originalJson = res.json.bind(res);

            res.json = function (data) {
                try {
                    const signed = RSAIntegrityManager.instance.createSignedResponse(data);

                    // Set signature headers
                    Object.entries(signed.headers).forEach(([key, value]) => {
                        if (value) res.setHeader(key, value);
                    });

                    // Send response with data
                    return originalJson(signed.body);
                } catch (error) {
                    console.error('Error in signature middleware:', error);
                    return originalJson(data);
                }
            };

            next();
        };
    }

    /**
     * Get public key for client-side verification
     * @returns {string} Public key PEM format
     */
    getPublicKey() {
        try {
            if (fs.existsSync(this.publicKeyPath)) {
                return fs.readFileSync(this.publicKeyPath, 'utf8');
            }
            return null;
        } catch (error) {
            console.error('❌ Error reading public key:', error.message);
            return null;
        }
    }
}

// Singleton instance
RSAIntegrityManager.instance = null;

function getRSAManager() {
    if (!RSAIntegrityManager.instance) {
        RSAIntegrityManager.instance = new RSAIntegrityManager();
    }
    return RSAIntegrityManager.instance;
}

module.exports = { RSAIntegrityManager, getRSAManager };
