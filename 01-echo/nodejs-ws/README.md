# Echo con Node.js + ws

Servidor WebSocket mínimo que devuelve (hace eco de) cada mensaje que recibe,
construido con la biblioteca [`ws`](https://github.com/websockets/ws).
Incluye un cliente web simple en `public/index.html` para probarlo.

## Requisitos

- Node.js 20 o superior
- npm

## Estructura

```
nodejs-ws/
├── index.js          # Servidor WebSocket
├── package.json
├── package-lock.json
└── public/
    └── index.html    # Cliente web de prueba
```

## Instalación
Las dependencias se instalan con este comando, con lo cual se vuelve a tener la carpeta node_modules
```bash
npm install
```
## Ejecución
Para producción normalmente es este comando:
```bash
npm start
```

Para ambiente de desarrollo se suele ejecutar con:
```bash
npm run dev
```

De la forma universal el comando a user es:
```bash
node index.js
```
El servidor queda escuchando en `ws://localhost:3000`.

## Pruebas

npm test

La prueba levanta el servidor en el puerto 8081, envía un mensaje y verifica
que la respuesta sea idéntica. No interfiere con `npm run dev`.

## Cómo probarlo

### Opción 1: cliente web

Abre `public/index.html` en el navegador, escribe un mensaje y envíalo.
Deberías ver el mismo mensaje devuelto por el servidor.

### Opción 2: línea de comandos con wscat

```bash
npx wscat -c ws://localhost:3000
> hola
< hola
```

## Cómo funciona

1. El cliente abre una conexión WebSocket con el servidor.
2. El servidor escucha el evento `message` de cada conexión.
3. Cuando llega un mensaje, el servidor lo reenvía al mismo cliente que lo envió.

## Configuración

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT`   | Puerto del servidor | `3000` |

## Modo desarrollo con archivo de entorno

Por defecto el servidor escucha en el puerto **3000**. El repositorio incluye un
archivo `.env.development` con un puerto alternativo (**3001**) para que puedas
probar la configuración por entorno sin crear nada.

Ejecuta el servidor cargando ese archivo y con recarga automática:

```bash
node --env-file-if-exists=.env.development --watch index.js
```

El servidor queda escuchando en `ws://localhost:3001`.

> **Nota:** `--env-file-if-exists` requiere Node.js 20.18+ o 22.9+.
> Si tu versión es anterior, usa `--env-file=.env.development` (falla si el
> archivo no existe).

### Cómo funciona

- `.env.development` contiene variables de ejemplo, **sin secretos**, y por eso
  está versionado.
- Si ejecutas `npm start` o `npm run dev`, no se carga ningún archivo de entorno
  y se usa el puerto por defecto (3000).
- Una variable definida en tu terminal tiene prioridad sobre la del archivo.
  Por ejemplo, `PORT=4000 node --env-file-if-exists=.env.development index.js`
  usa el puerto 4000.