// public/js/register.js
document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Manejar el caso en que la respuesta del servidor no sea OK (200)
      const result = await response.json();
      alert(result.message);
      return;
    }

    // Si la respuesta es OK, mostrar mensaje de registro exitoso
    alert('Registro exitoso');
     window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error en el registro desde JS');
  }
});
