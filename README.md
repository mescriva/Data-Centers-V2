# Data Centers — Expo Screen MVP

Pantalla interactiva para exposición comercial de modelos de Data Center.

## Estructura de archivos

```
/
├── index.html         ← Estructura HTML (secciones A, B, C, D)
├── styles.css         ← Todos los estilos y tokens de diseño
├── data.js            ← Contenido de los 6 modelos y equipos
├── app.js             ← Lógica de interacción
└── assets/
    ├── renders/       ← Imágenes .webp del render 3D por modelo
    │   ├── m1.webp
    │   ├── m2.webp
    │   ├── m3.webp
    │   ├── m4.webp
    │   ├── m5.webp
    │   └── m6.webp
    ├── graphs/        ← Vídeos .mp4 de gráficas (bucle)
    │   ├── m1.mp4
    │   ├── m2.mp4
    │   ├── m3.mp4
    │   ├── m4.mp4
    │   ├── m5.mp4
    │   └── m6.mp4
    └── schemes/       ← Imágenes .webp de esquemas de equipos
        ├── pcs.webp
        ├── batteries.webp
        ├── aircon.webp
        ├── chiller.webp
        └── ... (un .webp por equipo)
```

## Cómo ejecutar en local

1. Abre una terminal en la carpeta del proyecto
2. Levanta un servidor local (necesario para que los assets carguen):

```bash
# Con Node.js (npx, sin instalar nada):
npx serve .

# O con Python 3:
python3 -m http.server 8080
```

3. Abre en Chrome: `http://localhost:3000` (o el puerto que indique el servidor)

> ⚠️ No abras index.html directamente con doble clic — el navegador bloqueará la carga de assets por política de seguridad CORS.

## Cómo añadir assets reales

### Renders (Sección B)
- Coloca los archivos `.webp` en `assets/renders/`
- Nombra exactamente `m1.webp`, `m2.webp`... `m6.webp`
- Dimensiones recomendadas: 1200×800px mínimo

### Gráficas (Sección C)
- Coloca los archivos `.mp4` en `assets/graphs/`
- Nombra `m1.mp4`, `m2.mp4`... `m6.mp4`
- Usar vídeo sin sonido (muted), loop infinito, resolución 1920×400px

### Esquemas de equipos (Vista detalle)
- Coloca los `.webp` en `assets/schemes/`
- El nombre de cada archivo está definido en `data.js` → campo `schemeImg`
- Dimensiones recomendadas: 800×450px (ratio 16:9)

## Cómo modificar contenido

Todo el contenido está en `data.js`. Cada modelo tiene:
- `name` / `shortName` — títulos
- `description` — texto del panel izquierdo
- `render` / `graph` — rutas a los assets
- `equipos[]` — array de equipos, cada uno con:
  - `title`, `short`, `long` — textos de la card y detalle
  - `schemeImg` — ruta al esquema
  - `focus.x` / `focus.y` — posición del punto en el render (en %)

## Flujo de interacción

```
[Sección D] Usuario selecciona Modelo N
      ↓
  setModel(id) → render completo
      ↓
[Sección A] Aparecen cards de equipos
      ↓
  [Switch] → toggleEquip() → punto foco cambia a azul en render
      ↓
  [Flecha →] → openDetail() → activa switch + muestra detalle en Sección A
      ↓
  [← Volver] → closeDetail() → vuelve al listado de equipos
```

## Tokens de diseño (CSS)

Para adaptar colores a la identidad visual de la empresa, edita las variables en `styles.css`:

```css
:root {
  --blue:       #1b5fff;   /* Color corporativo principal */
  --panel:      #f2f4f7;   /* Fondo panel izquierdo (gris 01) */
  --bg:         #e8ecf2;   /* Fondo general */
  --text-900:   #0d1421;   /* Texto principal */
  --render-bg:  #c8d2e0;   /* Fondo de la zona de render */
}
```
