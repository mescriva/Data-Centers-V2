// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — data.js
//  Contiene los datos de los 6 modelos y sus equipos.
//  ─────────────────────────────────────────────────────────
//  CÓMO ACTUALIZAR:
//   · render:     ruta a imagen .webp del render base del modelo
//   · graph:      ruta al .mp4 de la gráfica en bucle
//   · focus.x/y:  posición del punto sobre el render en %
//   · schemeImg:  ruta a imagen .webp del esquema del equipo
// ═══════════════════════════════════════════════════════════

const MODELS = [

  // ─── MODELO 1 — Standard ──────────────────────────────
  {
    id: "m1",
    name: "Data Center Standard",
    shortName: "Line Interactive",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m1.webp",
    graph: "./assets/graphs/m1.mp4", /* TODO CHANGE THIS GRAPH FOR MP4 LOOP video*/
    graphLabel: "Line Interactive Chart",
    graphUnit: "PUE · Line Interactive",
    legend: [
      { label: "lorem ipsum",   color: "#3033ff" },
      { label: "lorem ipsum",   color: "#97d700" },
      { label: "lorem ipsum",   color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m1-pcs",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/pcs.webp",
        focus: { x: 72, y: 78 }
      }
    ]
  },

  // ─── LOAD SMOOTHING CAPABILITIES — High Density ───────
  {
    id: "m2",
    name: "Data Center High Density",
    shortName: "Double Conversion",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m2.webp",
    graph: "./assets/graphs/m2.mp4",
    graphLabel: "Double Conversion Chart",
    graphUnit: "kW/rack · Load Smoothing Capabilities - sub titulo gráfica 2 lineas",
    legend: [
      { label: "lorem ipsum",   color: "#3033ff" },
      { label: "lorem ipsum",  color: "#97d700" },
      { label: "lorem ipsum",    color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m2-gpu",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/gpu_racks.webp",
        focus: { x: 45, y: 22 }
      }
    ]
  },

  // ─── MODELO 3 — Solar + Storage ───────────────────────
  {
    id: "m3",
    name: "Data Center Solar + BESS",
    shortName: "Load Sensing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m3.webp",
    graph: "./assets/graphs/m3.mp4",
    graphLabel: "Generación solar vs. consumo",
    graphUnit: "MWh · Modelo 3",
    legend: [
      { label: "lorem ipsum",  color: "#3033ff" },
      { label: "lorem ipsum",   color: "#97d700" },
      { label: "lorem ipsum",  color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m3-solar",
        title: "Power Plant Controller",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/solar.webp",
        focus: { x: 78, y: 18 }
      },
      {
        id: "m3-bess",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/bess.webp",
        focus: { x: 60, y: 35 }
      }
    ]
  },

  // ─── MODELO 4 — Edge Computing ────────────────────────
  {
    id: "m4",
    name: "Data Center Edge",
    shortName: "OFF Grid: GT+ BESS BTM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m4.webp",
    graph: "./assets/graphs/m4.mp4",
    graphLabel: "OFF Grid: GT+ BESS BTM Chart",
    graphUnit: "ms · Modelo 4",
     legend: [
      { label: "lorem ipsum",  color: "#3033ff" },
      { label: "lorem ipsum",   color: "#97d700" },
      { label: "lorem ipsum",  color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m4-container",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/container.webp",
        focus: { x: 35, y: 45 }
      }
    ]
  },

  // ─── MODELO 5 — Hyperscale ────────────────────────────
  {
    id: "m5",
    name: "Data Center Hyperscale",
    shortName: "Hybrid Load Sensing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m5.webp",
    graph: "./assets/graphs/m5.mp4",
    graphLabel: "Hybrid Load Sensing Chart",
    graphUnit: "MW · Modelo 5",
     legend: [
      { label: "lorem ipsum",  color: "#3033ff" },
      { label: "lorem ipsum",   color: "#97d700" },
      { label: "lorem ipsum",  color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m5-xmv670",
        title: "Power Plant Controller",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/xmv670.webp",
        focus: { x: 52, y: 48 }
      },
      {
        id: "m5-liquid",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/liquid.webp",
        focus: { x: 30, y: 60 }
      }
    ]
  },

  // ─── MODELO 6 — Hybrid Colocation ─────────────────────
  {
    id: "m6",
    name: "Data Center Hybrid Colocation",
    shortName: "800 V Power Supply",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    render: "./assets/renders/m6.webp",
    graph: "./assets/graphs/m6.mp4",
    graphLabel: "800 V Power Supply Chart",
    graphUnit: "% ocupación · Modelo 6",
     legend: [
      { label: "lorem ipsum",  color: "#3033ff" },
      { label: "lorem ipsum",   color: "#97d700" },
      { label: "lorem ipsum",  color: "#FF8300" }
    ],
    equipos: [
      {
        id: "m6-zone-priv",
        title: "HEM Solar Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "La zona privada del modelo híbrido dispone de jaulas de seguridad física con control de acceso biométrico, circuito de alimentación dedicado y VLANs aisladas para garantizar la separación total frente a los clientes de colocation. Cumple con los requisitos de GDPR, ISO 27001 y ENS nivel alto.",
        schemeImg: "./assets/schemes/zone_private.webp",
        focus: { x: 25, y: 40 }
      },
      {
        id: "m6-zone-colo",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "AIPCS 800 V Power Supply",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "DC/DC Converter",
        short: "Lorem ipsum dolor sit amet, consectetur arem ipsum dolor sit ametpsum dolor m dolor sit sed do eiusmod tempor, lorem ipsum ",
        long: "Lorem ipsum dolor sit amet, psum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-noc",
        title: "XMV670 & XMV670K",
        short: "Lorem ipsum dolor sit amet, consum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/noc.webp",
        focus: { x: 45, y: 20 }
      },
      {
        id: "m6-smartpdu",
        title: "SD750FR",
        short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet,",
        long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        schemeImg: "./assets/schemes/smartpdu.webp",
        focus: { x: 80, y: 65 }
      }
    ]
  }

]; // fin MODELS
