const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {};

User.create = (userData, callback) => {
  // Generar el hash de la contraseña antes de insertarla
  bcrypt.hash(userData.contrasena_hash, 10, (err, hashedPassword) => {
    if (err) {
      return callback(err, null);
    }
    // Sobrescribir la contraseña en el objeto userData con el hash generado
    userData.contrasena_hash = hashedPassword;

    console.log('Hash creado para el nuevo usuario:', hashedPassword); // Log para verificar el hash

    // Query para insertar el usuario con la contraseña hasheada
    const query = 'INSERT INTO usuario SET ?';
    db.query(query, userData, (err, res) => {
      if (err) {
        return callback(err, null);
      }
      const userId = res.insertId;
      callback(null, { id_usuario: userId, ...userData });
    });
  });
};


User.createLogin = (loginData, callback) => {
  const query = 'INSERT INTO login SET ?';
  db.query(query, loginData, (err, res) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, { ...loginData });
  });
};

User.findByEmail = (email, callback) => {
  const query = 'SELECT * FROM usuario WHERE correo_electronico = ?';
  db.query(query, [email], (err, res) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, res[0]);
  });
};

User.comparePassword = (password, hashedPassword, callback) => {
  bcrypt.compare(password, hashedPassword, (err, isMatch) => {
    if (err) {
      return callback(err, false);
    }
    callback(null, isMatch);
  });
};

module.exports = User;
