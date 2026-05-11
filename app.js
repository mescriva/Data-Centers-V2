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
  graphCanvas:$("graphCanvas"),
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
  // Actualizar etiquetas
  dom.graphLabel.textContent = model.graphLabel || "Rendimiento energético";
  dom.graphUnit.textContent  = model.graphUnit  || `kW · ${model.shortName}`;

  // Si hay asset de vídeo real
  if (model.graph) {
    // Soporta ambos casos: <video> y <img> en el contenedor de gráfica.
    const isVideoEl = dom.graphVideo.tagName === "VIDEO";

    if (isVideoEl) {
      const source = dom.graphVideo.querySelector("source");
      if (source) source.src = model.graph;
      else dom.graphVideo.src = model.graph;

      dom.graphVideo.load();
      dom.graphVideo.play().catch(() => {
        // En algunos kioscos el autoplay puede estar bloqueado.
      });

      dom.graphVideo.oncanplay = () => {
        dom.graphVideo.style.display = "block";
        dom.graphCanvas.style.display = "none";
      };
      dom.graphVideo.onerror = () => {
        dom.graphVideo.style.display = "none";
        dom.graphCanvas.style.display = "block";
        drawPlaceholderChart(dom.graphCanvas, model);
      };
    } else {
      dom.graphVideo.src = model.graph;
      dom.graphVideo.style.display = "block";
      dom.graphCanvas.style.display = "none";

      dom.graphVideo.onerror = () => {
        dom.graphVideo.style.display = "none";
        dom.graphCanvas.style.display = "block";
        drawPlaceholderChart(dom.graphCanvas, model);
      };
    }
  } else {
    // Sin vídeo → dibujar gráfica demo con Canvas
    dom.graphVideo.style.display = "none";
    dom.graphCanvas.style.display = "block";
    drawPlaceholderChart(dom.graphCanvas, model);
  }
}


// ── GRÁFICA PLACEHOLDER (Canvas API) ─────────────────────
// Dibuja una curva de área suave como placeholder hasta
// que el cliente proporcione los .mp4 reales.
function drawPlaceholderChart(canvas, model) {
  // Esperar al layout para tener dimensiones reales
  requestAnimationFrame(() => {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext("2d");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const W = rect.width;
    const H = rect.height;

    // Datos de muestra — 12 puntos (meses)
    const baseValues = {
      m1: [32, 35, 45, 52, 48, 60, 72, 68, 55, 63, 70, 65],
      m2: [55, 62, 70, 82, 78, 90, 96, 92, 85, 88, 94, 90],
      m3: [20, 28, 42, 58, 65, 78, 85, 80, 62, 50, 35, 22],
      m4: [15, 18, 22, 25, 28, 30, 32, 31, 28, 24, 20, 16],
      m5: [80, 84, 88, 90, 92, 95, 98, 96, 93, 91, 88, 85],
      m6: [40, 44, 50, 56, 60, 65, 68, 66, 62, 58, 52, 46]
    };
    const vals = baseValues[model.id] || baseValues.m1;
    const maxVal = Math.max(...vals);
    const pad = { top: 20, right: 20, bottom: 28, left: 40 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Grid líneas horizontales
    ctx.strokeStyle = "rgba(13,20,33,0.08)";
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(t => {
      const y = pad.top + chartH * (1 - t);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
    });

    // Puntos de la curva
    const points = vals.map((v, i) => ({
      x: pad.left + (i / (vals.length - 1)) * chartW,
      y: pad.top  + chartH * (1 - v / maxVal)
    }));

    // Área bajo la curva (relleno con gradiente)
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0,   "rgba(27,95,255,0.25)");
    grad.addColorStop(1,   "rgba(27,95,255,0.02)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i-1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i-1].y, cpx, points[i].y, points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length-1].x, pad.top + chartH);
    ctx.lineTo(points[0].x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea de la curva
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i-1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i-1].y, cpx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = "rgba(27,95,255,0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();

    // Eje X: etiquetas de meses
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    ctx.fillStyle = "rgba(13,20,33,0.35)";
    ctx.font = "10px 'Suisse Int\\'l', sans-serif";
    ctx.textAlign = "center";
    points.forEach((p, i) => {
      ctx.fillText(meses[i], p.x, H - 6);
    });

    // Eje Y: valor máximo
    ctx.textAlign = "right";
    ctx.fillText(maxVal + " kW", pad.left - 6, pad.top + 4);
  });
}


// ── RENDER: SECCIÓN A — LISTADO DE EQUIPOS ────────────────
function renderSectionAList(model) {
  // Cabecera: subtítulo (shortName del modelo) + descripción
  dom.aBadge.textContent = model.shortName;
  dom.aText.textContent  = model.description;

  const iconOn  = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2 3-3"/></svg>`;
  const iconOff = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M5 5l4 4M9 5l-4 4"/></svg>`;

  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const on         = isOn(eq.id);
    const cardActive = on ? "card--active" : "";
    const labelClass = on ? "card-label--on" : "card-label--off";
    const labelText  = on ? "Enabled" : "Disabled";
    const labelIcon  = on ? iconOn : iconOff;

    return `
      <article class="card ${cardActive} anim-fade"
               data-equip="${eq.id}"
               data-action="toggle"
               style="animation-delay: ${i * 0.06}s">

        <!-- Fila superior: nombre + label estado -->
        <div class="card-top">
          <div class="card-title">${eq.title}</div>
          <span class="card-label ${labelClass}" aria-label="${labelText}">
            ${labelIcon}${labelText}
          </span>
        </div>

        <!-- Descripción corta -->
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

/** Alterna el estado ON/OFF de un equipo */
function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];
  render();
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


// ── INICIALIZACIÓN ────────────────────────────────────────
// Llamada inicial que pinta toda la UI con el modelo 1.
render();
