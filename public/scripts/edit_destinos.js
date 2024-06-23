const ModalEdicion = {
    modal: document.getElementById('modalEdicion'),
    form: document.getElementById('editForm'),
    idField: document.getElementById('editId'),
    nameField: document.getElementById('editName'),
    descripcionField: document.getElementById('editDescripcion'),
    provinciaField: document.getElementById('editProvincia'),
    categoriasField: document.getElementById('editCategorias'),

    open: function(lugar) {
        this.idField.value = lugar.id_destino;
        this.nameField.value = lugar.name_destino;
        this.descripcionField.value = lugar.descripcion;
        this.provinciaField.value = lugar.id_provincia;

        // Seleccionar las categorías
        Array.from(this.categoriasField.options).forEach(option => {
            option.selected = lugar.categorias.includes(parseInt(option.value));
        });

        this.modal.style.display = "block";
    },

    close: function() {
        this.modal.style.display = "none";
    },

    updateDestino: function() {
        const formData = new FormData(this.form);

        fetch(`/api/destinos/${formData.get('id')}`, {
            method: 'PUT',
            body: JSON.stringify({
                name_destino: formData.get('name_destino'),
                descripcion: formData.get('descripcion'),
                id_provincia: parseInt(formData.get('id_provincia'), 10),
                categorias: formData.getAll('categorias').map(Number)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Si el servidor responde con JSON, parsear la respuesta
            } else {
                throw new Error('Error al actualizar el destino');
            }
        })
        .then(data => {
            // Actualizar la tarjeta en el DOM si es necesario
            const updatedCard = document.querySelector(`.card[data-id="${formData.get('id')}"]`);
            updatedCard.querySelector('h2').textContent = formData.get('name_destino');
            updatedCard.querySelector('p').textContent = formData.get('descripcion');
            this.close(); // Cerrar el modal después de actualizar
        })
        .catch(error => {
            console.error('Error al actualizar el destino:', error);
            alert('Error al actualizar el destino'); // Mostrar mensaje de error al usuario
        });
    }
};

// Event listener para el botón de guardar dentro del formulario de edición
document.addEventListener("DOMContentLoaded", function() {
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            ModalEdicion.updateDestino();
        });
    }

    // Cerrar el modal cuando se hace clic fuera de la ventana modal
    window.onclick = function(event) {
        if (event.target == ModalEdicion.modal) {
            ModalEdicion.close();
        }
    };
});
