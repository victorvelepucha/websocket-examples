const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const webSocket = require('ws');

const hostname = '127.0.0.1'
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' || req.url.split('?')[0] !== '/') {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, html) => {
        if (err) {
            console.error('Could not read index.html:', err);
            res.writeHead(500);
            res.end('Internal server error');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    });
});

server.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});

const wss = new webSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Server said: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    ws.on('error', (error) => {
        console.error('Error WebSocket:', error);
    });
});

