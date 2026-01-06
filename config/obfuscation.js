/**
 * Obfuscation & Anti-Debug Module
 * Minifies JavaScript and implements anti-debug techniques
 */

class ObfuscationManager {
    /**
     * Anti-debug check - runs in client-side scripts
     * Prevents browser DevTools from easily accessing code
     */
    static getAntiDebugCode() {
        return `
      (function() {
        // Detect DevTools
        let isDevToolsOpen = false;
        let devToolsCheckCount = 0;
        
        // Check console object
        const checkDevTools = () => {
          const start = performance.now();
          debugger;
          const end = performance.now();
          
          // If execution was paused at debugger, devtools is likely open
          if (end - start > 100) {
            isDevToolsOpen = true;
            devToolsCheckCount++;
          }
        };
        
        // Run check periodically
        setInterval(() => {
          checkDevTools();
          
          if (devToolsCheckCount > 2) {
            console.warn('⚠️  Security Warning: DevTools detected');
            // Optional: reload page, redirect, or disable features
          }
        }, 2000);
        
        // Disable console logging in certain scenarios
        window.console.log = function(...args) {
          if (isDevToolsOpen) return;
          // Original logging
        };
        
        // Prevent common debugging techniques
        Object.defineProperty(window, 'debugger', {
          get() {
            isDevToolsOpen = true;
            return undefined;
          },
        });
      })();
    `;
    }

    /**
     * Generate minified version of code
     * @param {string} code - JavaScript code to minify
     * @returns {string} Minified code
     */
    static minifyCode(code) {
        // Basic minification (production should use terser/uglify-js)
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*/g, '') // Remove line comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*([{}()[\];:,])\s*/g, '$1') // Remove spaces around syntax
            .trim();
    }

    /**
     * Obfuscate variable names
     * @param {string} code - JavaScript code
     * @returns {string} Obfuscated code
     */
    static obfuscateVariableNames(code) {
        const varMap = new Map();
        let counter = 0;

        // Simple variable renaming (a, b, c, etc.)
        const obfuscatedCode = code.replace(
            /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
            (match) => {
                // Skip keywords
                const keywords = ['function', 'if', 'else', 'return', 'var', 'let', 'const',
                    'for', 'while', 'true', 'false', 'null', 'undefined'];
                if (keywords.includes(match)) return match;

                if (!varMap.has(match)) {
                    varMap.set(match, String.fromCharCode(97 + (counter % 26)) + '_' + counter);
                    counter++;
                }
                return varMap.get(match);
            }
        );

        return obfuscatedCode;
    }

    /**
     * Create obfuscated client-side admin script
     * @returns {string} Obfuscated JavaScript
     */
    static getObfuscatedAdminScript() {
        const adminScript = `
      const API_BASE = '/admin';
      
      async function loadProductStock(productId) {
        try {
          const response = await fetch(\`\${API_BASE}/products\`);
          const products = await response.json();
          const product = products.find(p => p.id === productId);
          
          if (product) {
            const stockEl = document.querySelector(\`[data-product-id="\${productId}"]\`);
            if (stockEl) stockEl.textContent = product.stock + ' units';
          }
        } catch (error) {
          console.error('Error loading stock:', error);
        }
      }
      
      function createPurchase() {
        const form = document.getElementById('purchaseForm');
        const formData = new FormData(form);
        // Purchase logic...
      }
    `;

        // Minify and obfuscate
        let minified = this.minifyCode(adminScript);
        minified = this.obfuscateVariableNames(minified);

        return minified;
    }

    /**
     * Generate script tag with obfuscation
     * @param {string} scriptPath - Path to script file
     * @param {boolean} includeAntiDebug - Include anti-debug code
     * @returns {string} HTML script tag
     */
    static generateScriptTag(scriptPath, includeAntiDebug = true) {
        let html = '';

        if (includeAntiDebug) {
            html += `<script nonce="${this.generateNonce()}">${this.getAntiDebugCode()}</script>\n`;
        }

        html += `<script src="${scriptPath}" nonce="${this.generateNonce()}"></script>`;
        return html;
    }

    /**
     * Generate CSP nonce for inline scripts
     * @returns {string} Random nonce
     */
    static generateNonce() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create build configuration for minification
     * @returns {Object} Build config for webpack/parcel
     */
    static getBuildConfig() {
        return {
            mode: 'production',
            optimization: {
                minimize: true,
                minimizer: [
                    {
                        // Terser options for JavaScript minification
                        compress: {
                            drop_console: process.env.NODE_ENV === 'production',
                            drop_debugger: true,
                            passes: 3,
                        },
                        output: {
                            comments: false,
                            beautify: false,
                        },
                        mangle: {
                            properties: {
                                regex: /^_private_/,
                            },
                        },
                    },
                ],
            },
            entry: './public/js/admin.js',
            output: {
                path: './public/js',
                filename: 'admin.min.js',
            },
        };
    }

    /**
     * Express middleware to serve minified files
     * @returns {Function} Middleware
     */
    static minificationMiddleware() {
        return (req, res, next) => {
            // Store original send
            const originalSend = res.send;

            res.send = function (data) {
                // Only minify JavaScript
                if (res.get('content-type') && res.get('content-type').includes('javascript')) {
                    if (typeof data === 'string' && process.env.NODE_ENV === 'production') {
                        data = ObfuscationManager.minifyCode(data);
                    }
                }
                return originalSend.call(this, data);
            };

            next();
        };
    }
}

module.exports = ObfuscationManager;
