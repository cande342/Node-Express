const express = require('express');
const router = express.Router();
const path = require('path');

const { crearDestinoController, obtenerDestinosController, eliminarDestinoController } = require('../controllers/destinoController');


// Ruta de inicio
router.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación Express!');
});

// Rutas de Destino

//esta sirve el html
router.get('/destinos', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/destinos.html'));
});

//estas son las del CRUD
router.route('/api/destinos')
    .get(obtenerDestinosController)
    .post(crearDestinoController);

router.route('/api/destinos/:id')
    .delete(eliminarDestinoController);

// Rutas de Servicios
//router.use('/servicios', serviciosRoutes);

// Rutas de Autenticación (Login y Registro)
//router.use('/auth', authRoutes);

module.exports = router;
