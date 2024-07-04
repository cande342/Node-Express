document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (token) {
        // Usuario autenticado: Cambiar el texto del botón a "Cerrar Sesión"
        const loginButton = document.querySelector('nav.nav-items ul li:last-child a');
        if (loginButton) {
            loginButton.textContent = 'Cerrar Sesión';
            loginButton.href = '#'; 
            loginButton.addEventListener('click', function() {
                localStorage.removeItem('token');
                window.location.href = '/home'; 
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
