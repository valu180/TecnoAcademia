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
 * Registra una visita en la pestaña independiente
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

  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, nuevaFilaVisita.length).setValues([nuevaFilaVisita]);
}

/**
 * Obtiene el total de visitas registradas en la hoja ContadorVisitas
 */
function obtenerTotalVisitas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_VISITAS);
  if (!sheet) return 0;
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
