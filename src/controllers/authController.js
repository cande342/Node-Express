const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

// Controlador para registrar un nuevo usuario
exports.register = (req, res) => {
  const { nombre, apellido, fecha_nacimiento, domicilio_ciudad, domicilio_departamento, telefono, correo_electronico, contrasena_hash } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!nombre || !apellido || !fecha_nacimiento || !domicilio_ciudad || !domicilio_departamento || !telefono || !correo_electronico || !contrasena_hash) {
    return res.status(400).send({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si ya existe un usuario con el correo electrónico proporcionado
  User.findByEmail(correo_electronico, (err, user) => {
    if (err) {
      console.error('Error al buscar el correo electrónico:', err);
      return res.status(500).send({ message: 'Error al buscar el correo electrónico' });
    }

    // Si el usuario ya existe, devolver un error
    if (user) {
      return res.status(400).send({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña antes de guardarla en la base de datos
    bcrypt.hash(contrasena_hash, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error al encriptar la contraseña:', err);
        return res.status(500).send({ message: 'Error al encriptar la contraseña' });
      }

      // Datos del nuevo usuario a ser creado
      const newUser = {
        nombre,
        apellido,
        fecha_nacimiento,
        domicilio_ciudad,
        domicilio_departamento,
        telefono,
        correo_electronico,
        contrasena_hash: hashedPassword, // Guardar la contraseña hasheada
        rol: 0 //rol hardcodeadoo
      };

      // Crear el usuario en la base de datos
      User.create(newUser, (err, createdUser) => {
        if (err) {
          console.error('Error al registrar el usuario:', err);
          return res.status(500).send({ message: 'Error al registrar el usuario' });
        }

        // Generar un token JWT para autenticación
        const token = jwt.sign({ id: createdUser.id_usuario, email: correo_electronico }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token como respuesta al cliente
        return res.status(201).send({ token });
      });
    });
  });
};


// Controlador para iniciar sesión
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
        return res.status(400).json({ error: 'Usuario no encontrado.' });
      }

      // Log para verificar los valores antes de comparar contraseñas
      console.log('Contraseña ingresada:', password);
      console.log('Contraseña almacenada (hasheada):', user.contrasena_hash);

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Contraseña incorrecta.' });
      }

      // Crear token JWT
      const token = jwt.sign({ id: user.id_usuario, correo_electronico: user.correo_electronico }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id_usuario,
          correo_electronico: user.correo_electronico
        }
      });
    });
  } catch (err) {
    console.error('ERROR_AUTH-CONTROLLER.LOGIN', err);
    res.status(500).send('Se ha generado un error al iniciar sesión.');
  }
};