document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');
    const modal = document.getElementById('modal');
    const modalTitle = modal.querySelector('h2');
    const modalContent = modal.querySelector('.modal-content');

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

        const categories = document.createElement('p');
        categories.classList.add('card-categorias');
        categories.textContent = `Categorías: ${lugar.categorias}`;

        // Botón para ver más
        const moreButton = document.createElement('button');
        moreButton.textContent = 'Ver más';
        moreButton.addEventListener('click', function() {
            showModal(lugar.name_destino, lugar.descripcion); // Mostrar modal con nombre y descripción
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(categories);
        card.appendChild(moreButton);

        // Verificar si el usuario está logeado para mostrar los botones de editar y eliminar
        const token = obtenerToken();
        if (token) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('small-btn');
            editButton.addEventListener('click', function() {
                ModalEdicion.open(lugar); // Abrir el modal de edición con los datos del lugar
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('small-btn');
            deleteButton.addEventListener('click', function() {
                eliminarDestino(lugar.id_destino); // Llamar a la función para eliminar el destino
            });

            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
            btnContainer.appendChild(editButton);
            btnContainer.appendChild(deleteButton);
            card.appendChild(btnContainer);
        }

        return card;
    }

    // Función para mostrar el modal con nombre y descripción
    function showModal(name, description) {
        closeModal(); // Cerrar el modal actual antes de abrir uno nuevo

        modalTitle.textContent = name;
        const modalDescription = document.createElement('p');
        modalDescription.textContent = description;

        const closeModalButton = document.createElement('span');
        closeModalButton.classList.add('close');
        closeModalButton.textContent = '×';
        closeModalButton.addEventListener('click', () => {
            closeModal();
        });

        modalContent.innerHTML = '';
        modalContent.appendChild(closeModalButton);
        modalContent.appendChild(modalDescription);

        modal.style.display = 'block';
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

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
                closeModal();
            } else {
                alert('Error al eliminar el destino');
            }
        })
        .catch(error => console.error('Error al eliminar el destino:', error));
    }
});
