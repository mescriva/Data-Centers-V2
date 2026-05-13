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
    graphLabel: "Eficiencia energética",
    graphUnit: "PUE · Line Interactive",
    legend: [
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m1-pcs",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Conversión AC/DC de alta eficiencia para racks de cómputo.",
        long: "El sistema de conversión de potencia (PCS) gestiona la transformación de corriente alterna a continua con una eficiencia superior al 97,5%. Reduce las pérdidas térmicas, alarga la vida útil de los equipos IT y permite una gestión inteligente de la carga a través de protocolos BMS.",
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
    graphLabel: "Densidad de potencia - titulo modelo gráfica 2",
    graphUnit: "kW/rack · Load Smoothing Capabilities - sub titulo gráfica 2 lineas",
    legend: [
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m2-gpu",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Clústeres de computación gráfica para IA y HPC.",
        long: "Los racks GPU de alta densidad alojan aceleradores de cómputo de hasta 100 kW por rack. Su diseño contempla la integración de refrigeración líquida directa en la placa trasera, eliminando la necesidad de pasillos fríos convencionales y multiplicando por 5 la densidad de cómputo por m².",
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
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m3-solar",
        title: "Power Plant Controller",
        short: "Generación solar integrada en cubierta y perímetro.",
        long: "La instalación FV cubre entre el 30% y el 70% del consumo anual del data center según la irradiación del emplazamiento. Con módulos bifaciales de 600Wp y seguimiento solar opcional, maximiza la captación sin ampliar la huella de suelo. El inversor solar se integra directamente en el bus CC del HEM.",
        schemeImg: "./assets/schemes/solar.webp",
        focus: { x: 78, y: 18 }
      },
      {
        id: "m3-bess",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Almacenamiento masivo para respaldo y arbitraje de precio.",
        long: "El sistema BESS de gran escala proporciona hasta 4 horas de autonomía completa para el data center. Permite arbitraje energético comprando en valle y vendiendo o consumiendo en punta, con un retorno de inversión típico de 5 a 7 años. Compatible con baterías LFP nuevas o reacondicionadas de segunda vida.",
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
    graphLabel: "Latencia de red edge vs. cloud",
    graphUnit: "ms · Modelo 4",
    legend: [
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m4-container",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Módulo prefabricado listo para desplegar en 72 horas.",
        long: "El contenedor IT de 20' o 40' integra toda la infraestructura de potencia, refrigeración y comunicaciones en un módulo de fábrica. La instalación en site se reduce a la conexión de suministro eléctrico, fibra y agua de refrigeración, con puesta en marcha en menos de 72 horas tras entrega.",
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
    graphLabel: "Potencia total instalada",
    graphUnit: "MW · Modelo 5",
    legend: [
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m5-xmv670",
        title: "Power Plant Controller",
        short: "Inversores de alta potencia en cadena para bus CC 1.500V.",
        long: "Los inversores XMV670 en configuración central gestionan el bus de 1.500 V DC que alimenta las PDUs de rack. La arquitectura de bus CC de alta tensión reduce las pérdidas de distribución en instalaciones superiores a 10 MW hasta un 70% comparado con distribución AC 400V convencional.",
        schemeImg: "./assets/schemes/xmv670.webp",
        focus: { x: 52, y: 48 }
      },
      {
        id: "m5-liquid",
         title: "PCSM & Multi PCSM Battery Inverter",
        short: "Distribución centralizada de refrigerante a cada rack.",
        long: "El manifold de distribución líquida lleva agua fría o refrigerante dieléctrico a cada rack del data center mediante tuberías de cobre o acero inoxidable. El sistema de monitorización de caudal y temperatura en tiempo real detecta fugas o anomalías en menos de 30 segundos y activa el aislamiento automático del sector afectado.",
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
    description: "Modelo mixto que combina infraestructura propia con colocation de terceros. Permite a las empresas mantener sus datos críticos on-premise mientras optimizan costes cediendo capacidad sobrante a clientes colocados, con separación física y lógica garantizada.",
    render: "./assets/renders/m6.webp",
    graph: "./assets/graphs/m6.mp4",
    graphLabel: "Utilización de capacidad",
    graphUnit: "% ocupación · Modelo 6",
    legend: [
      { label: "Red eléctrica",  color: "#3033ff" },
      { label: "Generación FV",  color: "#97d700" },
      { label: "BESS",           color: "#FF8300" },
      { label: "Consumo IT",     color: "#83919f" }
    ],
    equipos: [
      {
        id: "m6-zone-priv",
        title: "HEM Solar Inverter",
        short: "Área exclusiva con acceso restringido para activos críticos.",
        long: "La zona privada del modelo híbrido dispone de jaulas de seguridad física con control de acceso biométrico, circuito de alimentación dedicado y VLANs aisladas para garantizar la separación total frente a los clientes de colocation. Cumple con los requisitos de GDPR, ISO 27001 y ENS nivel alto.",
        schemeImg: "./assets/schemes/zone_private.webp",
        focus: { x: 25, y: 40 }
      },
      {
        id: "m6-zone-colo",
        title: "PCSM & Multi PCSM Battery Inverter",
        short: "Espacio comercializable con SLA de disponibilidad 99,999%.",
        long: "El área de colocation ofrece slots de medio rack, rack completo o jaulas de varios racks con alimentación redundante Tier III. La monitorización de consumo por cliente y la facturación automatizada por kWh real facilitan el modelo de negocio como operador neutral de colocation.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "AIPCS 800 V Power Supply",
        short: "Espacio comercializable con SLA de disponibilidad 99,999%.",
        long: "El área de colocation ofrece slots de medio rack, rack completo o jaulas de varios racks con alimentación redundante Tier III. La monitorización de consumo por cliente y la facturación automatizada por kWh real facilitan el modelo de negocio como operador neutral de colocation.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-zone-colo",
        title: "DC/DC Converter",
        short: "Espacio comercializable con SLA de disponibilidad 99,999%.",
        long: "El área de colocation ofrece slots de medio rack, rack completo o jaulas de varios racks con alimentación redundante Tier III. La monitorización de consumo por cliente y la facturación automatizada por kWh real facilitan el modelo de negocio como operador neutral de colocation.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-noc",
        title: "XMV670 & XMV670K",
        short: "Centro de operaciones de red con monitorización 24/7.",
        long: "El NOC del data center híbrido opera de forma continua para garantizar los SLA comprometidos con los clientes colocados. Integra herramientas de monitorización de red, potencia y ambiental con ticketing automático y escalado de incidencias. Puede operar en modo remoto desde un segundo NOC de respaldo.",
        schemeImg: "./assets/schemes/noc.webp",
        focus: { x: 45, y: 20 }
      },
      {
        id: "m6-smartpdu",
        title: "SD750FR",
        short: "Distribución inteligente con medición por toma de corriente.",
        long: "Las PDUs inteligentes permiten medir el consumo real de cada servidor colocado con resolución de 0,1W, generar informes de energía por cliente y activar/desactivar tomas de forma remota. Son la base del modelo de negocio de colocation por consumo real y garantizan la trazabilidad para auditorías de eficiencia.",
        schemeImg: "./assets/schemes/smartpdu.webp",
        focus: { x: 80, y: 65 }
      }
    ]
  }

]; // fin MODELS
