# 🚀 Quick Start Guide - Xionco Furniture AI System

**Last Updated**: January 6, 2026  
**Phases Complete**: 1-6 of 10 ✅  
**Status**: Ready for Backend Testing

---

## 📁 Project Structure

```
pre-test/
├── 🔐 certs/                    # RSA-4096 keys for API signing
├── ⚙️ config/
│   ├── database.js              # SQLite configuration
│   ├── security.js              # HTTPS/TLS/CSP headers
│   ├── rsa-integrity.js         # RSA-4096 signing
│   └── obfuscation.js           # JavaScript minification
├── 📊 data/                      # ✅ PHASE 1
│   ├── products_catalog.json    # 15 furniture products
│   ├── qa_sft_dataset.json      # 35+ Q&A pairs for training
│   ├── system_prompts.json      # Generated AI prompts
│   └── image_analysis_results.json # (Generated)
├── 🤖 ai/                        # ✅ PHASE 2-5
│   ├── image_detector.py        # ResNet-50 CNN module
│   ├── llm_client.py            # Multi-LLM API clients
│   ├── system_prompt.py         # Dynamic prompt generation
│   └── requirements.txt         # Python dependencies
├── 🔧 backend/                   # ✅ PHASE 6
│   ├── main.go                  # Golang Fiber API
│   ├── ai_bridge.py             # Python Flask AI bridge
│   ├── go.mod                   # Go dependencies
│   ├── docker-compose.yml       # Multi-service orchestration
│   ├── Dockerfile.go            # Go container image
│   ├── Dockerfile.py            # Python container image
│   ├── Makefile                 # Development commands
│   ├── .env.example             # Configuration template
│   └── API_DOCUMENTATION.md     # REST API docs
├── 👁️ views/                     # EJS templates (admin panel)
├── 📄 app.js                     # Node.js Express server
├── 📄 ROADMAP.md                # 10-phase implementation plan
├── 📄 SECURITY_IMPLEMENTATION.md # Enterprise security details
└── 📄 package.json              # Node.js dependencies
```

---

## ⚡ Quick Commands

### Python AI Module Setup

```bash
# Install Python dependencies
cd ai/
pip install -r requirements.txt

# Test image detection
python image_detector.py

# Test LLM clients
python llm_client.py

# Generate system prompts
python system_prompt.py
```

### Golang Backend Setup

```bash
# Install Go dependencies
cd backend/
go mod download
go mod verify

# Run Golang Fiber API
go run main.go

# Run Flask AI Bridge
python ai_bridge.py
```

### Full Stack (Local Development)

```bash
# Terminal 1: Golang API
cd backend && go run main.go
# Output: 🚀 Starting Golang Fiber server on port 3001

# Terminal 2: Python Flask AI
cd backend && python ai_bridge.py
# Output: 🚀 Starting Flask AI Bridge on port 5000

# Terminal 3: Node.js Admin Panel
npm start
# Output: ✅ Server running on http://localhost:3000
```

### Docker Full Stack

```bash
cd backend/

# Build images
docker-compose build

# Start all services
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔌 API Endpoints

### Golang Fiber (Port 3001)

| Endpoint                    | Method | Purpose                  |
| --------------------------- | ------ | ------------------------ |
| `/health`                   | GET    | Health check             |
| `/api/v1/chat`              | POST   | Send chat message        |
| `/api/v1/products/search`   | GET    | Search products          |
| `/api/v1/recommendations`   | GET    | Get recommendations      |
| `/api/v1/conversations/:id` | GET    | Get conversation history |
| `/api/v1/stats`             | GET    | Service statistics       |

### Python Flask (Port 5000)

| Endpoint                  | Method | Purpose                  |
| ------------------------- | ------ | ------------------------ |
| `/health`                 | GET    | Health check             |
| `/api/v1/chat`            | POST   | Chat with streaming      |
| `/api/v1/recommendations` | POST   | AI recommendations       |
| `/api/v1/image-analysis`  | POST   | Analyze furniture images |
| `/api/v1/product-search`  | GET    | Search product catalog   |
| `/api/v1/comparison`      | POST   | Compare products         |
| `/api/v1/providers`       | GET    | List available LLMs      |

### Node.js Admin (Port 3000)

| Path              | Purpose            |
| ----------------- | ------------------ |
| `/`               | Dashboard          |
| `/admin`          | Admin panel        |
| `/admin/products` | Product management |

---

## 🔑 Configuration

### Environment Variables

Create `backend/.env`:

```bash
# Golang Fiber
FIBER_PORT=3001
FIBER_ENV=development

# Python Flask
FLASK_PORT=5000
FLASK_DEBUG=true

# LLM Provider (primary)
PRIMARY_LLM=deepseek  # Options: gemini, deepseek, openai

# API Keys (required for AI)
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xionco_furniture
```

See `backend/.env.example` for all options.

---

## 🧪 Testing APIs

### Test Health Checks

```bash
# Golang
curl http://localhost:3001/health | jq .

# Python Flask
curl http://localhost:5000/health | jq .
```

### Test Chat Endpoint

```bash
curl -X POST http://localhost:3001/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sofa apa untuk ruang tamu modern?",
    "user_id": "test_user"
  }'
```

### Test Product Search

```bash
curl "http://localhost:3001/api/v1/products/search?q=sofa&max_price=5000000" | jq .
```

### Test AI Recommendations

```bash
curl -X POST http://localhost:5000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 5000000,
    "style": "modern",
    "room": "living_room"
  }' | jq .
```

---

## 📊 Data Overview

### Product Catalog (15 Items)

- **Price Range**: Rp 800K - Rp 6.8M
- **Categories**: Sofa, Kursi, Meja, Lemari, Tempat Tidur, Rak, Lighting, Accessories
- **Features**: Material specs, dimensions, capacity, keywords

### Q&A Training Dataset (35+ Pairs)

- **Categories**: Recommendations, Pricing, Specs, Maintenance, Installation
- **Language**: Bahasa Indonesia
- **SFT Ready**: Yes (for fine-tuning small models)

### System Prompts (3 Types)

1. **Base**: Standard furniture sales assistant
2. **QA Training**: Instruction-following format
3. **Safety**: Prompt injection defense

---

## 🔒 Security Features

✅ **Already Implemented**:

- HTTPS + TLS 1.3
- RSA-4096 API signing
- Content Security Policy (CSP)
- JavaScript obfuscation
- HSTS headers (1 year)
- HTTP→HTTPS redirect

🚨 **To Implement**:

- Rate limiting (express-rate-limit)
- Input validation
- Prompt injection detection
- CORS configuration
- Database encryption

See `SECURITY_IMPLEMENTATION.md` for details.

---

## 📈 Performance Targets

| Component        | Target | Status           |
| ---------------- | ------ | ---------------- |
| API Response     | <200ms | 🔄 Testing       |
| LLM Response     | <5s    | 🔄 Testing       |
| Image Processing | <2s    | 🔄 Testing       |
| DB Query         | <100ms | ⏳ After Phase 7 |

---

## 🔗 Phase Dependencies

```
Phase 1: Data Collection ✅
    ↓
Phase 2-5: AI Modules ✅
    ↓
Phase 6: Backend APIs ✅
    ↓
Phase 7: Golang↔Python Bridge 🔄 (IN PROGRESS)
    ↓
Phase 8: React Chat UI ⏳
    ↓
Phase 9: Security Testing ⏳
    ↓
Phase 10: Docker Deploy ⏳
```

---

## 🐛 Troubleshooting

### Python Modules Not Found

```bash
cd ai/
pip install -r requirements.txt --upgrade
```

### Golang Build Error

```bash
go clean -cache
go mod tidy
go build
```

### CORS Issues

Update `ALLOWED_ORIGINS` in `.env`:

```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### LLM API Errors

Check:

1. API keys in `.env` are valid
2. Internet connection available
3. API quota not exceeded
4. Correct provider selected

### Rate Limit Hit

- Default: 100 requests / 15 minutes per IP
- Response includes `retry_after` header

---

## 📚 Documentation

- **[ROADMAP.md](ROADMAP.md)** - 10-phase plan
- **[SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md)** - Security details
- **[backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - API specs
- **[Dockerfile](backend/Dockerfile.go)** - Container setup

---

## 🎯 Next Steps

### Week 2 (Phase 7)

1. **HTTP Bridge**: Connect Golang → Python Flask
2. **Request Forwarding**: /api/v1/chat → Flask /api/v1/chat
3. **Response Mapping**: Format Flask responses for Golang

### Week 3 (Phase 8)

1. **React Component**: Chat UI with streaming
2. **Integration**: Connect React → Golang API
3. **Message History**: Store and display conversations

### Week 4 (Phase 9-10)

1. **Security Testing**: Prompt injection attempts
2. **Docker Build**: Create production images
3. **Deployment**: Push to cloud provider

---

## 📞 Support

**Key Files for Reference**:

- `ROADMAP.md` - Full 10-phase plan
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/Makefile` - Development commands
- `backend/.env.example` - Configuration options

**Current Blockers**: None ✅

**Ready to Proceed**: Yes ✅

---

**Generated**: January 6, 2026  
**Total Lines of Code**: 2000+  
**Project Status**: On Track 🚀
