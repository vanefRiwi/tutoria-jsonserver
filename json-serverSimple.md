# 🗄️ JSON Server + Fetch API — Guía desde cero 

Una API falsa completa con cero backend real. Perfecta para prototipos y practicar fetch.

---

## ¿Qué es json-server?

`json-server` convierte un archivo `.json` en una **API REST funcional** al instante.
Sin Node propio, sin Express, sin configuración compleja. Solo un archivo y un comando.

Imagínatelo así:
```
db.json  →  json-server  →  http://localhost:3000/productos  ✅
  (tus datos)    (la magia)         (tu API lista para fetch)
```

---

## 0. Antes de empezar — Requisitos

Necesitas tener **Node.js** instalado. Para verificar, abre tu terminal y escribe:

```bash
node -v
npm -v
```

Si ves números (ej: `v20.11.0`), estás lista. Si no, descarga Node desde [nodejs.org](https://nodejs.org) (versión LTS).

---

## 1. Crear la carpeta del proyecto desde cero

Abre tu terminal (o la terminal integrada de VS Code) y ejecuta esto paso a paso:

```bash
# 1. Crea una carpeta nueva
mkdir mi-proyecto-api

# 2. Entra a esa carpeta
cd mi-proyecto-api

# 3. Abre VS Code desde aquí (opcional pero recomendado)
code .
```

Ahora estás dentro de tu carpeta vacía. ✅

---

## 2. Inicializar el proyecto con npm

Esto crea el archivo `package.json`, que es el "cerebro" de tu proyecto: guarda el nombre, versión y las dependencias que instales.

```bash
npm init -y
```

El flag `-y` responde "sí" a todas las preguntas automáticamente. Verás algo así:

```json
{
  "name": "mi-proyecto-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Este archivo se creó solito en tu carpeta. No lo toques por ahora. ✅

---

## 3. Instalar json-server

```bash
npm install json-server --save-dev
```

¿Qué pasó aquí?
- `npm install` → descarga e instala el paquete
- `json-server` → el nombre del paquete
- `--save-dev` → lo registra en tu `package.json` como dependencia de desarrollo

Después de instalarlo verás una carpeta `node_modules/` aparecer. Es normal, ahí vive json-server. No la toques. ✅

Tu estructura de carpetas ahora se ve así:
```
mi-proyecto-api/
├── node_modules/      ← generada sola, no tocar
├── package.json       ← el cerebro del proyecto
└── package-lock.json  ← generado solo, no tocar
```

---

## 4. Crear tu base de datos falsa

Dentro de `mi-proyecto-api/`, crea un archivo llamado `db.json`:

```json
{
  "productos": [
    { "id": 1, "nombre": "Guitarra eléctrica", "precio": 850000 },
    { "id": 2, "nombre": "Bajo Fender", "precio": 1200000 },
    { "id": 3, "nombre": "Batería Pearl", "precio": 3500000 }
  ],
  "usuarios": [
    { "id": 1, "nombre": "Rosy", "email": "rosy@ejemplo.com" }
  ]
}
```

> Cada clave del objeto (`"productos"`, `"usuarios"`) se convierte en un **endpoint** de tu API automáticamente.

Tu estructura ahora:
```
mi-proyecto-api/
├── node_modules/
├── db.json            ← tus datos (nueva!)
├── package.json
└── package-lock.json
```

---

## 5. Agregar el script en package.json

Abre `package.json` y reemplaza la línea del script `"test"` para que quede así:

```json
{
  "name": "mi-proyecto-api",
  "version": "1.0.0",
  "scripts": {
    "start": "json-server --watch db.json --port 3000"
  },
  "devDependencies": {
    "json-server": "^1.0.0"
  }
}
```

> Solo cambia la parte de `"scripts"`. El resto déjalo como está.

---

## 6. Levantar el servidor

En la terminal, estando dentro de `mi-proyecto-api/`, ejecuta:

```bash
npm run start
```

Verás algo así:

```
JSON Server started on PORT :3000
Press CTRL-C to stop

Watching db.json...

( ˶ˆ꒳ˆ˵ )

Index:
http://localhost:3000/

Static files:
Serving ./public directory if it exists

Endpoints:
http://localhost:3000/productos
http://localhost:3000/usuarios
```

✅ **¡Tu API está viva!** Puedes abrir `http://localhost:3000/productos` en el navegador y ver tus datos.

> ⚠️ Deja esta terminal abierta mientras trabajas. Si la cierras, el servidor se apaga.

---

## 7. Endpoints disponibles (automáticos)

| Método   | URL                  | Acción                        |
|----------|----------------------|-------------------------------|
| `GET`    | `/productos`         | Obtener todos                 |
| `GET`    | `/productos/1`       | Obtener uno por ID            |
| `POST`   | `/productos`         | Crear uno nuevo               |
| `PUT`    | `/productos/1`       | Reemplazar uno completo       |
| `PATCH`  | `/productos/1`       | Actualizar campos específicos |
| `DELETE` | `/productos/1`       | Eliminar uno                  |

---

## 8. Entendiendo fetch — antes de usarlo

`fetch` es una función nativa de JavaScript que hace peticiones HTTP. Así funciona mentalmente:

```
Tu código JS  →  fetch()  →  pide datos al servidor  →  el servidor responde  →  tú recibes los datos
```

Fetch devuelve una **Promesa**: no tienes los datos al instante, sino que llegarán "después". Por eso usamos `.then()` o `async/await` para esperar.

Anatomía de un fetch básico:
```javascript
fetch("URL de la API")          // 1. Haz la petición
  .then(res => res.json())      // 2. Convierte la respuesta a JSON (JavaScript puro)
  .then(data => console.log(data)) // 3. Usa los datos
  .catch(err => console.error(err)); // 4. Si algo falla, muéstralo
```

---

## 9. Haciendo fetch a tu API

### GET — Obtener todos los productos
```javascript
fetch("http://localhost:3000/productos")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### GET — Obtener un producto por ID
```javascript
fetch("http://localhost:3000/productos/1")
  .then(res => res.json())
  .then(data => console.log(data));
```

### POST — Crear un nuevo producto
```javascript
fetch("http://localhost:3000/productos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"   // Le dices: "te mando JSON"
  },
  body: JSON.stringify({                 // Convierte objeto JS → texto JSON
    nombre: "Pedal de efectos",
    precio: 320000
  })
})
  .then(res => res.json())
  .then(data => console.log("Creado:", data));
```
> json-server asigna el `id` automáticamente 🎉

### PATCH — Actualizar solo un campo
```javascript
fetch("http://localhost:3000/productos/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ precio: 900000 })
})
  .then(res => res.json())
  .then(data => console.log("Actualizado:", data));
```

### DELETE — Eliminar un producto
```javascript
fetch("http://localhost:3000/productos/1", {
  method: "DELETE"
})
  .then(res => {
    if (res.ok) console.log("Eliminado correctamente");
  });
```

---

## 10. Con async/await — las 4 funciones parametrizadas

`async/await` es azúcar sintáctica sobre las Promesas. Hace que el código asíncrono se lea de arriba a abajo, como si fuera síncrono (de lo contrario tendrías que anidar `.then()` dentro de `.then()` hasta el infinito).

### Anatomía de una función async — línea por línea

Antes de ver las 4 funciones completas, entiende qué hace cada parte:

```javascript
//  1️⃣  "async" le dice a JS: esta función va a hacer cosas que toman tiempo.
//      Automáticamente devuelve una Promesa aunque tú no lo escribas.
async function get() {

  //  2️⃣  "try" envuelve el camino feliz.
  //      Si CUALQUIER línea adentro falla, salta directo al catch.
  try {

    //  3️⃣  "await" pausa la función aquí hasta que el servidor responda.
    //      Sin await, fetch devuelve una Promesa vacía antes de que lleguen los datos.
    //      res = la respuesta cruda del servidor (todavía no son tus datos)
    const res = await fetch("http://localhost:3000/productos");

    //  4️⃣  res.ok es true si el código HTTP es 200-299 (éxito).
    //      Si el servidor respondió 404, 500, etc., fetch NO lanza error solo —
    //      tienes que comprobarlo tú y lanzarlo manualmente con throw.
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    //  5️⃣  res.json() convierte el texto crudo de la respuesta en un objeto JS.
    //      También es asíncrono (necesita leer el stream completo), así que lleva await.
    //      Aquí sí están tus datos reales.
    const data = await res.json();

    console.log(data); // array de objetos: [{ id:1, nombre:"...", precio:... }, ...]

  //  6️⃣  "catch" atrapa cualquier error de los pasos 3-5:
  //      red caída, servidor apagado, JSON mal formado, el throw del paso 4, etc.
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}
```

El flujo en palabras: **llama al servidor → espera → verifica que fue bien → convierte a JSON → usa los datos. Si algo explota en el camino, el catch lo atrapa.**

---

### El problema del dato "quemado"

Imagina que escribes `post()` así de entrada — función completa, correcta en estructura, pero con el dato fijo adentro:

```javascript
// ❌ PROBLEMA — función completa pero con dato quemado
async function post() {
  try {
    const res = await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Pedal Boss DS-1", precio: 320000 })
      //                    ↑ este objeto está fijo aquí adentro
      //                    no importa cuántas veces la llames,
      //                    siempre va a crear exactamente ese producto
    });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();
    console.log("Creado:", data);
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Si la llamas 3 veces, crea 3 veces lo mismo. Inútil.
post(); // → crea "Pedal Boss DS-1"
post(); // → crea "Pedal Boss DS-1" otra vez
post(); // → crea "Pedal Boss DS-1" otra vez más
```

Lo mismo pasa con `put()` y `del()` — si el ID va quemado en la URL, siempre editas o borras el mismo:

```javascript
// ❌ PROBLEMA — siempre edita el ID 1, siempre con los mismos datos
async function put() {
  const res = await fetch("http://localhost:3000/productos/1", { // ← ID fijo
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Guitarra Yamaha", precio: 950000 }) // ← datos fijos
  });
}

// ❌ PROBLEMA — siempre borra el ID 1
async function del() {
  const res = await fetch("http://localhost:3000/productos/1", { // ← ID fijo
    method: "DELETE"
  });
}
```

---

### La solución — recibir el dato como parámetro

La función no debe saber qué dato va a procesar. Eso lo decides **tú cuando la llamas**, pasándoselo como argumento:

```javascript
// ✅ SOLUCIÓN — el dato entra como parámetro, la función no sabe ni le importa qué es
async function post(nuevoProducto) {
  //                ↑ parámetro: recibe el objeto desde afuera
  try {
    const res = await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto)
      //                   ↑ usa lo que le pasaste, no un valor fijo
    });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();
    console.log("Creado:", data);
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Ahora sí — cada llamada crea un producto distinto:
post({ nombre: "Amplificador Fender", precio: 2400000 });
post({ nombre: "Platillos Zildjian",  precio: 890000  });
post({ nombre: "Bajo Fender Jazz",    precio: 1800000 });
```

Para `put()` y `del()`, el ID también debe ser parámetro porque va en la URL:

```javascript
// ✅ SOLUCIÓN — id y datos vienen de afuera
async function put(id, datosNuevos) {
  //              ↑   ↑ dos parámetros: el id va a la URL, los datos al body
  const res = await fetch(`http://localhost:3000/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosNuevos)
  });
}

// ✅ SOLUCIÓN — el id viene de afuera
async function del(id) {
  const res = await fetch(`http://localhost:3000/productos/${id}`, {
    method: "DELETE"
  });
}

// Ahora puedes editar o borrar cualquier producto:
put(1, { nombre: "Guitarra Yamaha", precio: 950000 });
put(3, { nombre: "Bajo Squier",     precio: 780000 });
del(2);
del(4);
```

La regla es simple: **todo lo que cambia entre una llamada y otra debe ser parámetro. Lo que no cambia (la URL base, el método) se queda adentro.**

---

### Las 4 funciones — bien parametrizadas y explicadas

```javascript
const BASE_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────
// GET — obtener todos los productos
//
// No necesita parámetros porque siempre pide la misma lista.
// ─────────────────────────────────────────────────────────────────
async function get() {
  try {
    // fetch sin segundo argumento = GET por defecto
    const res = await fetch(`${BASE_URL}/productos`);

    // res.ok es true si el servidor respondió 200-299 (éxito)
    // Si fue un 404, 500, etc., lo tratamos como error manualmente
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    // La respuesta llega como texto. .json() lo convierte en array de objetos JS.
    // También es asíncrono, así que necesita await.
    const data = await res.json();

    console.log("Productos:", data);
    // data es un array → [{ id: 1, nombre: "...", precio: ... }, ...]
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Uso:
get();


// ─────────────────────────────────────────────────────────────────
// POST — crear un producto nuevo
//
// Recibe `nuevoProducto`: el objeto que quieres guardar.
// Tú decides qué le mandas. json-server asigna el id automáticamente.
// ─────────────────────────────────────────────────────────────────
async function post(nuevoProducto) {
  try {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
        // Le dices al servidor: "lo que te mando en body está en formato JSON"
        // Sin este header, el servidor no sabe interpretar el body
      },

      body: JSON.stringify(nuevoProducto)
      // body es el "paquete" que envías al servidor
      // JSON.stringify convierte tu objeto JS en texto JSON:
      // { nombre: "Fender", precio: 500 }  →  '{"nombre":"Fender","precio":500}'
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    // El servidor responde con el objeto que creó, incluyendo el id nuevo
    const data = await res.json();
    console.log("Creado:", data);
    // data → { id: 4, nombre: "Fender", precio: 500 }
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Usos — tú controlas qué se crea:
post({ nombre: "Amplificador Fender",  precio: 2400000 });
post({ nombre: "Platillos Zildjian",   precio: 890000  });
post({ nombre: "Bajo Fender Jazz",     precio: 1800000 });


// ─────────────────────────────────────────────────────────────────
// PUT — reemplazar un producto COMPLETO por su id
//
// Recibe `id`: el número del producto a reemplazar.
// Recibe `datosNuevos`: el objeto con el que se reemplaza.
//
// ⚠️ PUT reemplaza TODO. Si no mandas un campo, ese campo desaparece.
//    Usa PATCH si solo quieres editar un campo suelto.
// ─────────────────────────────────────────────────────────────────
async function put(id, datosNuevos) {
  try {
    // El id va en la URL: /productos/2 edita el producto con id 2
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosNuevos)
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    console.log("Reemplazado:", data);
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Usos — tú eliges el id y los datos nuevos:
put(1, { nombre: "Guitarra Yamaha F310", precio: 950000 });
put(2, { nombre: "Bajo Squier",          precio: 780000 });

// ⚠️ Esto borraría el campo nombre porque no lo incluiste:
// put(1, { precio: 500000 });  → resultado: { id: 1, precio: 500000 }  (sin nombre)


// ─────────────────────────────────────────────────────────────────
// DELETE — eliminar un producto por su id
//
// Recibe `id`: el número del producto a eliminar.
// DELETE no envía body — solo necesita el id en la URL.
// ─────────────────────────────────────────────────────────────────
async function del(id) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: "DELETE"
      // No hay headers ni body — solo el método y el id en la URL
    });

    // DELETE exitoso devuelve código 200 pero el body viene vacío
    // Por eso no hacemos res.json() — no hay nada que convertir
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    console.log(`Producto ${id} eliminado ✅`);
  } catch (error) {
    console.error("Algo salió mal:", error);
  }
}

// Usos:
del(1);
del(3);
```

> **💡 PUT vs PATCH — ¿cuál usar?**
> - `PUT` → reemplaza el objeto **completo**. Debes mandar todos los campos.
> - `PATCH` → actualiza **solo los campos que mandas**. El resto queda intacto.
> - Para ediciones parciales, siempre prefiere `PATCH`. En esta guía usamos `PUT` para aprender la diferencia.

---

## 11. Ejemplo completo — Modularizado en 3 archivos

En lugar de poner todo en un solo HTML, separamos responsabilidades. Cada archivo tiene su propio trabajo:

```
mi-proyecto-api/
├── index.html      ← solo estructura (el esqueleto)
├── style.css       ← solo estilos (la apariencia)
└── main.js         ← solo lógica JS (el comportamiento + fetch)
```

> En el HTML vinculamos los otros dos archivos con `<link>` y `<script>`.

El ejemplo tiene **inputs reales** para POST y PUT. Así la función recibe los datos que tú escribes — no datos quemados en el código.

---

### 📄 `index.html`

Solo estructura. Sin una línea de CSS ni JS aquí adentro.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mi tienda — JSON Server</title>

  <!-- Vincula el archivo de estilos externo -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <h1>🎸 Tienda de instrumentos</h1>
  <p class="subtitulo">Consumiendo json-server en tiempo real</p>

  <!-- ── GET ─────────────────────────────────── -->
  <!-- No necesita inputs: solo pide la lista -->
  <section class="bloque">
    <h2>GET — Ver todos los productos</h2>
    <button id="btn-get">Obtener productos</button>
  </section>

  <!-- ── POST ────────────────────────────────── -->
  <!-- El usuario escribe el nombre y precio que quiere crear -->
  <section class="bloque">
    <h2>POST — Crear producto</h2>
    <input type="text"   id="post-nombre" placeholder="Nombre del producto" />
    <input type="number" id="post-precio" placeholder="Precio" />
    <button id="btn-post">Crear</button>
  </section>

  <!-- ── PUT ─────────────────────────────────── -->
  <!-- El usuario escribe el id a reemplazar y los datos nuevos -->
  <section class="bloque">
    <h2>PUT — Reemplazar producto (completo)</h2>
    <input type="number" id="put-id"     placeholder="ID a reemplazar" />
    <input type="text"   id="put-nombre" placeholder="Nombre nuevo" />
    <input type="number" id="put-precio" placeholder="Precio nuevo" />
    <button id="btn-put">Reemplazar</button>
  </section>

  <!-- ── DELETE ───────────────────────────────── -->
  <!-- El usuario escribe el id que quiere borrar -->
  <section class="bloque">
    <h2>DELETE — Eliminar producto</h2>
    <input type="number" id="del-id" placeholder="ID a eliminar" />
    <button id="btn-delete">Eliminar</button>
  </section>

  <!-- Aquí se renderizan las cards al hacer GET -->
  <div id="lista"></div>

  <!-- Aquí se muestra la respuesta JSON de la API -->
  <p class="log-titulo">📋 Respuesta de la API:</p>
  <div id="log">Presiona un botón para ver la respuesta aquí...</div>

  <!--
    El script va AL FINAL del body.
    Razón: el navegador lee el HTML de arriba a abajo.
    Si el script estuviera en el <head>, se ejecutaría antes de que
    existieran los botones e inputs en el DOM — y document.getElementById
    devolvería null porque aún no se han creado.
  -->
  <script src="main.js"></script>

</body>
</html>
```

---

### 🎨 `style.css`

Solo estilos. Cero lógica aquí.

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #0f0f0f;
  color: #f0f0f0;
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 860px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 10px;
  color: #e2b96f;
}

.subtitulo {
  text-align: center;
  color: #888;
  margin-bottom: 40px;
  font-size: 0.95rem;
}

/* ── Bloques de cada método ── */
.bloque {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.bloque h2 {
  width: 100%;
  font-size: 0.9rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

/* ── Inputs ── */
input {
  padding: 9px 14px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 0.9rem;
  flex: 1;
  min-width: 140px;
}

input::placeholder {
  color: #555;
}

input:focus {
  outline: none;
  border-color: #e2b96f;
}

/* ── Botones ── */
button {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
}

button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

#btn-get    { background: #3b82f6; color: white; }
#btn-post   { background: #22c55e; color: white; }
#btn-put    { background: #f59e0b; color: #111;  }
#btn-delete { background: #ef4444; color: white; }

/* ── Cards ── */
#lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 30px;
}

.card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 18px;
  transition: border-color 0.2s;
}

.card:hover { border-color: #e2b96f; }

.card h3 {
  color: #e2b96f;
  font-size: 0.95rem;
  margin-bottom: 6px;
}

.card p { color: #aaa; font-size: 0.85rem; }

.card .precio {
  color: #22c55e;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 8px;
}

/* ── Log de respuesta ── */
.log-titulo {
  color: #555;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

#log {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: #7ee787;
  min-height: 80px;
  white-space: pre-wrap;
}
```

---

### ⚙️ `main.js`

Solo lógica. Aquí viven las funciones parametrizadas — leen los inputs del HTML y le pasan los datos a cada función de fetch.

```javascript
// ════════════════════════════════════════════════════
// CONFIGURACIÓN
// ════════════════════════════════════════════════════

const BASE_URL = "http://localhost:3000";

// Referencias a los elementos del DOM que vamos a usar.
// getElementById busca un elemento por su atributo id en el HTML.
const lista = document.getElementById("lista");
const log   = document.getElementById("log");


// ════════════════════════════════════════════════════
// UTILIDADES — funciones de apoyo (no hacen fetch)
// ════════════════════════════════════════════════════

// Muestra el objeto de respuesta formateado en el recuadro de log.
// JSON.stringify(data, null, 2) convierte el objeto a texto con 2 espacios de indentación.
function mostrarLog(data) {
  log.textContent = JSON.stringify(data, null, 2);
}

// Muestra un mensaje de texto en el área de cards (después de POST, PUT, DELETE).
// `grid-column: 1/-1` hace que el párrafo ocupe toda la fila del grid.
function mostrarMensaje(texto, color) {
  lista.innerHTML = `<p style="color:${color}; grid-column:1/-1; text-align:center">${texto}</p>`;
}

// Crea y muestra las cards a partir del array de productos devuelto por el GET.
function renderProductos(productos) {
  lista.innerHTML = ""; // limpia las cards anteriores

  productos.forEach(p => {
    // Crea un div por cada producto
    const card = document.createElement("div");
    card.classList.add("card");

    // Template literal: inserta los datos del producto en el HTML de la card
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>ID: ${p.id}</p>
      <p class="precio">$${p.precio.toLocaleString("es-CO")}</p>
    `;

    lista.appendChild(card); // lo agrega al DOM
  });
}


// ════════════════════════════════════════════════════
// FUNCIONES DE FETCH — una por cada método HTTP
// ════════════════════════════════════════════════════

// ── GET ──────────────────────────────────────────────
// No recibe parámetros. Siempre pide /productos completo.
async function get() {
  try {
    const res = await fetch(`${BASE_URL}/productos`);
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json(); // array de productos
    renderProductos(data);         // los muestra como cards
    mostrarLog(data);              // los muestra en el log
  } catch (err) {
    log.textContent = "❌ Error: " + err.message;
  }
}

// ── POST ─────────────────────────────────────────────
// Recibe `nuevoProducto`: el objeto a crear.
// Lo construimos afuera (desde los inputs) y lo pasamos como argumento.
async function post(nuevoProducto) {
  try {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto) // convierte el objeto a texto JSON
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json(); // el servidor devuelve el objeto creado con su nuevo id
    mostrarLog(data);
    mostrarMensaje("✅ Producto creado. Presiona GET para ver la lista.", "#22c55e");
  } catch (err) {
    log.textContent = "❌ Error: " + err.message;
  }
}

// ── PUT ──────────────────────────────────────────────
// Recibe `id`: el número del producto a reemplazar.
// Recibe `datosNuevos`: el objeto con el que se reemplaza.
// ⚠️ Manda TODOS los campos — PUT reemplaza el objeto completo.
async function put(id, datosNuevos) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`, { // el id va en la URL
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosNuevos)
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();
    mostrarLog(data);
    mostrarMensaje(`✏️ Producto ${id} reemplazado. Presiona GET para ver el cambio.`, "#f59e0b");
  } catch (err) {
    log.textContent = "❌ Error: " + err.message;
  }
}

// ── DELETE ───────────────────────────────────────────
// Recibe `id`: el número del producto a eliminar.
// No necesita body ni headers — solo el método y el id en la URL.
async function del(id) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);

    // DELETE devuelve 200 pero sin body JSON, así que no hacemos res.json()
    mostrarLog({ mensaje: `Producto ${id} eliminado correctamente ✅` });
    mostrarMensaje(`🗑️ Producto ${id} eliminado. Presiona GET para confirmar.`, "#ef4444");
  } catch (err) {
    log.textContent = "❌ Error: " + err.message;
  }
}


// ════════════════════════════════════════════════════
// EVENT LISTENERS — conectan los botones con las funciones
// ════════════════════════════════════════════════════
//
// Cada listener hace dos cosas:
// 1. Lee los valores de los inputs del HTML
// 2. Llama a la función de fetch con esos valores como argumentos
//
// .value siempre devuelve string. Por eso usamos Number() para convertir
// el precio y el id a número antes de mandarlos.
// ════════════════════════════════════════════════════

document.getElementById("btn-get").addEventListener("click", () => {
  // GET no necesita leer ningún input
  get();
});

document.getElementById("btn-post").addEventListener("click", () => {
  // Lee los inputs de la sección POST
  const nombre = document.getElementById("post-nombre").value.trim();
  const precio = Number(document.getElementById("post-precio").value);

  // Validación básica: no mandar datos vacíos
  if (!nombre || !precio) {
    log.textContent = "❌ Completa el nombre y el precio antes de crear.";
    return; // detiene la ejecución aquí si faltan datos
  }

  // Arma el objeto y se lo pasa a post()
  // Así la función es genérica — no sabe ni le importa qué producto es
  post({ nombre, precio });
  // Equivale a: post({ nombre: nombre, precio: precio })
});

document.getElementById("btn-put").addEventListener("click", () => {
  const id     = Number(document.getElementById("put-id").value);
  const nombre = document.getElementById("put-nombre").value.trim();
  const precio = Number(document.getElementById("put-precio").value);

  if (!id || !nombre || !precio) {
    log.textContent = "❌ Completa el ID, el nombre y el precio antes de reemplazar.";
    return;
  }

  // Pasa el id separado (va en la URL) y los datos nuevos (van en el body)
  put(id, { nombre, precio });
});

document.getElementById("btn-delete").addEventListener("click", () => {
  const id = Number(document.getElementById("del-id").value);

  if (!id) {
    log.textContent = "❌ Escribe el ID del producto que quieres eliminar.";
    return;
  }

  del(id);
});
```

---

### ¿Cómo usarlo?

1. Abre **dos terminales** en VS Code (ícono `+` en la terminal)
2. Terminal 1 → levanta el servidor: `npm run api`
3. Terminal 2 → abre el HTML con Live Server o arrástralo al navegador
4. Llena los inputs y presiona los botones — observa la respuesta en el log

> **¿Por qué necesito dos terminales?** Una terminal corre `json-server` constantemente (si la cierras, la API muere). La otra queda libre para otros comandos.

---

## 12. Filtros y queries útiles

json-server soporta queries por URL sin configuración extra:

```bash
# Filtrar por campo exacto
GET /productos?precio=850000

# Ordenar ascendente o descendente
GET /productos?_sort=precio&_order=asc

# Paginar resultados
GET /productos?_page=1&_limit=2

# Buscar texto libre
GET /productos?q=guitarra
```

---

## Estructura final del proyecto

```
mi-proyecto-api/
├── node_modules/        ← generada por npm, no tocar
├── db.json              ← tus datos (la "base de datos")
├── index.html           ← estructura HTML
├── style.css            ← estilos
├── main.js              ← lógica y fetch
├── package.json         ← configuración del proyecto
└── package-lock.json    ← generado por npm, no tocar
```

---

## Resumen en 5 pasos basicos para json-server: 

```bash
mkdir mi-proyecto-api   # 1. Crea carpeta
cd mi-proyecto-api      # 2. Entra a ella
npm init -y             # 3. Inicializa el proyecto
npm install json-server --save-dev  # 4. Instala json-server
```

Luego crea `db.json`, agrega el script en `package.json` y:

```bash
npm run start             # 5. Levanta la API
```

¡Listo! En menos de 5 minutos tienes una API REST json-server funcionando. 🚀
