// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js 
// ═══════════════════════════════════════════════════════════

const state = {
  modeloId:    MODELS[0].id,
  activeEquip: {}
};

const $ = id => document.getElementById(id);

const dom = {
  aText:      $("aText"),
  aText2:     $("aText2"),
  aBadge:     $("aBadge"),
  aBody:      $("aBody"),
  graphLabel: $("graphLabel"),
  graphUnit:  $("graphUnit"),
  graphImg:   $("graphImg"),
  modelNav:   $("modelNav"),
  renderWrap: $("renderWrap")
};

// ── MAPA DE VÍDEOS PRECARGADOS ────────────────────────────
// videoMap[modelId] = elemento <video> listo para mostrar
const videoMap = {};

function preloadAllVideos() {
  MODELS.forEach(model => {
    const src = model.render || "";
    const video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.style.cssText = [
      "position:absolute",
      "inset:0",
      "width:100%",
      "height:100%",
      "object-fit:contain",
      "object-position:center",
      "opacity:0",
      "transition:opacity 0.25s ease",
      "pointer-events:none"
    ].join(";");

    if (src) {
      video.src = src;
      video.load();
      // Arranca reproducción en cuanto hay datos mínimos
      video.addEventListener("canplay", () => {
        video.play().catch(() => {});
      }, { once: true });
    }

    dom.renderWrap.appendChild(video);
    videoMap[model.id] = video;
  });
}

function showVideo(modelId) {
  // Oculta todos y muestra el del modelo activo — sin await, sin canplay
  Object.entries(videoMap).forEach(([id, video]) => {
    video.style.opacity = id === modelId ? "1" : "0";
  });
  // Asegura que esté reproduciendo (puede haberse pausado)
  const active = videoMap[modelId];
  if (active && active.paused) {
    active.play().catch(() => {});
  }
}

// ── MAPA DE IMÁGENES PRECARGADAS ──────────────────────────
const graphMap = {};

function preloadAllGraphs() {
  MODELS.forEach(model => {
    const img = new Image();
    img.src = `./assets/graphs/${model.id}.png`;
    graphMap[model.id] = img;
  });
}


// ── HELPERS ────────────────────────────────────────────────
function getModel() {
  return MODELS.find(m => m.id === state.modeloId);
}

function isOn(equipId) {
  return Boolean(state.activeEquip[equipId]);
}

function initEquipState(model) {
  model.equipos.forEach(eq => {
    if (state.activeEquip[eq.id] === undefined) {
      state.activeEquip[eq.id] = false;
    }
  });
}


// ── SECCIÓN D ─────────────────────────────────────────────
function renderSectionD() {
  dom.modelNav.innerHTML = MODELS.map(m => {
    const sel = m.id === state.modeloId ? "selected" : "";
    return `<button class="model-btn ${sel}"
                    data-action="setModel"
                    data-model="${m.id}">
              ${m.shortName}
            </button>`;
  }).join("");
}


// ── SECCIÓN B ─────────────────────────────────────────────
function renderSectionB(model) {
  showVideo(model.id);
}


// ── SECCIÓN C ─────────────────────────────────────────────
function renderSectionC(model) {
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";

  const legendItems = (model.legend || []).map(item =>
    `<span class="graph-legend-item">
       <span class="graph-legend-dot" style="background:${item.color}"></span>
       ${item.label}
     </span>`
  ).join("");
  dom.graphUnit.innerHTML = legendItems || (model.graphUnit || `kW · ${model.shortName}`);

  // Swap instantáneo: reemplaza el elemento en el DOM por el precargado
  const cached = graphMap[model.id];
  if (cached) {
    cached.className = "graph-img";
    cached.alt = "Gráfica del modelo activo";
    dom.graphImg.replaceWith(cached);
    dom.graphImg = cached;           // actualiza la referencia
  }
}


// ── SECCIÓN A ─────────────────────────────────────────────
function renderSectionAList(model) {
  dom.aBadge.textContent = model.shortName;
  dom.aText.textContent  = model.description;
  dom.aText2.textContent = model.description2;

  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const on = isOn(eq.id);
    return `
      <article class="card ${on ? "card--active" : ""} anim-fade"
               data-equip="${eq.id}"
               data-action="toggle"
               style="animation-delay:${i * 0.06}s">
        <div class="card-left">
          <div class="card-title">${eq.title}</div>
        </div>
        <div class="card-desc">${eq.short}</div>
      </article>`;
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
function setModel(modelId) {
  state.modeloId = modelId;
  render();
}

function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];
  const on = isOn(equipId);
  const card = dom.aBody.querySelector(`[data-equip="${equipId}"]`);
  if (card) card.classList.toggle("card--active", on);
}


// ── EVENTOS ───────────────────────────────────────────────
document.addEventListener("click", (ev) => {
  const target = ev.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "setModel") {
    const modelId = target.dataset.model;
    if (modelId) setModel(modelId);
    return;
  }

  if (target.dataset.action === "toggle") {
    const card    = target.closest("[data-equip]") ?? target;
    const equipId = target.dataset.equip || card.dataset.equip;
    if (equipId) toggleEquip(equipId);
    return;
  }
});


// ── ESCALADO 1920×1080 ────────────────────────────────────
function fitToViewport() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  document.documentElement.style.setProperty("--scale", scale);
}
window.addEventListener("resize", fitToViewport);
fitToViewport();


// ── INIT ──────────────────────────────────────────────────
// Primero precarga todos los vídeos, luego pinta la UI
preloadAllVideos();
preloadAllGraphs();
render(); 