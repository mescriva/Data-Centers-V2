// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — data.js
//
//  Cada equipo (card) define su propia gráfica, leyenda y
//  vídeo de render. El modelo sólo agrupa equipos y aporta
//  los textos descriptivos del panel lateral.
// ═══════════════════════════════════════════════════════════

const MODELS = [

  // ─── M1 — Line Interactive ─────────────────────────────
  {
    id:          "m1",
    videoId:     "v1",           // vídeo base / fallback
    name:        "Data Center Line Interactive",
    shortName:   "Line Interactive",
    isPublic:    false,
    description: "Line Interactive architecture decouples the inverter from grid disturbances while limiting fault currents and supporting smoother transitions between grid-connected and islanded operation.",
    description2:"With grid-forming operation and advanced control capabilities, this configuration enhances system stability and supports reliable performance under demanding load profiles.",
    equipos: [
      {
        id:         "m1-pcs",
        renderKey:  "pcs",
        videoId:    "v1",
        title:      "PCSM & Multi PCSM Battery Inverter",
        short:      "Supports the load during disturbances, stabilizes power flow, and enables islanded operation when required.",
        graphLabel: "Line Interactive — PCSM",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",     color: "var(--yellow500)" },
          { label: "PE BESS", color: "var(--orange500)" },
          { label: "P Load",  color: "var(--mobilityGreen500)" }
        ]
      }
    ]
  },

  // ─── M2 — Double Conversion ────────────────────────────
  {
    id:          "m2",
    videoId:     "v2",
    name:        "Data Center Double Conversion",
    shortName:   "Double Conversion",
    isPublic:    false,
    description: "Double conversion architecture provides complete isolation from grid disturbances, delivering clean and stable power to critical data center loads.",
    description2:"This configuration ensures optimal power quality and uninterrupted supply with zero transfer time, making it one of the most reliable solutions for mission-critical environments.",
    equipos: [
      {
        id:         "m2-pcs",
        renderKey:  "pcs",
        videoId:    "v2",
        title:      "PCSM & Multi PCSM Battery Inverter",
        short:      "Conditions and stabilizes the energy flow, ensuring clean power delivery to critical data center loads.",
        graphLabel: "Double Conversion — PCSM",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--yellow500)" },
          { label: "PE BESS GFM", color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" },
          { label: "PE BESS GFL", color: "var(--yellow500)" }
        ]
      }
    ]
  },

  // ─── M3 — Load Sensing ─────────────────────────────────
  {
    id:          "m3",
    videoId:     "v3",
    name:        "Data Center Load Sensing",
    shortName:   "Load Sensing",
    isPublic:    false,
    description: "Load Sensing measures real-time data center demand and sends the required power references to the grid-following inverter.",
    description2:"This enables fast response to load variations, helping reduce grid consumption and smooth significant power peaks while maintaining operational efficiency.",
    equipos: [
      {
        id:         "m3-ppc",
        renderKey:  "ppc",
        videoId:    "v3",
        title:      "Power Plant Controller",
        short:      "Tracks load demand in real time and sends power references to optimize inverter response.",
        graphLabel: "Load Sensing — Power Plant Controller",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--yellow500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      },
      {
        id:         "m3-pcs",
        renderKey:  "pcs",
        videoId:    "v3",
        title:      "PCSM & Multi PCSM Battery Inverter",
        short:      "Responds to load changes, reduces power peaks, and supports efficient energy exchange with the grid.",
        graphLabel: "Load Sensing — PCSM",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--yellow500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      }
    ]
  },

  // ─── M4 — Hybrid Load Sensing ──────────────────────────
  {
    id:          "m4",
    videoId:     "v4",
    name:        "Data Center Hybrid Load Sensing",
    shortName:   "Hybrid Load Sensing",
    isPublic:    false,
    description: "Hybrid Load Sensing uses an external control device to measure real-time load demand and send power references to the grid-forming inverter.",
    description2:"This solution helps minimize grid consumption, reduce significant power peaks, and achieve performance close to line-interactive systems without the need for a choke.",
    equipos: [
      {
        id:         "m4-ppc",
        renderKey:  "ppc",
        videoId:    "v4",
        title:      "Power Plant Controller",
        short:      "Measures real-time load demand and sends power references to coordinate the inverter response.",
        graphLabel: "Hybrid Load Sensing — Power Plant Controller",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--yellow500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      },
      {
        id:         "m4-pcs",
        renderKey:  "pcs",
        videoId:    "v4",
        title:      "PCSM & Multi PCSM Battery Inverter",
        short:      "Operates in grid-forming mode to reduce power peaks, support stability, and optimize grid consumption.",
        graphLabel: "Hybrid Load Sensing — PCSM",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--yellow500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      }
    ]
  },

  // ─── M5 — OFF Grid GT + BESS BTM ───────────────────────
  {
    id:          "m5",
    videoId:     "v5",
    name:        "Data Center OFF Grid GT + BESS BTM",
    shortName:   "OFF Grid: GT+ BESS BTM",
    isPublic:    false,
    description: "Off-grid data centers use gas turbines for primary, continuous, and high-density power, while BESS provides backup power and stability services.",
    description2:"The BESS delivers near-instantaneous protection against momentary dips and failures, creating a scalable, reliable, and more sustainable alternative to traditional diesel-based backup systems.",
    equipos: [
      {
        id:         "m5-pcs",
        renderKey:  "pcs",
        videoId:    "v5",
        title:      "PCSM & Multi PCSM Battery Inverter",
        short:      "Stabilizes the off-grid system, manages battery response, and provides fast backup power during disturbances.",
        graphLabel: "OFF Grid — PCSM",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "Gas Turbine", color: "var(--yellow500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      }
    ]
  },

  // ─── M6 — 800 V Power Supply (PÚBLICO / DEFAULT) ───────
  {
    id:          "m6",
    videoId:     "v6",
    name:        "Data Center 800 V Power Supply",
    shortName:   "800 V Power Supply",
    isPublic:    true,
    description: "AI data centers are no longer limited only by GPUs, but by grid interconnection and energy efficiency. Traditional AC architectures can lose up to 10% of approved power before reaching compute.",
    description2:"By moving to a direct 800 V DC architecture, redundant conversion stages are reduced, improving efficiency, simplifying system design, and enabling faster scalability for next-generation data centers.",
    equipos: [
      {
        id:         "m6-aipcs",
        renderKey:  "aipcs",
        videoId:    "v6",
        title:      "AIPCS 800 V Power Supply",
        short:      "Delivers regulated 800 V DC power to critical data center loads.",
        graphLabel: "800 V Power Supply — AIPCS",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--neonBlue500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      },
      {
        id:         "m6-dcdc",
        renderKey:  "dcdc",
        videoId:    "v6",
        title:      "DC/DC Converter",
        short:      "Connects batteries to the 800 V DC bus for fast power exchange.",
        graphLabel: "800 V Power Supply — DC/DC Converter",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--neonBlue500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      },
      {
        id:         "m6-xmv",
        renderKey:  "xmv",
        videoId:    "v6",
        title:      "XMV670 & XMV670K MV and SD750FR LV Drive",
        short:      "Ensure efficient cooling by controlling medium-voltage motors and optimizing pumps and fans.",
        graphLabel: "800 V Power Supply — XMV670",
        graphHtml:  "./assets/graphs/0_prueba.html",
        legend: [
          { label: "POI",         color: "var(--neonBlue500)" },
          { label: "PE BESS",     color: "var(--orange500)" },
          { label: "Data Center", color: "var(--mobilityGreen500)" }
        ]
      }
    ]
  }

];
