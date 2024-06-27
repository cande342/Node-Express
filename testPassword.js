const bcrypt = require('bcryptjs');

const plainPassword = 'admin';

// Crear el hash
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error al hashear la contraseña:', err);
    return;
  }

  console.log('Hash creado:', hash);

  // Comparar la contraseña en texto plano con el hash creado
  bcrypt.compare(plainPassword, hash, (err, isMatch) => {
    if (err) {
      console.error('Error al comparar las contraseñas:', err);
    } else {
      console.log('¿Las contraseñas coinciden?', isMatch);
    }
  });
});
