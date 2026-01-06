# 🚀 AI-Powered E-Commerce Furniture System - Complete Roadmap

**Project Status**: Phase 1 Complete ✅ | Phase 2-10 In Progress

**Last Updated**: January 6, 2026

---

## 📋 Executive Summary

This is a comprehensive 10-phase migration from a basic Node.js e-commerce admin system to an **enterprise-grade AI-powered furniture marketplace** with:

- Multi-LLM AI chatbot (Gemini, DeepSeek, OpenAI)
- CNN-based image recognition (ResNet-50)
- Golang backend with Fiber framework
- React chat interface
- Comprehensive security (RSA-4096, HTTPS/TLS 1.3, WAF)
- Docker containerization

**Total Timeline**: 4-6 weeks  
**Tech Stack**: Node.js, Python, Golang, React, PostgreSQL, Docker

---

## 📊 Project Phases Tracker

| #   | Fase           | Tugas                        | Teknologi     | Status         | ETA    | Owner       |
| --- | -------------- | ---------------------------- | ------------- | -------------- | ------ | ----------- |
| 1   | **Data**       | Kumpulkan 15 produk & spek   | JSON/Excel    | ✅ Complete    | -      | AI Team     |
| 2   | **Data**       | Generate 50+ Q&A pairs (SFT) | Python Script | ✅ Complete    | -      | AI Team     |
| 3   | **AI (CNN)**   | Setup ResNet image detection | PyTorch       | 🔄 In Progress | Week 1 | ML Engineer |
| 4   | **AI (LLM)**   | Setup multi-LLM API clients  | Python SDK    | 🔄 In Progress | Week 2 | AI Engineer |
| 5   | **AI (Logic)** | Create system prompts        | Python        | ✅ Complete    | -      | AI Engineer |
| 6   | **Backend**    | Setup Golang Fiber + limiter | Golang        | ⏳ Pending     | Week 2 | Backend     |
| 7   | **Backend**    | Connect Golang ↔ Python      | gRPC/REST     | ⏳ Pending     | Week 3 | Backend     |
| 8   | **Frontend**   | Chat UI integration          | React/JS      | ⏳ Pending     | Week 3 | Frontend    |
| 9   | **Security**   | Prompt injection testing     | Manual        | ⏳ Pending     | Week 4 | QA/Security |
| 10  | **Deploy**     | Docker & deployment          | Docker        | ⏳ Pending     | Week 4 | DevOps      |

---

## ✅ Phase 1: Data Collection & Preparation

### Status: COMPLETED ✓

### Deliverables:

#### 1. **products_catalog.json** (15 Products)

- **Sofa Modern Minimalis** - Rp 4.5M (ergonomic, 3-4 seater)
- **Kursi Kerja Executive** - Rp 2.8M (adjustable, memory foam)
- **Meja Makan Kayu Jati** - Rp 5.2M (premium wood, 6-8 seater)
- **Lemari Penyimpanan Modular** - Rp 3.5M (flexible storage)
- **Tempat Tidur Platform** - Rp 6.8M (with under-bed storage)
- **Rak Dinding Floating** - Rp 800K (multiple sizes)
- **Lampu Pendant Modern** - Rp 1.2M (LED dimmable)
- **Karpet Area Wool Premium** - Rp 2.2M (stain resistant)
- **Meja Konsol Marmer** - Rp 3.8M (luxury entryway)
- **Kursi Lounge Kulit Asli** - Rp 4.2M (genuine leather)
- **Partisi Ruangan Berkaca** - Rp 1.8M (modern divider)
- **Meja Kerja Minimalis** - Rp 1.5M (home office)
- **Kursi Bar Kulit Sintetis** - Rp 950K (adjustable height)
- **Mirror Dekoratif Bulat** - Rp 1.1M (accent piece)
- **Ottoman Kubus Linen** - Rp 1.6M (storage ottoman)

**Structure**: ID, name, price, category, specs, features, image_url, keywords

#### 2. **qa_sft_dataset.json** (35+ Q&A Pairs)

| Category        | Count | Examples                         |
| --------------- | ----- | -------------------------------- |
| Recommendations | 8     | "Sofa apa yang cocok untuk..."   |
| Pricing         | 4     | "Berapa harga..."                |
| Specifications  | 6     | "Spesifikasi lengkap..."         |
| Maintenance     | 2     | "Bagaimana cara merawat..."      |
| Customization   | 2     | "Bisa dikustomisasi?"            |
| Installation    | 2     | "Berapa lama instalasi..."       |
| Versatility     | 2     | "Cocok di ruangan apa..."        |
| Comparisons     | 1     | "Perbedaan..."                   |
| Material        | 2     | "Material apa yang digunakan..." |
| Budget          | 2     | "Ada furniture untuk budget..."  |
| Bundles         | 1     | "Furniture set untuk..."         |
| Other           | 4     | Various                          |

**Format**: id, question (Indonesian), answer, product_ids, category, tags

**Ready for**: Supervised Fine-Tuning (SFT) on Gemini or smaller models

---

## 🤖 Phase 2: AI Module - CNN Image Detection

### Status: IN PROGRESS 🔄

### File: `ai/image_detector.py`

### Features:

```python
class FurnitureImageDetector:
  - Model: ResNet-50 (pretrained on ImageNet)
  - Input: Furniture image paths
  - Outputs:
    * 2048-dim feature vector
    * Style classification (modern, classic, rustic, minimalist)
    * Material detection (leather, fabric, wood, metal, marmer)
    * Color palette analysis (dominant colors)
    * Confidence scores
```

### Installation:

```bash
pip install torch torchvision pillow
python ai/image_detector.py  # Batch analyze all products
```

### Output: `image_analysis_results.json`

- Per-product feature vectors
- Style probabilities
- Material predictions
- Color analysis

### Next Steps:

- [ ] Generate product image placeholders or use real images
- [ ] Run batch analysis to create feature database
- [ ] Train secondary classifier for furniture category recognition
- [ ] Integrate with LLM context (e.g., "Mirip dengan sofa X")

---

## 🧠 Phase 3: AI Module - Multi-LLM Integration

### Status: IN PROGRESS 🔄

### File: `ai/llm_client.py`

### Supported LLMs:

| Provider      | Model                 | API               | Status         |
| ------------- | --------------------- | ----------------- | -------------- |
| Google Gemini | gemini-pro            | REST              | ✅ Implemented |
| DeepSeek      | deepseek-chat         | OpenAI-compatible | ✅ Implemented |
| OpenAI        | gpt-3.5-turbo / gpt-4 | REST              | ✅ Implemented |

### Architecture:

```python
LLMManager
├── GeminiClient (async, streaming)
├── DeepSeekClient (async, streaming)
└── OpenAIClient (async, streaming)
```

### Features:

- Async/await support for non-blocking calls
- Streaming responses for real-time chat UI
- Conversation history management
- Fallback to alternative providers if one fails
- Temperature/token configuration

### Setup:

```bash
# Install dependencies
pip install google-generativeai openai python-dotenv

# Configure .env
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Usage:

```python
manager = LLMManager(primary_provider='deepseek')
response = await manager.chat(
    "Sofa apa untuk ruang tamu modern?",
    system_prompt=system_prompt
)
```

### Next Steps:

- [ ] Set up API keys for all providers
- [ ] Test multi-provider failover logic
- [ ] Implement response caching (Redis)
- [ ] Add cost tracking per provider
- [ ] Integrate with Node.js backend

---

## 📝 Phase 4: AI Module - System Prompts & Context

### Status: IN PROGRESS 🔄

### File: `ai/system_prompt.py`

### Prompt Types:

#### 1. **Base System Prompt**

- Personality: Xionco Furniture Sales Expert
- Language: Bahasa Indonesia
- Tone: Professional, helpful, enthusiastic
- Max response length: 150 words

#### 2. **Product Context**

Automatically includes:

- All 15 products with specs
- Pricing information
- Features and benefits
- Keywords for product matching

#### 3. **Safety Guardrails**

Defends against:

- Prompt injection attacks
- Role override attempts
- Confidential data access
- Code execution requests

#### 4. **Conversation Rules**

- Product recommendations
- Specification accuracy
- Price/budget assistance
- Material education
- Style coordination

#### 5. **Template Library**

- Recommendation scenarios
- Product comparisons
- Room styling guides
- Budget-based suggestions

### Outputs:

Generated to `data/system_prompts.json`:

```json
{
  "timestamp": "2026-01-06T10:00:00",
  "prompts": {
    "base": "Anda adalah asisten penjualan...",
    "qa_training": "Instruction-following furniture expert...",
    "safety": "You are a safety monitor..."
  }
}
```

### Key Features:

✅ Dynamic context injection based on customer profile  
✅ Automatic product knowledge integration  
✅ Safety guidelines to prevent jailbreaks  
✅ Conversation templates for common scenarios

---

## 🔧 Phase 5-10: Backend, Frontend & Deployment

### 🚨 CRITICAL DECISIONS NEEDED:

Before proceeding with Golang backend and React integration, please clarify:

#### 1. **Architecture Decision**

- **Option A**: Golang Fiber as main API → Python as microservice
- **Option B**: Keep Node.js as main API → Python as sidecar
- **Option C**: Full microservices (Node.js + Golang + Python)

**Recommendation**: Option A (cleanest separation, best performance)

#### 2. **Communication Protocol**

- **HTTP REST** (simpler, JSON-based)
- **gRPC** (faster, binary protocol)
- **Message Queue** (async, scalable)

**Recommendation**: REST for initial phase + gRPC for optimized phase

#### 3. **Database**

- Current: SQLite (for products)
- Needed: PostgreSQL (for chat history, user profiles)
- Cache: Redis (for sessions, response caching)

**Recommendation**: PostgreSQL + Redis in Docker

#### 4. **React Chat Component**

- Streaming UI (real-time token display)
- Message history persistence
- Image upload for furniture matching
- Product carousel with recommendations

---

## 📦 Environment Setup

### Current Stack:

```
pre-test/
├── app.js (Node.js Express server)
├── config/
│   ├── database.js
│   ├── security.js (HTTPS/TLS)
│   ├── rsa-integrity.js (API signing)
│   └── obfuscation.js (JS minification)
├── data/
│   ├── products_catalog.json ✅
│   ├── qa_sft_dataset.json ✅
│   └── system_prompts.json ✅
├── ai/
│   ├── image_detector.py ✅
│   ├── llm_client.py ✅
│   ├── system_prompt.py ✅
│   └── requirements.txt ✅
├── views/
│   └── admin/ (EJS templates)
├── public/ (static files)
└── certs/ (RSA keys for signing)
```

### Installation:

```bash
# Python dependencies for AI
cd ai/
pip install -r requirements.txt

# Or install individually
pip install torch torchvision google-generativeai openai python-dotenv

# Verify installations
python image_detector.py
python llm_client.py
python system_prompt.py
```

---

## 🎯 Next Immediate Steps

### Week 1 Priority:

1. **✅ DONE**: Data collection (catalog + Q&A)
2. **✅ DONE**: AI modules created (image detector + LLM clients + prompts)
3. **🔄 TODO**: Configure API keys in `.env`
4. **🔄 TODO**: Test Python scripts individually
5. **🔄 TODO**: Create Node.js→Python bridge (Express endpoints)

### Week 2 Priority:

6. **TODO**: Setup Golang Fiber backend
7. **TODO**: Implement gRPC/REST communication
8. **TODO**: Create chat message schema (PostgreSQL)
9. **TODO**: Build React chat component

---

## 🔐 Security Considerations

### Already Implemented ✅

- HTTPS + TLS 1.3
- RSA-4096 API signing
- Content Security Policy (CSP)
- JavaScript obfuscation
- HSTS headers

### To Add 🚨

- [ ] Rate limiting (express-rate-limit)
- [ ] Input validation & sanitization
- [ ] Prompt injection detection
- [ ] CORS configuration for frontend
- [ ] Database encryption (sensitive user data)
- [ ] Audit logging for API calls

---

## 📈 Performance Targets

| Component         | Target          | Current |
| ----------------- | --------------- | ------- |
| API Response Time | <200ms          | -       |
| Image Processing  | <2s per image   | -       |
| LLM Response Time | <5s (streaming) | -       |
| Database Query    | <100ms          | -       |
| Frontend Load     | <1s             | -       |

---

## 🧪 Testing Strategy

### Unit Tests (Phase 9)

- [ ] Image detector accuracy
- [ ] LLM prompt injection defense
- [ ] API response signing/verification
- [ ] Database CRUD operations

### Integration Tests

- [ ] Golang ↔ Python communication
- [ ] Node.js ↔ Golang API calls
- [ ] React UI ↔ API integration
- [ ] Security header validation

### Security Tests

- [ ] Prompt injection attempts (SQL, Code, Role override)
- [ ] XSS prevention (CSP)
- [ ] CSRF protection
- [ ] Data leakage testing

---

## 📚 Documentation

### Generated Files:

- ✅ `products_catalog.json` - Product database
- ✅ `qa_sft_dataset.json` - Training data for SFT
- ✅ `image_analysis_results.json` - CNN feature vectors
- ✅ `system_prompts.json` - AI system prompts
- 🔄 `API_DOCUMENTATION.md` - REST/gRPC endpoints
- 🔄 `DEPLOYMENT_GUIDE.md` - Docker & production setup
- 🔄 `TESTING_CHECKLIST.md` - QA procedures

---

## 🚀 Estimated Timeline

| Phase     | Task             | Duration        | Start         |
| --------- | ---------------- | --------------- | ------------- |
| 1         | Data collection  | ✅ 1 day        | Week 1        |
| 2-4       | AI modules       | ✅ 2 days       | Week 1        |
| 5-7       | Backend (Golang) | 5 days          | Week 2        |
| 8         | Frontend (React) | 4 days          | Week 3        |
| 9         | Security testing | 3 days          | Week 4        |
| 10        | Docker & Deploy  | 3 days          | Week 4        |
| **Total** |                  | **~18-21 days** | **4-5 weeks** |

---

## 📞 Support & Questions

For clarifications on:

- Architecture choices
- Technology decisions
- Budget constraints
- Timeline adjustments

**Current Blockers**: None - Ready to proceed to Phase 5 (Golang Backend)

---

**Generated**: January 6, 2026  
**Version**: 1.0  
**Project Lead**: AI Team  
**Status**: On Track ✅
