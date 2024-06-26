// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;


exports.register = (req, res) => {
  const { nombre, apellido, fecha_nacimiento, domicilio_ciudad, domicilio_departamento, telefono, correo_electronico, contrasenia } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!nombre || !apellido || !fecha_nacimiento || !domicilio_ciudad || !domicilio_departamento || !telefono || !correo_electronico || !contrasenia) {
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
    bcrypt.hash(contrasenia, 10, (err, hashedPassword) => {
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
        rol: 0 // Aquí puedes hardcodear el rol como 0 para usuario normal
      };

      // Crear el usuario en la base de datos
      User.create(newUser, (err, createdUser) => {
        if (err) {
          console.error('Error al registrar el usuario:', err);
          return res.status(500).send({ message: 'Error al registrar el usuario' });
        }

        // Datos para crear el login del usuario
        const loginData = {
          correo_electronico,
          contrasenia: hashedPassword, // Contraseña encriptada
          id_usuario: createdUser.id_usuario // Obtener el id_usuario del usuario creado
        };

        // Crear el login asociado al usuario
        User.createLogin(loginData, (err, createdLogin) => {
          if (err) {
            console.error('Error al crear login:', err);
            return res.status(500).send({ message: 'Error al crear login' });
          }

          // Generar un token JWT para autenticación
          const token = jwt.sign({ id: createdUser.id_usuario, email: correo_electronico }, 'tu_secreto', { expiresIn: '1h' });

          // Enviar el token como respuesta al cliente
          return res.status(201).send({ token });
        });
      });
    });
  });
};

exports.login = (req, res) => {

  const { correo_electronico, contrasenia } = req.body;
  
  if (!correo_electronico || !contrasenia) {
    return res.status(400).json({ message: 'Por favor, ingrese correo electrónico y contraseña' });
  }

  // Buscar el usuario por correo electrónico en la base de datos
  User.findByEmail(correo_electronico, (err, user) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }

    // Si no se encuentra un usuario con el correo electrónico proporcionado
    if (!user) {
      return res.status(404).json({ message: 'Correo electrónico no registrado' });
    }

    // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
    bcrypt.compare(contrasenia, user.contrasenia, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }

      // Si las contraseñas coinciden, generar un token JWT y enviarlo como respuesta
      if (isMatch) {
        const token = jwt.sign({ id: user.id_usuario, email: user.correo_electronico }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } else {
        // Si las contraseñas no coinciden, devolver un error de contraseña incorrecta
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    });
  });
};