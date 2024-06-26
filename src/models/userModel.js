// userModel.js
const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {};

User.create = (userData, result) => {
  const query = 'INSERT INTO usuario SET ?';
  db.query(query, userData, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // Obtener el id_usuario generado
    const userId = res.insertId;
    result(null, { id_usuario: userId, ...userData });
  });
};

User.createLogin = (loginData, result) => {
  const query = 'INSERT INTO login SET ?';
  db.query(query, loginData, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // No necesitas devolver el resultado del insert para el login
    result(null, { ...loginData });
  });
};

User.findByEmail = (email, result) => {
  const query = 'SELECT * FROM usuario WHERE correo_electronico = ?';
  db.query(query, [email], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res[0]);
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
