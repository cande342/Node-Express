const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.usuario = decoded; // Almacenar el usuario decodificado en el objeto de solicitud
    next();
  });
}

module.exports = verificarToken;

