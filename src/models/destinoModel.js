// src/models/destino.js
const connection = require('../db');

const crearDestino = async (name_destino, description, idProvincia, idCategorias) => {
    let nuevoDestinoId;

    try {
        // Insertar destino en la tabla Destinos
        const [resultsDestino, fieldsDestino] = await connection.promise().query(
            'INSERT INTO Destinos (name_destino, descripcion, id_provincia) VALUES (?, ?, ?)',
            [name_destino, description, idProvincia]
        );

        nuevoDestinoId = resultsDestino.insertId;

        // Insertar relaciones en la tabla Destinos_Categorias si hay categorías seleccionadas
        if (idCategorias && idCategorias.length > 0) {
            const promises = idCategorias.map(async (idCategoria) => {
                await connection.promise().query(
                    'INSERT INTO Destinos_Categorias (id_destino, id_categoria) VALUES (?, ?)',
                    [nuevoDestinoId, idCategoria]
                );
            });
            await Promise.all(promises);
        }

        return nuevoDestinoId; // Retorna el ID del destino insertado
    } catch (error) {
        console.error('Error al crear el destino:', error);
        throw error;
    }
};

module.exports = {
    crearDestino,
};

