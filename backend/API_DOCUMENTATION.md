# Xionco Furniture API Documentation

## Overview

The backend consists of two main services:

1. **Golang Fiber API** (Port 3001) - Main REST API with rate limiting
2. **Python Flask AI Bridge** (Port 5000) - AI/ML services integration

---

## Golang Fiber API (http://localhost:3001)

### Base Endpoints

#### Health Check

```
GET /health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-06T10:30:45Z",
  "service": "xionco-furniture-api",
  "version": "1.0.0"
}
```

---

## API v1 Endpoints

### 1. Chat API

#### Send Message

```
POST /api/v1/chat
Content-Type: application/json

{
  "message": "Saya mencari sofa modern untuk ruang tamu",
  "product_id": 1,
  "user_id": "user123",
  "conversation_id": "conv456"
}
```

Response:

```json
{
  "id": "msg_1704520200000",
  "message": "Saya merekomendasikan Sofa Modern Minimalis...",
  "provider": "deepseek",
  "timestamp": "2026-01-06T10:30:45Z",
  "confidence": 0.95,
  "related_products": [1, 3, 5]
}
```

**Rate Limiting**: 100 requests per 15 minutes per IP

---

### 2. Product Search

#### Search Products

```
GET /api/v1/products/search?q=sofa&category=Sofa&max_price=5000000
```

Query Parameters:

- `q` (string, optional): Search query
- `category` (string, optional): Product category
- `max_price` (integer, optional): Maximum price in IDR

Response:

```json
{
  "count": 3,
  "products": [
    {
      "id": 1,
      "name": "Sofa Modern Minimalis",
      "price": 4500000,
      "category": "Sofa",
      "description": "...",
      "features": ["ergonomis", "mudah dibersihkan"]
    }
  ]
}
```

---

### 3. Recommendations

#### Get Product Recommendations

```
GET /api/v1/recommendations?budget=5000000&style=modern&room=living_room
```

Query Parameters:

- `budget` (integer, optional): Budget in IDR
- `style` (string, optional): modern, classic, rustic, minimalist
- `room` (string, optional): Room type

Response:

```json
{
  "budget": "5000000",
  "style": "modern",
  "room": "living_room",
  "recommendations": [
    {
      "id": 1,
      "name": "Sofa Modern Minimalis",
      "price": 4500000,
      "category": "Sofa"
    }
  ]
}
```

---

### 4. Conversation History

#### Get Conversation

```
GET /api/v1/conversations/:id
```

Response:

```json
{
  "conversation_id": "conv_123",
  "messages": [
    {
      "id": "msg_1",
      "message": "Halo, apa yang bisa saya bantu?",
      "provider": "deepseek",
      "timestamp": "2026-01-06T10:25:00Z"
    }
  ],
  "count": 10
}
```

---

### 5. Statistics

#### Get Service Statistics

```
GET /api/v1/stats
```

Response:

```json
{
  "total_chats": 1234,
  "active_users": 45,
  "avg_response_time": "1.2s",
  "uptime_hours": 168
}
```

---

## Python Flask AI Bridge (http://localhost:5000)

### Base Endpoints

#### Health Check

```
GET /health
```

Response:

```json
{
  "status": "healthy",
  "service": "xionco-ai-bridge",
  "available_providers": ["deepseek", "openai"],
  "image_detection": true
}
```

---

## API v1 Endpoints

### 1. Chat (Streaming)

#### Stream Chat Response

```
POST /api/v1/chat
Content-Type: application/json

{
  "message": "Sofa apa untuk ruang tamu modern?",
  "stream": true,
  "provider": "deepseek",
  "customer_context": {
    "budget": 5000000,
    "style": "modern"
  }
}
```

Streaming Response (newline-delimited JSON):

```json
{"chunk": "Saya merekomendasikan", "token_count": 5, "is_final": false}
{"chunk": " Sofa Modern", "token_count": 10, "is_final": false}
{"chunk": " Minimalis.", "token_count": 12, "is_final": true}
```

---

### 2. Recommendations

#### Get AI Recommendations

```
POST /api/v1/recommendations
Content-Type: application/json

{
  "budget": 5000000,
  "style": "modern",
  "room": "living_room",
  "priorities": ["comfort", "durability"]
}
```

Response:

```json
{
  "recommendations": "Berdasarkan preferensi Anda, saya merekomendasikan...",
  "preferences": {...},
  "timestamp": "2026-01-06T10:30:45Z"
}
```

---

### 3. Image Analysis

#### Analyze Furniture Image

```
POST /api/v1/image-analysis
Content-Type: multipart/form-data

image: <binary image file>
```

Response:

```json
{
  "analysis": {
    "image_path": "...",
    "status": "analyzed",
    "style": {
      "modern": 0.85,
      "minimalist": 0.1,
      "classic": 0.05
    },
    "material": {
      "fabric": 0.9,
      "wood": 0.08,
      "metal": 0.02
    },
    "colors": {
      "dark": 0.45,
      "light": 0.35,
      "warm": 0.2
    }
  }
}
```

---

### 4. Product Search

#### Search Products from Catalog

```
GET /api/v1/product-search?q=sofa&category=Sofa
```

Query Parameters:

- `q`: Search query (optional)
- `category`: Product category (optional)
- `max_price`: Maximum price in IDR (optional)

---

### 5. Product Comparison

#### Compare Multiple Products

```
POST /api/v1/comparison
Content-Type: application/json

{
  "product_ids": [1, 3, 5],
  "compare_aspects": ["price", "material", "design"],
  "provider": "deepseek"
}
```

Response:

```json
{
  "comparison": "Perbandingan produk [1,3,5]...",
  "product_ids": [1, 3, 5]
}
```

---

### 6. Available Providers

#### List LLM Providers

```
GET /api/v1/providers
```

Response:

```json
{
  "available_providers": ["deepseek", "openai", "gemini"],
  "primary_provider": "deepseek"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request format",
  "details": "message field is required"
}
```

### 404 Not Found

```json
{
  "error": "Route not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "retry_after": 45.3
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

### 503 Service Unavailable

```json
{
  "error": "Image detection not enabled"
}
```

---

## Authentication

Currently, the API is open without authentication. For production:

- Add JWT token validation
- Implement API key authentication
- Use OAuth2 for user authentication

---

## Rate Limiting

**Golang Fiber**: 100 requests per 15 minutes per IP

- Applies to `/api/v1/chat` endpoint
- Returns 429 with `retry_after` header if exceeded

---

## CORS

**Allowed Origins** (configurable):

- http://localhost:3000
- http://localhost:3001
- http://localhost:3000

---

## Timeouts

- API response: 30 seconds
- Chat completion: 60 seconds
- Image processing: 120 seconds

---

## Example Workflows

### Complete Chat Workflow

1. User sends message

```bash
curl -X POST http://localhost:3001/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Rekomendasi sofa untuk ruang tamu kecil?",
    "user_id": "user123"
  }'
```

2. System processes with AI

- Python Flask receives request
- Loads system prompt with product context
- Calls DeepSeek/OpenAI/Gemini API
- Returns formatted response

3. Response with related products

```json
{
  "id": "msg_...",
  "message": "Saya merekomendasikan Sofa Modern Minimalis...",
  "related_products": [1, 2, 4]
}
```

### Search & Recommend Workflow

1. Search products

```bash
curl "http://localhost:3001/api/v1/products/search?category=Sofa&max_price=5000000"
```

2. Get AI recommendations

```bash
curl -X POST http://localhost:5000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 5000000,
    "style": "modern"
  }'
```

3. Compare products

```bash
curl -X POST http://localhost:5000/api/v1/comparison \
  -H "Content-Type: application/json" \
  -d '{"product_ids": [1, 3, 5]}'
```

---

## Monitoring

### Health Checks

Golang API:

```bash
curl http://localhost:3001/health
```

Flask AI:

```bash
curl http://localhost:5000/health
```

### Logs

- Golang: `./logs/fiber.log`
- Flask: `./logs/flask.log`
- Combined: Docker Compose logs

---

## Performance Metrics

| Endpoint                | Avg Response Time | P99   |
| ----------------------- | ----------------- | ----- |
| /api/v1/chat            | 2-5s              | 10s   |
| /api/v1/products/search | 50ms              | 200ms |
| /api/v1/recommendations | 3-7s              | 15s   |
| /api/v1/image-analysis  | 1-2s              | 5s    |

---

## Future Enhancements

- [ ] WebSocket support for real-time chat
- [ ] Message caching with Redis
- [ ] Database persistence (PostgreSQL)
- [ ] User authentication & profiles
- [ ] Conversation history retrieval
- [ ] Advanced filtering & faceted search
- [ ] Product recommendation caching
- [ ] Analytics & usage tracking

---

**API Version**: 1.0.0  
**Last Updated**: January 6, 2026  
**Status**: Development
