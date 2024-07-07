// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  fetch('auth/login', {
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
      window.location.href = '/destinos'; 
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión.');
    });
});
