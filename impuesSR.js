// Función para formatear números con comas como separador de miles
function formatearMoneda(numero) {
  return "RD$" + numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Función para formatear deducciones con signo de menos y color rojo
function formatearDeduccion(numero) {
  const elemento = document.createElement("span");
  elemento.className = "deduccion";
  elemento.textContent = "-" + formatearMoneda(numero);
  return elemento.textContent;
}

function calcularIR1() {
  const salarioInput = parseFloat(document.getElementById("salario").value);

  if (isNaN(salarioInput) || salarioInput <= 0) {
    // Reiniciar todos los valores si el salario no es válido
    const ids = [
      "sumatoriaaSalarios",
      "salarioPdiario",
      "AFP",
      "ARS",
      "salarioSubNetoMensual",
      "totalImpuestos",
      "salarioNetoAnual",
      "totalImpuestosAnuales",
      "Salariofinal",
    ];

    ids.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        // Para deducciones, mostrar con signo de menos
        if (
          ["AFP", "ARS", "totalImpuestos", "totalImpuestosAnuales"].includes(id)
        ) {
          elemento.textContent = "-RD$0.00";
          elemento.className = "deduccion";
        } else {
          elemento.textContent = "RD$0.00";
          elemento.className = "";
        }
      }
    });
    return;
  }

  let impuestos = 0.0;

  let Afp = salarioInput * 0.0287;
  let ars = salarioInput * 0.0304;

  let ingresosAnuales = salarioInput * 12;

  let salarioPromedioDiario = (salarioInput / 176) * 8;

  let salarionetoMensual = salarioInput - ars - Afp;
  let salarionetoAnual = salarionetoMensual * 12;

  // ISR MENSUAL
  if (salarionetoMensual <= 34685.0) {
    impuestos = 0.0;
  } else if (salarionetoMensual <= 52027.42) {
    impuestos = (salarionetoMensual - 34685.0) * 0.15;
  } else if (salarionetoMensual <= 72260.25) {
    impuestos = 2601.33 + (salarionetoMensual - 52027.42) * 0.2;
  } else {
    impuestos = 6648.0 + (salarionetoMensual - 72260.25) * 0.25;
  }

  let totalDeImpuestoAnual = impuestos * 12;

  let salariofinal = salarionetoMensual - impuestos;

  // MOSTRAR EN HTML
  document.getElementById("sumatoriaaSalarios").textContent =
    formatearMoneda(ingresosAnuales);
  document.getElementById("salarioPdiario").textContent = formatearMoneda(
    salarioPromedioDiario,
  );

  // Deducciones en rojo con signo de menos
  const afpElement = document.getElementById("AFP");
  afpElement.textContent = "-" + formatearMoneda(Afp);
  afpElement.className = "deduccion";

  const arsElement = document.getElementById("ARS");
  arsElement.textContent = "-" + formatearMoneda(ars);
  arsElement.className = "deduccion";

  document.getElementById("salarioSubNetoMensual").textContent =
    formatearMoneda(salarionetoMensual);

  const impuestosElement = document.getElementById("totalImpuestos");
  impuestosElement.textContent = "-" + formatearMoneda(impuestos);
  impuestosElement.className = "deduccion";

  document.getElementById("salarioNetoAnual").textContent =
    formatearMoneda(salarionetoAnual);

  const impuestosAnualesElement = document.getElementById(
    "totalImpuestosAnuales",
  );
  impuestosAnualesElement.textContent =
    "-" + formatearMoneda(totalDeImpuestoAnual);
  impuestosAnualesElement.className = "deduccion";

  document.getElementById("Salariofinal").textContent =
    formatearMoneda(salariofinal);
}

// ================= BOTÓN LIMPIAR =================
function limpiarCampos() {
  // Limpiar inputs
  document.getElementById("nombre").value = "";
  document.getElementById("cedula").value = "";
  document.getElementById("salario").value = "";

  // Reiniciar todos los valores a RD$0.00
  const ids = [
    "sumatoriaaSalarios",
    "salarioPdiario",
    "AFP",
    "ARS",
    "salarioSubNetoMensual",
    "totalImpuestos",
    "salarioNetoAnual",
    "totalImpuestosAnuales",
    "Salariofinal",
  ];

  ids.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      // Para deducciones, mostrar con signo de menos
      if (
        ["AFP", "ARS", "totalImpuestos", "totalImpuestosAnuales"].includes(id)
      ) {
        elemento.textContent = "-RD$0.00";
        elemento.className = "deduccion";
      } else {
        elemento.textContent = "RD$0.00";
        elemento.className = "";
      }
    }
  });
}

// ================= BOTÓN IMPRIMIR =================
function imprimir() {
  window.print();
}

// ================= LISTENER PARA CÁLCULO AUTOMÁTICO =================
document.addEventListener("DOMContentLoaded", function () {
  const salarioInput = document.getElementById("salario");
  if (salarioInput) {
    salarioInput.addEventListener("input", calcularIR1);
  }
});
