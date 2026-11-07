// test/echo.test.js
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8081;
let server;

async function connect(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      const ws = new WebSocket(`ws://localhost:${PORT}`);
      await new Promise((resolve, reject) => {
        ws.once('open', resolve);
        ws.once('error', reject);
      });
      return ws;
    } catch {
      await sleep(100);
    }
  }
  throw new Error('Server did not start in time');
}

before(() => {
  server = spawn('node', ['index.js'], { env: { ...process.env, PORT } });
});

after(() => server.kill());

test('Server echoes the same message', async () => {
  const ws = await connect();
  const reply = new Promise((resolve) => ws.once('message', (d) => resolve(d.toString())));
  ws.send('hello echo');
  assert.equal(await reply, 'Server said: hello echo');
  ws.close();
});