#!/usr/bin/env python3
"""
Python Flask Service - AI Backend Bridge
Connects Golang Fiber frontend to Python AI services
Handles: LLM API calls, image analysis, product recommendations
"""

from flask import Flask, request, jsonify, stream_with_context, Response
from flask_cors import CORS
import json
import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional
import sys
sys.path.insert(0, os.path.dirname(__file__))

from llm_client import LLMManager
from system_prompt import SystemPromptBuilder, PromptTemplateLibrary
from image_detector import FurnitureImageDetector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Flask app initialization
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize services
try:
    llm_manager = LLMManager(primary_provider=os.getenv('PRIMARY_LLM', 'deepseek'))
    prompt_builder = SystemPromptBuilder('data/products_catalog.json')
    image_detector = FurnitureImageDetector() if os.getenv('ENABLE_IMAGE_DETECTION', 'false').lower() == 'true' else None
    logger.info("✅ All services initialized")
except Exception as e:
    logger.error(f"❌ Initialization error: {e}")
    llm_manager = None
    prompt_builder = None
    image_detector = None


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'xionco-ai-bridge',
        'version': '1.0.0',
        'available_providers': llm_manager.list_providers() if llm_manager else [],
        'image_detection': image_detector is not None
    }), 200


@app.route('/api/v1/chat', methods=['POST'])
def chat():
    """
    Chat endpoint - processes user messages and returns AI responses
    
    Request body:
    {
        "message": "string (required)",
        "product_id": "int (optional)",
        "user_id": "string (optional)",
        "conversation_id": "string (optional)",
        "provider": "string (gemini|deepseek|openai, default: primary)",
        "stream": "boolean (default: false)"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'message field is required'}), 400
        
        user_message = data['message']
        provider = data.get('provider')
        stream = data.get('stream', False)
        customer_context = data.get('customer_context', {})
        
        # Build system prompt with context
        system_prompt = prompt_builder.build_contextual_prompt(customer_context)
        
        # Get response from LLM
        if stream:
            # Streaming response
            return Response(
                stream_response(user_message, system_prompt, provider),
                mimetype='application/json'
            )
        else:
            # Regular response
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            response_text = loop.run_until_complete(
                llm_manager.chat(user_message, system_prompt, provider)
            )
            
            return jsonify({
                'id': f"msg_{int(datetime.now().timestamp() * 1000)}",
                'message': response_text,
                'provider': provider or llm_manager.primary_provider,
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }), 200
            
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({'error': str(e)}), 500


def stream_response(message: str, system_prompt: str, provider: Optional[str] = None):
    """Stream response chunks from LLM"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def generate():
        buffer = ""
        token_count = 0
        
        async for chunk in llm_manager.stream_chat(message, system_prompt, provider):
            buffer += chunk
            token_count += 1
            
            # Send chunk every 5 tokens or at end of sentence
            if token_count % 5 == 0 or chunk in ['.', '!', '?']:
                yield json.dumps({
                    'chunk': buffer,
                    'token_count': token_count,
                    'is_final': False
                }) + '\n'
                buffer = ""
        
        # Send final chunk
        if buffer:
            yield json.dumps({
                'chunk': buffer,
                'token_count': token_count,
                'is_final': True
            }) + '\n'
    
    return loop.run_until_complete(generate())


@app.route('/api/v1/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get product recommendations based on customer preferences
    
    Request body:
    {
        "budget": "int (optional)",
        "style": "string (modern|classic|rustic|minimalist)",
        "room": "string (living room|bedroom|dining|office)",
        "priorities": ["array of strings"]
    }
    """
    try:
        data = request.get_json() or {}
        
        # Build recommendation prompt
        template = PromptTemplateLibrary.recommendation_prompt(data)
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        response = loop.run_until_complete(
            llm_manager.chat(
                "Berikan rekomendasi produk terbaik: " + json.dumps(data),
                template,
                data.get('provider')
            )
        )
        
        return jsonify({
            'recommendations': response,
            'preferences': data,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/image-analysis', methods=['POST'])
def analyze_image():
    """
    Analyze furniture image for features and style
    
    Request: multipart/form-data with 'image' file
    """
    if not image_detector:
        return jsonify({'error': 'Image detection not enabled'}), 503
    
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'image file is required'}), 400
        
        file = request.files['image']
        
        # Save temporarily
        temp_path = f"/tmp/{file.filename}"
        file.save(temp_path)
        
        # Analyze
        analysis = image_detector.analyze_image(temp_path)
        
        # Cleanup
        os.remove(temp_path)
        
        return jsonify({
            'analysis': analysis,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/product-search', methods=['GET'])
def product_search():
    """
    Search products by query or category
    
    Query params:
    - q: search query (optional)
    - category: product category (optional)
    - max_price: maximum price in IDR (optional)
    """
    try:
        query = request.args.get('q', '')
        category = request.args.get('category', '')
        max_price = request.args.get('max_price', type=int)
        
        # Load product catalog
        with open('data/products_catalog.json', 'r', encoding='utf-8') as f:
            catalog = json.load(f)
        
        products = catalog.get('products', [])
        
        # Filter products
        filtered = []
        for product in products:
            matches = True
            
            if query and query.lower() not in product['name'].lower():
                matches = False
            
            if category and product['category'].lower() != category.lower():
                matches = False
            
            if max_price and product['price'] > max_price:
                matches = False
            
            if matches:
                filtered.append(product)
        
        return jsonify({
            'count': len(filtered),
            'products': filtered,
            'query': query,
            'category': category,
            'max_price': max_price,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Product search error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/comparison', methods=['POST'])
def compare_products():
    """
    Compare multiple products
    
    Request body:
    {
        "product_ids": [1, 3, 5],
        "compare_aspects": ["price", "material", "design"]
    }
    """
    try:
        data = request.get_json()
        product_ids = data.get('product_ids', [])
        
        if not product_ids:
            return jsonify({'error': 'product_ids is required'}), 400
        
        # Build comparison prompt
        template = PromptTemplateLibrary.comparison_prompt(product_ids)
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        response = loop.run_until_complete(
            llm_manager.chat(
                f"Compare these products: {product_ids}",
                template,
                data.get('provider')
            )
        )
        
        return jsonify({
            'comparison': response,
            'product_ids': product_ids,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Comparison error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/providers', methods=['GET'])
def list_providers():
    """List available LLM providers"""
    if not llm_manager:
        return jsonify({'error': 'LLM manager not initialized'}), 503
    
    return jsonify({
        'available_providers': llm_manager.list_providers(),
        'primary_provider': llm_manager.primary_provider,
        'timestamp': datetime.now().isoformat()
    }), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    
    logger.info(f"🚀 Starting Flask AI Bridge on port {port}")
    logger.info(f"📡 Available LLM providers: {llm_manager.list_providers() if llm_manager else 'None'}")
    logger.info(f"🖼️ Image detection: {'Enabled' if image_detector else 'Disabled'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
