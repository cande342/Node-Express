document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch('/auth/login', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al iniciar sesión');
    }
    return response.json();
  })
  .then(data => {
    console.log('Respuesta del servidor:', data);
    localStorage.setItem('token', data.token);
    window.location.href = '/destinos';
  })
  .catch(error => {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
  });
});
