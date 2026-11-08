# Echo con ASP.NET Core

Servidor WebSocket mínimo que devuelve (hace eco de) cada mensaje que recibe,
construido con el soporte de WebSockets **integrado** en ASP.NET Core.
No requiere instalar paquetes adicionales. Incluye un cliente web simple en
`wwwroot/index.html` para probarlo.

## Requisitos

- [.NET SDK](https://dotnet.microsoft.com/download) 10 o superior

## Estructura

```
aspnetcore-websockets/
├── Program.cs                      # Servidor WebSocket
├── aspnetcore-websockets.csproj
├── appsettings.json
├── appsettings.Development.json
├── Properties/
│   └── launchSettings.json
└── wwwroot/
    └── index.html                  # Cliente web de prueba
```

## Ejecución

```bash
dotnet run
```

El servidor queda escuchando en `http://localhost:3000`.
El endpoint WebSocket está en `ws://localhost:3000/ws`.

## Cómo probarlo

### Opción 1: cliente web

Abre `http://localhost:3000` en el navegador. La página se conecta al servidor,
envía un mensaje y muestra tanto el mensaje enviado como la respuesta:

```
Sent: Echo client message sent to server
Received: Echo client message sent to server
```

> Abre la página desde `http://localhost:3000`, no haciendo doble clic sobre
> `index.html`: el cliente deduce la URL del WebSocket a partir de la
> dirección de la página.

### Opción 2: consola del navegador

Con la página abierta en `http://localhost:3000`, abre las herramientas de
desarrollo (`F12`), ve a la pestaña **Console** y ejecuta, primero:

```javascript
const client = new WebSocket('ws://localhost:3000/ws');
client.onmessage = (e) => console.log('Received:', e.data);
```

Y luego, ya con la conexión abierta, envía los mensajes que quieras:

```javascript
client.send('hola');
```

Deberías ver en la consola: `Received: hola`. Puedes enviar más mensajes con
`client.send('otro mensaje')` y cerrar la conexión con `client.close()`.

> Si el navegador no te deja pegar en la consola, escribe `allow pasting`
> y pulsa Enter, o teclea las líneas a mano. Es una protección habitual de
> Edge y Chrome.

### Opción 3: Postman

Si no lo tienes, puedes [descargarlo aquí](https://www.postman.com/downloads/).

1. Crea una nueva petición de tipo **WebSocket** (no HTTP: una petición HTTP
   normal no realiza el handshake de WebSocket).
2. Escribe la URL `ws://localhost:3000/ws` y pulsa **Connect**.
3. Cuando la conexión se establezca (estado `101 Switching Protocols`), se
   habilita el botón **Send**.
4. Escribe un mensaje y pulsa **Send**. En el historial de mensajes verás
   el mensaje enviado y la respuesta del servidor, con el mismo contenido.
   Las flechas indican la dirección de cada mensaje (enviado o recibido).
### Opción 4: línea de comandos con wscat (Requiere Node.js)

```bash
npx wscat -c ws://localhost:3000/ws
> hola
< hola
```

## Cómo funciona esta implementación en C#

1. `app.UseWebSockets()` habilita el middleware de WebSockets.
2. `app.Map("/ws", ...)` define el endpoint. Si la petición no es WebSocket,
   responde con un 400.
3. `AcceptWebSocketAsync()` convierte la petición HTTP en una conexión WebSocket.
4. Un bucle recibe cada mensaje y lo reenvía al mismo cliente, hasta que el
   cliente cierra la conexión.

### Servir `index.html` en la raíz

Para que `http://localhost:3000` muestre la página, se necesitan tres cosas:

- El archivo debe estar en la carpeta **`wwwroot`**, que es la carpeta de
  archivos estáticos por defecto en ASP.NET Core.
- Estas dos líneas en `Program.cs`, **en este orden**:

```csharp
app.UseDefaultFiles();   // convierte "/" en "/index.html"
app.UseStaticFiles();    // sirve los archivos de wwwroot
```

`UseDefaultFiles()` solo reescribe la ruta, y quien entrega el archivo es
`UseStaticFiles()`. Si se invierte el orden, la raíz devuelve un 404.

## Puerto

El puerto 3000 está fijado en `Program.cs`:

```csharp
app.Run("http://localhost:3000");
```
