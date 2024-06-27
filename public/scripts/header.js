document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (token) {
        // Usuario autenticado: Cambiar el texto del botón a "Cerrar Sesión"
        const loginButton = document.querySelector('nav.nav-items ul li:last-child a');
        if (loginButton) {
            loginButton.textContent = 'Cerrar Sesión';
            loginButton.href = '#'; // Aquí deberías definir la acción de cerrar sesión
            loginButton.addEventListener('click', function() {
                localStorage.removeItem('token');
                window.location.href = '/'; 
            });
        }
    } else {
        // Usuario no autenticado: Mantener el texto original del botón "Iniciar Sesión"
        const loginButton = document.querySelector('nav.nav-items ul li:last-child a');
        if (loginButton) {
            loginButton.textContent = 'Iniciar Sesión';
            loginButton.href = 'login.html'; // Ruta al formulario de inicio de sesión
        }
    }
});
