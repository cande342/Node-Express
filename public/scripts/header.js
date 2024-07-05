document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const loginButton = document.querySelector('nav.nav-items ul li:last-child a');

    if (token) {
        // Usuario autenticado: Cambiar el texto del botón a "Cerrar Sesión"
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
        if (loginButton) {
            loginButton.textContent = 'Iniciar Sesión';
            loginButton.href = 'login.html'; // Ruta al formulario de inicio de sesión
        }
    }

    // Lógica del menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const navItems = document.querySelector('.nav-items ul');

    menuToggle.addEventListener('click', function() {
        navItems.classList.toggle('show');
    });
});
