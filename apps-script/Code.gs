/**
 * Backend TecnoAcademia — Google Apps Script
 *
 * 1. Copia este archivo en el editor de Apps Script del proyecto vinculado al formulario.
 * 2. Ajusta SHEET_NAME si tu hoja tiene otro nombre.
 * 3. Implementación > Nueva implementación > Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 4. Usa la URL /exec generada en js/config.js
 */

const SHEET_NAME = "Respuestas";

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "";

  if (action === "visit") {
    const props = PropertiesService.getScriptProperties();
    const actual = Number(props.getProperty("VISIT_COUNT") || "0");
    const nuevo = actual + 1;
    props.setProperty("VISIT_COUNT", String(nuevo));
    return jsonResponse({ value: nuevo });
  }

  return jsonResponse({ ok: true, message: "TecnoAcademia API activa" });
}

function doPost(e) {
  try {
    const datos = (e && e.parameter) || {};
    guardarRegistro(datos);
    return jsonResponse({ ok: true, message: "Registro guardado" });
  } catch (error) {
    return jsonResponse({ ok: false, message: String(error) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function guardarRegistro(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  const ahora = new Date();
  const marcaDeTiempo = Utilities.formatDate(
    ahora,
    ss.getSpreadsheetTimeZone(),
    "dd/MM/yyyy HH:mm:ss"
  );

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
    datos.institucionEducativa || "",
    datos.grado || "",
    datos.cursoAnteriorTecno || "",
    datos.jornadaTecno || "",
  ];

  sheet.appendRow(nuevaFila);
}
