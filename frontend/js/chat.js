// Chat Widget JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.getElementById('chat-widget');
    const chatBtn = document.getElementById('chat-with-agent');
    const closeBtn = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    
    // Generate unique session ID for this customer
    const sessionId = localStorage.getItem('chat-session-id') || 'customer-' + Date.now();
    localStorage.setItem('chat-session-id', sessionId);
    
    // Open/close chat
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            chatWidget.classList.toggle('active');
            loadMessages();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }
    
    // Send message
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add message to chat
        addMessageToChat(message, 'customer');
        chatInput.value = '';
        
        // Send to server
        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: message,
                    sender: 'customer',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) throw new Error('Failed to send message');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    
    // Load messages function
    async function loadMessages() {
        try {
            const response = await fetch(`/api/messages/${sessionId}`);
            if (!response.ok) throw new Error('Failed to load messages');
            
            const data = await response.json();
            const currentMessages = chatMessages.querySelectorAll('.message-bubble p');
            const lastDisplayedMsg = currentMessages.length > 0 ? 
                currentMessages[currentMessages.length - 1].textContent : null;
            
            if (data.messages && data.messages.length > 0) {
                // Only add new messages that aren't already displayed
                data.messages.forEach((msg, index) => {
                    // Check if message already exists
                    const existingMsgs = Array.from(chatMessages.querySelectorAll('.message-bubble p'))
                        .map(p => p.textContent);
                    
                    if (!existingMsgs.includes(msg.message)) {
                        addMessageToChat(msg.message, msg.sender, true);
                    }
                });
            } else if (chatMessages.innerHTML === '') {
                chatMessages.innerHTML = '<div class="welcome-message"><p>👋 Welcome! How can we help you?</p></div>';
            }
            
            // Scroll to bottom
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    // Add message to chat UI
    function addMessageToChat(text, sender, isHistoric = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}-message`;
        messageEl.innerHTML = `
            <div class="message-bubble">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Escape HTML function
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Poll for new messages every 3 seconds
    setInterval(() => {
        if (chatWidget.classList.contains('active')) {
            fetch(`/api/messages/${sessionId}`)
                .then(r => r.json())
                .then(data => {
                    if (data.messages) {
                        // Check for new agent messages
                        const existingMsgs = Array.from(chatMessages.querySelectorAll('.message-bubble p'))
                            .map(p => p.textContent);
                        
                        data.messages.forEach(msg => {
                            if (!existingMsgs.includes(msg.message)) {
                                addMessageToChat(msg.message, msg.sender);
                            }
                        });
                        
                        // Scroll to bottom
                        setTimeout(() => {
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 100);
                    }
                })
                .catch(e => console.error('Poll error:', e));
        }
    }, 3000);
});
