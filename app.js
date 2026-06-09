// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js
// ═══════════════════════════════════════════════════════════

// Default model is the public one (800 V Power Supply = m6)
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
  graphImg:   $("graphImg"),
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


// ── MOSTRAR GRÁFICA (iframe HTML o imagen PNG) ────────────
let graphExpandModal = null;

function ensureGraphModal() {
  if (graphExpandModal) return;

  graphExpandModal = document.createElement("div");
  graphExpandModal.id = "graphModal";
  graphExpandModal.innerHTML = `
    <div class="graph-modal-backdrop"></div>
    <div class="graph-modal-inner">
      <button class="graph-modal-close" title="Cerrar">✕</button>
      <iframe class="graph-modal-frame" src="" frameborder="0" allowfullscreen></iframe>
    </div>`;
  document.body.appendChild(graphExpandModal);

  graphExpandModal.querySelector(".graph-modal-backdrop").addEventListener("click", closeGraphModal);
  graphExpandModal.querySelector(".graph-modal-close").addEventListener("click", closeGraphModal);
}

function openGraphModal(src) {
  ensureGraphModal();
  graphExpandModal.querySelector(".graph-modal-frame").src = src;
  graphExpandModal.classList.add("open");
}

function closeGraphModal() {
  if (!graphExpandModal) return;
  graphExpandModal.classList.remove("open");
  // small delay before clearing src to avoid flash on re-open
  setTimeout(() => {
    graphExpandModal.querySelector(".graph-modal-frame").src = "";
  }, 300);
}

function showGraph(model) {
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";

  const legendItems = (model.legend || []).map(item =>
    `<span class="graph-legend-item">
       <span class="graph-legend-dot" style="background:${item.color}"></span>
       ${item.label}
     </span>`
  ).join("");
  dom.graphUnit.innerHTML = legendItems;

  // Clear previous graph content
  const container = document.getElementById("graphContent");
  container.innerHTML = "";

  if (model.graphHtml) {
    // Render interactive HTML graph via iframe
    const wrapper = document.createElement("div");
    wrapper.className = "graph-iframe-wrapper";

    const iframe = document.createElement("iframe");
    iframe.src = model.graphHtml;
    iframe.frameBorder = "0";
    iframe.className = "graph-iframe";
    iframe.setAttribute("scrolling", "no");

    const expandBtn = document.createElement("button");
    expandBtn.className = "graph-expand-btn";
    expandBtn.title = "Ampliar gráfica";
    expandBtn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h5M3 3v5M3 3l6 6M17 17h-5M17 17v-5M17 17l-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
    expandBtn.addEventListener("click", () => openGraphModal(model.graphHtml));

    wrapper.appendChild(iframe);
    wrapper.appendChild(expandBtn);
    container.appendChild(wrapper);
  } else {
    // Fallback: static PNG image
    const graphSrc = `./assets/graphs/${model.graphId}.png`;
    const cached = getOrCreateImage(graphSrc);
    cached.className = "graph-img graph-img--clickable";
    cached.alt = "Gráfica del modelo activo";
    cached.onclick = () => openGraphModal(graphSrc);
    container.appendChild(cached);
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


// ── EVENTOS ───────────────────────────────────────────────
document.addEventListener("click", ev => {
  const target = ev.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "setModel") {
    const modelId = target.dataset.model;
    if (!modelId) return;

    const model = MODELS.find(m => m.id === modelId);
    if (!model) return;

    // If the target model is public, switch directly (no login needed)
    if (model.isPublic) {
      setModel(modelId);
      return;
    }

    // Otherwise, require login via the login system
    if (typeof requireLoginForModel === "function") {
      requireLoginForModel(modelId);
    } else {
      // Fallback: just switch (login.js not loaded yet)
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
