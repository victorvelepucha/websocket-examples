# Echo con Node.js + Socket.IO

Servidor de eco construido con [Socket.IO](https://socket.io), una librería de
comunicación en tiempo real que usa WebSockets como transporte preferido y agrega
funciones de más alto nivel (eventos con nombre, reconexión, respaldo a otros
transportes). El cliente envía un mensaje y el servidor lo devuelve al mismo
cliente.

Para comparar con la versión de bajo nivel, ver [nodejs-ws](../nodejs-ws).

## Requisitos

- Node.js 20 o superior (probado con Node.js 26)
- npm

## Estructura

```
nodejs-socketio/
├── index.js          # Servidor HTTP + Socket.IO
├── package.json
├── package-lock.json
└── public/
    └── index.html    # Cliente web de prueba
```

## Instalación y ejecución

```bash
npm install
npm start
```

Para desarrollo, con recarga automática al guardar cambios:

```bash
npm run dev
```

El servidor queda escuchando en `http://localhost:3000`.

## Cómo probarlo

Abre **`http://localhost:3000`** en el navegador. La página se conecta al
servidor, envía un mensaje y muestra tanto el mensaje enviado como la respuesta:

```
Sent: Socket.IO echo client message sent to server
Received: Socket.IO echo client message sent to server
```

> Un cliente WebSocket genérico (`new WebSocket`, `wscat`) **no sirve** contra un
> servidor Socket.IO: Socket.IO usa su propio protocolo sobre WebSockets. Para
> probarlo, usa el `index.html` incluido o un cliente de Socket.IO.

## Cómo funciona

### Servidor (`index.js`)

1. Un servidor HTTP básico (módulo `node:http`) entrega `public/index.html` en
   la raíz `/`.
2. `new Server(httpServer)` adjunta Socket.IO a ese servidor HTTP.
3. Por cada cliente que se conecta, el servidor recibe un `socket` y registra
   los eventos que le interesan:

```javascript
io.on('connection', (socket) => {
  socket.on('message', (message) => {
    socket.emit('message', message);   // devuelve el mensaje al mismo cliente
  });
});
```

A diferencia de `ws`, donde todo llega por un único evento `message`, en
Socket.IO los mensajes viajan en **eventos con nombre**. Aquí el nombre
`message` es una elección del ejemplo, y podría ser cualquier otro (`echo`, por
ejemplo), siempre que cliente y servidor usen el mismo.

### Cliente (`public/index.html`)

```javascript
const socket = io();

socket.on('connect', () => socket.emit('message', text));
socket.on('message', (message) => { /* mostrar */ });
```

`io()` sin argumentos se conecta al mismo origen que la página, por lo que
funciona en cualquier puerto sin cambiar el código.

## Cliente de Socket.IO

El `index.html` carga `/socket.io/socket.io.js`. Ese archivo **no está en el
proyecto**: lo sirve automáticamente el servidor de Socket.IO desde el paquete
`socket.io` (carpeta `client-dist`), por lo que la versión del cliente siempre
coincide con la del servidor y no requiere conexión a internet.

##