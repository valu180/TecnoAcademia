/**
 * Backend TecnoAcademia — Google Apps Script
 *
 * 1. Copia este archivo en el editor de Apps Script del proyecto vinculado al formulario.
 * 2. Ejecuta inicializarHoja() una vez si necesitas crear las pestañas y encabezados.
 * 3. Implementación > Nueva implementación > Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 4. Usa la URL /exec generada en js/config.js
 */

/**
 * Configuración global de la hoja
 */
const SHEET_NAME = "Sheet1"; // Pestaña de registros del formulario
const SHEET_VISITAS = "ContadorVisitas"; // Pestaña para el contador de visitas
const VISIT_SUMMARY_ROW = 2; // Fila fija del resumen "Total Visitas"
const VISIT_DATA_COLS = 2; // Columnas A y B para registros de visitas
const VISIT_LABEL_COL = 4; // Columna D ("Métrica") para la etiqueta
const VISIT_TOTAL_COL = 5; // Columna E ("Total") para el conteo

/**
 * Configura el resumen estático en D/E (no se mueve al insertar visitas en A:B).
 * Usa COUNTA en inglés (setFormula exige el nombre en inglés) y una referencia
 * de columna completa (A:A) que NO se desplaza al insertar celdas.
 */
function configurarFilaResumenVisitas(sheet) {
  sheet.getRange(1, VISIT_LABEL_COL).setValue("Métrica").setFontWeight("bold");
  sheet.getRange(1, VISIT_TOTAL_COL).setValue("Total").setFontWeight("bold");
  sheet.getRange(VISIT_SUMMARY_ROW, VISIT_LABEL_COL).setValue("Total Visitas:").setFontWeight("bold");
  sheet.getRange(VISIT_SUMMARY_ROW, VISIT_TOTAL_COL).setFormula("=COUNTA(A:A)-1");
  sheet.setFrozenRows(1);
}

/**
 * Ejecutar una vez si la hoja ya tiene datos y el contador quedó abajo.
 * Mueve el resumen a la fila 2 sin borrar registros existentes.
 */
function repararContadorVisitas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_VISITAS);
  if (!sheet) return;

  const headersVisitas = ["Marca de tiempo", "Página/Módulo"];
  sheet.getRange(1, 1, 1, headersVisitas.length).setValues([headersVisitas]).setFontWeight("bold");

  // Limpia restos de la versión anterior que escribía el resumen en C2:D2
  sheet.getRange(VISIT_SUMMARY_ROW, 3, 1, 2).clearContent();

  configurarFilaResumenVisitas(sheet);
}

/**
 * Función para inicializar la hoja con los nuevos encabezados unificados (Orden Versión B)
 * e inicializar también la pestaña del contador de visitas.
 */
function inicializarHoja() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- Inicializar Hoja de Registros ----
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "Marca de tiempo", "Nombre(s)", "Primer Apellido", "Segundo Apellido", "Fecha de nacimiento",
    "Género", "País de Nacimiento", "Departamento de Nacimiento", "Municipio de Nacimiento",
    "Estrato Socioeconómico", "Correo electrónico", "Celular", "Tipo de documento",
    "Número de documento", "Fecha de expedición del documento", "País de Expedición",
    "Departamento de Expedición", "Municipio de Expedición", "RH (Tipo de Sangre)",
    "¿En qué EPS está Afiliado?", "¿Cuenta con alguna discapacidad o condición especial?",
    "Departamento de Residencia", "Municipio de Residencia", "Dirección de residencia",
    "Nombre y apellidos del familiar", "Número de celular familiar",
    "¿Estuvo antes en algún curso de TecnoAcademia?", "Jornada en la que asistirá a la TecnoAcademia"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");

  // ---- Inicializar Hoja de Visitas ----
  let sheetVisitas = ss.getSheetByName(SHEET_VISITAS);
  if (!sheetVisitas) {
    sheetVisitas = ss.insertSheet(SHEET_VISITAS);
  }
  const headersVisitas = ["Marca de tiempo", "Página/Módulo"];
  sheetVisitas.getRange(1, 1, 1, headersVisitas.length).setValues([headersVisitas]).setFontWeight("bold");
  configurarFilaResumenVisitas(sheetVisitas);
}

/**
 * Función para guardar datos recibidos e insertar la marca de tiempo automática.
 */
function guardarRegistro(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const marcaDeTiempo = new Date();

  const nuevaFila = [
    marcaDeTiempo,
    datos.nombres || "",
    datos.primerApellido || "",
    datos.segundoApellido || "",
    datos.fechaNacimiento || "",
    datos.genero || "",
    datos.paisNacimiento || "",
    datos.deptoNacimiento || "",
    datos.municipioNacimiento || "",
    datos.estrato || "",
    datos.correo || "",
    datos.celular || "",
    datos.tipoDocumento || "",
    datos.numeroDocumento || "",
    datos.fechaExpedicion || "",
    datos.paisExpedicion || "",
    datos.deptoExpedicion || "",
    datos.municipioExpedicion || "",
    datos.rh || "",
    datos.eps || "",
    datos.discapacidad || "",
    datos.deptoResidencia || "",
    datos.municipioResidencia || "",
    datos.direccionResidencia || "",
    datos.nombreFamiliar || "",
    datos.celularFamiliar || "",
    datos.cursoAnteriorTecno || "",
    datos.jornadaTecno || ""
  ];

  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, nuevaFila.length).setValues([nuevaFila]);
}

/**
 * Registra una visita desplazando solo las columnas A y B (D2:E2 quedan fijas).
 * @param {Object} datosVisita - Objeto con los detalles de la visita
 */
function registrarVisita(datosVisita) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_VISITAS);
  const marcaDeTiempo = new Date();

  const nuevaFilaVisita = [
    marcaDeTiempo,
    datosVisita.modulo || "Inicio/General"
  ];

  if (!sheet.getRange(VISIT_SUMMARY_ROW, VISIT_TOTAL_COL).getFormula()) {
    configurarFilaResumenVisitas(sheet);
  }

  // Inserta solo las celdas A:B de la fila 2 (D/E con el resumen no se mueven)
  const rangoInsercion = sheet.getRange(VISIT_SUMMARY_ROW, 1, 1, VISIT_DATA_COLS);
  rangoInsercion.insertCells(SpreadsheetApp.Dimension.ROWS);
  sheet.getRange(VISIT_SUMMARY_ROW, 1, 1, VISIT_DATA_COLS).setValues([nuevaFilaVisita]);
}

/**
 * Obtiene el total de visitas registradas en la hoja ContadorVisitas
 */
function obtenerTotalVisitas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_VISITAS);
  if (!sheet) return 0;

  const totalCelda = sheet.getRange(VISIT_SUMMARY_ROW, VISIT_TOTAL_COL).getValue();
  if (typeof totalCelda === "number") return totalCelda;

  return Math.max(0, sheet.getLastRow() - 1);
}

/**
 * Receptor de peticiones GET desde el sitio web (contador de visitas)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "";

  if (action === "visit") {
    registrarVisita({
      modulo: (e && e.parameter && e.parameter.modulo) || "Sitio Web Principal"
    });

    const total = obtenerTotalVisitas();

    return ContentService
      .createTextOutput(JSON.stringify({ value: total }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "TecnoAcademia API activa" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Receptor de peticiones POST desde el sitio web
 * Discrimina si es un registro de formulario o una visita analítica
 */
function doPost(e) {
  try {
    const accion = e.parameter.accion;

    if (accion === "visita") {
      const datosVisita = {
        modulo: e.parameter.modulo || "Sitio Web Principal"
      };
      registrarVisita(datosVisita);

      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", message: "Visita registrada" }))
        .setMimeType(ContentService.MimeType.JSON);

    } else {
      const datos = {
        nombres: e.parameter.nombres,
        primerApellido: e.parameter.primerApellido,
        segundoApellido: e.parameter.segundoApellido || "",
        fechaNacimiento: e.parameter.fechaNacimiento,
        genero: e.parameter.genero,
        paisNacimiento: e.parameter.paisNacimiento,
        deptoNacimiento: e.parameter.deptoNacimiento,
        municipioNacimiento: e.parameter.municipioNacimiento,
        estrato: e.parameter.estrato,
        correo: e.parameter.correo,
        celular: e.parameter.celular,
        tipoDocumento: e.parameter.tipoDocumento,
        numeroDocumento: e.parameter.numeroDocumento,
        fechaExpedicion: e.parameter.fechaExpedicion,
        paisExpedicion: e.parameter.paisExpedicion,
        deptoExpedicion: e.parameter.deptoExpedicion,
        municipioExpedicion: e.parameter.municipioExpedicion,
        rh: e.parameter.rh,
        eps: e.parameter.eps,
        discapacidad: e.parameter.discapacidad,
        deptoResidencia: e.parameter.deptoResidencia,
        municipioResidencia: e.parameter.municipioResidencia,
        direccionResidencia: e.parameter.direccionResidencia,
        nombreFamiliar: e.parameter.nombreFamiliar,
        celularFamiliar: e.parameter.celularFamiliar,
        cursoAnteriorTecno: e.parameter.cursoAnteriorTecno,
        jornadaTecno: e.parameter.jornadaTecno
      };

      guardarRegistro(datos);

      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", message: "Registro guardado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
