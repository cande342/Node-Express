// src/models/destino.js
const connection = require('../db');

// Método para crear un destino
const crearDestino = async (name_destino, descripcion, id_provincia, categorias) => {
    let nuevoDestinoId;

    try {
        // Insertar destino en la tabla Destinos
        const [resultsDestino, fieldsDestino] = await connection.promise().query(
            'INSERT INTO Destinos (name_destino, descripcion, id_provincia) VALUES (?, ?, ?)',
            [name_destino, descripcion, id_provincia]
        );

        nuevoDestinoId = resultsDestino.insertId;

        // Insertar relaciones en la tabla Destinos_Categorias si hay categorías seleccionadas
        if (categorias && categorias.length > 0) {
            const values = categorias.map(idCategoria => [nuevoDestinoId, idCategoria]);
            await connection.promise().query(
                'INSERT INTO Destinos_Categorias (id_destino, id_categoria) VALUES ?',
                [values]
            );
        }

        return nuevoDestinoId; // Retorna el ID del destino insertado
    } catch (error) {
        console.error('Error al crear el destino:', error);
        throw error;
    }
};

// Método para obtener todos los destinos
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

// Método para obtener un destino por su ID
const obtenerDestinoPorId = async (id) => {
    try {
        const query = `
            SELECT d.id_destino, d.name_destino, d.descripcion, p.nombre_provincia, GROUP_CONCAT(c.nombre_categoria) AS categorias
            FROM Destinos d
            JOIN Provincia p ON d.id_provincia = p.id_provincia
            LEFT JOIN Destinos_Categorias dc ON d.id_destino = dc.id_destino
            LEFT JOIN Categorias c ON dc.id_categoria = c.id_categoria
            WHERE d.id_destino = ?
            GROUP BY d.id_destino, d.name_destino, d.descripcion, p.nombre_provincia
        `;

        const [results, fields] = await connection.promise().query(query, [id]);
        return results[0]; // Retorna solo el primer resultado (debería haber uno solo)
    } catch (error) {
        console.error('Error al obtener el destino por ID:', error);
        throw error;
    }
};

// Método para eliminar un destino por su ID
const eliminarDestino = async (id_destino) => {
    try {
        const [result] = await connection.promise().query(
            'DELETE FROM Destinos WHERE id_destino = ?',
            [id_destino]
        );

        return result.affectedRows > 0; // Retorna true si se afectó alguna fila (es decir, si se eliminó algún registro)
    } catch (error) {
        console.error('Error al eliminar el destino en el modelo:', error);
        throw error;
    }
};

// Método para actualizar un destino por su ID
const actualizarDestino = async (id, name_destino, descripcion, id_provincia) => {
    try {
        const query = `
            UPDATE Destinos
            SET name_destino = ?, descripcion = ?, id_provincia = ?
            WHERE id_destino = ?
        `;
        const [result] = await connection.promise().query(query, [name_destino, descripcion, id_provincia, id]);

        return result.affectedRows > 0; // Retorna true si se afectó alguna fila (es decir, si se actualizó algún registro)
    } catch (error) {
        console.error('Error al actualizar el destino:', error);
        throw error;
    }
};

// Método para actualizar las categorías de un destino por su ID
const actualizarCategoriasDestino = async (idDestino, categorias) => {
    try {
        // Borrar las categorías existentes para este destino
        const deleteQuery = `
            DELETE FROM Destinos_Categorias
            WHERE id_destino = ?
        `;
        await connection.promise().query(deleteQuery, [idDestino]);

        // Insertar las nuevas categorías para este destino
        if (categorias && categorias.length > 0) {
            const values = categorias.map(idCategoria => [idDestino, idCategoria]);
            await connection.promise().query(
                'INSERT INTO Destinos_Categorias (id_destino, id_categoria) VALUES ?',
                [values]
            );
        }
    } catch (error) {
        console.error('Error al actualizar las categorías del destino:', error);
        throw error;
    }
};

module.exports = {
    crearDestino,
    obtenerDestinos,
    obtenerDestinoPorId,
    eliminarDestino,
    actualizarCategoriasDestino,
    actualizarDestino,
};
