document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria');
    const selectedCategoriesDiv = document.getElementById('selectedCategories');
    const selectedCategories = new Set();

    categoriaSelect.addEventListener('change', updateSelectedCategories);

    function updateSelectedCategories() {
        selectedCategoriesDiv.innerHTML = '';

        Array.from(categoriaSelect.selectedOptions).forEach(option => {
            selectedCategories.add(option.value);
        });

        selectedCategories.forEach(categoryValue => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('selected-category');
            categoryDiv.setAttribute('data-value', categoryValue);

            const categorySpan = document.createElement('span');
            categorySpan.textContent = categoriaSelect.querySelector(`option[value="${categoryValue}"]`).textContent;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', () => {
                const optionToRemove = categoriaSelect.querySelector(`option[value="${categoryValue}"]`);
                if (optionToRemove) {
                    optionToRemove.selected = false;
                    selectedCategories.delete(categoryValue);
                    updateSelectedCategories();
                }
            });

            categoryDiv.appendChild(categorySpan);
            categoryDiv.appendChild(removeButton);
            selectedCategoriesDiv.appendChild(categoryDiv);
        });
    }

    document.getElementById('destinoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name_destino = formData.get('name_destino');
        const province = parseInt(formData.get('province'));
        const descripcion = formData.get('descripcion');
        const categorias = Array.from(selectedCategories); // Convertir el Set a un array de strings

        const data = { name_destino, province, descripcion, categorias };

        console.log('Datos enviados (POST):', data);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        try {
            const response = await fetch('/api/destinos', requestOptions);
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }
            const responseData = await response.json();
            console.log('Respuesta del servidor (POST):', responseData);
            // Aquí podrías agregar lógica adicional después de crear el destino, si es necesario
        } catch (error) {
            console.error('Error al enviar la solicitud (POST):', error);
        }
    });
});