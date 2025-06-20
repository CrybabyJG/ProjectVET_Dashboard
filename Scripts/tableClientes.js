function cargarClientes() {
    const tbody       = document.querySelector('#loadClienteList tbody');
    const addBtn      = document.getElementById('addClienteBtn');
    const modal       = document.getElementById('clienteModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('clienteForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/seguridad/clientes/';

    // Campos del formulario
    const inpCodigo    = document.getElementById('codigo');
    const inpNombres   = document.getElementById('nombres');
    const inpApellido1 = document.getElementById('apellido1');
    const inpApellido2 = document.getElementById('apellido2');
    const inpCorreo    = document.getElementById('correo');
    const inpTelefono  = document.getElementById('telefono');
    const inpDireccion = document.getElementById('direccion');

    let editarId = null;

    if (!tbody || !addBtn || !modal || !closeModal || !form || !title || !inpCodigo || !inpNombres) {
        return; // Si la vista no está lista, detener
    }

    function limpiarFormulario() {
        form.reset();
        editarId = null;
    }

    function abrirModal(cliente = null) {
        limpiarFormulario();
        editarId = cliente ? cliente.ID_Cliente : null;
        title.textContent = cliente ? 'Editar Cliente' : 'Agregar Cliente';

        inpCodigo.value    = cliente?.Codigo_Cliente || '';
        inpNombres.value   = cliente?.Nombres || '';
        inpApellido1.value = cliente?.Apellido1 || '';
        inpApellido2.value = cliente?.Apellido2 || '';
        inpCorreo.value    = cliente?.Correo || '';
        inpTelefono.value  = cliente?.Telefono || '';
        inpDireccion.value = cliente?.Direccion || '';

        modal.style.display = 'flex';
        setTimeout(() => {
            inpCodigo.focus();
        }, 100);
    }

    function cerrarModal() {
        modal.style.display = 'none';
        limpiarFormulario();
    }

    // Cerrar modal al hacer click fuera del contenido
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    // Cerrar modal con Escape
    document.addEventListener('keydown', function (e) {
        if (modal.style.display === 'flex' && e.key === 'Escape') {
            cerrarModal();
        }
    });

    function fetchAndRender() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                const itemsPerPage = 10;
                let currentPage = 1;

                function renderTable(page) {
                    tbody.innerHTML = '';
                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageData = data.slice(start, end);

                    pageData.forEach(item => {
                        const tr = tbody.insertRow();
                        const headers = [
                            'ID', 'Código', 'Nombres', 'Primer Apellido', 'Segundo Apellido', 'Correo', 'Teléfono', 'Dirección'
                        ];
                        const values = [
                            item.ID_Cliente,
                            item.Codigo_Cliente,
                            item.Nombres,
                            item.Apellido1,
                            item.Apellido2 || '',
                            item.Correo,
                            item.Telefono || '',
                            item.Direccion || ''
                        ];
                        for (let i = 0; i < headers.length; i++) {
                            const td = tr.insertCell(i);
                            td.textContent = values[i];
                            td.setAttribute('data-label', headers[i]);
                        }
                        // Botón editar
                        const tdEdit = tr.insertCell(8);
                        tdEdit.setAttribute('data-label', 'Editar');
                        const btnEdit = document.createElement('button');
                        btnEdit.classList.add('btn-edit');
                        btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                        btnEdit.addEventListener('click', () => abrirModal(item));
                        tdEdit.appendChild(btnEdit);
                        // Botón eliminar
                        const tdDel = tr.insertCell(9);
                        tdDel.setAttribute('data-label', 'Eliminar');
                        const btnDel = document.createElement('button');
                        btnDel.classList.add('btn-delete');
                        btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                        btnDel.addEventListener('click', () => eliminarCliente(item.ID_Cliente));
                        tdDel.appendChild(btnDel);
                    });
                }

                function renderPagination() {
                    const pageCount = Math.ceil(data.length / itemsPerPage);
                    const pagination = document.getElementById('pagination');
                    pagination.innerHTML = '';

                    // Mostrar máximo 3 páginas a la vez
                    let startPage = Math.max(1, currentPage - 1);
                    let endPage = Math.min(pageCount, startPage + 2);
                    // Ajustar si estamos al final
                    if (endPage - startPage < 2) {
                        startPage = Math.max(1, endPage - 2);
                    }

                    // Botón anterior
                    if (startPage > 1) {
                        const prevBtn = document.createElement('button');
                        prevBtn.textContent = '«';
                        prevBtn.onclick = () => {
                            currentPage = startPage - 1;
                            renderTable(currentPage);
                            renderPagination();
                        };
                        pagination.appendChild(prevBtn);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                        const btn = document.createElement('button');
                        btn.textContent = i;
                        btn.classList.toggle('active', i === currentPage);
                        btn.addEventListener('click', () => {
                            currentPage = i;
                            renderTable(currentPage);
                            renderPagination();
                        });
                        pagination.appendChild(btn);
                    }

                    // Botón siguiente
                    if (endPage < pageCount) {
                        const nextBtn = document.createElement('button');
                        nextBtn.textContent = '»';
                        nextBtn.onclick = () => {
                            currentPage = endPage + 1;
                            renderTable(currentPage);
                            renderPagination();
                        };
                        pagination.appendChild(nextBtn);
                    }
                }

                renderTable(currentPage);
                renderPagination();
            })
            .catch(err => {
                console.error('Error al cargar clientes:', err);
                alert('No se pudieron cargar los clientes.');
            });
    }

    function eliminarCliente(id) {
        if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;

        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                fetchAndRender();
            })
            .catch(err => {
                console.error('Error al eliminar cliente:', err);
                alert('No se pudo eliminar el cliente.');
            });
    }

    // Eventos
    addBtn.onclick = () => abrirModal();
    closeModal.onclick = cerrarModal;

    form.onsubmit = function (e) {
        e.preventDefault();

        const payload = {
            Codigo_Cliente: inpCodigo.value.trim(),
            Nombres:        inpNombres.value.trim(),
            Apellido1:      inpApellido1.value.trim(),
            Apellido2:      inpApellido2.value.trim(),
            Correo:         inpCorreo.value.trim(),
            Telefono:       inpTelefono.value.trim(),
            Direccion:      inpDireccion.value.trim()
        };

        const url = editarId ? `${apiUrl}${editarId}/` : apiUrl;
        const method = editarId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al guardar');
            cerrarModal();
            fetchAndRender();
        })
        .catch(err => {
            console.error('Error al guardar cliente:', err);
            alert('Hubo un problema al guardar el cliente.');
        });
    };

    // Carga inicial
    fetchAndRender();
}

window.cargarClientes = cargarClientes;
