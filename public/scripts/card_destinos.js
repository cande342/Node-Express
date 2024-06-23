document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');

    fetch('/api/destinos')
        .then(response => response.json())
        .then(lugaresTuristicos => {
            lugaresTuristicos.forEach(lugar => {
                const card = createCard(lugar);
                cardContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Función para crear una tarjeta (card)
    function createCard(lugar) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', lugar.id_destino);

        const img = document.createElement('img');
        img.src = 'ruta/a/la/imagen'; // Reemplaza esto por la URL correcta si la tienes
        img.alt = lugar.name_destino;

        const title = document.createElement('h2');
        title.textContent = lugar.name_destino;

        const description = document.createElement('p');
        description.textContent = lugar.descripcion;

        const categories = document.createElement('p');
        categories.classList.add('card-categorias'); // Clase para categorías
        categories.textContent = `Categorías: ${lugar.categorias}`;

        // Botón de Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function() {
            ModalEdicion.open(lugar); // Abrir el modal de edición con los datos del lugar
        });

        // Botón de Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function() {
            eliminarDestino(lugar.id_destino); // Llamar a la función para eliminar el destino
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(categories);
        card.appendChild(editButton);
        card.appendChild(deleteButton);

        return card;
    }


    // Función para eliminar un destino
    function eliminarDestino(id) {
        fetch(`/api/destinos/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Eliminar la tarjeta del DOM si la eliminación fue exitosa
                document.querySelector(`.card[data-id="${id}"]`).remove();
                closeModal('modal'); // Cerrar el modal si se elimina correctamente
            } else {
                alert('Error al eliminar el destino');
            }
        })
        .catch(error => console.error('Error al eliminar el destino:', error));
    }
});
