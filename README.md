# ingpereirasalvador-next

Versión Next.js del sitio web de **Ing. Pereira Salvador** (consultoría en ingeniería), migrada desde el
proyecto original `ingpereirasalvador-web` (HTML + CSS + JS generado con `build.js`), manteniendo su diseño
y comportamiento.

Se publica como sitio estático (`output: "export"`) en Cloudflare Pages: no hay servidor, API routes ni funciones.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, static export) + React 19
- TypeScript (modo `strict`)
- Tailwind CSS v4 (configuración en CSS con `@theme`, sin `tailwind.config.js`)
- ESLint (`eslint-config-next`)
- [Web3Forms](https://web3forms.com) para el formulario de contacto (los envíos llegan por mail)

## Requisitos e instalación

Node.js 20.12 o superior (Cloudflare Pages usa Node 22, fijado en `.node-version`).

```bash
npm install
cp .env.example .env.local   # y completar la clave de Web3Forms (ver abajo)
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
| `npm run build` | Build de producción; genera el sitio estático en `out/` (y `out/_headers` con headers y CSP) |
| `npm run start` | Sirve `out/` localmente (vía `npx serve`) para probar el build     |
| `npm run lint`  | ESLint                                                             |
| `npm run validate:content` | Valida `src/content/site.json` y la clave del formulario (también corre antes de `build`) |

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

## Cloudflare Pages

Proyecto de Pages conectado al repo de GitHub (cada push publica: la rama de producción en el dominio
principal y las demás en un link de preview `<rama>.<proyecto>.pages.dev`). Configuración del build:

- Framework preset: **Next.js (Static HTML Export)** (o *None*). No usar el preset *Next.js* a secas: ese es para
  SSR con `@cloudflare/next-on-pages` y este sitio es estático.
- Build command: `npm run build` · Build output directory: `out`
- Node 22, tomado de `.node-version`.
- Variable de entorno `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (Settings → Variables and Secrets), en Production y Preview.
  Sin ella el build falla en Cloudflare (`validate-content.mjs` lo verifica cuando `CF_PAGES=1`).

Headers: `out/_headers` (formato de Cloudflare Pages), generado en cada build (`postbuild`) por
`scripts/generate-headers.mjs`. No se edita a mano. Contiene:

- La **Content-Security-Policy**: recorre el HTML de `out/` y habilita por hash SHA-256 los scripts inline
  (los de Next cambian con cada build), sin `'unsafe-inline'` en `script-src`. `connect-src` habilita la API de Web3Forms.
  Cloudflare ignora líneas de más de 2000 caracteres: si la CSP las supera, el build falla.
- Headers de seguridad fijos (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`).
- Cache de una semana para `/images/*` y cache permanente (`immutable`) para `/_next/static/*`.

La página 404 es `out/404.html`, que Cloudflare Pages sirve sola para rutas inexistentes.

Formulario de contacto (Web3Forms, sin backend propio):

- La clave (*access key*) se genera gratis en web3forms.com con el mail que va a recibir las consultas. Es pública
  (queda en el JS del sitio), pero conviene no commitearla: va en `.env.local` y en la variable de Cloudflare.
- `src/components/sections/ContactForm.tsx` envía por `fetch` (JSON) a `https://api.web3forms.com/submit`.
  El campo `email` queda como reply-to del mail; el honeypot es el checkbox oculto `botcheck`.
- El envío se puede probar también en local (`npm run dev`), con la clave en `.env.local`.
