# ingpereirasalvador-next

Versión Next.js del sitio web de **Ing. Pereira Salvador** (consultoría en ingeniería), migrada desde el
proyecto original `ingpereirasalvador-web` (HTML + CSS + JS generado con `build.js`), manteniendo su diseño
y comportamiento.

Se publica como sitio estático (`output: "export"`) en Netlify: no hay servidor, API routes ni funciones.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, static export) + React 19
- TypeScript (modo `strict`)
- Tailwind CSS v4 (configuración en CSS con `@theme`, sin `tailwind.config.js`)
- ESLint (`eslint-config-next`)
- Netlify Forms para el formulario de contacto

## Requisitos e instalación

Node.js 20.9 o superior (Netlify usa Node 22, ver `netlify.toml`).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Validación y build

```bash
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript
npm run build      # valida el contenido y genera el sitio estático en out/
```

## Scripts

| Comando         | Qué hace                                                           |
| --------------- | ------------------------------------------------------------------ |
| `npm run dev`   | Servidor de desarrollo en http://localhost:3000                    |
| `npm run build` | Build de producción; genera el sitio estático en `out/` (y `out/_headers` con la CSP) |
| `npm run start` | Sirve `out/` localmente (vía `npx serve`) para probar el build     |
| `npm run lint`  | ESLint                                                             |
| `npm run validate:content` | Valida `src/content/site.json` y el formulario (también corre antes de `build`) |

> `next start` no funciona con static export, por eso `start` sirve la carpeta `out/`.

## Estructura de assets

```
src/app/
  icon.svg            favicon (Next genera el <link rel="icon">)
  fonts/              Lil Grotesk (next/font/local) + licencia OFL
public/images/
  brand/              logotipos, isotipos y arcos (SVG)
  services/           fotos de servicios (.webp)
  about/              foto de "Sobre mí"
  og-image.jpg        imagen para compartir en redes
```

Los tokens de diseño (colores, breakpoints, medidas) están en `src/app/globals.css` (`@theme`).

## Contenido

Todos los textos están en **`src/content/site.json`** (fuente de contenido): se editan ahí, sin tocar componentes.

- `src/content/index.ts`: tipos del contenido y export `siteContent`. Si el JSON no respeta los tipos, falla TypeScript.
- `src/content/links.ts`: arma los enlaces de WhatsApp, teléfono y email a partir de los datos.
- `scripts/validate-content.mjs`: corre antes de cada build (`prebuild`) y verifica que las imágenes existan, que las anclas `#id` apunten a una sección y que no haya campos mal escritos. También: `npm run validate:content`.

Convenciones: imágenes con ruta absoluta desde `public/` (`/images/...`); servicios con foto cuadrada ~800×800 WebP y encuadre opcional con `imagePosition` (ej. `"80% center"`); con `projects.items` vacío (`[]`) la sección Trabajos y su enlace no se muestran (la sección todavía no está migrada: cargar proyectos hace fallar la validación hasta migrarla); `contact.area` vacío no se muestra. Las fotos actuales de servicios son de Unsplash (uso libre, sin atribución).

## Netlify

Configurado en `netlify.toml`: build `npm run build`, publica `out/`.

Headers:

- `netlify.toml`: headers de seguridad fijos (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`) y cache de una semana para `/images/*`.
  El cache de `/_next/static/*` lo pone el adaptador de Next en Netlify.
- `out/_headers`: la **Content-Security-Policy**, generada en cada build (`postbuild`) por
  `scripts/generate-headers.mjs`. Recorre el HTML de `out/` y habilita por hash SHA-256 los scripts inline
  (los de Next cambian con cada build), sin `'unsafe-inline'` en `script-src`. No editar a mano ni repetir la CSP
  en `netlify.toml`.

Formulario de contacto (Netlify Forms, sin backend propio):

- Netlify detecta el formulario `contacto` en `public/__forms.html` (copia estática con `data-netlify`).
- El formulario visible (`src/components/sections/ContactForm.tsx`) no lleva `data-netlify` para que Netlify no reescriba el HTML que hidrata React; envía por `fetch('/')` (urlencoded) con el campo oculto `form-name`.
- Los `name` de los campos deben coincidir en ambos archivos: lo verifica `npm run validate:content`.
- El envío real solo se puede probar en un deploy de Netlify (en local no hay quien reciba el POST).
