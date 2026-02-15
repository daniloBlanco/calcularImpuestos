document.querySelector(".calcular").addEventListener("click", calcularTodo);

function calcularTodo() {
  if (!validarCampos()) return;

  const salario = parseFloat(document.getElementById("salario").value);
  const fechaIngreso = new Date(document.getElementById("fecha").value);
  const fechaSalida = new Date(document.getElementById("fechaSalida").value);

  const salarioDiario = salario / 23.83;

  const años = fechaSalida.getFullYear() - fechaIngreso.getFullYear();
  const meses = años * 12 + (fechaSalida.getMonth() - fechaIngreso.getMonth());

  // ================= RESUMEN INICIAL =================
  const sumatoriasSalarios = salario * meses;
  const salarioPromedioMensual = sumatoriasSalarios / Math.max(meses, 1);

  document.getElementById("sumatoriaaSalarios").innerText =
    formatear(sumatoriasSalarios);
  document.getElementById("salarioPromedioMensual").innerText = formatear(
    salarioPromedioMensual,
  );
  document.getElementById("salarioPdiario").innerText =
    formatear(salarioDiario);

  let subTotal = 0;

  // ================= PREAVISO =================
  if (!document.getElementById("preAvisado").checked) {
    let diasPreaviso = 0;

    if (meses >= 3 && meses < 6) diasPreaviso = 7;
    else if (meses >= 6 && meses < 12) diasPreaviso = 14;
    else if (meses >= 12) diasPreaviso = 28;

    const montoPreaviso = salarioDiario * diasPreaviso;

    document.getElementById("montoPreaviso").innerText =
      formatear(montoPreaviso);
    subTotal += montoPreaviso;
  } else {
    document.getElementById("montoPreaviso").innerText = "RD$0.00";
  }

  // ================= CESANTIA =================
  if (document.getElementById("incluirCesantia").checked) {
    const cesantia = calcularCesantia(fechaIngreso, fechaSalida, salarioDiario);

    document.getElementById("montoAntes1992").innerText = formatear(
      cesantia.antes,
    );
    document.getElementById("montoDespues1992").innerText = formatear(
      cesantia.despues,
    );

    subTotal += cesantia.antes + cesantia.despues;
  } else {
    document.getElementById("montoAntes1992").innerText = "RD$0.00";
    document.getElementById("montoDespues1992").innerText = "RD$0.00";
  }

  // ================= VACACIONES =================
  if (!document.getElementById("vacacionesTomadas").checked) {
    let diasVacaciones = 0;

    if (años >= 1 && años <= 5) diasVacaciones = 14;
    else if (años > 5) diasVacaciones = 18;

    const montoVacaciones = salarioDiario * diasVacaciones;

    document.getElementById("montoVacaciones").innerText =
      formatear(montoVacaciones);

    subTotal += montoVacaciones;
  } else {
    document.getElementById("montoVacaciones").innerText = "RD$0.00";
  }

  document.getElementById("subTotal").innerText = formatear(subTotal);

  // ================= NAVIDAD =================
  let total = subTotal;

  if (document.getElementById("salarioNavidad").checked) {
    const montoNavidad = salario / 12;

    document.getElementById("montoNavidad").innerText = formatear(montoNavidad);

    total += montoNavidad;
  } else {
    document.getElementById("montoNavidad").innerText = "RD$0.00";
  }

  document.getElementById("totalFinal").innerText = formatear(total);

  animarTotal();
}

// ================= FUNCIONES AUXILIARES =================

function calcularCesantia(fechaIngreso, fechaSalida, salarioDiario) {
  const fechaCorte = new Date("1992-06-01");

  let antes = 0;
  let despues = 0;

  if (fechaIngreso < fechaCorte) {
    const finAntes = fechaSalida < fechaCorte ? fechaSalida : fechaCorte;
    const añosAntes = finAntes.getFullYear() - fechaIngreso.getFullYear();
    antes = añosAntes * 21 * salarioDiario;
  }

  if (fechaSalida > fechaCorte) {
    const inicioDespues = fechaIngreso > fechaCorte ? fechaIngreso : fechaCorte;
    const añosDespues = fechaSalida.getFullYear() - inicioDespues.getFullYear();
    despues = añosDespues * 23 * salarioDiario;
  }

  return { antes, despues };
}

function validarCampos() {
  let valido = true;

  ["salario", "fecha", "fechaSalida"].forEach((id) => {
    const campo = document.getElementById(id);

    if (!campo.value) {
      campo.style.border = "2px solid red";
      valido = false;
    } else {
      campo.style.border = "";
    }
  });

  return valido;
}

function formatear(valor) {
  return "RD$ " + valor.toFixed(2);
}

function animarTotal() {
  const total = document.getElementById("totalFinal");

  total.style.transition = "all 0.3s ease";
  total.style.transform = "scale(1.1)";
  total.style.color = "#16a34a";

  setTimeout(() => {
    total.style.transform = "scale(1)";
  }, 300);
}

// ================= BOTÓN IMPRIMIR =================
document.querySelector(".imprimir").addEventListener("click", function () {
  window.print();
});

// ================= BOTÓN LIMPIAR =================
document.querySelector(".limpiar").addEventListener("click", function () {
  // Limpiar inputs de texto
  document.getElementById("nombre").value = "";
  document.getElementById("cedula").value = "";
  document.getElementById("salario").value = "";

  // Limpiar inputs de fecha
  document.getElementById("fecha").value = "";
  document.getElementById("fechaSalida").value = "";

  // Desmarcar todos los checkboxes
  document.getElementById("preAvisado").checked = false;
  document.getElementById("incluirCesantia").checked = false;
  document.getElementById("vacacionesTomadas").checked = false;
  document.getElementById("salarioNavidad").checked = false;

  // Reiniciar todos los valores a RD$0.00
  document.getElementById("sumatoriaaSalarios").innerText = "RD$0.00";
  document.getElementById("salarioPromedioMensual").innerText = "RD$0.00";
  document.getElementById("salarioPdiario").innerText = "RD$0.00";
  document.getElementById("montoPreaviso").innerText = "RD$0.00";
  document.getElementById("montoAntes1992").innerText = "RD$0.00";
  document.getElementById("montoDespues1992").innerText = "RD$0.00";
  document.getElementById("montoVacaciones").innerText = "RD$0.00";
  document.getElementById("subTotal").innerText = "RD$0.00";
  document.getElementById("montoNavidad").innerText = "RD$0.00";
  document.getElementById("totalFinal").innerText = "RD$0.00";

  // Remover bordes rojos de validación
  ["salario", "fecha", "fechaSalida"].forEach((id) => {
    document.getElementById(id).style.border = "";
  });
});
