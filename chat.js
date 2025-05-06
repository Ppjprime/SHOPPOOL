class ChatSystem {
    constructor() {
        this.chatButton = document.getElementById('chatButton');
        this.chatBox = document.getElementById('chatBox');
        this.closeChat = document.getElementById('closeChat');
        this.chatInput = document.getElementById('chatInput');
        this.sendMessage = document.getElementById('sendMessage');
        this.chatMessages = document.getElementById('chatMessages');
        this.notificationBadge = document.getElementById('chatNotification');
        
        this.database = firebase.database();
        this.auth = firebase.auth();
        this.chatRef = this.database.ref('chats');
        this.supportRef = this.database.ref('support_status');
        
        this.currentUser = null;
        this.chatId = null;
        this.supportAgent = null;
        
        this.initializeEventListeners();
        this.initializeAuth();
    }

    initializeAuth() {
        // Sign in anonymously for guest users
        this.auth.signInAnonymously()
            .then((userCredential) => {
                this.currentUser = userCredential.user;
                this.setupUserChat();
            })
            .catch((error) => {
                console.error("Auth error:", error);
            });
    }

    setupUserChat() {
        // Create or get existing chat session
        this.chatId = localStorage.getItem('chatId');
        if (!this.chatId) {
            this.chatId = this.chatRef.push().key;
            localStorage.setItem('chatId', this.chatId);
        }

        // Listen for chat messages
        this.chatRef.child(this.chatId).child('messages').on('child_added', (snapshot) => {
            const message = snapshot.val();
            this.displayMessage(message);
        });

        // Listen for support agent assignment
        this.chatRef.child(this.chatId).child('agent').on('value', (snapshot) => {
            this.supportAgent = snapshot.val();
            if (this.supportAgent) {
                this.updateAgentStatus(true);
            }
        });
    }

    initializeEventListeners() {
        // Toggle chat box
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeChat.addEventListener('click', () => this.closeChat());

        // Message input handlers
        this.chatInput.addEventListener('input', () => this.adjustInputHeight());
        this.chatInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.sendMessage.addEventListener('click', () => this.sendUserMessage());

        // Online/Offline detection
        window.addEventListener('online', () => this.updateConnectionStatus(true));
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }

    toggleChat() {
        const isVisible = this.chatBox.style.display === 'flex';
        this.chatBox.style.display = isVisible ? 'none' : 'flex';
        this.notificationBadge.style.display = 'none';
        
        if (!isVisible) {
            this.chatInput.focus();
            this.markMessagesAsRead();
        }
    }

    closeChat() {
        this.chatBox.style.display = 'none';
    }

    adjustInputHeight() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = (this.chatInput.scrollHeight) + 'px';
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendUserMessage();
        }
    }

    async sendUserMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        try {
            await this.chatRef.child(this.chatId).child('messages').push({
                text: message,
                sender: this.currentUser.uid,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                type: 'user'
            });

            // Clear input
            this.chatInput.value = '';
            this.adjustInputHeight();

            // Notify support about new message
            this.notifySupport();
        } catch (error) {
            console.error("Error sending message:", error);
            this.showError("Failed to send message. Please try again.");
        }
    }

    displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        const avatar = message.type === 'support' ? 
            '<i class="fas fa-headset"></i>' : 
            '<i class="fas fa-user"></i>';

        const time = new Date(message.timestamp).toLocaleTimeString();

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                <div class="message-name">${message.type === 'support' ? 'Support Agent' : 'You'}</div>
                <div class="message-text">${this.formatMessage(message.text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        // Convert emojis
        text = text.replace(/:\)|😊/g, '😊')
                   .replace(/:\(/g, '😞')
                   .replace(/<3/g, '❤️');
        return text;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateAgentStatus(isOnline) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (isOnline) {
            statusIndicator.style.backgroundColor = '#2ecc71';
            statusText.textContent = 'Support Online';
        } else {
            statusIndicator.style.backgroundColor = '#95a5a6';
            statusText.textContent = 'Support Offline';
        }
    }

    updateConnectionStatus(isOnline) {
        if (!isOnline) {
            this.showError("Connection lost. Trying to reconnect...");
        } else {
            this.removeError();
        }
    }

    notifySupport() {
        // Update the chat status to need attention
        this.chatRef.child(this.chatId).update({
            needsAttention: true,
            lastActivity: firebase.database.ServerValue.TIMESTAMP
        });
    }

    markMessagesAsRead() {
        this.chatRef.child(this.chatId).update({
            unreadCount: 0
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-error';
        errorDiv.textContent = message;
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }

    removeError() {
        const errors = this.chatMessages.getElementsByClassName('chat-error');
        while (errors.length > 0) {
            errors[0].remove();
        }
    }
}

// Initialize chat when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const chat = new ChatSystem();
}); 