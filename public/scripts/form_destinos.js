document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria');
    const selectedCategoriesDiv = document.getElementById('selectedCategories');
    const selectedCategories = new Set();

    categoriaSelect.addEventListener('change', updateSelectedCategories);

    // Función para obtener el token almacenado en localStorage
    function obtenerToken() {
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token);
        return token;
    }

    function updateSelectedCategories() {
        const token = obtenerToken();
        if (!token) {
            console.error('No se encontró token en localStorage');
            return;
        }

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
        const categorias = formData.getAll('categorias').map(id => parseInt(id));
        const imagen_destino = formData.get('imagen_destino');
            
        // Obtener el token dentro del evento submit
        const token = obtenerToken();
        if (!token) {
            console.error('No se encontró token en localStorage');
            return;
        }
        // Convertir categorias a JSON antes de enviarlo
        formData.set('categorias', JSON.stringify(categorias));
    
        console.log('Datos enviados (POST):', {
            name_destino,
            province,
            descripcion,
            categorias,
            imagen_destino
        });
    
        try {
            const response = await fetch('/api/destinos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }
    
            const responseData = await response.json();
            console.log('Respuesta del servidor (POST):', responseData);
            alert(`Destino creado con ID: ${responseData.nuevoDestinoId}`);
    
            // Limpiar el formulario después de éxito
            event.target.reset();
        } catch (error) {
            console.error('Error al enviar la solicitud (POST):', error);
            alert('Hubo un error al crear el destino');
        }
    });
});