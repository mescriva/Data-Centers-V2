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
  modeloId:      MODELS[0].id,  // modelo seleccionado por defecto
  activeEquip:   {},            // { [equipId]: boolean }  switch ON/OFF
  detailEquipId: null           // si ≠ null → sección A muestra detalle
};


// ── REFERENCIAS DOM (caché para no buscar en cada render) ──
const $ = id => document.getElementById(id);

const dom = {
  aTitle:     $("aTitle"),
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


// ── RENDER: SECCIÓN B (render + puntos de foco) ───────────
function renderSectionB(model) {
  const currentSrc = dom.renderImg.src;
  const newSrc     = model.render;

  // Si el render cambia, hacemos fade suave
  if (currentSrc && !currentSrc.endsWith(newSrc)) {
    dom.renderImg.classList.add("fading");
    setTimeout(() => {
      dom.renderImg.src = newSrc;
      dom.renderImg.classList.remove("fading");
    }, 250);
  } else {
    dom.renderImg.src = newSrc;
  }

  // Etiqueta del modelo sobre el render
  dom.renderTag.textContent = model.shortName.toUpperCase();

  // Puntos de foco (overlay sobre el render)
  // Los puntos grises son inactivos, azules son activos
  dom.focusLayer.innerHTML = model.equipos.map(eq => {
    const activeClass = isOn(eq.id) ? "active" : "";
    const x = eq.focus?.x ?? 50;
    const y = eq.focus?.y ?? 50;
    return `<span class="focus-dot ${activeClass}"
                  style="left:${x}%; top:${y}%"
                  title="${eq.title}">
            </span>`;
  }).join("");
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
    ctx.font = "10px 'DM Sans', sans-serif";
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
  // Cabecera
  dom.aBadge.textContent  = model.shortName.toUpperCase();
  dom.aTitle.textContent  = model.name;
  dom.aText.textContent   = model.description;

  // Cards de equipos
  dom.aBody.innerHTML = model.equipos.map((eq, i) => {
    const onClass = isOn(eq.id) ? "on" : "";
    const cardActive = isOn(eq.id) ? "card--active" : "";

    return `
      <article class="card ${cardActive} anim-fade"
               data-equip="${eq.id}"
               style="animation-delay: ${i * 0.06}s">

        <!-- Información del equipo -->
        <div class="card-info">
          <div class="card-title">${eq.title}</div>
          <div class="card-desc">${eq.short}</div>
        </div>

        <!-- Switch ON/OFF -->
        <button class="switch ${onClass}"
                data-action="toggle"
                aria-label="${isOn(eq.id) ? "Desactivar" : "Activar"} ${eq.title}"
                aria-pressed="${isOn(eq.id)}">
        </button>

        <!-- Botón de detalle -->
        <button class="btn-detail"
                data-action="detail"
                aria-label="Ver detalle de ${eq.title}">
          <!-- Icono flecha derecha -->
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </button>

      </article>
    `;
  }).join("");
}


// ── RENDER: SECCIÓN A — DETALLE DE EQUIPO ────────────────
function renderSectionADetail(model, equipId) {
  const eq = model.equipos.find(e => e.id === equipId);
  if (!eq) return;

  // Actualizar cabecera con datos del equipo
  dom.aBadge.textContent = model.shortName.toUpperCase();
  dom.aTitle.textContent = eq.title;
  dom.aText.textContent  = "";  // se mostrará en el body

  // Contenido del detalle
  dom.aBody.innerHTML = `
    <div class="detail-wrap anim-fade">

      <!-- Botón volver -->
      <button class="btn-back" data-action="back">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 7H3M7 3L3 7l4 4"/>
        </svg>
        Volver a equipos
      </button>

      <!-- Imagen esquema del equipo -->
      ${eq.schemeImg
        ? `<img class="detail-scheme"
                src="${eq.schemeImg}"
                alt="Esquema de ${eq.title}"
                onerror="this.outerHTML=renderSchemePlaceholder('${eq.title}')" />`
        : renderSchemePlaceholder(eq.title)
      }

      <!-- Descripción larga -->
      <p class="detail-long">${eq.long}</p>

      <!-- Toggle de activación (al fondo del panel) -->
      <div class="detail-toggle-row">
        <span class="detail-toggle-label">Activar en el data center</span>
        <button class="switch ${isOn(eq.id) ? "on" : ""}"
                data-action="toggle"
                data-equip="${eq.id}"
                aria-label="${isOn(eq.id) ? "Desactivar" : "Activar"} ${eq.title}"
                aria-pressed="${isOn(eq.id)}">
        </button>
      </div>

    </div>
  `;
}


// Helper: HTML del placeholder de imagen de esquema
function renderSchemePlaceholder(title) {
  return `
    <div class="detail-scheme-placeholder">
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="6" width="28" height="20" rx="3"/>
        <circle cx="10" cy="16" r="3"/>
        <path d="M17 13h8M17 16h6M17 19h8"/>
      </svg>
      <span>Esquema: ${title}</span>
    </div>
  `;
}


// ── RENDER GLOBAL ─────────────────────────────────────────
// Un único punto de entrada que actualiza toda la UI.
// Para MVP es suficiente — re-render completo es muy rápido
// con el DOM que tenemos.
function render() {
  const model = getModel();
  initEquipState(model);

  renderSectionD();
  renderSectionB(model);
  renderSectionC(model);

  if (state.detailEquipId) {
    renderSectionADetail(model, state.detailEquipId);
  } else {
    renderSectionAList(model);
  }
}


// ── ACCIONES ──────────────────────────────────────────────

/** Cambia el modelo activo y resetea la vista de detalle */
function setModel(modelId) {
  state.modeloId    = modelId;
  state.detailEquipId = null;
  render();
}

/** Alterna el estado ON/OFF de un equipo */
function toggleEquip(equipId) {
  state.activeEquip[equipId] = !state.activeEquip[equipId];
  render();
}

/**
 * Abre la vista detalle de un equipo.
 * Activa automáticamente el switch para que el render
 * muestre el punto de foco azul.
 */
function openDetail(equipId) {
  state.activeEquip[equipId] = true;  // activar al entrar en detalle
  state.detailEquipId        = equipId;
  render();
}

/** Cierra el detalle y vuelve al listado */
function closeDetail() {
  state.detailEquipId = null;
  render();
}


// ── DELEGACIÓN DE EVENTOS ─────────────────────────────────
// Un único listener en el documento para toda la interacción.
// Busca el botón más cercano y su data-action.
document.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-action]");
  if (!btn) return;

  const action  = btn.dataset.action;

  // ① Cambiar modelo (Sección D)
  if (action === "setModel") {
    const modelId = btn.dataset.model;
    if (modelId) setModel(modelId);
    return;
  }

  // ② Activar/desactivar equipo (switch)
  if (action === "toggle") {
    // El equipId puede estar en el propio botón o en la card padre
    const card    = btn.closest("[data-equip]");
    const equipId = btn.dataset.equip || card?.dataset.equip;
    if (equipId) toggleEquip(equipId);
    return;
  }

  // ③ Abrir detalle (flecha →)
  if (action === "detail") {
    const card    = btn.closest("[data-equip]");
    const equipId = card?.dataset.equip;
    if (equipId) openDetail(equipId);
    return;
  }

  // ④ Volver al listado (← volver)
  if (action === "back") {
    closeDetail();
    return;
  }
});


// ── INICIALIZACIÓN ────────────────────────────────────────
// Llamada inicial que pinta toda la UI con el modelo 1.
render();
