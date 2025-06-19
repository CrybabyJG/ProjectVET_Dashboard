function cargarEnfermedades() {
    const tbody       = document.querySelector('#loadEnfermedadList tbody');
    const addBtn      = document.getElementById('addEnfermedadBtn');
    const modal       = document.getElementById('enfermedadModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('enfermedadForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/catalogos/enfermedades/';
    const inpCodigo   = document.getElementById('codigo');
    const inpNombre   = document.getElementById('nombre');
    let editarId = null;

    if (!tbody || !addBtn || !modal || !closeModal || !form || !title || !inpCodigo || !inpNombre) {
        // Si la vista no está cargada, no hacer nada
        return;
    }

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
                    tr.insertCell(0).textContent = item.ID_Enfermedades;
                    tr.insertCell(1).textContent = item.Codigo_Enfermedades;
                    tr.insertCell(2).textContent = item.Nombre_Enfermedad;

                    // Editar
                    const tdEdit = tr.insertCell(3);
                    const btnEdit = document.createElement('button');
                    btnEdit.classList.add('btn-edit');
                    btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                    btnEdit.addEventListener('click', () => abrirModal(item));
                    tdEdit.appendChild(btnEdit);

                    // Eliminar
                    const tdDel = tr.insertCell(4);
                    const btnDel = document.createElement('button');
                    btnDel.classList.add('btn-delete');
                    btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                    btnDel.addEventListener('click', () => eliminarEnfermedad(item.ID_Enfermedades));
                    tdDel.appendChild(btnDel);
                });
            }

            function renderPagination() {
                const pageCount = Math.ceil(data.length / itemsPerPage);
                const pagination = document.getElementById('pagination');
                pagination.innerHTML = '';

                for (let i = 1; i <= pageCount; i++) {
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
            }

            renderTable(currentPage);
            renderPagination();
        });
    }

    function abrirModal(enfermedad = null) {
        editarId = enfermedad ? enfermedad.ID_Enfermedades : null;
        title.textContent = enfermedad ? 'Editar Enfermedad' : 'Agregar Enfermedad';
        inpCodigo.value = enfermedad?.Codigo_Enfermedades || '';
        inpNombre.value = enfermedad?.Nombre_Enfermedad   || '';
        modal.style.display = 'flex';
    }

    function eliminarEnfermedad(id) {
        if (!confirm('¿Seguro que deseas eliminar esta enfermedad?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                fetchAndRender();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar la enfermedad.');
            });
    }

    // Asignar eventos (elimina listeners previos para evitar duplicados)
    addBtn.onclick = () => abrirModal();
    closeModal.onclick = () => { modal.style.display = 'none'; };
    form.onsubmit = function (e) {
        e.preventDefault();
        const payload = {
            Codigo_Enfermedades: inpCodigo.value.trim(),
            Nombre_Enfermedad:   inpNombre.value.trim()
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
            modal.style.display = 'none';
            fetchAndRender();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar la enfermedad.');
        });
    };

    fetchAndRender();
}

window.cargarEnfermedades = cargarEnfermedades;