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

const obtenerDestinos = async () => {
    try {
        const query = `
            SELECT d.id_destino, d.name_destino, d.descripcion, p.nombre_provincia, GROUP_CONCAT(c.nombre_categoria) AS categorias
            FROM Destinos d
            JOIN Provincia p ON d.id_provincia = p.id_provincia
            LEFT JOIN Destinos_Categorias dc ON d.id_destino = dc.id_destino
            LEFT JOIN Categorias c ON dc.id_categoria = c.id_categoria
            GROUP BY d.id_destino, d.name_destino, d.descripcion, p.nombre_provincia
        `;

        const [results, fields] = await connection.promise().query(query);
        return results;
    } catch (error) {
        console.error('Error al obtener los destinos:', error);
        throw error;
    }
};

// En destinoModel.js
const eliminarDestino = async (id_destino) => {
    try {
        const [result] = await connection.promise().query(
            'DELETE FROM destinos WHERE id_destino = ?',
            [id_destino]
        );

        return result.affectedRows > 0; // Retorna true si se afectó alguna fila (es decir, si se eliminó algún registro)
    } catch (error) {
        console.error('Error al eliminar el destino en el modelo:', error);
        throw error;
    }
};



module.exports = {
    crearDestino,
    obtenerDestinos,
    eliminarDestino,
};

