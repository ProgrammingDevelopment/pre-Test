package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

// ChatRequest represents incoming chat message
type ChatRequest struct {
	Message       string `json:"message" binding:"required"`
	ProductID     *int   `json:"product_id"`
	UserID        string `json:"user_id"`
	ConversationID string `json:"conversation_id"`
}

// ChatResponse represents outgoing chat response
type ChatResponse struct {
	ID            string    `json:"id"`
	Message       string    `json:"message"`
	Provider      string    `json:"provider"`
	Timestamp     time.Time `json:"timestamp"`
	Confidence    float64   `json:"confidence"`
	RelatedProducts []int   `json:"related_products"`
}

// ProductInfo represents product information
type ProductInfo struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	Price       int      `json:"price"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Features    []string `json:"features"`
}

// AIService handles communication with Python AI services
type AIService struct {
	pythonServiceURL string
}

// RateLimiter configuration
type RateLimiterConfig struct {
	MaxRequests int
	TimeWindow  time.Duration
	CleanupInterval time.Duration
}

var (
	app         *fiber.App
	aiService   *AIService
	rateLimiter map[string]*RateLimitEntry
)

// RateLimitEntry tracks rate limit state
type RateLimitEntry struct {
	Count     int
	ResetTime time.Time
}

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ .env file not found, using default config")
	}

	// Initialize rate limiter
	rateLimiter = make(map[string]*RateLimitEntry)

	// Initialize AI service with Python backend URL
	pythonURL := os.Getenv("PYTHON_SERVICE_URL")
	if pythonURL == "" {
		pythonURL = "http://localhost:5000"
	}
	aiService = &AIService{
		pythonServiceURL: pythonURL,
	}
}

// RateLimit middleware implementation
func RateLimitMiddleware(maxRequests int, timeWindow time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		clientIP := c.IP()
		now := time.Now()

		// Check and update rate limit
		if entry, exists := rateLimiter[clientIP]; exists {
			if now.Before(entry.ResetTime) {
				if entry.Count >= maxRequests {
					return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
						"error": "Rate limit exceeded",
						"retry_after": entry.ResetTime.Sub(now).Seconds(),
					})
				}
				entry.Count++
			} else {
				// Reset
				rateLimiter[clientIP] = &RateLimitEntry{
					Count:     1,
					ResetTime: now.Add(timeWindow),
				}
			}
		} else {
			// First request
			rateLimiter[clientIP] = &RateLimitEntry{
				Count:     1,
				ResetTime: now.Add(timeWindow),
			}
		}

		return c.Next()
	}
}

// Health check endpoint
func HealthCheck(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "healthy",
		"timestamp": time.Now().Unix(),
		"service": "xionco-furniture-api",
		"version": "1.0.0",
	})
}

// Chat endpoint - communicates with Python LLM service
func ChatHandler(c *fiber.Ctx) error {
	var req ChatRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	// Validate input
	if req.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Message cannot be empty",
		})
	}

	// Generate response (would call Python service in production)
	response := ChatResponse{
		ID:        fmt.Sprintf("msg_%d", time.Now().UnixNano()),
		Message:   fmt.Sprintf("Chat received: %s (processing via AI service)", req.Message),
		Provider:  "deepseek", // Default provider
		Timestamp: time.Now(),
		Confidence: 0.95,
		RelatedProducts: []int{1, 3, 5}, // Example related products
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

// Product search endpoint
func ProductSearchHandler(c *fiber.Ctx) error {
	query := c.Query("q")
	category := c.Query("category")
	maxPrice := c.Query("max_price")

	if query == "" && category == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Query or category parameter required",
		})
	}

	// Mock product search (would query database in production)
	products := []ProductInfo{
		{
			ID:          1,
			Name:        "Sofa Modern Minimalis",
			Price:       4500000,
			Category:    "Sofa",
			Description: "Sofa modern dengan desain minimalis",
			Features:    []string{"ergonomis", "mudah dibersihkan", "tahan lama"},
		},
	}

	if maxPrice != "" {
		// Filter by price (mock implementation)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"count":     len(products),
		"products":  products,
		"timestamp": time.Now().Unix(),
	})
}

// Recommendation endpoint - uses AI to suggest products
func RecommendationHandler(c *fiber.Ctx) error {
	budget := c.Query("budget")
	style := c.Query("style")
	room := c.Query("room")

	recommendations := []ProductInfo{
		{
			ID:       1,
			Name:     "Sofa Modern Minimalis",
			Price:    4500000,
			Category: "Sofa",
		},
		{
			ID:       2,
			Name:     "Kursi Kerja Executive",
			Price:    2800000,
			Category: "Kursi",
		},
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"budget":          budget,
		"style":           style,
		"room":            room,
		"recommendations": recommendations,
		"timestamp":       time.Now().Unix(),
	})
}

// Conversation history endpoint
func ConversationHistoryHandler(c *fiber.Ctx) error {
	conversationID := c.Params("id")

	// Mock conversation history (would fetch from database)
	history := []ChatResponse{
		{
			ID:        "msg_1",
			Message:   "Halo, apa yang bisa saya bantu?",
			Provider:  "deepseek",
			Timestamp: time.Now().Add(-5 * time.Minute),
		},
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"conversation_id": conversationID,
		"messages":        history,
		"count":           len(history),
	})
}

// Statistics endpoint
func StatsHandler(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"total_chats": 1234,
		"active_users": 45,
		"avg_response_time": "1.2s",
		"uptime_hours": 168,
		"timestamp": time.Now().Unix(),
	})
}

// Security headers middleware
func SecurityHeadersMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-XSS-Protection", "1; mode=block")
		c.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")
		return c.Next()
	}
}

func main() {
	// Initialize Fiber app
	app = fiber.New(fiber.Config{
		AppName:      "Xionco Furniture AI API",
		ServerHeader: "Fiber/v2 + Golang",
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(SecurityHeadersMiddleware())
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("ALLOWED_ORIGINS"),
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Content-Type,Authorization",
	}))

	// Rate limiter: 100 requests per 15 minutes per IP
	chatLimiter := RateLimitMiddleware(100, 15*time.Minute)

	// Routes
	app.Get("/health", HealthCheck)

	// Chat API
	api := app.Group("/api/v1")
	{
		api.Post("/chat", chatLimiter, ChatHandler)
		api.Get("/products/search", ProductSearchHandler)
		api.Get("/recommendations", RecommendationHandler)
		api.Get("/conversations/:id", ConversationHistoryHandler)
		api.Get("/stats", StatsHandler)
	}

	// Static files (if needed)
	// app.Static("/", "./public")

	// 404 handler
	app.All("*", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
			"path":  c.Path(),
		})
	})

	// Get port from environment or use default
	port := os.Getenv("FIBER_PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("🚀 Starting Golang Fiber server on port %s\n", port)
	log.Printf("📍 Python AI Service URL: %s\n", aiService.pythonServiceURL)
	log.Printf("✅ Rate Limiting: 100 requests per 15 minutes per IP\n")

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
