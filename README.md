# GUIA PARA JSON SERVER — API DE CODERS

### JSON Server usando ES Modules

Proyecto básico usando JSON Server con:

- ES Modules (`import`)
- Rutas personalizadas
- Middleware de logs
- Validaciones en POST
- Reescritura de rutas

---

## Pasos uno a uno desde cero

---

## 1. Verificar la versión de Node

```bash
node --version
npm --version
```

Si ambos muestran un número de versión, estás listo. Si no, descarga Node desde [nodejs.org](https://nodejs.org) — elige la versión **LTS** y sigue el instalador.

---

## 2. Crear la carpeta del proyecto y entrar a ella

```bash
mkdir json-server
cd json-server
```
Puede ser desde la terminal o creando un nueva carpeta desde tu explorador de archivos.
> A partir de aquí, todos los comandos se ejecutan dentro de esta carpeta.

---

## 3. Crear el `package.json`

El `package.json` es el "documento de identidad" del proyecto. Le dice a Node.js cómo se llama, qué librerías necesita y qué comandos puedes ejecutar.

```bash
npm init -y
```

Esto lo genera automáticamente. Luego ábrelo y agrega `"type": "module"` y el script `dev` manualmente, hasta que quede así:

```json
{
  "name": "json-server",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

> `"type": "module"` hay que agregarlo a mano. Sin esta línea, Node interpreta el archivo con CommonJS (sistema antiguo) y el `import` de `server.js` daría error. Node no puede detectarlo solo porque ambos sistemas coexisten.

> `npm start` ejecuta el servidor una vez. `npm run dev` lo ejecuta con nodemon, que lo reinicia automáticamente cada vez que guardas un cambio.

---

## 4. Instalar las dependencias

```bash
npm install json-server
npm install --save-dev nodemon
```

- **json-server**: librería que convierte tu `db.json` en una API REST funcional. Sin ella no tienes servidor ni rutas.
- **nodemon**: detecta cambios en tus archivos y reinicia el servidor automáticamente. Solo se necesita en desarrollo, por eso va con `--save-dev`.

> Estos comandos añaden las dependencias al `package.json` automáticamente y crean la carpeta `node_modules/` con todo lo descargado.

> ⚠️ **No subas `node_modules/` a git.** Crea un archivo `.gitignore` en la raíz con:

```.gitignore
node_modules/
```

---

## 5. Crear los archivos del proyecto

```bash
touch server.js
touch db.json
```

O créalos directamente desde VS Code (New File o Nuevo Archivo `server.js` y `db.json`). Por ahora déjalos vacíos, los vamos a llenar en los pasos siguientes.

---

## 6. Llenar el `db.json` con datos de ejemplo

```json
{
  "coders": [
    {
      "id": 1,
      "name": "Ana García",
      "language": "JavaScript",
      "active": true
    },
    {
      "id": 2,
      "name": "Luis Pérez",
      "language": "Python",
      "active": false
    },
    {
      "id": 3,
      "name": "María Torres",
      "language": "TypeScript",
      "active": true
    }
  ]
}
```

> Cada coder tiene: `id`, `name`, `language` y `active`. Puedes añadir los campos que quieras, pero mantenlos consistentes en todos los objetos.
> 

---

## Estructura del proyecto hasta aquí
Tu proyecto se debe ver de la siguiente manera si haz realizado los pasos anteriores de manera exitosa.

```
json-server/
│
├── package.json
├── package-lock.json
├── server.js
├── db.json
├── .gitignore
└── README.md
```

---

## 7. Implementar el `server.js` — Parte 1: base y middlewares

```js
import jsonServer from 'json-server'; // Trae las herramientas de json-server ( "import ... from" es la sintaxis moderna de ES Modules.)

const server = jsonServer.create();  // Crea nuestro servidor web vacío ( esto lo guardamos en "server" para registrar rutas y middlewares sobre él.)
const middlewares = jsonServer.defaults(); // Activa funciones básicas del middleware (cors, logger, no cache) Lo guardamos en "middlewares" para activarlo más adelante con server.use()
const router = jsonServer.router('db.json'); // Conecta el servidor al archivo db.json. A partir de aquí json-server sabe que ese archivo es la "base de datos" y genera automáticamente los endpoints 
const PORT = 3000; // Puerto donde el servidor va a escuchar (Guardarlo en una constante facilita cambiarlo sin editar varias lineas)

server.use(jsonServer.bodyParser); // Lee el cuerpo (body) de las peticiones POST y PUT y lo convierte en un objeto JavaScript accesible desde req.body.(va antes de los middlewares)
server.use(middlewares); // Activa los tres middlewares básicos preparados arriba: logger, cors y no-cache.

// Middleware personalizado de de logs: se ejecuta en cada petición que llega
server.use((req, res, next) => {

    // req.method → el verbo HTTP de la petición: GET, POST, PUT, DELETE...
   // req.url    → la ruta que pidieron: /coders, /coders/active, /health...
  // Ejemplo de salida en consola: GET /coders

  console.log(`${req.method} ${req.url}`);
  next();

   // next() le dice al servidor "este middleware ya terminó, pasa al siguiente".
  // Sin next(), la petición queda congelada aquí
 // y el cliente esperaría una respuesta que nunca llegaría.
});
```

> Lo que puede cambiar de proyecto a proyecto es el nombre del `db.json` y el `PORT`.

### ¿Qué es un middleware?

Una función que se ejecuta **en el camino** entre que llega la petición y que se envía la respuesta. Como los filtros del aeropuerto: tiquete → seguridad → pasaporte. Cada paso puede dejar pasar o bloquear. En código, cada middleware recibe `(req, res, next)` y llama `next()` para pasar al siguiente — si no llama `next()`, la petición queda congelada.

---
## NOTA:
### req, res y next

Estos tres parámetros aparecen en cada middleware y ruta del servidor.

| Parámetro | Qué es | Ejemplo en el código |
|---|---|---|
| `req` (request) | La petición que llegó. Contiene el método, la URL, el body y los query params. | `req.body.name`, `req.query.name`, `req.method` |
| `res` (response) | La respuesta que vas a enviar de vuelta al cliente. | `res.status(200).json({...})` |
| `next` | Función que pasa el control al siguiente middleware. Sin llamarla, la petición queda congelada. | `next()` en la validación del POST |

```js
server.use((req, res, next) => {
  console.log(req.method, req.url); // leemos la petición
  next();                           // pasamos al siguiente
});
```
---

## 8. Implementar el `server.js` — Parte 2: rutas personalizadas

Las rutas personalizadas van **antes del router automático**.( el router automatico es esto: `server.use(router)`) Si las pones después, nunca se ejecutan.

```js
// Ruta 1: health check — verifica que el servidor está vivo
server.get('/health', (req, res) => {
  // status(200) = "todo bien" | .json() convierte el objeto a JSON y lo envía
  res.status(200).json({ status: 'ok', message: 'Servidor de coders esta OK' });
});

// Ruta 2: valida el POST antes de que json-server guarde en db.json
server.post('/coders', (req, res, next) => {
  
  const { name, language } = req.body; // Desestructuración: extrae name y language de lo que el cliente envió en el body

  if (!name || !language) {
    return res.status(400).json({ error: 'name y language son obligatorios' });  // Si falta alguno, respondemos con error y cortamos la función con return
    // status(400) = "petición incorrecta" — el cliente envió datos incompletos
  }

  

  next(); // Validación superada → next() pasa el control al router automático, (que es quien realmente escribe el nuevo coder en db.json)
});

// Ruta 3: devuelve solo los coders con active: true
server.get('/coders/active', (req, res) => {

  const db = router.db;   // router.db accede a db.json directamente desde código (usa lowdb internamente)

  // .get('coders')        → agarra el arreglo del db.json
  // .filter({active:true})→ filtra solo los activos
  // .value()              → convierte el resultado a array JS normal (obligatorio al final)
  const activos = db.get('coders').filter({ active: true }).value();

  res.status(200).json(activos);
});
```

> El "router automático" es la línea `server.use(router)` que va al final. Ese `router` fue creado con `jsonServer.router('db.json')` y genera automáticamente los endpoints GET, POST, PUT, PATCH y DELETE para `/coders`. Registrarlo al final garantiza que tus rutas personalizadas tengan prioridad.

> **lowdb**: es la librería interna que usa json-server para leer y escribir `db.json`. Solo la tocas cuando accedes a `router.db` para filtrar datos manualmente, como en la ruta `/coders/active`.

---

## 9. Implementar el `server.js` — Parte 3: cierre

```js
// Ruta alternativa: /api/coders → /coders
server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

// Router automático: genera GET, POST, PUT, PATCH y DELETE para /coders.
// SIEMPRE al final de las rutas — si va antes, intercepta las rutas personalizadas y nunca se ejecutan
server.use(router);

// Levantar el servidor en el puerto indicado.
// El callback solo se ejecuta una vez cuando el servidor está listo.
server.listen(PORT, () => {
  console.log('============================');
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('============================');
  console.log(`GET  http://localhost:${PORT}/coders`);
  console.log(`GET  http://localhost:${PORT}/coders/active`);
  console.log(`POST http://localhost:${PORT}/coders`);
  console.log(`GET  http://localhost:${PORT}/health`);
});
```

**¿Para qué sirve el rewriter?**
Permite que una misma ruta funcione con dos URLs distintas sin duplicar código. La regla `'/api/*': '/$1'` le dice al servidor: si alguien pide `/api/coders`, trátalo como `/coders`. El `*` captura lo que venga después de `/api/` y `$1` lo reutiliza.

---

## Ejecución

### Instalar dependencias (si es la primera vez o si clonaste el proyecto):

```bash
npm install
```

### Ejecutar el servidor:

```bash
npm start      # producción — ejecuta una vez
npm run dev    # desarrollo — se recarga al guardar
```

---

## Probar que funciona

### 1. Abrir en el navegador

```
http://localhost:3000/coders
http://localhost:3000/coders/active
http://localhost:3000/health
```

### 2. Probar con Postman

Usa los métodos HTTP `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

> **¿Qué es Postman?**  
> Postman es una herramienta que te permite hacer peticiones HTTP (GET, POST, PUT, PATCH, DELETE) a tu servidor sin necesidad de escribir código. Es ideal para probar que tus endpoints funcionan correctamente.

 **Opción 1 — Extensión en VS Code (la que usamos en clase):**  
> 1. Abre VS Code → ve a Extensiones (`Ctrl+Shift+X`)  
> 2. Busca **Postman** e instálala  
> 3. Inicia sesión con tu cuenta de Postman (o crea una gratis)  
> 4. Haz clic en el ícono de Postman en la barra lateral  
> 5. Clic en **New HTTP Request**  
> 6. Elige el método, escribe la URL y haz clic en **Send**  

> Para un **POST**, ve a **Body → raw → JSON** y escribe:
 ```json
 {
  "name": "Pedro Perez",
  "language": "TypeScript",
  "active": true
}

 ```

> **Opción 2 — Aplicación de escritorio:**  
> Si prefieres instalarlo por separado, descárgalo en [postman.com/downloads](https://www.postman.com/downloads/). El flujo es exactamente el mismo.

> ⚠️ El servidor debe estar corriendo (`npm start` o `npm run dev`) para que Postman reciba respuesta.

---

## URL Base
Para realizar las pruebas en postman ten en cuenta las siguientes URL: 

URL BASE
```
http://localhost:3000
```

---

## Endpoints automáticos (generados por JSON Server)

| Método | URL base | Ruta | Qué hace |
|---|---|---|---|
| `GET` | `http://localhost:3000` | `/coders` | Lista todos los coders |
| `GET` | `http://localhost:3000` | `/coders/1` | Trae el coder con id 1 |
| `POST` | `http://localhost:3000` | `/coders` | Crea un nuevo coder |
| `PUT` | `http://localhost:3000` | `/coders/1` | Reemplaza el coder 1 completo |
| `PATCH` | `http://localhost:3000` | `/coders/1` | Actualiza solo los campos enviados |
| `DELETE` | `http://localhost:3000` | `/coders/1` | Elimina el coder 1 |

**EJEMPLO DE UN ENDPOINT:**

**ESTRUCTURA:** `METODO + URL BASE + RUTA`
```http
GET http://localhost:3000/coders
```

## Rutas personalizadas

| Método | Ruta base | Ruta | Qué hace |
|---|---|---|---|
| `GET` | `http://localhost:3000` | `/health` | Verifica que el servidor está vivo |
| `GET` | `http://localhost:3000` | `/coders/active` | Devuelve solo los coders con `active: true` |
| `POST` | `http://localhost:3000` | `/coders` | Crea un coder validando que vengan `name` y `language` |

### Ejemplo body para POST:

```json
{
  "name": "Pedro Perez",
  "language": "TypeScript",
  "active": true
}
```

> El `id` no hace falta enviarlo — JSON Server lo genera automáticamente.

---

## Reescritura de rutas

También puedes usar el prefijo `/api/`:

```
GET /api/coders  →  equivale a  GET /coders
```

Esto es una convención común en APIs REST — indica que estás hablando con una API, no con una página web. El resultado es idéntico, puedes usar cualquiera de las dos formas.

---

## Tecnologías utilizadas

- Node.js
- JSON Server `0.17.4`
- ES Modules
