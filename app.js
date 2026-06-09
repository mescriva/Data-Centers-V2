// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — app.js
// ═══════════════════════════════════════════════════════════

// ── ESTADO ───────────────────────────────────────────────
const DEFAULT_MODEL_ID = MODELS.find(m => m.isPublic)?.id ?? MODELS[0].id;

const state = {
  modeloId:      DEFAULT_MODEL_ID,
  activeEquipId: null   // id del equipo (card) actualmente seleccionado
};

const $ = id => document.getElementById(id);

// Refs DOM — todos apuntan a elementos que existen en index.html
const dom = {
  aBadge:      $("aBadge"),
  aText:       $("aText"),
  aText2:      $("aText2"),
  aBody:       $("aBody"),
  graphLabel:  $("graphLabel"),
  graphLegend: $("graphLegend"),
  graphWrap:   $("graphWrap"),       // contenedor de la gráfica (zoom + iframe)
  graphFrame:  $("graphFrame"),      // el <iframe> fijo en el HTML
  graphReset:  $("graphReset"),      // botón ✕ reset zoom
  modelNav:    $("modelNav"),
  renderWrap:  $("renderWrap"),
};


// ── HELPERS ───────────────────────────────────────────────
function getModel() {
  return MODELS.find(m => m.id === state.modeloId);
}

function getActiveEquipo() {
  const model = getModel();
  if (!model) return null;
  return (
    model.equipos.find(eq => eq.id === state.activeEquipId) ??
    model.equipos[0] ??
    null
  );
}


// ── VÍDEOS ────────────────────────────────────────────────
const videoCache = {};

function getOrCreateVideo(src) {
  if (videoCache[src]) return videoCache[src];
  const v = document.createElement("video");
  v.setAttribute("autoplay", "");
  v.setAttribute("loop", "");
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("preload", "auto");
  Object.assign(v.style, {
    position: "absolute", inset: "0",
    width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center",
    opacity: "0", transition: "opacity 0.25s ease",
    pointerEvents: "none"
  });
  v.src = src;
  v.load();
  dom.renderWrap.appendChild(v);
  videoCache[src] = v;
  return v;
}

function preloadBaseAssets() {
  MODELS.forEach(model => {
    // vídeo de modelo
    getOrCreateVideo(`./assets/renders/${model.videoId}.mp4`);
    // vídeos de cada equipo (si difieren del modelo)
    model.equipos.forEach(eq => {
      if (eq.videoId && eq.videoId !== model.videoId) {
        getOrCreateVideo(`./assets/renders/${eq.videoId}.mp4`);
      }
    });
  });
}

let currentVideoSrc = null;

function showVideo(src) {
  if (src === currentVideoSrc) return;
  currentVideoSrc = src;
  getOrCreateVideo(src); // asegura que existe
  Object.entries(videoCache).forEach(([s, v]) => {
    v.style.opacity = s === src ? "1" : "0";
  });
  const next = videoCache[src];
  if (next && next.paused) {
    next.play().catch(() => {
      document.addEventListener("click", () => next.play().catch(() => {}), { once: true });
    });
  }
}


// ── GRÁFICA — iframe fijo + zoom por CSS ─────────────────
// El <iframe id="graphFrame"> existe en el HTML y nunca se destruye.
// Cambiamos su .src y aplicamos transform de escala sobre #graphWrap
// para el zoom de doble clic.

let zoomScale = 1;
let zoomOriginX = 0;
let zoomOriginY = 0;
const ZOOM_FACTOR = 2;
const ZOOM_MAX    = 4;

function applyZoom() {
  if (!dom.graphFrame) return;
  if (zoomScale <= 1) {
    dom.graphFrame.style.transform       = "none";
    dom.graphFrame.style.transformOrigin = "top left";
    dom.graphFrame.style.width           = "100%";
    dom.graphFrame.style.height          = "100%";
    if (dom.graphWrap) dom.graphWrap.style.overflow = "hidden";
    if (dom.graphReset) dom.graphReset.style.display = "none";
  } else {
    const pct = zoomScale * 100;
    dom.graphFrame.style.transform       = "none";
    dom.graphFrame.style.width           = pct + "%";
    dom.graphFrame.style.height          = pct + "%";
    if (dom.graphWrap) dom.graphWrap.style.overflow = "auto";
    if (dom.graphReset) dom.graphReset.style.display = "flex";
  }
}

function resetZoom() {
  zoomScale = 1;
  applyZoom();
}

function showGraph(equipo) {
  if (!equipo) return;

  // Etiqueta
  if (dom.graphLabel) dom.graphLabel.textContent = equipo.graphLabel || "";

  // Leyenda
  if (dom.graphLegend) {
    dom.graphLegend.innerHTML = (equipo.legend || []).map(item =>
      `<span class="graph-legend-item">
         <span class="graph-legend-dot" style="background:${item.color}"></span>
         ${item.label}
       </span>`
    ).join("");
  }

  // Cambiar src del iframe si es necesario
  if (dom.graphFrame) {
    const newSrc = equipo.graphHtml || "";
    // comparamos sólo la parte final para evitar problemas con URLs absolutas
    if (!dom.graphFrame.src.endsWith(newSrc.replace("./", ""))) {
      dom.graphFrame.src = newSrc;
    }
  }

  // Resetear zoom al cambiar de equipo
  resetZoom();
}

// Eventos de zoom — se registran una sola vez
(function initZoomEvents() {
  // Necesitamos el DOM listo; como este script carga al final del body, ya está disponible.
  const wrap  = dom.graphWrap;
  const reset = dom.graphReset;
  if (!wrap) return;

  // Doble clic: zoom in / reset al llegar al máximo
  wrap.addEventListener("dblclick", (e) => {
    if (zoomScale >= ZOOM_MAX) {
      resetZoom();
      return;
    }
    zoomScale = Math.min(zoomScale * ZOOM_FACTOR, ZOOM_MAX);

    // Guardar punto de clic para scroll centrado
    const rect = wrap.getBoundingClientRect();
    zoomOriginX = e.clientX - rect.left;
    zoomOriginY = e.clientY - rect.top;

    applyZoom();

    // Centrar el scroll en el punto de doble clic
    requestAnimationFrame(() => {
      wrap.scrollLeft = zoomOriginX * zoomScale - wrap.clientWidth  / 2;
      wrap.scrollTop  = zoomOriginY * zoomScale - wrap.clientHeight / 2;
    });
  });

  // Botón reset
  if (reset) {
    reset.addEventListener("click", (e) => {
      e.stopPropagation();
      resetZoom();
    });
  }
})();


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


// ── SECCIÓN A — Panel lateral ─────────────────────────────
function renderSectionA(model) {
  dom.aBadge.textContent = model.shortName;
  dom.aText.textContent  = model.description;
  dom.aText2.textContent = model.description2;

  const activeId = state.activeEquipId ?? model.equipos[0]?.id;

  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const active = eq.id === activeId ? "card--active" : "";
    return `
      <article class="card ${active}"
               data-equip="${eq.id}"
               data-action="selectEquip"
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

  // Si el equipo activo no pertenece al modelo actual, resetear al primero
  if (!model.equipos.find(eq => eq.id === state.activeEquipId)) {
    state.activeEquipId = model.equipos[0]?.id ?? null;
  }

  renderSectionD();
  renderSectionA(model);
  updateAssets();

  if (typeof window.onModelChanged === "function") window.onModelChanged();
}


// ── ACTUALIZAR RENDER + GRÁFICA ───────────────────────────
function updateAssets() {
  const model  = getModel();
  const equipo = getActiveEquipo();

  // Vídeo del equipo seleccionado (fallback al vídeo del modelo)
  const videoId  = equipo?.videoId ?? model.videoId;
  showVideo(`./assets/renders/${videoId}.mp4`);

  // Gráfica del equipo seleccionado
  showGraph(equipo);
}


// ── ACCIONES ──────────────────────────────────────────────
function setModel(modelId) {
  state.modeloId    = modelId;
  state.activeEquipId = null;  // vuelve al primer equipo del modelo
  render();
}

function selectEquip(equipId) {
  state.activeEquipId = equipId;

  // Actualizar highlight de cards sin re-renderizar todo
  dom.aBody.querySelectorAll(".card").forEach(card => {
    card.classList.toggle("card--active", card.dataset.equip === equipId);
  });

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

    if (model.isPublic) {
      setModel(modelId);
      return;
    }

    // Modelo protegido → siempre pide PIN
    if (typeof requireLoginForModel === "function") {
      requireLoginForModel(modelId);
    } else {
      setModel(modelId);
    }
    return;
  }

  if (target.dataset.action === "selectEquip") {
    const card    = target.closest("[data-equip]") ?? target;
    const equipId = target.dataset.equip || card.dataset.equip;
    if (equipId) selectEquip(equipId);
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
render();

(function startInitialVideo() {
  const equipo = getActiveEquipo();
  const model  = getModel();
  const src    = `./assets/renders/${equipo?.videoId ?? model.videoId}.mp4`;
  const video  = getOrCreateVideo(src);

  function playIt() {
    video.play().catch(() => {
      document.addEventListener("click", () => video.play().catch(() => {}), { once: true });
    });
  }
  if (video.readyState >= 2) playIt();
  else video.addEventListener("canplay", playIt, { once: true });
})();
