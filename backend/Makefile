.PHONY: help install run dev test clean docker-build docker-run

help:
	@echo "🚀 Xionco Furniture Backend - Make Commands"
	@echo "============================================"
	@echo ""
	@echo "Golang Fiber:"
	@echo "  make go-install    Install Golang dependencies"
	@echo "  make go-run        Run Golang server (port 3001)"
	@echo "  make go-dev        Run with hot reload (requires Air)"
	@echo "  make go-test       Run Go unit tests"
	@echo "  make go-build      Build Go binary"
	@echo ""
	@echo "Python Flask:"
	@echo "  make py-install    Install Python dependencies"
	@echo "  make py-run        Run Flask AI bridge (port 5000)"
	@echo "  make py-dev        Run Flask in debug mode"
	@echo "  make py-test       Run Python tests"
	@echo ""
	@echo "Full Stack:"
	@echo "  make install       Install all dependencies"
	@echo "  make run           Run both servers"
	@echo "  make dev           Run both in dev mode"
	@echo "  make test          Run all tests"
	@echo "  make clean         Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build  Build Docker images"
	@echo "  make docker-run    Run containers with docker-compose"
	@echo "  make docker-stop   Stop Docker containers"
	@echo ""

# GOLANG FIBER COMMANDS
go-install:
	cd . && go mod download && go mod verify
	@echo "✅ Golang dependencies installed"

go-run:
	go run main.go

go-dev:
	@command -v air > /dev/null || (echo "Installing Air..." && go install github.com/cosmtrek/air@latest)
	air

go-test:
	go test -v -race ./...

go-build:
	CGO_ENABLED=0 GOOS=linux go build -o xionco-api main.go
	@echo "✅ Built: xionco-api (linux-amd64)"

go-lint:
	@command -v golangci-lint > /dev/null || (echo "Installing golangci-lint..." && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest)
	golangci-lint run ./...

# PYTHON FLASK COMMANDS
py-install:
	pip install -r requirements.txt
	@echo "✅ Python dependencies installed"

py-run:
	python ai_bridge.py

py-dev:
	FLASK_DEBUG=true FLASK_ENV=development python ai_bridge.py

py-test:
	pytest -v

py-lint:
	pylint ai_bridge.py

py-format:
	black ai_bridge.py
	autopep8 --in-place ai_bridge.py

# FULL STACK
install: go-install py-install
	@echo "✅ All dependencies installed"

run:
	@echo "🚀 Starting both servers..."
	@echo "Go server: http://localhost:3001"
	@echo "Python server: http://localhost:5000"
	go run main.go & python ai_bridge.py

dev:
	@echo "🔧 Starting development servers..."
	@echo "Go server (hot reload): http://localhost:3001"
	@echo "Python server (debug): http://localhost:5000"
	@echo "Press Ctrl+C to stop"
	@(go run main.go &) && (FLASK_DEBUG=true python ai_bridge.py)

test: go-test py-test
	@echo "✅ All tests passed"

clean:
	go clean
	rm -f xionco-api xionco-api.exe
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	@echo "✅ Cleaned build artifacts"

# DOCKER COMMANDS
docker-build:
	docker-compose build
	@echo "✅ Docker images built"

docker-run:
	docker-compose up -d
	@echo "✅ Docker containers running"
	@echo "  Go API: http://localhost:3001"
	@echo "  Flask AI: http://localhost:5000"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis: localhost:6379"

docker-stop:
	docker-compose down
	@echo "✅ Docker containers stopped"

docker-logs-go:
	docker-compose logs -f golang

docker-logs-py:
	docker-compose logs -f flask

docker-logs-db:
	docker-compose logs -f postgres

# DEVELOPMENT SHORTCUTS
status:
	@echo "📊 Service Status:"
	@curl -s http://localhost:3001/health | jq . || echo "❌ Go server not running"
	@curl -s http://localhost:5000/health | jq . || echo "❌ Flask server not running"

logs:
	@echo "Golang Fiber logs:"
	@ps aux | grep "go run" | grep -v grep || echo "Not running"
	@echo ""
	@echo "Flask AI Bridge logs:"
	@ps aux | grep "python" | grep -v grep || echo "Not running"

restart: clean install run
	@echo "✅ Services restarted"

# LOCAL DEVELOPMENT
setup:
	@echo "Setting up development environment..."
	cp .env.example .env
	@echo "📝 Created .env file - please fill in API keys"
	$(MAKE) install
	@echo "✅ Setup complete!"

# CODE QUALITY
fmt:
	go fmt ./...
	black --line-length=100 *.py
	@echo "✅ Code formatted"

lint: go-lint py-lint
	@echo "✅ Linting complete"

security:
	@echo "🔒 Running security checks..."
	@command -v gosec > /dev/null || (go install github.com/securego/gosec/v2/cmd/gosec@latest)
	gosec ./...
	@echo "✅ Security checks complete"

# DATABASE
db-init:
	@echo "Initializing PostgreSQL database..."
	docker-compose exec postgres psql -U furniture_user -d xionco_furniture < ./sql/schema.sql
	@echo "✅ Database initialized"

db-migrate:
	@echo "Running migrations..."
	@echo "TODO: Implement migration script"

# UTILITIES
stats:
	@echo "📈 Code Statistics:"
	@echo "Go code:"
	@wc -l *.go
	@echo ""
	@echo "Python code:"
	@find . -name "*.py" -type f | xargs wc -l | tail -1

version:
	@echo "Go version:" && go version
	@echo "Python version:" && python --version

deps-check:
	go mod graph | head -20
	@echo ""
	pip list | head -20
