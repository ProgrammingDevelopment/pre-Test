#!/usr/bin/env python3
"""
Multi-LLM API Client for Furniture E-Commerce Chatbot
Supports: Google Gemini, DeepSeek, OpenAI
"""

import os
import json
import asyncio
from typing import Optional, List, Dict, AsyncGenerator
from abc import ABC, abstractmethod
from dataclasses import dataclass
import dotenv

# Load environment variables
dotenv.load_dotenv()


@dataclass
class ChatMessage:
    """Represents a chat message"""
    role: str  # 'user' or 'assistant'
    content: str


class LLMClient(ABC):
    """Abstract base class for LLM clients"""
    
    def __init__(self, api_key: str, model_name: str = None):
        self.api_key = api_key
        self.model_name = model_name
        self.conversation_history: List[ChatMessage] = []
    
    @abstractmethod
    async def chat(self, message: str, system_prompt: str = None) -> str:
        """Send message and get response"""
        pass
    
    @abstractmethod
    async def stream_chat(self, message: str, system_prompt: str = None) -> AsyncGenerator:
        """Stream response chunks"""
        pass
    
    def add_to_history(self, role: str, content: str):
        """Add message to conversation history"""
        self.conversation_history.append(ChatMessage(role, content))
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
    
    def get_history(self) -> List[Dict]:
        """Get conversation history as dicts"""
        return [{'role': msg.role, 'content': msg.content} for msg in self.conversation_history]


class GeminiClient(LLMClient):
    """Google Gemini API Client"""
    
    def __init__(self, api_key: str = None):
        api_key = api_key or os.getenv('GEMINI_API_KEY')
        super().__init__(api_key, 'gemini-pro')
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.client = genai.GenerativeModel(self.model_name)
            print("✅ Gemini client initialized")
        except ImportError:
            print("⚠️  google-generativeai not installed: pip install google-generativeai")
            self.client = None
    
    async def chat(self, message: str, system_prompt: str = None) -> str:
        """Send message to Gemini"""
        if not self.client:
            return "❌ Gemini client not available"
        
        try:
            full_prompt = f"{system_prompt}\n\n{message}" if system_prompt else message
            response = self.client.generate_content(
                full_prompt,
                generation_config={'max_output_tokens': 500}
            )
            return response.text
        except Exception as e:
            return f"❌ Gemini error: {str(e)}"
    
    async def stream_chat(self, message: str, system_prompt: str = None) -> AsyncGenerator:
        """Stream response from Gemini"""
        if not self.client:
            yield "❌ Gemini client not available"
            return
        
        try:
            full_prompt = f"{system_prompt}\n\n{message}" if system_prompt else message
            response = self.client.generate_content(
                full_prompt,
                stream=True,
                generation_config={'max_output_tokens': 500}
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"❌ Gemini stream error: {str(e)}"


class DeepSeekClient(LLMClient):
    """DeepSeek API Client (OpenAI-compatible)"""
    
    def __init__(self, api_key: str = None):
        api_key = api_key or os.getenv('DEEPSEEK_API_KEY')
        super().__init__(api_key, 'deepseek-chat')
        
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url='https://api.deepseek.com/v1'
            )
            print("✅ DeepSeek client initialized")
        except ImportError:
            print("⚠️  openai not installed: pip install openai")
            self.client = None
    
    async def chat(self, message: str, system_prompt: str = None) -> str:
        """Send message to DeepSeek"""
        if not self.client:
            return "❌ DeepSeek client not available"
        
        try:
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            
            messages.append({'role': 'user', 'content': message})
            
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"❌ DeepSeek error: {str(e)}"
    
    async def stream_chat(self, message: str, system_prompt: str = None) -> AsyncGenerator:
        """Stream response from DeepSeek"""
        if not self.client:
            yield "❌ DeepSeek client not available"
            return
        
        try:
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            
            messages.append({'role': 'user', 'content': message})
            
            stream = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"❌ DeepSeek stream error: {str(e)}"


class OpenAIClient(LLMClient):
    """OpenAI API Client"""
    
    def __init__(self, api_key: str = None, model: str = 'gpt-3.5-turbo'):
        api_key = api_key or os.getenv('OPENAI_API_KEY')
        super().__init__(api_key, model)
        
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=self.api_key)
            print(f"✅ OpenAI client initialized ({model})")
        except ImportError:
            print("⚠️  openai not installed: pip install openai")
            self.client = None
    
    async def chat(self, message: str, system_prompt: str = None) -> str:
        """Send message to OpenAI"""
        if not self.client:
            return "❌ OpenAI client not available"
        
        try:
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            
            messages.append({'role': 'user', 'content': message})
            
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"❌ OpenAI error: {str(e)}"
    
    async def stream_chat(self, message: str, system_prompt: str = None) -> AsyncGenerator:
        """Stream response from OpenAI"""
        if not self.client:
            yield "❌ OpenAI client not available"
            return
        
        try:
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            
            messages.append({'role': 'user', 'content': message})
            
            stream = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"❌ OpenAI stream error: {str(e)}"


class LLMManager:
    """Unified LLM Manager supporting multiple providers"""
    
    def __init__(self, primary_provider: str = 'deepseek'):
        """
        Initialize LLM Manager
        
        Args:
            primary_provider: 'gemini', 'deepseek', or 'openai'
        """
        self.primary_provider = primary_provider.lower()
        self.clients = {}
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize all available clients"""
        # Gemini
        if os.getenv('GEMINI_API_KEY'):
            self.clients['gemini'] = GeminiClient()
        
        # DeepSeek
        if os.getenv('DEEPSEEK_API_KEY'):
            self.clients['deepseek'] = DeepSeekClient()
        
        # OpenAI
        if os.getenv('OPENAI_API_KEY'):
            model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
            self.clients['openai'] = OpenAIClient(model=model)
        
        if self.clients:
            print(f"✅ Initialized {len(self.clients)} LLM provider(s)")
        else:
            print("⚠️  No LLM API keys found. Set GEMINI_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY")
    
    def get_client(self, provider: str = None) -> Optional[LLMClient]:
        """Get LLM client by provider"""
        provider = provider or self.primary_provider
        return self.clients.get(provider.lower())
    
    async def chat(self, message: str, system_prompt: str = None, provider: str = None) -> str:
        """Send message using specified provider"""
        client = self.get_client(provider)
        if not client:
            return f"❌ Provider '{provider}' not available"
        
        return await client.chat(message, system_prompt)
    
    async def stream_chat(self, message: str, system_prompt: str = None, provider: str = None) -> AsyncGenerator:
        """Stream response from specified provider"""
        client = self.get_client(provider)
        if not client:
            yield f"❌ Provider '{provider}' not available"
            return
        
        async for chunk in client.stream_chat(message, system_prompt):
            yield chunk
    
    def list_providers(self) -> List[str]:
        """List available providers"""
        return list(self.clients.keys())


# Example usage
async def demo():
    """Demo usage of LLM clients"""
    manager = LLMManager(primary_provider='deepseek')
    
    print(f"\n🤖 Available providers: {manager.list_providers()}\n")
    
    # Example system prompt for furniture chatbot
    system_prompt = """Anda adalah asisten penjualan furniture premium yang berpengalaman. 
Bantu pelanggan menemukan produk furniture yang sempurna dengan memberikan rekomendasi 
berdasarkan kebutuhan, budget, dan preferensi gaya interior mereka. Selalu profesional, 
ramah, dan informatif."""
    
    # Example user message
    user_message = "Saya mencari sofa yang nyaman untuk ruang tamu modern dengan budget Rp 5 juta. Apa rekomendasi Anda?"
    
    # Get response from primary provider
    print(f"User: {user_message}\n")
    response = await manager.chat(user_message, system_prompt)
    print(f"Assistant: {response}\n")
    
    # Stream response from another provider
    print("Streaming response from OpenAI (if available):\n")
    full_response = ""
    async for chunk in manager.stream_chat(user_message, system_prompt, provider='openai'):
        print(chunk, end='', flush=True)
        full_response += chunk
    print("\n")


if __name__ == '__main__':
    asyncio.run(demo())
