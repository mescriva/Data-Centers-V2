// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js
// ═══════════════════════════════════════════════════════════

const DEFAULT_MODEL_ID = MODELS.find(m => m.isPublic)?.id ?? MODELS[0].id;

const state = {
  modeloId:    DEFAULT_MODEL_ID,
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
  graphContainer: $("graphHtmlContainer"),
/*   graphImg:   $("graphImg"), */
  modelNav:   $("modelNav"),
  renderWrap: $("renderWrap"),
  sectionC:   $("sectionC"),
};


// ── RUTAS DE ASSETS ───────────────────────────────────────
function getActiveKeys(model) {
  const active = model.equipos
    .filter(eq => state.activeEquip[eq.id])
    .map(eq => eq.renderKey);
  return active.length ? active.join("-") : "none";
}

function renderPathFor(model, keys) {
  const allKeys = model.equipos.map(eq => eq.renderKey).join("-");
  if (keys === allKeys) return `./assets/renders/${model.videoId}.mp4`;
  return `./assets/renders/${model.videoId}_${keys}.mp4`;
}

function graphPathFor(model, keys) {
  const allKeys = model.equipos.map(eq => eq.renderKey).join("-");
  if (keys === allKeys) return `./assets/graphs/${model.graphId}.png`;
  return `./assets/graphs/${model.graphId}_${keys}.png`;
}


// ── PRELOAD DE VÍDEOS ─────────────────────────────────────
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
    objectFit:      "cover",
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

function preloadBaseAssets() {
  MODELS.forEach(model => {
    getOrCreateVideo(`./assets/renders/${model.videoId}.mp4`);
  });
}

function preloadBaseGraphs() {
  MODELS.forEach(model => {
    if (!model.graphHtml) getOrCreateImage(`./assets/graphs/${model.graphId}.png`);
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


// ── DETECCIÓN DE ASSET ────────────────────────────────────
async function assetExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolvedRenderPath(model) {
  const keys = getActiveKeys(model);
  const path  = renderPathFor(model, keys);
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
  Object.entries(videoCache).forEach(([s, v]) => {
    v.style.opacity = s === src ? "1" : "0";
  });
  if (next.paused) {
    next.play().catch(() => {
      document.addEventListener("click", () => next.play().catch(() => {}), { once: true });
    });
  }
}


// ── GRAPH ZOOM STATE ──────────────────────────────────────
let graphZoom = { scale: 1, translateX: 0, isDragging: false, startX: 0, startTranslateX: 0 };

function resetGraphZoom(container) {
  graphZoom.scale = 1;
  graphZoom.translateX = 0;
  applyGraphTransform(container);
  const btn = container.querySelector(".graph-zoom-reset");
  if (btn) btn.style.display = "none";
}

function applyGraphTransform(container) {
  const inner = container.querySelector(".graph-zoom-inner");
  if (!inner) return;
  inner.style.transform = `translateX(${graphZoom.translateX}px) scaleX(${graphZoom.scale})`;
  inner.style.transformOrigin = "left center";
}

function clampTranslateX(container) {
  if (graphZoom.scale <= 1) { graphZoom.translateX = 0; return; }
  const containerW = container.offsetWidth;
  const scaledW = containerW * graphZoom.scale;
  const maxTranslate = 0;
  const minTranslate = containerW - scaledW;
  graphZoom.translateX = Math.min(maxTranslate, Math.max(minTranslate, graphZoom.translateX));
}

function setupGraphZoom(container) {
  // Reset state
  graphZoom = { scale: 1, translateX: 0, isDragging: false, startX: 0, startTranslateX: 0 };

  // Wrap content in zoom-inner
  const inner = container.querySelector(".graph-zoom-inner");
  if (!inner) return;

  // Double-click to zoom
  container.addEventListener("dblclick", (e) => {
    if (graphZoom.scale >= 3) {
      resetGraphZoom(container);
      return;
    }
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // Zoom 2x centred on click point
    const newScale = Math.min(graphZoom.scale * 2, 4);
    // Keep the clicked point stationary
    const scaleRatio = newScale / graphZoom.scale;
    graphZoom.translateX = clickX - scaleRatio * (clickX - graphZoom.translateX);
    graphZoom.scale = newScale;
    clampTranslateX(container);
    applyGraphTransform(container);
    const btn = container.querySelector(".graph-zoom-reset");
    if (btn) btn.style.display = "flex";
  });

  // Drag / pan (only when zoomed)
  container.addEventListener("mousedown", (e) => {
    if (graphZoom.scale <= 1) return;
    graphZoom.isDragging = true;
    graphZoom.startX = e.clientX;
    graphZoom.startTranslateX = graphZoom.translateX;
    container.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!graphZoom.isDragging) return;
    const dx = e.clientX - graphZoom.startX;
    graphZoom.translateX = graphZoom.startTranslateX + dx;
    clampTranslateX(container);
    applyGraphTransform(container);
  });

  document.addEventListener("mouseup", () => {
    if (!graphZoom.isDragging) return;
    graphZoom.isDragging = false;
    container.style.cursor = graphZoom.scale > 1 ? "grab" : "default";
  });

  // Touch pan
  let touchStartX = 0, touchStartTX = 0;
  container.addEventListener("touchstart", (e) => {
    if (graphZoom.scale <= 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartTX = graphZoom.translateX;
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    if (graphZoom.scale <= 1) return;
    const dx = e.touches[0].clientX - touchStartX;
    graphZoom.translateX = touchStartTX + dx;
    clampTranslateX(container);
    applyGraphTransform(container);
  }, { passive: true });
}


// ── MOSTRAR GRÁFICA ───────────────────────────────────────
function showGraph(model) {
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";

  const legendItems = (model.legend || []).map(item =>
    `<span class="graph-legend-item">
       <span class="graph-legend-dot" style="background:${item.color}"></span>
       ${item.label}
     </span>`
  ).join("");
  dom.graphUnit.innerHTML = legendItems;

  const container = document.getElementById("graphHtmlContainer");
  container.innerHTML = "";

  // Reset zoom state
  graphZoom = { scale: 1, translateX: 0, isDragging: false, startX: 0, startTranslateX: 0 };

  if (model.graphHtml) {
    // Render interactive HTML graph via iframe inside zoom wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "graph-iframe-wrapper graph-zoom-container";
    wrapper.style.position = "relative";
    wrapper.style.overflow = "hidden";

    // zoom-inner wraps the iframe for transform
    const inner = document.createElement("div");
    inner.className = "graph-zoom-inner";
    inner.style.cssText = "width:100%;height:100%;will-change:transform;";

    const iframe = document.createElement("iframe");
    iframe.src = model.graphHtml;
    iframe.frameBorder = "0";
    iframe.className = "graph-iframe";
    iframe.setAttribute("scrolling", "no");

    inner.appendChild(iframe);
    wrapper.appendChild(inner);

    // Reset / X button
    const resetBtn = document.createElement("button");
    resetBtn.className = "graph-zoom-reset";
    resetBtn.title = "Restablecer zoom";
    resetBtn.innerHTML = "✕";
    resetBtn.style.display = "none";
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetGraphZoom(wrapper);
    });
    wrapper.appendChild(resetBtn);

    container.appendChild(wrapper);
    setupGraphZoom(wrapper);

  } else {
    // Fallback: static PNG image with zoom
    const wrapper = document.createElement("div");
    wrapper.className = "graph-zoom-container";
    wrapper.style.cssText = "position:relative;overflow:hidden;width:100%;flex:1;min-height:0;border-radius:var(--radius-sm);";

    const inner = document.createElement("div");
    inner.className = "graph-zoom-inner";
    inner.style.cssText = "width:100%;height:100%;will-change:transform;";

    const graphSrc = `assets/graphs/0_Loss of synchronous machine discharging.html`;
    const cached = getOrCreateImage(graphSrc);
    cached.className = "graph-img";
    cached.alt = "Gráfica del modelo activo";
    cached.style.cursor = "zoom-in";

    inner.appendChild(cached);
    wrapper.appendChild(inner);

    const resetBtn = document.createElement("button");
    resetBtn.className = "graph-zoom-reset";
    resetBtn.title = "Restablecer zoom";
    resetBtn.innerHTML = "✕";
    resetBtn.style.display = "none";
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetGraphZoom(wrapper);
    });
    wrapper.appendChild(resetBtn);

    container.appendChild(wrapper);
    setupGraphZoom(wrapper);
  }
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
      state.activeEquip[eq.id] = true;
    }
  });
}


// ── ACTUALIZAR RENDER + GRÁFICA ───────────────────────────
async function updateAssets() {
  const model = getModel();
  const renderSrc = `./assets/renders/${model.videoId}.mp4`;
  showVideo(renderSrc);
  showGraph(model);
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
  // Notify login.js about model change (for session bar visibility)
  if (typeof window.onModelChanged === "function") window.onModelChanged();
}


// ── ACCIONES ──────────────────────────────────────────────
function setModel(modelId) {
  state.modeloId = modelId;
  render();
}

function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];
  const card = dom.aBody.querySelector(`[data-equip="${equipId}"]`);
  if (card) card.classList.toggle("card--active", isOn(equipId));
  updateAssets();
}


// ── EVENTOS ──────────────────────────────────────────────
document.addEventListener("click", ev => {
  const target = ev.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "setModel") {
    const modelId = target.dataset.model;
    if (!modelId) return;

    const model = MODELS.find(m => m.id === modelId);
    if (!model) return;

    // Public model: switch directly, no login ever
    if (model.isPublic) {
      setModel(modelId);
      return;
    }

    // Protected model: always require login
    if (typeof requireLoginForModel === "function") {
      requireLoginForModel(modelId);
    } else {
      setModel(modelId);
    }
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

(function startInitialVideo() {
  const model = getModel();
  const src = `./assets/renders/${model.videoId}.mp4`;
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
