// Valida src/content/site.json antes del build (`prebuild`).
// Complementa a TypeScript con lo que los tipos no pueden verificar:
// que las imágenes existan, que las anclas apunten a secciones reales
// y que no haya campos con nombres mal escritos en las listas.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "src/content/site.json"), "utf8"));
const errors = [];

// Campos permitidos en los elementos de cada lista (detecta errores de tipeo en campos opcionales)
const allowedKeys = {
  "navigation.items": ["label", "href"],
  "services.items": ["title", "description", "image", "imagePosition"],
  "process.steps": ["title", "description"],
  "about.facts": ["value", "label"],
  "projects.items": ["title", "detail", "image"],
};
for (const [path, keys] of Object.entries(allowedKeys)) {
  const [section, list] = path.split(".");
  content[section][list].forEach((item, i) => {
    for (const key of Object.keys(item)) {
      if (!keys.includes(key)) errors.push(`${path}[${i}]: campo desconocido "${key}"`);
    }
  });
}

// Anclas internas: cada "#id" debe corresponder al id de una sección
const sectionIds = ["hero", "services", "process", "about", "projects", "contactSection"].map(
  (key) => content[key].id,
);
if (new Set(sectionIds).size !== sectionIds.length) errors.push("Hay ids de sección repetidos");

// Recorre todos los valores de texto
function walk(value, path) {
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k));
  }
  if (typeof value !== "string") return;

  if (value.includes("{{")) errors.push(`${path}: contiene sintaxis de plantilla "{{"`);
  if (value.startsWith("#") && !sectionIds.includes(value.slice(1))) {
    errors.push(`${path}: el ancla "${value}" no corresponde a ninguna sección`);
  }
  if (value.startsWith("/")) {
    if (!value.startsWith("/images/")) errors.push(`${path}: las imágenes van en /images/ ("${value}")`);
    else if (!existsSync(join(root, "public", value))) errors.push(`${path}: no existe public${value}`);
  }
  if (value.includes("assets/")) errors.push(`${path}: ruta del sitio anterior ("${value}")`);
}
walk(content, "");

// Trabajos: con la lista vacía el sitio no muestra la sección (igual que el original).
// El componente de la sección todavía no está migrado: si se cargan proyectos, el menú
// mostraría "Trabajos" apuntando a una sección inexistente. Se frena el build hasta migrarla.
if (content.projects.items.length > 0) {
  errors.push("projects.items tiene proyectos, pero la sección Trabajos todavía no está migrada a Next");
}

// Datos de contacto
const { phone, email, whatsapp } = content.contact;
if (!/^\+\d+$/.test(phone.number)) errors.push(`contact.phone.number: formato inválido ("${phone.number}")`);
if (!/^\d+$/.test(whatsapp.number)) errors.push(`contact.whatsapp.number: solo dígitos ("${whatsapp.number}")`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(`contact.email: formato inválido ("${email}")`);
if (!/^https:\/\/[^/]+$/.test(content.site.url)) errors.push(`site.url: debe ser https y sin barra final`);

// Formulario de contacto: el gemelo estático para Netlify (public/__forms.html) debe tener
// el mismo nombre y los mismos campos que el formulario visible (ContactForm.tsx)
const namesIn = (source) => new Set([...source.matchAll(/\bname="([^"]+)"/g)].map((m) => m[1]));
const formSource = readFileSync(join(root, "src/components/sections/ContactForm.tsx"), "utf8");
const twinSource = readFileSync(join(root, "public/__forms.html"), "utf8").match(/<form[\s\S]*?<\/form>/)?.[0] ?? "";
const formNames = namesIn(formSource);
const formName = formSource.match(/const FORM_NAME = "([^"]+)"/)?.[1];
formNames.delete("form-name");
const twinNames = namesIn(twinSource);
if (!formName || !twinSource.includes(`<form name="${formName}"`)) {
  errors.push(`public/__forms.html: falta el formulario "${formName}" (debe coincidir con ContactForm.tsx)`);
}
twinNames.delete(formName);
for (const name of formNames) {
  if (!twinNames.has(name)) errors.push(`public/__forms.html: falta el campo "${name}" de ContactForm.tsx`);
}
for (const name of twinNames) {
  if (!formNames.has(name)) errors.push(`public/__forms.html: el campo "${name}" no existe en ContactForm.tsx`);
}

if (errors.length > 0) {
  console.error("✗ Errores de validación (contenido y formulario):");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ Contenido válido (src/content/site.json)");
