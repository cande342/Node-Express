// src/controllers/destinoController.js
const { crearDestino, obtenerDestinos, eliminarDestino } = require('../models/destinoModel');

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

const obtenerDestinosController = async (req, res) => {
    try {
        const destinos = await obtenerDestinos();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los destinos' });
    }
};

const eliminarDestinoController = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await eliminarDestino(id);
        if (resultado) {
            res.status(200).json({ message: 'Destino eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Destino no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el destino:', error);
        res.status(500).json({ error: 'Error interno al eliminar el destino' });
    }
};

module.exports = {
    crearDestinoController,
    obtenerDestinosController,
    eliminarDestinoController,
};
