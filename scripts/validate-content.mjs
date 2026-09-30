// Valida src/content/site.json antes del build (`prebuild`).
// Complementa a TypeScript con lo que los tipos no pueden verificar:
// que las imágenes existan, que las anclas apunten a secciones reales
// y que no haya campos con nombres mal escritos en las listas.
// También verifica la clave de Web3Forms del formulario de contacto.
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

// Formulario de contacto (Web3Forms): la clave pública se incrusta en el JS al compilar.
// En Cloudflare Pages (CF_PAGES=1) sin clave el build falla; en local solo avisa (el form da error al enviar).
for (const file of [".env.local", ".env"]) {
  if (existsSync(join(root, file))) process.loadEnvFile(join(root, file));
}
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!accessKey) {
  const message = "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY no está definida: el formulario de contacto no va a enviar";
  if (process.env.CF_PAGES) errors.push(message);
  else console.warn(`⚠ ${message} (ver README, sección Cloudflare Pages)`);
} else if (!uuid.test(accessKey)) {
  errors.push(`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: formato inválido (se espera la clave de Web3Forms, un UUID)`);
}

if (errors.length > 0) {
  console.error("✗ Errores de validación (contenido y formulario):");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ Contenido válido (src/content/site.json)");
