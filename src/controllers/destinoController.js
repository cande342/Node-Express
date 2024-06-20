// src/controllers/destinoController.js
const { crearDestino } = require('../models/destinoModel');

const crearDestinoController = async (req, res) => {
    const { name_destino, description, province, categories } = req.body;
    
    try {
        // Llamar al método para crear un destino en el modelo
        const nuevoDestinoId = await crearDestino(name_destino, description, province, categories);

        // Enviar una respuesta de éxito
        res.status(201).json({ message: 'Destino creado exitosamente', nuevoDestinoId });
    } catch (error) {
        // Manejo de errores
        console.error('Error al crear el destino:', error);
        res.status(500).json({ message: 'Hubo un error al crear el destino en el controller' });
    }
};

module.exports = {
    crearDestinoController,
};
