require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const db = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
// Middleware para manejar datos JSON
app.use(express.json());
const verificarToken = require('./src/middleware/middlewareAuth');
// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre del archivo
  }
});

// Filtro para aceptar solo ciertos tipos de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });



// Middleware para manejar datos codificados en URL (formularios HTML)
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos (HTML, CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar controladores
const {
  obtenerDestinosController,
  crearDestinoController,
  eliminarDestinoController,
  actualizarDestinoController
} = require('./src/controllers/destinoController');

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación Express!');
});

// Ruta para servir el HTML de destinos
app.get('/destinos', (req, res) => {
  res.sendFile(path.join(__dirname, './public/destinos.html'));
});

// Ruta para servir el HTML de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/register.html'));
});

// Ruta para servir el HTML de inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

// Ruta a Auth
app.use('/auth', authRoutes);

// Rutas del CRUD de Destinos
app.get('/api/destinos', obtenerDestinosController);
app.post('/api/destinos', verificarToken, upload.single('imagen_destino'), crearDestinoController);
app.delete('/api/destinos/:id', verificarToken, eliminarDestinoController);
app.put('/api/destinos/:id', verificarToken, actualizarDestinoController);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, './public/404.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el Puerto: ${PORT}`);
});