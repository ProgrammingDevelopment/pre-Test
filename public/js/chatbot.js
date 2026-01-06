// Chatbot Functions

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message to chat
    addChatMessage(message, 'user');
    chatInput.value = '';

    // Send to server
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                addChatMessage(data.reply, 'bot');
            } else {
                addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            addChatMessage('Sorry, I encountered a connection error. Please make sure your API key is configured in .env file.', 'bot');
        });
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

// Initialize with welcome message
document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        addChatMessage('👋 Hello! I\'m an AI shopping assistant. Ask me about our products or get recommendations!', 'bot');
    }
});
