document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');

    // Función para obtener el token almacenado en localStorage
    function obtenerToken() {
        return localStorage.getItem('token');
    }

    // Función para cargar los destinos al cargar la página
    function cargarDestinos() {
        fetch('/api/destinos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los destinos');
                }
                return response.json();
            })
            .then(lugaresTuristicos => {
                lugaresTuristicos.forEach(lugar => {
                    const card = createCard(lugar);
                    cardContainer.appendChild(card);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    cargarDestinos(); // Cargar destinos al cargar la página

    // Función para crear una tarjeta (card)
    function createCard(lugar) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', lugar.id_destino);

        const img = document.createElement('img');
        img.src = `http://localhost:3001/uploads/${lugar.img_path}`;
        img.alt = lugar.name_destino;

        const title = document.createElement('h2');
        title.textContent = lugar.name_destino;

        const description = document.createElement('p');
        description.textContent = lugar.descripcion;

        const categories = document.createElement('p');
        categories.classList.add('card-categorias');
        categories.textContent = `Categorías: ${lugar.categorias}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function() {
            ModalEdicion.open(lugar); // Abrir el modal de edición con los datos del lugar
        });

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
        const token = obtenerToken();
        if (!token) {
            console.error('No se encontró token en localStorage');
            return;
        }

        fetch(`/api/destinos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                document.querySelector(`.card[data-id="${id}"]`).remove();
                closeModal('modal');
            } else {
                alert('Error al eliminar el destino');
            }
        })
        .catch(error => console.error('Error al eliminar el destino:', error));
    }
});