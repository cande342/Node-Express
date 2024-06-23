document.addEventListener('DOMContentLoaded', () => {

    const categoriaSelect = document.getElementById('categoria');
    const selectedCategoriesDiv = document.getElementById('selectedCategories');
    const selectedCategories = new Set(); // Usamos un Set para almacenar las categorías seleccionadas
    
    categoriaSelect.addEventListener('change', updateSelectedCategories);
    
    function updateSelectedCategories() {
        // Limpiamos el contenedor antes de agregar las categorías
        selectedCategoriesDiv.innerHTML = '';
    
        // Recorremos las opciones seleccionadas y las agregamos al Set de categorías seleccionadas
        Array.from(categoriaSelect.selectedOptions).forEach(option => {
            selectedCategories.add(option.value);
        });
    
        // Iteramos sobre el Set de categorías seleccionadas y las mostramos en el contenedor
        selectedCategories.forEach(categoryValue => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('selected-category');
            categoryDiv.setAttribute('data-value', categoryValue);
    
            const categorySpan = document.createElement('span');
            categorySpan.textContent = categoriaSelect.querySelector(`option[value="${categoryValue}"]`).textContent;
    
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', () => {
                // Desmarcamos la opción en el select
                const optionToRemove = categoriaSelect.querySelector(`option[value="${categoryValue}"]`);
                if (optionToRemove) {
                    optionToRemove.selected = false;
                    selectedCategories.delete(categoryValue); // Eliminamos la categoría del Set
                    updateSelectedCategories(); // Actualizamos la lista de categorías seleccionadas
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
    const description = formData.get('description');
    const categoria = parseInt(formData.get('categoria'));
    const data = { name_destino, province, description, categoria };

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    };
    try {
        const response = await fetch('api/destinos', requestOptions);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${errorText}`);
        }
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
});

});