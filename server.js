import jsonServer from 'json-server'; 

const server = jsonServer.create();

const middlewares = jsonServer.defaults();

const router = jsonServer.router('db.json');

const PORT = 3000;

server.use(jsonServer.bodyParser);

server.use(middlewares);

server.use((req, res, next) => {
 console.log(`${req.method} ${req.url}`);
 next();        
});

//Ruta persoalizada para estado del servidor
server.get('/health', (req, res) => {
 res.status(200).json({ status: 'ok', message: 'Servidor de coders esta OK' });
});

// Ruta crear: validar POST (name y language son obligatorios)
server.post('/coders', (req, res, next) => {
const { name, language } = req.body;

  if (!name || !language) {
    return res.status(400).json({ error: 'name y language son obligatorios' });
  }
  next();
});
//Ruta coders activos

server.get('/coders/active', (req, res) => {
    const db = router.db; // Acceso a la base de datos
    const activos = db.get('coders').filter({ active: true }).value(); // Filtrar coders activos
    res.status(200).json(activos); // Devolver coders activos
});



// Ruta alternativa /api/coders → /coders
// /api
// GET /api/coders → /coders

server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

// Router automático (al final)
server.use(router);

// Levantar el servidor 
server.listen(PORT, () => {
  console.log('============================');
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('============================');
  console.log(`GET http://localhost:${PORT}/coders`);
  console.log(`GET http://localhost:${PORT}/coders/active`);
  console.log(`POST http://localhost:${PORT}/coders`);
  console.log(`GET http://localhost:${PORT}/health`);
});
