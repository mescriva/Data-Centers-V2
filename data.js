// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — data.js
// ═══════════════════════════════════════════════════════════
//
//  Convención de assets por combinación de equipos activos:
//
//    Render base del modelo (todos activos):
//      ./assets/renders/{id}.mp4          → ej. m4.mp4
//
//    Combinación parcial (solo algunos activos):
//      ./assets/renders/{id}_{keys}.mp4   → ej. m4_ppc.mp4
//                                            m4_pcsm.mp4
//                                            m4_none.mp4
//
//    Gráfica: misma lógica con ./assets/graphs/{id}[_{keys}].png
//
//    {keys} = renderKey de cada equipo activo, unidos por "-"
//    y ordenados según aparecen en el array `equipos`.
//    Si ningún equipo está activo → se usa el sufijo "none".
//
//  Si el archivo no existe el código cae al asset base del modelo.
// ═══════════════════════════════════════════════════════════

const MODELS = [

  // ─── MODELO 1 — Line Interactive ───────────────────────
  {
    id: "m1",
    videoId: "v1",
    graphId: "g1",
    name: "Data Center Line Interactive",
    shortName: "Line Interactive",
    description: "Line Interactive architecture decouples the inverter from grid disturbances while limiting fault currents and supporting smoother transitions between grid-connected and islanded operation.",
    description2: "With grid-forming operation and advanced control capabilities, this configuration enhances system stability and supports reliable performance under demanding load profiles.",
    graphLabel: "Line Interactive Chart",
    legend: [
      { label: "POI",         color: "var(--yellow500)" },
      { label: "PE BESS",     color: "var(--orange500)" },
      { label: "P Load", color: "var(--mobilityGreen500)" }
    ],
    equipos: [
      {
        id:        "m1-pcs",
        renderKey: "pcs",
        title:     "PCSM & Multi PCSM Battery Inverter",
        short:     "Supports the load during disturbances, stabilizes power flow, and enables islanded operation when required."
      }
    ]
  },

  // ─── MODELO 2 — Double Conversion ──────────────────────
  {
    id: "m2",
    videoId: "v2",
    graphId: "g2",
    name: "Data Center Double Conversion",
    shortName: "Double Conversion",
    description: "Double conversion architecture provides complete isolation from grid disturbances, delivering clean and stable power to critical data center loads.",
    description2: "This configuration ensures optimal power quality and uninterrupted supply with zero transfer time, making it one of the most reliable solutions for mission-critical environments.",
    graphLabel: "Double Conversion Chart",
    legend: [
      { label: "POI",          color: "var(--yellow500)"      },
      { label: "PE BESS GFM",  color: "var(--orange500)"         },
      { label: "Data Center",  color: "var(--mobilityGreen500)" },
      { label: "PE BESS GFL",  color: "var(--yellow500)"         }
    ],
    equipos: [
      {
        id:        "m2-gpu",
        renderKey: "pcs",
        title:     "PCSM & Multi PCSM Battery Inverter",
        short:     "Conditions and stabilizes the energy flow, ensuring clean power delivery to critical data center loads."
      }
    ]
  },

  // ─── MODELO 3 — Load Sensing ────────────────────────────
  {
    id: "m3",
    videoId: "v3",
    graphId: "g3",
    name: "Data Center Load Sensing",
    shortName: "Load Sensing",
    description: "Load Sensing measures real-time data center demand and sends the required power references to the grid-following inverter.",
    description2: "This enables fast response to load variations, helping reduce grid consumption and smooth significant power peaks while maintaining operational efficiency.",
    graphLabel: "Load Sensing Chart",
    legend: [
      { label: "POI",         color: "var(--yellow500)"      },
      { label: "PE BESS",     color: "var(--orange500)"         },
      { label: "Data Center", color: "var(--mobilityGreen500)" }
    ],
    equipos: [
      {
        id:        "m3-solar",
        renderKey: "ppc",
        title:     "Power Plant Controller",
        short:     "Tracks load demand in real time and sends power references to optimize inverter response."
      },
      {
        id:        "m3-bess",
        renderKey: "pcs",
        title:     "PCSM & Multi PCSM Battery Inverter",
        short:     "Responds to load changes, reduces power peaks, and supports efficient energy exchange with the grid."
      }
    ]
  },

  // ─── MODELO 4 — Hybrid Load Sensing ────────────────────
  {
    id: "m4",
    videoId: "v4",
    graphId: "g4",
    name: "Data Center Hybrid Load Sensing",
    shortName: "Hybrid Load Sensing",
    description: "Hybrid Load Sensing uses an external control device to measure real-time load demand and send power references to the grid-forming inverter.",
    description2: "This solution helps minimize grid consumption, reduce significant power peaks, and achieve performance close to line-interactive systems without the need for a choke.",
    graphLabel: "Hybrid Load Sensing Chart",
    legend: [
      { label: "POI",         color: "var(--yellow500)"      },
      { label: "PE BESS",     color: "var(--orange500)"         },
      { label: "Data Center", color: "var(--mobilityGreen500)" }
    ],
    equipos: [
      {
        id:        "m4-xmv670",
        renderKey: "ppc",
        title:     "Power Plant Controller",
        short:     "Measures real-time load demand and sends power references to coordinate the inverter response."
      },
      {
        id:        "m4-liquid",
        renderKey: "pcs",
        title:     "PCSM & Multi PCSM Battery Inverter",
        short:     "Operates in grid-forming mode to reduce power peaks, support stability, and optimize grid consumption."
      }
    ]
  },

  // ─── MODELO 5 — OFF Grid GT + BESS BTM ─────────────────
  {
    id: "m5",
    videoId: "v5",
    graphId: "g5",
    name: "Data Center OFF Grid GT + BESS BTM",
    shortName: "OFF Grid: GT+ BESS BTM",
    description: "Off-grid data centers use gas turbines for primary, continuous, and high-density power, while BESS provides backup power and stability services.",
    description2: "The BESS delivers near-instantaneous protection against momentary dips and failures, creating a scalable, reliable, and more sustainable alternative to traditional diesel-based backup systems.",
    graphLabel: "OFF Grid: GT+ BESS BTM Chart",
    legend: [
      { label: "Gas Turbine",  color: "var(--yellow500)"      },
      { label: "PE BESS",      color: "var(--orange500)"         },
      { label: "Data Center",  color: "var(--mobilityGreen500)" }
    ],
    equipos: [
      {
        id:        "m5-container",
        renderKey: "pcs",
        title:     "PCSM & Multi PCSM Battery Inverter",
        short:     "Stabilizes the off-grid system, manages battery response, and provides fast backup power during disturbances."
      }
    ]
  },

  // ─── MODELO 6 — 800 V Power Supply ─────────────────────
  {
    id: "m6",
    videoId: "v6",
    graphId: "g6",
    name: "Data Center 800 V Power Supply",
    shortName: "800 V Power Supply",
    description: "AI data centers are no longer limited only by GPUs, but by grid interconnection and energy efficiency. Traditional AC architectures can lose up to 10% of approved power before reaching compute.",
    description2: "By moving to a direct 800 V DC architecture, redundant conversion stages are reduced, improving efficiency, simplifying system design, and enabling faster scalability for next-generation data centers.",
    graphLabel: "800 V Power Supply Chart",
    legend: [
      { label: "POI",         color: "var(--neonBlue500)"      },
      { label: "PE BESS",     color: "var(--orange500)"         },
      { label: "Data Center", color: "var(--mobilityGreen500)" }
    ],
    equipos: [
      {
        id:        "m6-aipcs",
        renderKey: "aipcs",
        title:     "AIPCS 800 V Power Supply",
        short:     "Delivers regulated 800 V DC power to critical data center loads."
      },
      {
        id:        "m6-dcdc",
        renderKey: "dcdc",
        title:     "DC/DC Converter",
        short:     "Connects batteries to the 800 V DC bus for fast power exchange."
      },
      {
        id:        "m6-noc",
        renderKey: "xmv",
        title:     "XMV670 & XMV670K MV and SD750FR LV Drive",
        short:     "Ensure efficient cooling by controlling medium-voltage motors and optimizing pumps and fans."
      }
    ]
  }

];