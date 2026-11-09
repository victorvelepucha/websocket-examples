# Webchat con Node.js + Express + ws

Chat web en tiempo real: varios navegadores se conectan al servidor y todo
mensaje que envía un usuario se difunde (*broadcast*) a todos los clientes
conectados. Está construido con [Express](https://expressjs.com) para servir la
página y [`ws`](https://github.com/websockets/ws) para los WebSockets.

Es la evolución del ejemplo [01-echo/express-ws](../../01-echo/express-ws): allí
el servidor devolvía el mensaje solo a quien lo enviaba; aquí lo reenvía a
**todos** los clientes.

## Requisitos

- Node.js 20 o superior
- npm

## Estructura

```
express-ws/
├── index.js             # Servidor Express + WebSocket
├── package.json
├── package-lock.json
└── public/
    ├── index.html       # Interfaz del chat
    ├── script.js        # Lógica del cliente
    └── style.css        # Estilos
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

1. Abre **`http://localhost:3000`** en **dos ventanas** del navegador (o en dos
   navegadores distintos).
2. En cada una escribe un nombre de usuario distinto.
3. Envía un mensaje desde una ventana: aparece en ambas, con el nombre del
   usuario y la hora.

También puedes probar la seguridad: envía el texto `<b>hola</b>` y comprueba
que se muestra literalmente, sin interpretarse como HTML (ver
[Seguridad](#seguridad)).

### Con otro cliente WebSocket

Como el servidor usa WebSockets estándar, cualquier cliente WebSocket sirve
(Postman, `wscat`, la consola del navegador). Conéctate a
`ws://localhost:3000` (sin ruta adicional) y envía un JSON:

```json
{ "username": "Ana", "text": "Hola a todos" }
```

Con Postman, crea una petición de tipo **WebSocket**, pulsa **Connect** y envía
el mensaje; recibirás la difusión con el mismo formato que ven los navegadores.

## Contrato de mensajes

Los mensajes viajan como JSON.

**Cliente → servidor**

```json
{ "username": "Ana", "text": "Hola a todos" }
```

**Servidor → todos los clientes** (incluido quien lo envió)

```json
{ "username": "Ana", "text": "Hola a todos", "timestamp": "2026-11-08T15:30:00.000Z" }
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | string | Nombre del usuario, máximo 20 caracteres |
| `text` | string | Contenido del mensaje, máximo 500 caracteres |
| `timestamp` | string | Fecha y hora en formato ISO 8601 (UTC), **la asigna el servidor** |

- La hora la pone el servidor, para que todos los clientes vean la misma. Cada
  cliente la formatea según su configuración regional.
- El servidor reenvía el mensaje también a quien lo envió: el cliente solo
  muestra lo que recibe, sin dibujar mensajes localmente.

## Cómo funciona

### Servidor (`index.js`)

1. Express sirve los archivos de `public/` en la raíz `/`.
2. Un servidor WebSocket (`ws`) se adjunta al mismo servidor HTTP, por lo que
   página y WebSocket comparten el puerto 3000.
3. Cada conexión nueva se guarda en un `Set` de clientes y se elimina al
   cerrarse o fallar.
4. Al recibir un mensaje, el servidor lo valida, le agrega la hora y lo envía a
   todos los clientes con la conexión abierta:

```javascript
clients.forEach((client) => {
  if (client.readyState === WebSocket.OPEN) client.send(payload);
});
```

### Cliente (`public/script.js`)

- Deduce la URL del WebSocket a partir de la página (`ws://` o `wss://` según el
  protocolo), por lo que funciona en cualquier puerto.
- **Reconexión automática:** si se pierde la conexión, reintenta cada 3
  segundos y deshabilita el botón de envío mientras tanto.
- Envía el mensaje con el botón **Send** o con la tecla Enter.

## Seguridad

Un chat muestra texto escrito por otros usuarios, así que este ejemplo aplica
dos reglas básicas:

- **Cliente: nunca insertar mensajes con `innerHTML`.** Se usan `textContent` y
  nodos de texto, para que un mensaje como `<img src=x onerror=alert(1)>` se
  muestre como texto y no se ejecute (evita XSS).
- **Servidor: no confiar en el cliente.** El atributo `maxlength` del HTML solo
  limita al navegador, así que el servidor comprueba que `username` y `text`
  sean cadenas, los recorta a su longitud máxima, ignora los mensajes vacíos o
  con JSON inválido, y limita el tamaño de cada mensaje con `maxPayload`.

## Limitaciones

Es un ejemplo didáctico, y por simplicidad **no** incluye:

- Persistencia: al reiniciar el servidor se pierde todo, y quien entra después
  no ve el historial.
- Autenticación: cualquiera puede usar cualquier nombre de usuario.
- Salas, mensajes privados ni lista de usuarios conectados.

## Puerto

Por defecto el servidor usa el puerto **3000**. Se puede cambiar con la variable
de entorno `PORT`:

```bash
PORT=4000 npm start
```

(En Windows PowerShell: `$env:PORT=4000; npm start`).