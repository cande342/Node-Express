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

    const result = await response.json();
    if (response.ok) {
      alert('Registro exitoso');
      // Redirigir o realizar alguna acción después del registro exitoso
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error en el registro desde JS');
  }
});
