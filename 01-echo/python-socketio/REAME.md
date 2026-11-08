# Echo con Python + Socket.IO

Servidor de eco construido con [python-socketio](https://python-socketio.readthedocs.io)
y ejecutado con [Uvicorn](https://www.uvicorn.org). El cliente web envía un
mensaje y el servidor lo devuelve al mismo cliente.

Es el equivalente en Python de [nodejs-socketio](../nodejs-socketio): ambos
hablan el mismo protocolo de Socket.IO, así que **el mismo cliente web funciona
contra cualquiera de los dos servidores**.

## Requisitos

- Python 3.11 o superior (probado con Python 3.12)
- pip

## Estructura

```
python-socketio/
├── server.py            # Servidor Socket.IO (ASGI)
├── requirements.txt
└── public/
    ├── index.html       # Cliente web de prueba
    └── lib/
        └── socket.io.min.js   # Cliente JavaScript de Socket.IO
```

## Instalación y ejecución

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt

python server.py
```

Ejecuta el servidor **desde esta carpeta**: las rutas de los archivos estáticos
son relativas al directorio actual. En Windows también sirve `py server.py`.

El servidor queda escuchando en `http://localhost:3000`.

> `pip install` también instala las dependencias de las dependencias (por
> ejemplo, `python-socketio` necesita `python-engineio`). Es normal: pip las
> resuelve automáticamente.

## Cómo probarlo

Abre **`http://localhost:3000`** en el navegador. La página se conecta al
servidor, envía un mensaje y muestra tanto el mensaje enviado como la respuesta:

```
Sent: Hello from the browser to the Python Socket.IO server
Received: Hello from the browser to the Python Socket.IO server
```

En la consola del servidor verás `Client connected`, `Received from client: ...`
y, al cerrar la pestaña, `Client disconnected`.

> Un cliente WebSocket genérico (`new WebSocket`, `wscat`) **no sirve** contra un
> servidor Socket.IO: Socket.IO usa su propio protocolo sobre WebSockets. Para
> probarlo, usa el `index.html` incluido o un cliente de Socket.IO.

### Alternativa: Pruebas desde el cliente Postman

1. Crea una nueva petición de tipo **Socket.IO** (no WebSocket ni HTTP).
2. Escribe la URL `http://localhost:3000` y pulsa **Connect**.
3. En la pestaña **Events**, agrega el evento `message` y activa **Listen**.
   Postman solo muestra los eventos que estás escuchando.
4. Deja vacío el nombre del evento junto a **Send** (se usa `message` por
   defecto), escribe el texto en el editor de mensajes y pulsa **Send**.
5. En el historial verás el mensaje enviado y la respuesta del servidor.

## Cómo funciona

### Servidor (`server.py`)

```python
import socketio
import uvicorn

sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio, static_files={
    '/': 'public/index.html',
    '/lib': 'public/lib',
})

@sio.event
async def connect(sid, environ):
    print('Client connected')

@sio.event
async def message(sid, data):
    print('Received from client:', data)
    await sio.emit('message', data, to=sid)

@sio.event
async def disconnect(sid, reason=None):
    print('Client disconnected')

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=3000)
```

1. `AsyncServer` es el servidor de Socket.IO, y `ASGIApp` lo convierte en una
   aplicación ASGI que Uvicorn puede ejecutar.
2. `static_files` hace que el mismo servidor entregue `public/index.html` en la
   raíz `/` y los archivos de `public/lib` en `/lib`.
3. `@sio.event` registra un manejador cuyo **nombre de función es el nombre del
   evento**: `message` atiende el evento `message` que envía el cliente.
4. `sio.emit('message', data, to=sid)` devuelve el mensaje solo al cliente que
   lo envió.

### Cliente (`public/index.html`)

```javascript
const socket = io();

socket.on('connect', () => socket.emit('message', text));
socket.on('message', (message) => { /* mostrar */ });
```

`io()` sin argumentos se conecta al mismo origen que la página.

## Cliente JavaScript de Socket.IO

A diferencia de [nodejs-socketio](../nodejs-socketio), donde el servidor entrega
automáticamente el cliente en `/socket.io/socket.io.js`, **el servidor de Python
no lo sirve**. Por eso `public/lib/socket.io.min.js` es una copia del cliente
que se distribuye dentro del paquete `socket.io` de npm (carpeta `client-dist`).
La librería es MIT, y funciona sin conexión a internet.

> Al abrir las herramientas de desarrollo, el navegador puede mostrar un 404
> buscando el archivo `.map` del cliente. Es un archivo opcional de depuración y
> no afecta al funcionamiento.

## Diferencias con el ejemplo de Node.js

| | **nodejs-socketio** | **python-socketio** |
|---|---|---|
| Servidor HTTP | Módulo `node:http` | Uvicorn (ASGI) |
| Manejo de eventos | `socket.on('message', ...)` | `@sio.event` sobre `async def message` |
| Cliente JS | Lo sirve el servidor en `/socket.io/socket.io.js` | Copia local en `public/lib/` |
| Instalación | `npm install` | `pip install -r requirements.txt` |
| Protocolo | Socket.IO | Socket.IO (el mismo cliente sirve en ambos) |

## Puerto

El puerto 3000 está fijado en `server.py`.