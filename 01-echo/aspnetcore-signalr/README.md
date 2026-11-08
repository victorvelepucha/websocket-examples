# Echo con ASP.NET Core SignalR

Servidor de eco construido con [SignalR](https://learn.microsoft.com/aspnet/core/signalr),
la librería de ASP.NET Core para comunicación en tiempo real. El cliente envía
un mensaje y el servidor lo devuelve al mismo cliente.

SignalR usa WebSockets como transporte preferido, y agrega funciones de más alto
nivel (hubs, grupos, reconexión). Para comparar con la versión de bajo nivel,
ver [aspnetcore-websockets](../aspnetcore-websockets).

## Requisitos

- [.NET SDK](https://dotnet.microsoft.com/download) 10 o superior

El servidor de SignalR forma parte de ASP.NET Core, que se instala junto con el
SDK, así que **no hay que instalar paquetes adicionales**.

## Estructura

```
aspnetcore-signalr/
├── Program.cs                      # Servidor y hub de SignalR
├── aspnetcore-signalr.csproj
├── appsettings.json
├── appsettings.Development.json
├── Properties/
│   └── launchSettings.json
└── wwwroot/
    ├── index.html                  # Cliente web de prueba
    └── lib/
        └── signalr.min.js          # Cliente JavaScript de SignalR
```

## Ejecución

```bash
dotnet run
```

El servidor queda escuchando en `http://localhost:3000`.

## Cómo probarlo

Abre **`http://localhost:3000`** en el navegador. La página se conecta al hub,
envía un mensaje y muestra tanto el mensaje enviado como la respuesta:

```
Sent: SignalR echo client message sent to server
Received: SignalR echo client message sent to server
```

> Un cliente WebSocket genérico (consola del navegador, Postman, wscat) **no
> sirve** contra un hub de SignalR: SignalR negocia la conexión por HTTP y usa
> su propio protocolo de mensajes. Para probarlo, usa el `index.html` incluido.

## Cómo funciona

### Servidor (`Program.cs`)

```csharp
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapHub<EchoHub>("/echo");

app.Run("http://localhost:3000");

public class EchoHub : Hub
{
    public Task SendMessage(string message) =>
        Clients.Caller.SendAsync("ReceiveMessage", message);
}
```

1. `AddSignalR()` registra los servicios de SignalR.
2. `MapHub<EchoHub>("/echo")` expone el hub en la ruta **`/echo`**.
3. `EchoHub` es el hub: el método `SendMessage` puede ser invocado por el
   cliente, y responde llamando a `ReceiveMessage` solo en el cliente que
   envió el mensaje (`Clients.Caller`).
4. `UseDefaultFiles()` y `UseStaticFiles()`, en ese orden, sirven
   `wwwroot/index.html` en la raíz.

### Cliente (`wwwroot/index.html`)

```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl('/echo')
    .build();

connection.on('ReceiveMessage', (message) => { /* mostrar */ });

connection.start().then(() => connection.invoke('SendMessage', text));
```

- `withUrl('/echo')` apunta a la ruta del hub. **Debe coincidir** con la ruta
  definida en `MapHub`. Es una URL HTTP, no `ws://`: SignalR negocia primero la
  conexión y luego elige el transporte (WebSockets si está disponible).
- `connection.on('ReceiveMessage', ...)` registra el método que el servidor
  invoca en el cliente.
- `connection.invoke('SendMessage', text)` invoca el método del hub por nombre.
  Los nombres deben coincidir con los del servidor.

## Cliente JavaScript de SignalR

A diferencia del servidor, el cliente JavaScript **no** viene con el SDK.
`wwwroot/lib/signalr.min.js` (versión 10.0.11) es una copia local descargada de
[cdnjs](https://cdnjs.com/libraries/microsoft-signalr), para que el ejemplo
funcione sin conexión a internet. La librería se distribuye con licencia MIT.

## Diferencias con WebSockets puros

| | **WebSockets** | **SignalR** |
|---|---|---|
| Nivel | Bajo: se reciben y envían mensajes en un bucle | Alto: se invocan métodos por nombre en un hub |
| Transporte | Solo WebSocket | WebSocket, con respaldo a Server-Sent Events o long polling |
| Reconexión | La programa el desarrollador | Soporte integrado en el cliente |
| Grupos y broadcast | Se administra la lista de conexiones a mano | Incluidos (`Clients.All`, `Groups`) |
| Cliente | Cualquiera (`new WebSocket`, Postman, wscat) | Requiere el cliente de SignalR |
| Ruta | `ws://localhost:3000/ws` | `http://localhost:3000/echo` |

## Puerto

El puerto 3000 está fijado en `Program.cs` con `app.Run("http://localhost:3000")`.
`Properties/launchSettings.json` usa el mismo valor.