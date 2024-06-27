const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, domicilio_ciudad, domicilio_departamento, telefono, correo_electronico, contrasena_hash } = req.body;

  if (!nombre || !apellido || !fecha_nacimiento || !domicilio_ciudad || !domicilio_departamento || !telefono || !correo_electronico || !contrasena_hash) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Crear el nuevo usuario
    User.create({ nombre, apellido, fecha_nacimiento, domicilio_ciudad, domicilio_departamento, telefono, correo_electronico, contrasena_hash }, (err, newUser) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Error al registrar el usuario.' });
      }
      res.status(201).json({ message: 'Usuario registrado con éxito.', user: newUser });
    });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};

//INICIO DE SESION
  exports.login = async (req, res) => {
  const { correo_electronico, password } = req.body;

  // Validar que todos los campos estén presentes
  if (!correo_electronico || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
  }

  try {
    // Buscar usuario por correo electrónico
    User.findByEmail(correo_electronico, async (err, user) => {
      if (err) {
        console.error('ERROR_AUTH-CONTROLLER.LOGIN', err);
        return res.status(500).send('Se ha generado un error al iniciar sesión.');
      }

      if (!user) {
        console.log(`Usuario con correo electrónico ${correo_electronico} no encontrado.`);
        return res.status(400).json({ error: 'Usuario no encontrado.' });
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Contraseña incorrecta.' });
      }

      // Crear token JWT con el campo 'rol'
      const token = jwt.sign(
        { id: user.id_usuario, correo_electronico: user.correo_electronico, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id_usuario,
          correo_electronico: user.correo_electronico,
          rol: user.rol  // Asegurar que el rol también se devuelve en la respuesta
        }
      });
    });
  } catch (err) {
    console.error('ERROR_AUTH-CONTROLLER.LOGIN', err);
    res.status(500).send('Se ha generado un error al iniciar sesión.');
  }
};