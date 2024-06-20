const express = require('express');
const router = express.Router();
const path = require('path');

const { crearDestinoController } = require('../controllers/destinoController');


// Ruta de inicio
router.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación Express!');
});

// Rutas de Destino
router.get('/destinos', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/destinos.html'));
});
router.post('/destinos', crearDestinoController);

// Rutas de Servicios
//router.use('/servicios', serviciosRoutes);

// Rutas de Autenticación (Login y Registro)
//router.use('/auth', authRoutes);

module.exports = router;
