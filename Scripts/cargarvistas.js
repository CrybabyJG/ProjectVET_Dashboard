// Espera a que el DOM esté listo
window.addEventListener("DOMContentLoaded", function () {
  // Delegación de eventos para los enlaces con data-view
  document.body.addEventListener("click", function (e) {
    const link = e.target.closest("[data-view]");
    if (!link) return;
    e.preventDefault();
    const viewKey = link.getAttribute("data-view");
    const views = {
      Enfermedades: `
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
            `,
      Reporte: `

            <div class="main__card ">
                     <h2>Reporte de Medicamentos (Maestro-Detalle)</h2>
            </div>
                
            <div class="main__card ">
                <h3 class="estadistica-titulo">Medicamentos por Presentación</h3>
            </div>
                <p>Cantidad total de medicamentos registrados por tipo de presentación.</p>
                <div id="bar-chart"></div>
  

            <div class="main__card">
                <h3 class="estadistica-titulo">Dosis Totales por Presentación</h3>
            </div>
                <p>Total de unidades recetadas (sumando todas las cantidades en citas).</p>
                <div id="line-chart"></div>
 

            <div class="main__card">
                <h3 class="estadistica-titulo">Precio Promedio por Presentación</h3>
            </div>
                <p>Promedio del precio de medicamentos según presentación.</p>
                <div id="radar-chart"></div>
 

            `,
      Clientes: `
            <div class="title-container">
      <h2>Listado de Clientes</h2>
      <button id="addClienteBtn" class="btn-add">Agregar Cliente</button>
    </div>

    <table id="loadClienteList" class="table-client">
      <thead class="table-client__head">
        <tr>
          <th class="table-client__header">ID</th>
          <th class="table-client__header">Código</th>
          <th class="table-client__header">Nombres</th>
          <th class="table-client__header">Primer Apellido</th>
          <th class="table-client__header">Segundo Apellido</th>
          <th class="table-client__header">Correo</th>
          <th class="table-client__header">Teléfono</th>
          <th class="table-client__header">Dirección</th>
          <th class="table-client__header">Editar</th>
          <th class="table-client__header">Eliminar</th>
        </tr>
      </thead>
      <tbody class="table-client__body"></tbody>
    </table>
    <div id="pagination" class="pagination"></div>

    <!-- Formulario Modal -->
    <div id="clienteModal" class="modal">
      <div class="modal-content">
        <span class="close" id="closeModal">&times;</span>
        <h2 id="modal-title" class="modal__title">Agregar Cliente</h2>
        <form id="clienteForm" class="form-client">
          <label for="codigo" class="form-client__label"
            >Código de Cliente:</label
          >
          <input type="text" id="codigo" class="form-client__input" required />

          <label for="nombres" class="form-client__label">Nombres:</label>
          <input type="text" id="nombres" class="form-client__input" required />

          <label for="apellido1" class="form-client__label"
            >Primer Apellido:</label
          >
          <input
            type="text"
            id="apellido1"
            class="form-client__input"
            required
          />

          <label for="apellido2" class="form-client__label"
            >Segundo Apellido:</label
          >
          <input type="text" id="apellido2" class="form-client__input" />

          <label for="correo" class="form-client__label">Correo:</label>
          <input type="email" id="correo" class="form-client__input" required />

          <label for="telefono" class="form-client__label">Teléfono:</label>
          <input type="text" id="telefono" class="form-client__input" />

          <label for="direccion" class="form-client__label">Dirección:</label>
          <input type="text" id="direccion" class="form-client__input" />

          <button type="submit" id="guardarBtn" class="btn-save">
            Guardar
          </button>
        </form>
      </div>
    </div>

            `,
    };
    const mainContent = document.querySelector(".main-content");
    if (mainContent && views[viewKey]) {
      mainContent.innerHTML = views[viewKey];
      if (
        viewKey === "Enfermedades" &&
        typeof window.cargarEnfermedades === "function"
      ) {
        window.cargarEnfermedades();
      }
      if (viewKey === "Clientes" && typeof window.cargarClientes === "function") {
        window.cargarClientes();
      }
      // Ejecutar renderCharts si la vista es Reporte
      if (viewKey === "Reporte" && typeof window.renderCharts === "function") {
        window.renderCharts();
      }
    }
  });
});
