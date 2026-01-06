FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY ../ai/requirements.txt .
COPY backend/ai_bridge.py .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy data and AI modules (assuming they're in parent directory)
COPY data/ ../data/
COPY ai/ ../ai/

# Create logs directory
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["python", "ai_bridge.py"]
