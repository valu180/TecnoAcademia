# TecnoAcademia

Sitio web de la TecnoAcademia Risaralda.

## Despliegue (Firebase Hosting)

El sitio se publica con **Firebase Hosting**. La configuración vive en `firebase.json` y `.firebaserc` (proyecto `tecnoacademiarisaralda-site`).

### Requisitos

- [Node.js](https://nodejs.org/) (LTS o superior)
- Firebase CLI:

```bash
npm install -g firebase-tools
```

### Iniciar sesión (una sola vez)

```bash
firebase login
```

### Publicar cambios

```bash
firebase deploy --only hosting
```

Tras el despliegue, el sitio queda disponible en:

- https://tecnoacademiarisaralda-site.web.app

### Nota para Node 19+ (workaround temporal)

Con Node 19 o superior, la versión actual de `firebase-tools` puede fallar el
login/deploy con el mensaje `Your credentials are no longer valid` debido a un
bug de keep-alive en su dependencia interna `node-fetch@2`. Si te ocurre, crea
un archivo `no-keepalive.cjs` (ignorado por git) con:

```js
require('http').globalAgent.keepAlive = false;
require('https').globalAgent.keepAlive = false;
```

Y ejecuta los comandos de Firebase con:

```bash
# Windows (cmd)
set NODE_OPTIONS=--require ./no-keepalive.cjs

# macOS / Linux
export NODE_OPTIONS="--require ./no-keepalive.cjs"
```
