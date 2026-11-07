# Echo con Express.js + ws

Servidor WebSocket mínimo que devuelve (hace eco de) cada mensaje que recibe.
Construido con la biblioteca [`ws`](https://www.npmjs.com/package/ws).
Construido con la biblioteca [`express`] (https://www.npmjs.com/package/express).
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

