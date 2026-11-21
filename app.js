const alumnosIniciales = [
  { matricula: "AG-202601", nombre: "Sofía Ramírez Hernández", grupo: "3° A - Desarrollo Web", promedio: 9.4, estatus: "Activo" },
  { matricula: "AG-202602", nombre: "Carlos Mendoza López", grupo: "2° B - Sistemas", promedio: 7.2, estatus: "En Riesgo" },
  { matricula: "AG-202603", nombre: "Valeria Torres Cruz", grupo: "1° A - Ingeniería", promedio: 8.8, estatus: "Activo" }
];

let alumnos = JSON.parse(localStorage.getItem("aulagestion_alumnos")) || alumnosIniciales;

function guardarDatos() {
  localStorage.setItem("aulagestion_alumnos", JSON.stringify(alumnos));
}

function mostrarSeccion(idSeccion, boton) {
  document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("activa"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(idSeccion).classList.add("activa");
  boton.classList.add("active");
}

function renderizarTabla() {
  const tbody = document.getElementById("tabla-alumnos");
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase().trim();
  const filtroEstatus = document.getElementById("filtro-estatus").value;

  tbody.innerHTML = "";

  const filtrados = alumnos.filter(a => {
    const coincideTexto =
      a.matricula.toLowerCase().includes(textoBusqueda) ||
      a.nombre.toLowerCase().includes(textoBusqueda) ||
      a.grupo.toLowerCase().includes(textoBusqueda);
    const coincideEstatus = filtroEstatus === "Todos" || a.estatus === filtroEstatus;
    return coincideTexto && coincideEstatus;
  });

  filtrados.forEach(alumno => {
    const claseEstatus = "st-" + alumno.estatus.replace(/\s+/g, "-");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${alumno.matricula}</strong></td>
      <td>${alumno.nombre}</td>
      <td>${alumno.grupo}</td>
      <td>${Number(alumno.promedio).toFixed(1)}</td>
      <td><span class="status-badge ${claseEstatus}">${alumno.estatus}</span></td>
      <td>
        <button class="btn-small" onclick="rotarEstatus('${alumno.matricula}')">Cambiar Estatus</button>
        <button class="btn-small btn-del" onclick="eliminarAlumno('${alumno.matricula}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("contador-alumnos").textContent = `Total: ${alumnos.length} alumnos`;
}

document.getElementById("form-alumno").addEventListener("submit", (e) => {
  e.preventDefault();
  const matricula = document.getElementById("matricula").value.trim().toUpperCase();
  const nombre = document.getElementById("nombre").value.trim();
  const grupo = document.getElementById("grupo").value;
  const promedio = parseFloat(document.getElementById("promedio").value);
  const estatus = document.getElementById("estatus").value;

  if (alumnos.some(a => a.matricula === matricula)) {
    alert("Ya existe un alumno registrado con la matrícula " + matricula);
    return;
  }

  alumnos.push({ matricula, nombre, grupo, promedio, estatus });
  guardarDatos();
  renderizarTabla();
  e.target.reset();
});

function rotarEstatus(matricula) {
  const estados = ["Activo", "En Riesgo", "Baja Temporal"];
  alumnos = alumnos.map(a => {
    if (a.matricula === matricula) {
      const siguiente = estados[(estados.indexOf(a.estatus) + 1) % estados.length];
      return { ...a, estatus: siguiente };
    }
    return a;
  });
  guardarDatos();
  renderizarTabla();
}

function eliminarAlumno(matricula) {
  alumnos = alumnos.filter(a => a.matricula !== matricula);
  guardarDatos();
  renderizarTabla();
}

renderizarTabla();
