document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');

    fetch('/api/destinos')
        .then(response => response.json())
        .then(lugaresTuristicos => {
            lugaresTuristicos.forEach(lugar => {
                const card = document.createElement('div');
                card.classList.add('card');

                const img = document.createElement('img');
                img.src = 'ruta/a/la/imagen'; // Cambiar esto por la URL correcta si la tienes
                img.alt = lugar.name_destino;

                const title = document.createElement('h2');
                title.textContent = lugar.name_destino;

                const description = document.createElement('p');
                description.textContent = lugar.descripcion;

                const categories = document.createElement('p');
                categories.textContent = `Categorías: ${lugar.categorias}`;

                // Agregar evento de clic a la tarjeta para abrir el modal
                card.addEventListener('click', function() {
                    openModal(lugar);
                });

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(categories);

                cardContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Función para cerrar el modal
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = "none";
    }

    // Función para abrir el modal
    function openModal(lugar) {
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-content');

        // Limpiar contenido previo del modal
        modalContent.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = lugar.name_destino;

        const provincia = document.createElement('p');
        provincia.textContent = `Provincia: ${lugar.nombre_provincia}`;

        const descripcion = document.createElement('p');
        descripcion.textContent = lugar.descripcion;

        const categorias = document.createElement('p');
        categorias.textContent = `Categorías: ${lugar.categorias}`;

        modalContent.appendChild(title);
        modalContent.appendChild(provincia);
        modalContent.appendChild(descripcion);
        modalContent.appendChild(categorias);

        // Agregar botón de cierre al modal
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.innerHTML = '&times;';
        modalContent.appendChild(closeBtn);

        // Mostrar el modal
        modal.style.display = "block";

        // Asignar evento de clic al botón de cierre
        closeBtn.addEventListener('click', closeModal);
    }
});