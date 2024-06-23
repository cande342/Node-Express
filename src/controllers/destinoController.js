const {
    crearDestino,
    obtenerDestinos,
    eliminarDestino,
    actualizarDestino,
    actualizarCategoriasDestino,
    obtenerDestinoPorId,
} = require('../models/destinoModel');

// METODO POST para crear un nuevo destino
const crearDestinoController = async (req, res) => {
    const { name_destino, descripcion, province, categorias } = req.body;

    try {
        // Convertir el campo 'province' a número (si es necesario)
        const id_provincia = parseInt(province);

        // Convertir categorias de JSON a array de enteros
        const categoriasArray = JSON.parse(categorias).map(id => parseInt(id));
        
        // Obtener el nombre del archivo (multer ya guarda el archivo en 'req.file')
        const img_path = req.file ? req.file.path : null;

        // Llamar al método para crear un destino en el modelo, incluyendo la imagen
        const nuevoDestinoId = await crearDestino(name_destino, descripcion, id_provincia, categoriasArray, img_path);

        // Enviar una respuesta de éxito
        res.status(201).json({ message: 'Destino creado exitosamente', nuevoDestinoId });
    } catch (error) {
        // Manejo de errores
        console.error('Error al crear el destino:', error);
        res.status(500).json({ message: 'Hubo un error al crear el destino en el servidor' });
    }
};

// METODO GET
const obtenerDestinosController = async (req, res) => {
    try {
        const destinos = await obtenerDestinos();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los destinos' });
    }
};

// METODO DELETE
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

// METODO PUT
const actualizarDestinoController = async (req, res) => {
    const { id } = req.params;
    const { name_destino, descripcion, id_provincia, categorias } = req.body;

    try {
        // Verificar si el destino existe antes de actualizarlo
        const destinoExistente = await obtenerDestinoPorId(id);
        if (!destinoExistente) {
            return res.status(404).json({ error: 'El destino no existe' });
        }

        // Actualizar el destino en la base de datos
        await actualizarDestino(id, name_destino, descripcion, id_provincia);

        // Actualizar las categorías del destino
        await actualizarCategoriasDestino(id, categorias);

        // Obtener el destino actualizado desde la base de datos
        const destinoActualizado = await obtenerDestinoPorId(id);

        // Retornar el destino actualizado como respuesta
        res.json(destinoActualizado);
    } catch (error) {
        console.error('Error al actualizar el destino:', error);
        res.status(500).json({ error: 'Error interno al actualizar el destino' });
    }
};

module.exports = {
    crearDestinoController,
    obtenerDestinosController,
    eliminarDestinoController,
    actualizarDestinoController,
};