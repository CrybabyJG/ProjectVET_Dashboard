async function getData(url) {
      const res = await fetch(url);
      return await res.json();
    }

    async function renderCharts() {
      const [medicamentos, presentaciones] = await Promise.all([
        getData("http://127.0.0.1:8000/catalogos/medicamento/"),
        getData("http://127.0.0.1:8000/catalogos/presentacion/")
      ]);

      const mapPresentacion = {};
      for (const p of presentaciones) {
        mapPresentacion[p.ID_Presentacion] = p.Nombre_Presentacion;
      }

      // Agregamos nombre de presentación al objeto
      const medsConDatos = medicamentos.map(m => ({
        ...m,
        PresentacionNombre: mapPresentacion[m.ID_Presentacion]
      }));

      // Agrupamos por presentación
      const grouped = {};
      for (const m of medsConDatos) {
        const pres = m.PresentacionNombre || 'Sin presentación';
        if (!grouped[pres]) grouped[pres] = [];
        grouped[pres].push(m);
      }

      const presentacionesNombres = Object.keys(grouped);

      // 📦 Cantidad de medicamentos por presentación
      const countPorPresentacion = presentacionesNombres.map(p => grouped[p].length);

      // 💉 Suma total de cantidades recetadas por presentación
      const dosisTotales = presentacionesNombres.map(p => {
        return grouped[p].reduce((acc, m) => {
          const detalles = m.detalles || [];
          return acc + detalles.reduce((suma, d) => suma + (parseInt(d.Cantidad) || 0), 0);
        }, 0);
      });

      // 💲 Promedio de precios por presentación
      const precioPromedio = presentacionesNombres.map(p => {
        const lista = grouped[p];
        const total = lista.reduce((acc, m) => acc + parseFloat(m.Precio), 0);
        return (total / lista.length).toFixed(2);
      });

      // Gráfica: Medicamentos por presentación
      new ApexCharts(document.querySelector("#bar-chart"), {
        chart: { type: 'bar', height: 350 },
        series: [{ name: "Medicamentos", data: countPorPresentacion }],
        xaxis: { categories: presentacionesNombres }
      }).render();

      // Gráfica: Total de dosis por presentación
      new ApexCharts(document.querySelector("#line-chart"), {
        chart: { type: 'line', height: 350 },
        series: [{ name: "Dosis Recetadas", data: dosisTotales }],
        xaxis: { categories: presentacionesNombres }
      }).render();

      // Gráfica: Precio promedio por presentación
      new ApexCharts(document.querySelector("#radar-chart"), {
        chart: { type: 'radar', height: 350 },
        series: [{ name: "Precio Promedio", data: precioPromedio }],
        labels: presentacionesNombres
      }).render();
    }

    renderCharts();