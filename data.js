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
    description: "Line Interactive architecture decouples the inverter from grid disturbances while limiting fault currents and supporting smoother transitions between grid-connected and islanded operation.",
    description2: "With grid-forming operation and advanced control capabilities, this configuration enhances system stability and supports reliable performance under demanding load profiles.",
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
        short: "Supports the load during disturbances, stabilizes power flow, and enables islanded operation when required.",
        long: "Supports the load during disturbances, stabilizes power flow, and enables islanded operation when required.",
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
    description: "Double conversion architecture provides complete isolation from grid disturbances, delivering clean and stable power to critical data center loads.",
    description2: "This configuration ensures optimal power quality and uninterrupted supply with zero transfer time, making it one of the most reliable solutions for mission-critical environments.",
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
        short: "Conditions and stabilizes the energy flow, ensuring clean power delivery to critical data center loads.",
        long: "Conditions and stabilizes the energy flow, ensuring clean power delivery to critical data center loads.",
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
    description: "Load Sensing measures real-time data center demand and sends the required power references to the grid-following inverter.",
    description2: "This enables fast response to load variations, helping reduce grid consumption and smooth significant power peaks while maintaining operational efficiency.",
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
        short: "Tracks load demand in real time and sends power references to optimize inverter response.",
        long: "Tracks load demand in real time and sends power references to optimize inverter response.",
        schemeImg: "./assets/schemes/solar.webp",
        focus: { x: 78, y: 18 }
      },
      {
        id: "m3-bess",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Responds to load changes, reduces power peaks, and supports efficient energy exchange with the grid.",
        long: "Responds to load changes, reduces power peaks, and supports efficient energy exchange with the grid.",
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
    description: "Off-grid data centers use gas turbines for primary, continuous, and high-density power, while BESS provides backup power and stability services.",
    description2: "The BESS delivers near-instantaneous protection against momentary dips and failures, creating a scalable, reliable, and more sustainable alternative to traditional diesel-based backup systems.",
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
        short: "Stabilizes the off-grid system, manages battery response, and provides fast backup power during disturbances.",
        long: "Stabilizes the off-grid system, manages battery response, and provides fast backup power during disturbances.",
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
    description: "Hybrid Load Sensing uses an external control device to measure real-time load demand and send power references to the grid-forming inverter.",
    description2: "This solution helps minimize grid consumption, reduce significant power peaks, and achieve performance close to line-interactive systems without the need for a choke.",
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
        short: "Measures real-time load demand and sends power references to coordinate the inverter response.",
        long: "Measures real-time load demand and sends power references to coordinate the inverter response, ensuring optimal performance and efficiency.",
        schemeImg: "./assets/schemes/xmv670.webp",
        focus: { x: 52, y: 48 }
      },
      {
        id: "m5-liquid",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Operates in grid-forming mode to reduce power peaks, support stability, and optimize grid consumption.",
        long: "Operates in grid-forming mode to reduce power peaks, support stability, and optimize grid consumption, ensuring efficient energy management.",
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
    description: "AI data centers are no longer limited only by GPUs, but by grid interconnection and energy efficiency. Traditional AC architectures can lose up to 10% of approved power before reaching compute.",
    description2:"By moving to a direct 800 V DC architecture, redundant conversion stages are reduced, improving efficiency, simplifying system design, and enabling faster scalability for next-generation data centers.",
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
        short: "Converts solar energy into AC power for on-site generation.",
        long: "Converts solar energy into AC power for on-site generation.",
        schemeImg: "./assets/schemes/zone_private.webp",
        focus: { x: 25, y: 40 }
      },
      {
        id: "m6-zone-colo",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Manages battery power for backup, peak shaving, and grid support.",
        long: "Manages battery power for backup, peak shaving, and grid support.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "AIPCS 800 V Power Supply",
        short: "Delivers regulated 800 V DC power to critical data center loads.",
        long: "Delivers regulated 800 V DC power to critical data center loads.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "DC/DC Converter",
        short: "Connects batteries to the 800 V DC bus for fast power exchange.",
        long: "Connects batteries to the 800 V DC bus for fast power exchange.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-noc",
        title: "XMV670 & XMV670K",
        short: "Controls cooling systems with precise medium-voltage motor management.",
        long: "Controls cooling systems with precise medium-voltage motor management.",
        schemeImg: "./assets/schemes/noc.webp",
        focus: { x: 45, y: 20 }
      },
      {
        id: "m6-smartpdu",
        title: "SD750FR",
        short: "Controls auxiliary pumps and fans for efficient facility operation.",
        long: "Controls auxiliary pumps and fans for efficient facility operation.",
        schemeImg: "./assets/schemes/smartpdu.webp",
        focus: { x: 80, y: 65 }
      }
    ]
  }

]; // fin MODELS
