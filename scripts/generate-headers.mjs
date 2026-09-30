// Genera out/_headers con la Content-Security-Policy del sitio (corre después de `next build`, en `postbuild`).
//
// Next agrega scripts inline al HTML (hidratación / payload RSC) cuyo contenido cambia con cada build,
// y el sitio suma el script inline del Scroll Reveal (revealPendingScript.ts). Para no abrir
// script-src con 'unsafe-inline', se recorre todo el HTML generado en out/, se calcula el SHA-256
// exacto de cada script inline ejecutable y se habilitan solo esos hashes.
//
// Es el único archivo de headers del sitio (formato _headers de Cloudflare Pages): además de la CSP
// incluye los headers de seguridad fijos y el cache de /images/* y /_next/static/*.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(root, "out");

// Tipos de <script> que el navegador ejecuta (sin type, JavaScript o módulo).
// Los bloques de datos (application/ld+json, etc.) no se ejecutan y la CSP no los alcanza.
const executableTypes = new Set([
  "",
  "module",
  "text/javascript",
  "application/javascript",
  "application/ecmascript",
  "text/ecmascript",
]);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

function attribute(attributes, name) {
  const match = attributes.match(new RegExp(`(?:^|\\s)${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, "i"));
  if (!match) return undefined;
  return (match[1] ?? match[2] ?? match[3] ?? "").trim();
}

const errors = [];
const hashes = new Set();
const report = [];

for (const file of htmlFiles(outDir)) {
  const html = readFileSync(file, "utf8");
  const name = relative(outDir, file);
  let inline = 0;

  for (const [, attributes, content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attribute(attributes, "src") !== undefined) continue;
    const type = (attribute(attributes, "type") ?? "").toLowerCase();
    if (!executableTypes.has(type)) continue;
    // El hash se calcula sobre el texto exacto entre <script> y </script>, en UTF-8
    hashes.add(`'sha256-${createHash("sha256").update(content, "utf8").digest("base64")}'`);
    inline += 1;
  }

  // Manejadores inline (onclick="...") o enlaces javascript: necesitarían 'unsafe-hashes': no se permiten
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(html)) errors.push(`${name}: tiene manejadores de eventos inline (on...=)`);
  if (/\shref\s*=\s*["']?\s*javascript:/i.test(html)) errors.push(`${name}: tiene enlaces javascript:`);

  report.push(`  ${name}: ${inline} script(s) inline`);
}

if (errors.length > 0) {
  console.error("✗ No se pudo generar la CSP:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const directives = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`.trim(),
  // Estilos inline reales (encuadres de imágenes, variables de React): se mantienen en esta etapa
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  // API de Web3Forms: recibe los envíos del formulario de contacto (ContactForm.tsx)
  "connect-src 'self' https://api.web3forms.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
];

const csp = `  Content-Security-Policy: ${directives.join("; ")}`;
// Cloudflare Pages ignora las líneas de _headers de más de 2000 caracteres: mejor fallar que publicar sin CSP
if (csp.length > 2000) {
  console.error(`✗ La línea de la CSP tiene ${csp.length} caracteres (máximo de Cloudflare Pages: 2000)`);
  process.exit(1);
}

const headers = [
  "# Generado por scripts/generate-headers.mjs en cada build — no editar a mano.",
  "# CSP con los hashes de los scripts inline del HTML de out/ (cambian con cada build).",
  "/*",
  csp,
  "  X-Content-Type-Options: nosniff",
  "  X-Frame-Options: DENY",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "  Strict-Transport-Security: max-age=31536000",
  "",
  "# Imágenes: cache de una semana (si se reemplaza una foto con el mismo nombre, se actualiza sola).",
  "/images/*",
  "  Cache-Control: public, max-age=604800",
  "",
  "# JS, CSS y fuentes de Next: el nombre lleva un hash del contenido, se cachean para siempre.",
  "/_next/static/*",
  "  Cache-Control: public, max-age=31536000, immutable",
  "",
].join("\n");

writeFileSync(join(outDir, "_headers"), headers);
console.log(`✓ out/_headers generado (headers + CSP con ${hashes.size} hash(es) de script):`);
for (const line of report) console.log(line);
