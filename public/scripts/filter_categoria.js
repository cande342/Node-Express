document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const categoryItems = document.querySelectorAll('.category-item');
    const cardContainer = document.querySelector('.card-container');

    // Agregar evento para manejar el cambio de categoría en el select
    categorySelect.addEventListener('change', async () => {
        const selectedCategoryId = parseInt(categorySelect.value);
        await fetchAndDisplayDestinos(selectedCategoryId);
    });

    // Agregar eventos para manejar los clicks en los items de categoría
    categoryItems.forEach(item => {
        item.addEventListener('click', async () => {
            const selectedCategoryId = parseInt(item.getAttribute('data-category-id'));
            await fetchAndDisplayDestinos(selectedCategoryId);
        });
    });

    // Función para obtener y mostrar destinos filtrados por categoría
    async function fetchAndDisplayDestinos(categoryId) {
        try {
            console.log(`Fetching destinos for category: ${categoryId}`); // Verifica que la categoría seleccionada es correcta
            const response = await fetch(`/api/destinos/categoria/${categoryId}`);
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }

            const destinos = await response.json();
            console.log('Destinos obtenidos:', destinos); // Verifica que los datos obtenidos son correctos
            displayDestinos(destinos);
        } catch (error) {
            console.error('Error al obtener destinos:', error);
            alert('Hubo un problema al obtener los destinos');
        }
    }

    // Función para mostrar los destinos en el contenedor
    function displayDestinos(destinos) {
        cardContainer.innerHTML = '';

        destinos.forEach(destino => {
            console.log(`Checking destino: ${destino.id_destino} with category: ${destino.categoria_id}`);
            const card = createDestinoCard(destino);
            cardContainer.appendChild(card);
        });

        console.log(`Displayed ${cardContainer.children.length} destinos`); // Verifica cuántas tarjetas se están mostrando
    }

    // Función para crear la estructura de una tarjeta de destino
    function createDestinoCard(destino) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = `http://localhost:3001/uploads/${destino.img_path}`;
        img.alt = destino.name_destino;

        const name = document.createElement('h3');
        name.textContent = destino.name_destino;

        const description = document.createElement('p');
        description.textContent = destino.descripcion;

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(description);

        return card;
    }
});
