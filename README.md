# GUIA PARA JSON SERVER API PARA MANEJAR CODERS

### JSON Server usando ES Modules

Proyecto básico usando JSON Server con:

- ES Modules (`import`)
- Rutas personalizadas
- Middleware
- Validaciones
- Reescritura de rutas


Pasos uno a uno de cero:
## 1. Verificar la version de Node que tengamos `node --version`

## 2. Intalar Node si no lo tenemos (aqui pasos):

Descárgalo desde [nodejs.org](https://nodejs.org) y sigue el instalador.

Una vez instalado, verifica que quedó bien:
```bash
node --version
npm --version
```
Si ambos muestran un número de versión, estás listo.

## Crear la carpeta del proyecto y entrar a ella

```bash
mkdir json-server
cd json-server
```

> A partir de aquí, todos los comandos se ejecutan dentro de esta carpeta.

## 3. Crear el archivo principal del servidor `server.js`

Desde la terminal, estando dentro de la carpeta del proyecto:

```bash
touch server.js
```

> O simplemente crea un archivo nuevo llamado `server.js` desde tu editor (VS Code → New File).
Por ahora déjalo vacío — lo vamos a llenar paso a paso más adelante.

## 4. Crear el archivo donde vamos almacenar los datos `db.json`

## 5. Necesitamos crear el archivo `package.json` este archivo lo vamos a crear en nuestro proyecto de la siguiente manera: 

El package JSON se genera automáticamente con `npm init -y` y puedes editarlo manualmente después, por ejemplo: para agregar `"type": "module"` o cambiar el nombre del proyecto. 
Cuando alguien descarga tu proyecto y corre `npm install`, Node lee este archivo y descarga todo lo que necesita.

```bash
npm init -y
```

Una vez creado el `package.json` con `npm init -y`, agrega el script `dev` manualmente.
Abre el archivo y asegúrate de que la sección `scripts` quede así:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

> `npm start` ejecuta el servidor una vez. `npm run dev` lo ejecuta con nodemon, que lo reinicia automáticamente cada vez que guardas un cambio en el código.

> El `package.json` es el "documento de identidad" del proyecto. Le dice a Node.js:
- Cómo se llama el proyecto
- Qué librerías externas necesita (dependencias)
- Qué comandos puedes ejecutar (scripts como `npm start`)

---
## 6. Instalar lo que vamos a necesitar para la creación de la API que es `json-server` y `nodemon`

Instalación de json-server:
```bash
npm install json-server
```
Instalación de nodemon(como dependencia):

```bash
npm install --save-dev nodemon

```
(instalación global)

```bash
npm install -g nodemon
```
- **json-server**: librería que convierte tu `db.json` en una API REST funcional. Sin ella no tienes servidor ni rutas. Es el núcleo del proyecto.

- **nodemon**: herramienta que detecta cambios en tus archivos y reinicia el servidor automáticamente. Sin nodemon tendrías que parar el servidor (Ctrl+C) y volver a ejecutarlo cada vez que editas el código. Solo se necesita en desarrollo.

> [!NOTE]
> Esos dos comandos añaden las dependencias al package.json automáticamente. Solo `"type": "module"` tienes que agregarlo tú a mano porque npm no tiene forma de saber que lo necesitas:

- Sin esta línea, Node interpreta los archivos como CommonJS (el sistema antiguo)
y el `import` de la primera línea de `server.js` daría error. Node no puede
detectarlo solo porque ambos sistemas coexisten — tienes que declararlo explícitamente.

>[!WARNING]
> Esto crea automáticamente la carpeta `node_modules/` con todas las librerías
descargadas. Esta carpeta puede pesar varios MB — **no la subas a git**.
Crea un archivo `.gitignore` en la raíz del proyecto con este contenido:

```.gitignore
node_modules/
```
---
## 7. Una vez creado el archivo `db.json` agregarle datos de ejemplo:

`db.json`

```bash
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

>  Cada coder tiene: id, name, language y active. Puedes añadir los campos que quieras, pero mantenlos consistentes.


# Estructura del proyecto
Para este momento tu estructura del proyecto debe verse de esta manera:

```bash
json-server/
│
├── package.json
├── server.js
├── db.json
├── package-lock.json
└── README.md
```
## 8. Implementación del Server BASE
Empieza con la estructura base:

```js
import jsonServer from 'json-server';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const PORT = 3000;

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Middleware de logs 
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
```

> cambia de proyecto en proyecto el nombre del db.json y el PORT si quieres otro.

### ¿Que es un middleware?
Un **middleware** es una función que se ejecuta en el camino entre que llega
la petición y que se envía la respuesta. Piénsalo como los filtros de un aeropuerto: primero chequean el tiquete, luego seguridad, luego el pasaporte. Cada paso puede dejar pasar o bloquear. En código, cada middleware recibe `(req, res, next)` y llama `next()` para pasar al siguiente — si no llama `next()`, la petición queda congelada.

## 9. Implementación del server RUTAS personalizadas
Añade después del middleware de logs estas 4 rutas, adaptadas para hacer peticiones a coders:
```js
// Ruta 1: health check
server.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor de coders OK' });
});

// Ruta 2: solo coders activos
server.get('/coders/active', (req, res) => {
  const db = router.db;
  const activos = db.get('coders').filter({ active: true }).value();
  res.status(200).json(activos);
});

// Ruta 3: buscar por nombre
server.get('/coders/search', (req, res) => {
  const searchName = req.query.name;
  if (!searchName) {
    return res.status(400).json({ error: 'Parámetro name requerido' });
  }
  const db = router.db;
  const results = db.get('coders')
    .filter(c => c.name.toLowerCase().includes(searchName.toLowerCase()))
    .value();
  res.status(200).json(results);
});

// Ruta 4: validar POST (name y language son obligatorios)
server.post('/coders', (req, res, next) => {
  const { name, language } = req.body;
  if (!name || !language) {
    return res.status(400).json({ error: 'name y language son obligatorios' });
  }
  next();
});
```

> [!WARNING]
>  Estas rutas van antes del router automático. Si las pones después, nunca se ejecutan.

- El "router automático" es la línea `server.use(router)` que se agrega al final del archivo. Ese `router` fue creado con `jsonServer.router('db.json')` y es quien genera automáticamente los endpoints GET, POST, PUT, PATCH y DELETE para`/coders`. Si lo registras antes que tus rutas personalizadas, él intercepta todas las peticiones primero y tus rutas nunca se ejecutan.

## 10. Implementación del server CIERRE
Añade al final de server.js el rewriter y el arranque del servidor:
```js
// Ruta alternativa /api/coders → /coders
server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

// Router automático (SIEMPRE al final)
server.use(router);

// Arrancar
server.listen(PORT, () => {
  console.log('============================');
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('============================');
  console.log(`GET http://localhost:${PORT}/coders`);
  console.log(`GET http://localhost:${PORT}/coders/active`);
  console.log(`GET http://localhost:${PORT}/coders/search?name=ana`);
  console.log(`POST http://localhost:${PORT}/coders`);
  console.log(`GET http://localhost:${PORT}/health`);
});

```
>  Tu server.js ya está completo. Ahora a instalarlo y ejecutarlo.
(para que hago el rewritter, que es lo del router automatico, un poco más de explicación sobre el )

- **¿Para qué sirve el rewriter?**
Permite que una misma ruta funcione con dos URLs distintas sin duplicar código.
La regla `'/api/*': '/$1'` le dice al servidor: "si alguien pide `/api/coders`,
trátalo internamente como `/coders`". El `*` captura lo que venga después de
`/api/` y `$1` lo reutiliza. Así tu cliente puede usar `/coders` o `/api/coders`
indistintamente.

- **¿Qué es el router automático (`server.use(router)`)?**
Es la última pieza. El `router` fue configurado al principio con
`jsonServer.router('db.json')` y tiene toda la lógica REST lista: lee el
`db.json`, genera las rutas y escribe los cambios de vuelta al archivo cuando
haces un POST, PUT o DELETE. Registrarlo al final garantiza que tus rutas
personalizadas (health, active, search, validación del POST) tengan prioridad.


## Ejecución

### Se instalan dependencias:
Esto si el proyecto ya tiene creada su `package.json` con sus dependencias.

```bash
npm install
# Lee package.json y descarga json-server + nodemon
# Crea la carpeta node_modules automáticamente
```
### Ejecutar el servidor:
```bash
npm start   # para producción
npm run dev # para desarrollo (se recarga al guardar)
```
### Probar que funciona 

1. Abrir en el navegador
```bash
# Abre en el navegador:
http://localhost:3001/coders
http://localhost:3001/coders/active
http://localhost:3001/coders/search?name=ana
http://localhost:3001/health
```


2. Probar con Postman utilizando los diferentes metodos HTTP: `GET`, `POST`,`PUT`, `PATCH`, `DELETE`

# URL Base

```txt
http://localhost:3001
```

---

# Endpoints automáticos

## Obtener CODERS

```http
GET /coders
```

---

## Obtener CODERS por ID

```http
GET /coders/1
```

---

## Crear CODERS

```http
POST /coders
```

Body:

```json
  {
      "id": 4,
      "name": "Pedro Perez",
      "language": "TypeScript",
      "active": true
    }
```

---

# Rutas personalizadas

---

## Health Check

```http
GET /health
```

---

## CODERS ACTIVOS

```http
GET /coders/active
```

---

## Buscar CODERS

```http
GET /coders/search?name=ana
```

---

# Reescritura de rutas

También puedes usar:

```http
GET /api/coders
```

> La reescritura de rutas permite ofrecer una URL alternativa con el prefijo `/api/`. Esto es una convención común en APIs REST — indica que estás hablando con una API, no con una página web. Internamente el servidor convierte `/api/coders` en `/coders` antes de procesarla, así que el resultado es idéntico. Puedes usar cualquiera de las dos formas desde tu cliente o desde Postman.

---

# Tecnologías utilizadas

- Node.js
- JSON Server
- ES Modules

---