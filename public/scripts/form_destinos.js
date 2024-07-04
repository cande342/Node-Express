document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');

    // Función para obtener el token almacenado en localStorage
    function obtenerToken() {
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token);
        return token;
    }

    // Verificar si el usuario está logeado y mostrar/ocultar el formulario
    const token = obtenerToken();
    if (token) {
        formContainer.style.display = 'block';  // Mostrar el formulario si el usuario está logeado
    } else {
        formContainer.style.display = 'none';   // Ocultar el formulario si el usuario no está logeado
    }

    // Evento change en el select de categorías
    const categoriaSelect = document.getElementById('categoria');
    const selectedCategoriesDiv = document.getElementById('selectedCategories');
    const selectedCategories = new Set();

    categoriaSelect.addEventListener('change', updateSelectedCategories);

    function updateSelectedCategories() {
        selectedCategoriesDiv.innerHTML = '';

        selectedCategories.clear();

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
                    updateSelectedCategories(); // Actualizar la visualización de categorías seleccionadas
                }
            });

            categoryDiv.appendChild(categorySpan);
            categoryDiv.appendChild(removeButton);
            selectedCategoriesDiv.appendChild(categoryDiv);
        });
    }

    // Evento submit del formulario
    document.getElementById('destinoForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obtener token nuevamente para asegurar que el usuario sigue logeado antes de enviar
        const token = obtenerToken();
        if (!token) {
            console.error('No se encontró token en localStorage');
            alert('Debe iniciar sesión para crear un destino.');
            return;
        }

        const formData = new FormData(event.target);
        const name_destino = formData.get('name_destino');
        const province = parseInt(formData.get('province'));
        const descripcion = formData.get('descripcion');
        const categorias = formData.getAll('categorias').map(id => parseInt(id));
        const imagen_destino = formData.get('imagen_destino');

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
