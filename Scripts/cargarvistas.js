

// Espera a que el DOM esté listo
window.addEventListener('DOMContentLoaded', function () {
    // Delegación de eventos para los enlaces con data-view
    document.body.addEventListener('click', function (e) {
        const link = e.target.closest('[data-view]');
        if (!link) return;
        e.preventDefault();
        const viewKey = link.getAttribute('data-view');
        const views = {
            'Clientes': `
                <div class="title-container">
                    <h2>Enfermedades</h2>
                    <button class="btn-add" id="addEnfermedadBtn">Agregar Enfermedad</button>
                </div>
                <table class="table-client" id="loadEnfermedadList">
                    <thead class="table-client__head">
                        <tr>
                            <th class="table-client__header">ID</th>
                            <th class="table-client__header">Código</th>
                            <th class="table-client__header">Nombre</th>
                            <th class="table-client__header">Editar</th>
                            <th class="table-client__header">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody class="table-client__body"></tbody>
                </table>
                <div id="pagination" class="pagination"></div>
                <div class="modal" id="enfermedadModal">
                    <div class="modal-content">
                        <span class="close" id="closeModal">&times;</span>
                        <h2 class="modal__title" id="modal-title">Agregar Enfermedad</h2>
                        <form id="enfermedadForm" class="form-client">
                            <label class="form-client__label">Código:
                                <input type="text" id="codigo" class="form-client__input" required />
                            </label>
                            <label class="form-client__label">Nombre:
                                <input type="text" id="nombre" class="form-client__input" required />
                            </label>
                            <button type="submit" class="btn-save">Guardar</button>
                        </form>
                    </div>
                </div>
            `
        };
        const mainContent = document.querySelector('.main-content');
        if (mainContent && views[viewKey]) {
            mainContent.innerHTML = views[viewKey];
            if (viewKey === 'Clientes' && typeof window.cargarEnfermedades === 'function') {
                window.cargarEnfermedades();
            }
        }
    });
});
