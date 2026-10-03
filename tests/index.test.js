// Tests críticos de index.html (se ejecutan con: node --test tests/index.test.js)
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");

test("la página consulta el flag dark_mode_enabled", () => {
  assert.ok(
    html.includes("dark_mode_enabled"),
    "Falta el flag dark_mode_enabled en index.html"
  );
});

test("el flag arranca apagado por defecto (false)", () => {
  assert.match(
    html,
    /getValueAsync\(\s*["']dark_mode_enabled["']\s*,\s*false\s*\)/,
    "El valor por defecto del flag debe ser false, para que la funcionalidad nueva quede oculta"
  );
});

test("el SDK de ConfigCat se carga antes del script que lo usa", () => {
  const sdk = html.indexOf("configcat.browser");
  const uso = html.indexOf('<script type="module"');
  assert.ok(sdk !== -1, "No se encontró la etiqueta del SDK de ConfigCat");
  assert.ok(uso !== -1, "No se encontró el script que usa el SDK");
  assert.ok(sdk < uso, "El SDK debe cargarse ANTES del script que usa configcat");
});

test("existe el estilo del tema oscuro", () => {
  assert.ok(html.includes("body.dark"), "Falta el estilo body.dark");
});

test("no quedan placeholders de la clave del SDK", () => {
  assert.ok(!html.includes("TU_SDK_KEY"), "Quedó el placeholder TU_SDK_KEY");
  assert.ok(!html.includes("PEGA_AQUI"), "Quedó un placeholder PEGA_AQUI");
});