let ws;
let connected = false;

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const sendBtn = document.getElementById('sendBtn');
const statusConnection = document.getElementById('statusConnection');

function connect() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${location.host}`);
    
    ws.onopen = () => {
        connected = true;
        statusConnection.textContent = 'Connected';
        statusConnection.style.color = 'green';
        sendBtn.disabled = false;
    };
    
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        addMessage(msg.username, msg.text, msg.timestamp);
    };
    
    ws.onclose = () => {
        connected = false;
        statusConnection.textContent = 'Disconnected. Reconnecting...';
        statusConnection.style.color = 'red';
        sendBtn.disabled = true;
        setTimeout(connect, 3000);
    };
    
    ws.onerror = (error) => {
        console.error('Error WebSocket:', error);
    };
}

function addMessage(username, text, timestamp) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';

    const user = document.createElement('span');
    user.className = 'username';
    user.textContent = username + ': ';

    const time = document.createElement('span');
    time.className = 'timestamp';
    time.textContent = new Date(timestamp).toLocaleTimeString();

    msgDiv.append(user, text, time);   // los strings se insertan como texto, no como HTML
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    const username = usernameInput.value.trim();
    const text = messageInput.value.trim();
    
    if (!username) {
        alert('Please enter your username');
        usernameInput.focus();
        return;
    }
    
    if (!text) {
        messageInput.focus();
        return;
    }
    
    if (!connected) {
        alert('Server is disconnected. Please wait for reconnection.');
        return;
    }
    
    ws.send(JSON.stringify({ username, text }));
    messageInput.value = '';
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        messageInput.focus();
    }
});

// Initialize WebSocket connection
connect();

// Focus to the username input on page load
usernameInput.focus();