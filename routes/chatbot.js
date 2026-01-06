const express = require('express');
const router = express.Router();
const axios = require('axios');

// Function to call AI API
async function callAI(message) {
    const aiService = process.env.AI_API || 'deepseek';

    try {
        if (aiService === 'deepseek') {
            const response = await axios.post('https://api.deepseek.com/chat/completions', {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful shopping assistant. Help customers with product information and purchase inquiries.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        }

        if (aiService === 'gemini') {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        }

        if (aiService === 'openai') {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful shopping assistant.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        }

        if (aiService === 'ollama') {
            const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                model: 'llama2',
                prompt: message,
                stream: false
            });

            return response.data.response;
        }

        return 'AI service not configured properly';
    } catch (error) {
        console.error('AI API Error:', error.message);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Chat endpoint
router.post('/', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    try {
        const reply = await callAI(message);
        res.json({ success: true, reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

module.exports = router;
