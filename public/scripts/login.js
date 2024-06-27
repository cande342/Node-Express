// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo_electronico: correo, password: password }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Manejar la respuesta del servidor correctamente
      // Por ejemplo, guardar el token en localStorage y redirigir a otra página
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard'; // Redirigir a la página de dashboard o perfil, etc.
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      // Mostrar mensaje de error al usuario o manejar el error de otra manera
      alert('Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.');
    });
});
