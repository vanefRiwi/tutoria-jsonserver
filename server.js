// Importar json-server como librería para tener control total del servidor
import jsonServer from 'json-server';

// Crear la aplicación servidor
const server = jsonServer.create();

// Middlewares por defecto: logger, cors y no-cache
const middlewares = jsonServer.defaults();

// Conectar db.json como base de datos — genera los endpoints REST automáticamente
const router = jsonServer.router('db.json');

const PORT = 3000;

// Permite leer req.body en peticiones POST y PUT
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Middleware de logs: imprime método y ruta de cada petición que llega
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ruta personalizada: estado del servidor
server.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor de coders esta OK' });
});

// Ruta personalizada: validar POST — name y language son obligatorios
server.post('/coders', (req, res, next) => {
  const { name, language } = req.body;

  if (!name || !language) {
    return res.status(400).json({ error: 'name y language son obligatorios' });
  }

  // Validación superada → el router automático guarda en db.json
  next();
});

// Ruta personalizada: devuelve solo los coders activos
server.get('/coders/active', (req, res) => {
  const db = router.db;
  const activos = db.get('coders').filter({ active: true }).value();
  res.status(200).json(activos);
});

// Rewriter: permite usar /api/coders como alias de /coders
server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

// Router automático — SIEMPRE al final
server.use(router);

// Levantar el servidor
server.listen(PORT, () => {
  console.log('============================');
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('============================');
  console.log(`GET  http://localhost:${PORT}/coders`);
  console.log(`GET  http://localhost:${PORT}/coders/active`);
  console.log(`POST http://localhost:${PORT}/coders`);
  console.log(`GET  http://localhost:${PORT}/health`);
});
