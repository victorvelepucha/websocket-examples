# websocket-examples

Colección de ejemplos de WebSocket en distintos lenguajes y frameworks,
organizados por nivel de complejidad.

## Niveles

- **01-echo:** el servidor devuelve el mensaje que recibe.
- **02-chat:** chat con varios clientes y broadcast.
- **03-advanced:** ejemplo complejo tipo WhatsApp.

## Ejemplos disponibles

| Nivel | Stack | Carpeta |
|-------|-------|---------|
| 01-echo | Node.js + ws | [01-echo/nodejs-ws](01-echo/nodejs-ws) |
| 01-echo | Express.js + ws | [01-echo/express-ws](01-echo/express-ws) |
| 01-echo | Python + websockets | [01-echo/python-websockets](01-echo/python-websockets) |
| 01-echo | ASP.NET Core (WebSockets integrado) | [01-echo/aspnetcore-websockets](01-echo/aspnetcore-websockets) |
| 01-echo | ASP.NET Core SignalR | [01-echo/aspnetcore-signalr](01-echo/aspnetcore-signalr) |
| 01-echo | Node.js + Socket.IO | [01-echo/nodejs-socketio](01-echo/nodejs-socketio) |
| 01-echo | Python + Socket.IO | [01-echo/python-socketio](01-echo/python-socketio) |
| 02-webchat | Express.js + ws | [02-webchat/express-ws](02-webchat/express-ws) |

## Ejemplos pendientes
- **03-advanced-chat:** ejemplo complejo tipo WhatsApp.

## Fuera del alcance

El nivel `01-echo` se limita a unos pocos stacks para centrarse en el concepto:
primero WebSockets puros y luego abstracciones sobre ellos (SignalR en .NET,
Socket.IO en Node.js y Python). Lenguajes como Java, Swift, Dart o Rust no se
incluyen por ahora.

## Cómo usar este repositorio

Cada carpeta es independiente y tiene su propio README con los
requisitos y los pasos para ejecutarla.

## Licencia

MIT. Ver el archivo [LICENSE](LICENSE).