const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {
  // Obtener el token de la cabecera Authorization
  const token = req.header('Authorization');

  // Verificar si el token está presente y tiene el formato adecuado
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado, token requerido.' });
  }

  // Extraer el token sin el prefijo 'Bearer '
  const tokenSinBearer = token.replace('Bearer ', '');

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(tokenSinBearer, JWT_SECRET);

    // Agregar el usuario decodificado al objeto de solicitud (req)
    req.user = decoded;

    // Continuar con el siguiente middleware o controlador
    next();
  } catch (err) {
    // Capturar errores específicos de verificación del token
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    // Otros errores de verificación del token
    res.status(401).json({ error: 'Error al verificar el token.' });
  }
};

module.exports = verificarToken;
