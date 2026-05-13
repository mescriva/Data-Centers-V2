// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js
//  Lógica de interacción del MVP.
//  ─────────────────────────────────────────────────────────
//  Flujo principal:
//    1. Usuario elige modelo en Sección D   → setModel()
//    2. Usuario activa switch en card       → toggleEquip()
//    3. Usuario pulsa flecha de detalle     → openDetail()
//    4. Usuario pulsa ← volver             → closeDetail()
//
//  Sin frameworks. Sin bundler. Vanilla JS con módulos
//  simulados (variables globales desde data.js cargado antes).
//
//  IMPORTANTE: data.js debe cargarse ANTES que este archivo
//  (ver orden de <script> en index.html)
// ═══════════════════════════════════════════════════════════


// ── ESTADO GLOBAL ─────────────────────────────────────────
// Todo el estado de la UI vive aquí. Sencillo y depurable.
const state = {
  modeloId:    MODELS[0].id,  // modelo seleccionado por defecto
  activeEquip: {}             // { [equipId]: boolean }  ON/OFF
};


// ── REFERENCIAS DOM (caché para no buscar en cada render) ──
const $ = id => document.getElementById(id);

const dom = {
  aText:      $("aText"),
  aBadge:     $("aBadge"),
  aBody:      $("aBody"),
  renderImg:  $("renderImg"),
  focusLayer: $("focusLayer"),
  renderTag:  $("renderTag"),
  graphVideo: $("graphVideo"),
  graphImg:   $("graphImg"),
  graphLabel: $("graphLabel"),
  graphUnit:  $("graphUnit"),
  modelNav:   $("modelNav")
};


// ── HELPERS ────────────────────────────────────────────────

/** Devuelve el objeto modelo activo */
function getModel() {
  return MODELS.find(m => m.id === state.modeloId);
}

/** Devuelve true si el equipo está activo (switch ON) */
function isOn(equipId) {
  return Boolean(state.activeEquip[equipId]);
}

/** Inicializa el estado de switches para un modelo (solo la primera vez) */
function initEquipState(model) {
  model.equipos.forEach(eq => {
    if (state.activeEquip[eq.id] === undefined) {
      state.activeEquip[eq.id] = false;
    }
  });
}


// ── RENDER: SECCIÓN D (navbar modelos) ────────────────────
function renderSectionD() {
  dom.modelNav.innerHTML = MODELS.map(m => {
    const sel = m.id === state.modeloId ? "selected" : "";
    return `<button class="model-btn ${sel}" data-action="setModel" data-model="${m.id}">
              ${m.shortName}
            </button>`;
  }).join("");
}


// ── RENDER: SECCIÓN B (render fijo) ───────────────────────
const RENDER_SRC = "./assets/renders/render-main.png";

function renderSectionB(model) {
  // Imagen fija para todos los modelos
  if (!dom.renderImg.src.endsWith("render-main.png")) {
    dom.renderImg.src = RENDER_SRC;
  }

  // Etiqueta del modelo sobre el render
  dom.renderTag.textContent = model.shortName.toUpperCase();

  // Sin nodos de foco
  dom.focusLayer.innerHTML = "";
}


// ── RENDER: SECCIÓN C (gráfica / video) ───────────────────
function renderSectionC(model) {
  // Actualizar etiqueta y leyenda
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";
  const legendItems = (model.legend || []).map(item =>
    `<span class="graph-legend-item">
       <span class="graph-legend-dot" style="background:${item.color}"></span>
       ${item.label}
     </span>`
  ).join("");
  dom.graphUnit.innerHTML = legendItems || (model.graphUnit || `kW · ${model.shortName}`);

  // Placeholder SVG de color sólido por modelo (2160×480, 9:2).
  // Cuando lleguen los .mp4 reales, devolver al flujo de video.
  // el naming para recorrer el ARRAY y pintar cada img debe ser m + (id) + .png  dom.graphVideo.style.display = "none";
  dom.graphImg.style.display = "block";
  dom.graphImg.src = `./assets/graphs/${model.id}.png`; /* TODO CHANGE THE NAMES OF PLACEHOLDER BCS MODEL IS "m(n).svg" al png*/
}


// ── RENDER: SECCIÓN A — LISTADO DE EQUIPOS ────────────────
function renderSectionAList(model) {
  // Cabecera: subtítulo (shortName del modelo) + descripción
  dom.aBadge.textContent = model.shortName;
  dom.aText.textContent  = model.description;

  const iconOn  = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2 3-3"/></svg>`;
  const iconOff = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M5 5l4 4M9 5l-4 4"/></svg>`;

  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const on         = isOn(eq.id);
    const cardActive = on ? "card--active" : "";
    /* const labelText  = on ? "Enabled" : "Disabled";
    const labelIcon  = on ? iconOn : iconOff;  de momento no hay interaccion*/

    return `
      <article class="card ${cardActive} anim-fade"
               data-equip="${eq.id}"
               data-action="toggle"
               style="animation-delay: ${i * 0.06}s">

        <!-- columna izquierda: 312px titulo + label estado -->
        <div class="card-left">
          <div class="card-title">${eq.title}</div>
          </span>
        </div>

        <!-- columna derecha 1fr: descripción -->
        <div class="card-desc">${eq.short}</div>
      </article>
    `;
  }).join("");
}




// ── RENDER GLOBAL ─────────────────────────────────────────
function render() {
  const model = getModel();
  initEquipState(model);

  renderSectionD();
  renderSectionB(model);
  renderSectionC(model);
  renderSectionAList(model);
}


// ── ACCIONES ──────────────────────────────────────────────

/** Cambia el modelo activo */
function setModel(modelId) {
  state.modeloId = modelId;
  render();
}

/** Alterna el estado ON/OFF de un equipo — actualiza solo la card afectada */
function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];
  const on = isOn(equipId);

  const card = dom.aBody.querySelector(`[data-equip="${equipId}"]`);
  if (!card) return;

  card.classList.toggle("card--active", on);

  const label = card.querySelector(".card-label");
  if (label) {
    const iconOn  = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2 3-3"/></svg>`;
    const iconOff = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M5 5l4 4M9 5l-4 4"/></svg>`;
    label.className = `card-label ${on ? "card-label--on" : "card-label--off"}`;
    label.setAttribute("aria-label", on ? "Enabled" : "Disabled");
    label.innerHTML = `${on ? iconOn : iconOff}${on ? "Enabled" : "Disabled"}`;
  }
}


// ── DELEGACIÓN DE EVENTOS ─────────────────────────────────
// Listener único para toda la interacción. Soporta tanto
// botones como la card completa (data-action en article).
document.addEventListener("click", (ev) => {
  const target = ev.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  // ① Cambiar modelo (Sección D)
  if (action === "setModel") {
    const modelId = target.dataset.model;
    if (modelId) setModel(modelId);
    return;
  }

  // ② Activar/desactivar equipo (card completa o switch en detalle)
  if (action === "toggle") {
    const card    = target.closest("[data-equip]") ?? target;
    const equipId = target.dataset.equip || card.dataset.equip;
    if (equipId) toggleEquip(equipId);
    return;
  }

});


// ── ESCALADO UNIFORME 1920×1080 ──────────────────────────
// Calcula el factor que hace caber el diseño en el viewport
// sin deformar. CSS aplica transform: scale(var(--scale)).
function fitToViewport() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  document.documentElement.style.setProperty("--scale", scale);
}
window.addEventListener("resize", fitToViewport);
fitToViewport();


// ── INICIALIZACIÓN ────────────────────────────────────────
// Llamada inicial que pinta toda la UI con el modelo 1.
render();
