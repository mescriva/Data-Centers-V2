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
    shortName: "Modelo 1",
    description: "Solución modular de entrada diseñada para cargas de trabajo convencionales. Ofrece alta disponibilidad con un balance óptimo entre coste y rendimiento, ideal para empresas que dan sus primeros pasos en infraestructura crítica.",
    render: "./assets/renders/m1.webp",
    graph: "./assets/graphs/m1.mp4",
    graphLabel: "Eficiencia energética",
    graphUnit: "PUE · Modelo 1",
    equipos: [
      {
        id: "m1-pcs",
        title: "PCS — Power Conversion",
        short: "Conversión AC/DC de alta eficiencia para racks de cómputo.",
        long: "El sistema de conversión de potencia (PCS) gestiona la transformación de corriente alterna a continua con una eficiencia superior al 97,5%. Reduce las pérdidas térmicas, alarga la vida útil de los equipos IT y permite una gestión inteligente de la carga a través de protocolos BMS.",
        schemeImg: "./assets/schemes/pcs.webp",
        focus: { x: 72, y: 78 }
      },
      {
        id: "m1-batteries",
        title: "Baterías LFP",
        short: "Almacenamiento de energía de litio hierro fosfato.",
        long: "Las baterías LFP (Litio Hierro Fosfato) proporcionan autonomía ante cortes de red, con ciclos de carga superiores a 6.000 y una temperatura de operación segura de hasta 60 °C. Su integración con el sistema BMS permite monitorización en tiempo real del estado de carga y salud de cada celda.",
        schemeImg: "./assets/schemes/batteries.webp",
        focus: { x: 55, y: 30 }
      },
      {
        id: "m1-aircon",
        title: "Air Condensers",
        short: "Disipación de calor por aire para zonas sin agua disponible.",
        long: "Los condensadores de aire son la primera línea de disipación térmica. Diseñados para operar en ambientes de hasta 45 °C, trabajan en cascada con el Chiller para garantizar la temperatura adecuada de los equipos IT sin necesidad de torres de refrigeración hídricas.",
        schemeImg: "./assets/schemes/aircon.webp",
        focus: { x: 15, y: 55 }
      },
      {
        id: "m1-chiller",
        title: "Chiller",
        short: "Refrigeración líquida de alta capacidad para racks densos.",
        long: "El sistema chiller ofrece refrigeración líquida con capacidades desde 200 kW hasta 2 MW, adaptable a free-cooling en condiciones favorables para maximizar la eficiencia. El control predictivo reduce el consumo hasta un 35% frente a sistemas convencionales ON/OFF.",
        schemeImg: "./assets/schemes/chiller.webp",
        focus: { x: 28, y: 75 }
      }
    ]
  },

  // ─── MODELO 2 — High Density ──────────────────────────
  {
    id: "m2",
    name: "Data Center High Density",
    shortName: "Modelo 2",
    description: "Diseñado para cargas de trabajo de alta densidad como HPC y AI. Incorpora sistemas de refrigeración líquida directa en rack y buses de CC de 800V para minimizar pérdidas de conversión en instalaciones superiores a 1 MW.",
    render: "./assets/renders/m2.webp",
    graph: "./assets/graphs/m2.mp4",
    graphLabel: "Densidad de potencia por rack",
    graphUnit: "kW/rack · Modelo 2",
    equipos: [
      {
        id: "m2-gpu",
        title: "GPU Racks",
        short: "Clústeres de computación gráfica para IA y HPC.",
        long: "Los racks GPU de alta densidad alojan aceleradores de cómputo de hasta 100 kW por rack. Su diseño contempla la integración de refrigeración líquida directa en la placa trasera, eliminando la necesidad de pasillos fríos convencionales y multiplicando por 5 la densidad de cómputo por m².",
        schemeImg: "./assets/schemes/gpu_racks.webp",
        focus: { x: 45, y: 22 }
      },
      {
        id: "m2-xmv670k",
        title: "XMV670K",
        short: "Inversor modular de 670 kVA para centros de muy alta potencia.",
        long: "El XMV670K es el corazón de la conversión para instalaciones de data center superiores a 500 kW. Con arquitectura modular N+1, permite el mantenimiento en caliente sin interrupciones de servicio. Ofrece una THDi inferior al 3% y un factor de potencia de 1,0 en todo el rango de carga.",
        schemeImg: "./assets/schemes/xmv670k.webp",
        focus: { x: 50, y: 50 }
      },
      {
        id: "m2-hem",
        title: "HEM — Hybrid Energy Module",
        short: "Integración de renovables con gestión de picos de demanda.",
        long: "El módulo de energía híbrida combina el input de la red, generación fotovoltaica y almacenamiento para optimizar el coste energético en tiempo real. El algoritmo de despacho reduce el coste de la energía hasta un 28% en instalaciones con tarificación dinámica o contrato de potencia limitado.",
        schemeImg: "./assets/schemes/hem.webp",
        focus: { x: 88, y: 20 }
      },
      {
        id: "m2-dcdc",
        title: "DC/DC Converter",
        short: "Bus de 800V CC para distribución directa a equipos IT.",
        long: "El convertidor DC/DC adapta el bus principal de alta tensión continua a los niveles requeridos por cada rack (48V, 12V). La distribución en CC reduce las pérdidas de conversión en un 60% respecto a esquemas AC convencionales, siendo especialmente eficiente en instalaciones con alta penetración de renovables.",
        schemeImg: "./assets/schemes/dcdc.webp",
        focus: { x: 62, y: 55 }
      }
    ]
  },

  // ─── MODELO 3 — Solar + Storage ───────────────────────
  {
    id: "m3",
    name: "Data Center Solar + BESS",
    shortName: "Modelo 3",
    description: "Modelo orientado a la sostenibilidad y autosuficiencia energética. Combina generación fotovoltaica de gran escala con un sistema BESS de segunda vida o LFP para alcanzar PUE inferiores a 1,2 y operación off-grid o near-grid.",
    render: "./assets/renders/m3.webp",
    graph: "./assets/graphs/m3.mp4",
    graphLabel: "Generación solar vs. consumo",
    graphUnit: "MWh · Modelo 3",
    equipos: [
      {
        id: "m3-solar",
        title: "Paneles Fotovoltaicos",
        short: "Generación solar integrada en cubierta y perímetro.",
        long: "La instalación FV cubre entre el 30% y el 70% del consumo anual del data center según la irradiación del emplazamiento. Con módulos bifaciales de 600Wp y seguimiento solar opcional, maximiza la captación sin ampliar la huella de suelo. El inversor solar se integra directamente en el bus CC del HEM.",
        schemeImg: "./assets/schemes/solar.webp",
        focus: { x: 78, y: 18 }
      },
      {
        id: "m3-bess",
        title: "BESS — Battery Energy Storage",
        short: "Almacenamiento masivo para respaldo y arbitraje de precio.",
        long: "El sistema BESS de gran escala proporciona hasta 4 horas de autonomía completa para el data center. Permite arbitraje energético comprando en valle y vendiendo o consumiendo en punta, con un retorno de inversión típico de 5 a 7 años. Compatible con baterías LFP nuevas o reacondicionadas de segunda vida.",
        schemeImg: "./assets/schemes/bess.webp",
        focus: { x: 60, y: 35 }
      },
      {
        id: "m3-aipcs",
        title: "AIPCS — AI Power Control",
        short: "Control predictivo de flujos de energía mediante IA.",
        long: "El sistema de control AIPCS utiliza modelos de machine learning para predecir la demanda del data center y la generación solar con hasta 48h de antelación. Optimiza la carga/descarga del BESS, la importación de red y el arranque de grupos electrógenos de emergencia, reduciendo el coste operativo hasta un 22%.",
        schemeImg: "./assets/schemes/aipcs.webp",
        focus: { x: 40, y: 78 }
      },
      {
        id: "m3-pcsm",
        title: "PCSM — Power Control Station",
        short: "Centro de mando local para operación autónoma del site.",
        long: "La estación de control de potencia centraliza la supervisión y mando de todos los activos del data center: conversores, baterías, inversores FV y sistemas de refrigeración. Con interfaz táctil de 21\" y conectividad SCADA/MODBUS, permite operar el site sin necesidad de conexión a sistemas cloud.",
        schemeImg: "./assets/schemes/pcsm.webp",
        focus: { x: 80, y: 80 }
      }
    ]
  },

  // ─── MODELO 4 — Edge Computing ────────────────────────
  {
    id: "m4",
    name: "Data Center Edge",
    shortName: "Modelo 4",
    description: "Solución compacta para despliegues en el borde de la red (edge computing), zonas remotas o plantas industriales. Diseñada para operar en contenedor con temperatura exterior de hasta 55 °C y sin personal técnico en sitio.",
    render: "./assets/renders/m4.webp",
    graph: "./assets/graphs/m4.mp4",
    graphLabel: "Latencia de red edge vs. cloud",
    graphUnit: "ms · Modelo 4",
    equipos: [
      {
        id: "m4-container",
        title: "Contenedor IT",
        short: "Módulo prefabricado listo para desplegar en 72 horas.",
        long: "El contenedor IT de 20' o 40' integra toda la infraestructura de potencia, refrigeración y comunicaciones en un módulo de fábrica. La instalación en site se reduce a la conexión de suministro eléctrico, fibra y agua de refrigeración, con puesta en marcha en menos de 72 horas tras entrega.",
        schemeImg: "./assets/schemes/container.webp",
        focus: { x: 35, y: 45 }
      },
      {
        id: "m4-ups",
        title: "UPS Modular",
        short: "SAI modular N+1 para continuidad de servicio 24/7.",
        long: "El UPS modular en formato 3U permite escalar la potencia de respaldo de 10 a 100 kW en pasos de 10 kW, añadiendo módulos en caliente. La tecnología doble conversión online garantiza 0 ms de tiempo de transferencia. Incluye bypass de mantenimiento estático integrado y monitorización SNMP.",
        schemeImg: "./assets/schemes/ups.webp",
        focus: { x: 55, y: 60 }
      },
      {
        id: "m4-inrow",
        title: "In-Row Cooling",
        short: "Refrigeración de fila para alta densidad en espacio reducido.",
        long: "Los equipos de refrigeración in-row se intercalan entre racks para tratar el aire caliente en el punto de generación, eliminando los problemas de mezcla de aire del pasillo convencional. Compatibles con agua fría de circuito cerrado o con refrigeración adiabática para zonas de bajo consumo hídrico.",
        schemeImg: "./assets/schemes/inrow.webp",
        focus: { x: 25, y: 30 }
      },
      {
        id: "m4-sd750",
        title: "SD750FR — Rectificador Frontal",
        short: "Rectificador de acceso frontal para instalaciones sin pasillo trasero.",
        long: "El rectificador SD750FR con acceso 100% frontal permite instalar racks en salas sin pasillo trasero accesible o contra pared. Con una eficiencia del 96,5% y factor de potencia de 0,99, es la solución de referencia para modernizar CPDs legacy con mínima obra civil.",
        schemeImg: "./assets/schemes/sd750.webp",
        focus: { x: 45, y: 50 }
      }
    ]
  },

  // ─── MODELO 5 — Hyperscale ────────────────────────────
  {
    id: "m5",
    name: "Data Center Hyperscale",
    shortName: "Modelo 5",
    description: "Infraestructura pensada para operadores cloud y proveedores de colocación de muy gran escala. Soporta potencias totales de 10 a 100 MW con arquitectura de bus CC de 1.500V y enfriamiento líquido directo en cada rack.",
    render: "./assets/renders/m5.webp",
    graph: "./assets/graphs/m5.mp4",
    graphLabel: "Potencia total instalada",
    graphUnit: "MW · Modelo 5",
    equipos: [
      {
        id: "m5-xmv670",
        title: "XMV670 — Inversor Central",
        short: "Inversores de alta potencia en cadena para bus CC 1.500V.",
        long: "Los inversores XMV670 en configuración central gestionan el bus de 1.500 V DC que alimenta las PDUs de rack. La arquitectura de bus CC de alta tensión reduce las pérdidas de distribución en instalaciones superiores a 10 MW hasta un 70% comparado con distribución AC 400V convencional.",
        schemeImg: "./assets/schemes/xmv670.webp",
        focus: { x: 52, y: 48 }
      },
      {
        id: "m5-liquid",
        title: "Liquid Cooling Manifold",
        short: "Distribución centralizada de refrigerante a cada rack.",
        long: "El manifold de distribución líquida lleva agua fría o refrigerante dieléctrico a cada rack del data center mediante tuberías de cobre o acero inoxidable. El sistema de monitorización de caudal y temperatura en tiempo real detecta fugas o anomalías en menos de 30 segundos y activa el aislamiento automático del sector afectado.",
        schemeImg: "./assets/schemes/liquid.webp",
        focus: { x: 30, y: 60 }
      },
      {
        id: "m5-genset",
        title: "Grupos Electrógenos N+1",
        short: "Respaldo diésel o HVO para operación continuada en black-out.",
        long: "Los grupos electrógenos de respaldo en configuración N+1 garantizan la continuidad del servicio ante cortes prolongados de red. Con combustible HVO (aceite vegetal hidrotratado), reducen las emisiones de CO₂ hasta un 90% respecto al diésel convencional. El arranque automático se completa en menos de 10 segundos.",
        schemeImg: "./assets/schemes/genset.webp",
        focus: { x: 15, y: 75 }
      },
      {
        id: "m5-scada",
        title: "SCADA / DCIM",
        short: "Supervisión centralizada de toda la infraestructura crítica.",
        long: "La plataforma SCADA/DCIM unifica la supervisión de potencia, refrigeración, seguridad física y comunicaciones en un único panel de control. Ofrece dashboards configurables, alertas predictivas basadas en IA y exportación de datos a cualquier sistema de gestión energética o BI corporativo.",
        schemeImg: "./assets/schemes/scada.webp",
        focus: { x: 65, y: 25 }
      }
    ]
  },

  // ─── MODELO 6 — Hybrid Colocation ─────────────────────
  {
    id: "m6",
    name: "Data Center Hybrid Colocation",
    shortName: "Modelo 6",
    description: "Modelo mixto que combina infraestructura propia con colocation de terceros. Permite a las empresas mantener sus datos críticos on-premise mientras optimizan costes cediendo capacidad sobrante a clientes colocados, con separación física y lógica garantizada.",
    render: "./assets/renders/m6.webp",
    graph: "./assets/graphs/m6.mp4",
    graphLabel: "Utilización de capacidad",
    graphUnit: "% ocupación · Modelo 6",
    equipos: [
      {
        id: "m6-zone-priv",
        title: "Zona Privada (On-Premise)",
        short: "Área exclusiva con acceso restringido para activos críticos.",
        long: "La zona privada del modelo híbrido dispone de jaulas de seguridad física con control de acceso biométrico, circuito de alimentación dedicado y VLANs aisladas para garantizar la separación total frente a los clientes de colocation. Cumple con los requisitos de GDPR, ISO 27001 y ENS nivel alto.",
        schemeImg: "./assets/schemes/zone_private.webp",
        focus: { x: 25, y: 40 }
      },
      {
        id: "m6-zone-colo",
        title: "Zona Colocation",
        short: "Espacio comercializable con SLA de disponibilidad 99,999%.",
        long: "El área de colocation ofrece slots de medio rack, rack completo o jaulas de varios racks con alimentación redundante Tier III. La monitorización de consumo por cliente y la facturación automatizada por kWh real facilitan el modelo de negocio como operador neutral de colocation.",
        schemeImg: "./assets/schemes/zone_colo.webp",
        focus: { x: 65, y: 45 }
      },
      {
        id: "m6-noc",
        title: "NOC — Network Operations Center",
        short: "Centro de operaciones de red con monitorización 24/7.",
        long: "El NOC del data center híbrido opera de forma continua para garantizar los SLA comprometidos con los clientes colocados. Integra herramientas de monitorización de red, potencia y ambiental con ticketing automático y escalado de incidencias. Puede operar en modo remoto desde un segundo NOC de respaldo.",
        schemeImg: "./assets/schemes/noc.webp",
        focus: { x: 45, y: 20 }
      },
      {
        id: "m6-smartpdu",
        title: "Smart PDU",
        short: "Distribución inteligente con medición por toma de corriente.",
        long: "Las PDUs inteligentes permiten medir el consumo real de cada servidor colocado con resolución de 0,1W, generar informes de energía por cliente y activar/desactivar tomas de forma remota. Son la base del modelo de negocio de colocation por consumo real y garantizan la trazabilidad para auditorías de eficiencia.",
        schemeImg: "./assets/schemes/smartpdu.webp",
        focus: { x: 80, y: 65 }
      }
    ]
  }

]; // fin MODELS
