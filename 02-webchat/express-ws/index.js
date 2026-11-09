const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const MAX_USERNAME = 20;
const MAX_TEXT = 500;

const wss = new WebSocket.Server({ server, maxPayload: 16 * 1024 });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Total connected clients:', clients.size);

  // dentro de wss.on('connection', ...):
  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      return;   // JSON inválido: se ignora
    }

    const username = typeof message?.username === 'string'
      ? message.username.trim().slice(0, MAX_USERNAME) : '';
    const text = typeof message?.text === 'string'
      ? message.text.trim().slice(0, MAX_TEXT) : '';
    if (!username || !text) return;

    const payload = JSON.stringify({
      username,
      text,
      timestamp: new Date().toISOString()
    });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });

  ws.on('error', (error) => {
    console.error('Error WebSocket:', error);
    clients.delete(ws);
  });
});
