// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js
// ═══════════════════════════════════════════════════════════

const state = {
  modeloId:    MODELS[0].id,
  activeEquip: {}   // equipId → true/false
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


// ── RUTAS DE ASSETS ───────────────────────────────────────
// Devuelve la ruta de render o gráfica para la combinación
// de equipos activos del modelo. Si el archivo no existe
// (comprobado con un Image/fetch previo) cae al asset base.

function getActiveKeys(model) {
  const active = model.equipos
    .filter(eq => state.activeEquip[eq.id])
    .map(eq => eq.renderKey);
  return active.length ? active.join("-") : "none";
}

function renderPathFor(model, keys) {
  const allKeys = model.equipos.map(eq => eq.renderKey).join("-");
  // Estado por defecto (todos activos) → asset base del modelo
  if (keys === allKeys) return `./assets/renders/${model.id}.mp4`;
  return `./assets/renders/${model.id}_${keys}.mp4`;
}

function graphPathFor(model, keys) {
  const allKeys = model.equipos.map(eq => eq.renderKey).join("-");
  if (keys === allKeys) return `./assets/graphs/${model.id}.png`;
  return `./assets/graphs/${model.id}_${keys}.png`;
}


// ── PRELOAD DE VÍDEOS ─────────────────────────────────────
// videoCache[src] = elemento <video> listo, adjunto al DOM pero invisible
const videoCache = {};

function getOrCreateVideo(src) {
  if (videoCache[src]) return videoCache[src];

  const video = document.createElement("video");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");
  Object.assign(video.style, {
    position:       "absolute",
    inset:          "0",
    width:          "100%",
    height:         "100%",
    objectFit:      "contain",
    objectPosition: "center",
    opacity:        "0",
    transition:     "opacity 0.25s ease",
    pointerEvents:  "none"
  });
  video.src = src;
  video.load();
  dom.renderWrap.appendChild(video);
  videoCache[src] = video;
  return video;
}

// Precarga todos los assets base al arrancar
function preloadBaseAssets() {
  MODELS.forEach(model => {
    getOrCreateVideo(`./assets/renders/${model.id}.mp4`);
  });
}


// ── PRELOAD DE IMÁGENES ───────────────────────────────────
const imageCache = {};

function getOrCreateImage(src) {
  if (imageCache[src]) return imageCache[src];
  const img = new Image();
  img.src = src;
  imageCache[src] = img;
  return img;
}

function preloadBaseGraphs() {
  MODELS.forEach(model => {
    getOrCreateImage(`./assets/graphs/${model.id}.png`);
  });
}


// ── DETECCIÓN DE ASSET ────────────────────────────────────
// Comprueba si un mp4/png existe. Devuelve Promise<boolean>.
// Usa un fetch HEAD sin cuerpo para no descargar el archivo.
async function assetExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// Devuelve la ruta definitiva (combinación o fallback al base)
async function resolvedRenderPath(model) {
  const keys = getActiveKeys(model);
  const path  = renderPathFor(model, keys);
  // Si ya es el asset base no hace falta comprobar
  if (path === `./assets/renders/${model.id}.mp4`) return path;
  const exists = await assetExists(path);
  return exists ? path : `./assets/renders/${model.id}.mp4`;
}

async function resolvedGraphPath(model) {
  const keys = getActiveKeys(model);
  const path  = graphPathFor(model, keys);
  if (path === `./assets/graphs/${model.id}.png`) return path;
  const exists = await assetExists(path);
  return exists ? path : `./assets/graphs/${model.id}.png`;
}


// ── MOSTRAR VÍDEO ─────────────────────────────────────────
let currentVideoSrc = null;

function showVideo(src) {
  if (src === currentVideoSrc) return;
  currentVideoSrc = src;

  const next = getOrCreateVideo(src);

  // Oculta todos los demás
  Object.entries(videoCache).forEach(([s, v]) => {
    v.style.opacity = s === src ? "1" : "0";
  });

  if (next.paused) {
    next.play().catch(() => {
      document.addEventListener("click", () => next.play().catch(() => {}), { once: true });
    });
  }
}


// ── MOSTRAR GRÁFICA ───────────────────────────────────────
function showGraph(model, graphSrc) {
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";

  const legendItems = (model.legend || []).map(item =>
    `<span class="graph-legend-item">
       <span class="graph-legend-dot" style="background:${item.color}"></span>
       ${item.label}
     </span>`
  ).join("");
  dom.graphUnit.innerHTML = legendItems;

  const cached = getOrCreateImage(graphSrc);
  cached.className = "graph-img";
  cached.alt = "Gráfica del modelo activo";
  dom.graphImg.replaceWith(cached);
  dom.graphImg = cached;
}


// ── HELPERS ───────────────────────────────────────────────
function getModel() {
  return MODELS.find(m => m.id === state.modeloId);
}

function isOn(equipId) {
  return Boolean(state.activeEquip[equipId]);
}

function initEquipState(model) {
  model.equipos.forEach(eq => {
    if (state.activeEquip[eq.id] === undefined) {
      state.activeEquip[eq.id] = true; // todos activos por defecto
    }
  });
}


// ── ACTUALIZAR RENDER + GRÁFICA ───────────────────────────
async function updateAssets() {
  const model = getModel();
  const [renderSrc, graphSrc] = await Promise.all([
    resolvedRenderPath(model),
    resolvedGraphPath(model)
  ]);
  showVideo(renderSrc);
  showGraph(model, graphSrc);
}


// ── SECCIÓN D — Navegación de modelos ────────────────────
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


// ── SECCIÓN A — Cabecera + lista de equipos ───────────────
function renderSectionA(model) {
  dom.aBadge.textContent = model.shortName;
  dom.aText.textContent  = model.description;
  dom.aText2.textContent = model.description2;

  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const on = isOn(eq.id);
    return `
      <article class="card ${on ? "card--active" : ""}"
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
  renderSectionA(model);
  updateAssets();
}


// ── ACCIONES ──────────────────────────────────────────────
function setModel(modelId) {
  state.modeloId = modelId;
  render();
}

function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];

  // Actualiza clase de la card sin re-renderizar toda la lista
  const card = dom.aBody.querySelector(`[data-equip="${equipId}"]`);
  if (card) card.classList.toggle("card--active", isOn(equipId));

  // Carga los nuevos assets para la combinación actual
  updateAssets();
}


// ── EVENTOS ───────────────────────────────────────────────
document.addEventListener("click", ev => {
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
preloadBaseAssets();
preloadBaseGraphs();
render();

// Arranca el vídeo inicial
(function startInitialVideo() {
  const model = getModel();
  const src   = `./assets/renders/${model.id}.mp4`;
  const video = getOrCreateVideo(src);
  if (!video.src) return;

  function playIt() {
    video.play().catch(() => {
      document.addEventListener("click", () => video.play().catch(() => {}), { once: true });
    });
  }

  if (video.readyState >= 2) {
    playIt();
  } else {
    video.addEventListener("canplay", playIt, { once: true });
  }
})();