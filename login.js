// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — login.js
//
//  PIN: 1234  |  Inactividad: 3 min
//
//  Reglas:
//  · Inicio siempre en m6 (público), sin PIN.
//  · Clic en m1–m5 → muestra overlay de PIN SIEMPRE.
//  · Login OK → cambia al modelo pendiente, muestra "Cerrar sesión".
//  · "Cerrar sesión" / inactividad → vuelve a m6, SIN overlay de PIN.
//  · Botón m6 → vuelve a m6 directamente, SIN overlay de PIN.
//  · "Cerrar sesión" oculto mientras se está en m6.
//
//  API consola:
//    LoginDev.getToken()
//    LoginDev.expireNow()
//    LoginDev.setInactivity(seg)
//    LoginDev.status()
// ═══════════════════════════════════════════════════════════

(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const CORRECT_PIN       = "0000";
  const MAX_INACTIVITY_MS = 3 * 60 * 1000;   // 3 min
  const SESSION_KEY       = "dc_session_token";
  const PUBLIC_MODEL_ID   = MODELS.find(m => m.isPublic)?.id ?? "m6";

  // ── ESTADO ──────────────────────────────────────────────
  let pin             = "";
  let inactivityTimer = null;
  let sessionStart    = null;
  let sessionToken    = null;
  let maxInactivityMs = MAX_INACTIVITY_MS;
  let pendingModelId  = null;

  // ── DOM ─────────────────────────────────────────────────
  const overlay    = document.getElementById("loginOverlay");
  const appRoot    = document.getElementById("appRoot");
  const pinDots    = document.getElementById("pinDots");
  const dots       = pinDots.querySelectorAll(".pin-dot");
  const keyboard   = document.getElementById("pinKeyboard");
  const loginBtn   = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");
  const sessionBar = document.getElementById("sessionBar");
  const logoutBtn  = document.getElementById("sessionLogout");

  // ── TOKEN ────────────────────────────────────────────────
  function generateToken() {
    const a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
  }
  function saveToken(t)     { sessionStorage.setItem(SESSION_KEY, t); }
  function clearToken()     { sessionStorage.removeItem(SESSION_KEY); sessionToken = null; }
  function getStoredToken() { return sessionStorage.getItem(SESSION_KEY); }

  // ── BARRA DE SESIÓN ──────────────────────────────────────
  // Visible sólo cuando hay sesión activa Y el modelo activo NO es público.
  function updateSessionBar() {
    const model     = (typeof getModel === "function") ? getModel() : null;
    const onPublic  = model ? !!model.isPublic : true;
    sessionBar.style.display = (sessionToken && !onPublic) ? "flex" : "none";
  }
  // app.js llama a esto tras cada cambio de modelo
  window.onModelChanged = updateSessionBar;

  // ── INACTIVIDAD ──────────────────────────────────────────
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(onInactivity, maxInactivityMs);
  }

  function onInactivity() {
    console.info("[Login] Inactividad → regresando a m6.");
    goPublic();   // silencioso, sin overlay
  }

  ["mousemove", "mousedown", "keydown", "touchstart", "click"].forEach(ev =>
    document.addEventListener(ev, () => { if (sessionToken) resetInactivityTimer(); }, { passive: true })
  );

  // ── NAVEGACIÓN A MODELO PÚBLICO ──────────────────────────
  // Sin overlay, sin PIN, simplemente cambia el modelo.
  function goPublic() {
    clearToken();
    clearTimeout(inactivityTimer);
    sessionBar.style.display = "none";
    if (typeof setModel === "function") setModel(PUBLIC_MODEL_ID);
  }

  // ── MOSTRAR / OCULTAR OVERLAY ────────────────────────────
  function showOverlay() {
    overlay.style.display = "flex";
    overlay.style.opacity = "";
    overlay.classList.remove("hidden");
    resetPin();
    showError("");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
    overlay.addEventListener("animationend", () => {
      overlay.style.display = "none";
    }, { once: true });
  }

  // ── LOGIN ────────────────────────────────────────────────
  function login() {
    sessionToken = generateToken();
    sessionStart = Date.now();
    saveToken(sessionToken);
    console.info(`[Login] Sesión iniciada. Token: ${sessionToken}`);

    hideOverlay();
    resetInactivityTimer();

    if (pendingModelId) {
      const mid  = pendingModelId;
      pendingModelId = null;
      if (typeof setModel === "function") setModel(mid);
    }

    updateSessionBar();
  }

  // ── LOGOUT ───────────────────────────────────────────────
  // "Cerrar sesión" o inactividad → vuelve a m6 SIN overlay.
  function logout() {
    console.info("[Login] Sesión cerrada.");
    pendingModelId = null;
    goPublic();
  }

  // ── API PÚBLICA (llamada desde app.js) ───────────────────
  // Siempre muestra el overlay, independientemente de si hay sesión.
  window.requireLoginForModel = function (modelId) {
    pendingModelId = modelId;
    showOverlay();
  };

  // ── PIN ──────────────────────────────────────────────────
  function addDigit(d) {
    if (pin.length >= 4) return;
    pin += d;
    syncDots();
    if (pin.length === 4) loginBtn.removeAttribute("disabled");
  }

  function removeDigit() {
    if (!pin.length) return;
    pin = pin.slice(0, -1);
    syncDots();
    if (pin.length < 4) loginBtn.setAttribute("disabled", "");
  }

  function resetPin() {
    pin = "";
    loginBtn.setAttribute("disabled", "");
    syncDots();
  }

  function syncDots() {
    dots.forEach((dot, i) => dot.classList.toggle("filled", i < pin.length));
  }

  function showError(msg) {
    loginError.textContent = msg;
    loginError.classList.toggle("visible", Boolean(msg));
  }

  function shakeError() {
    pinDots.classList.add("error");
    pinDots.addEventListener("animationend", () => pinDots.classList.remove("error"), { once: true });
  }

  function attemptLogin() {
    if (pin === CORRECT_PIN) {
      login();
    } else {
      shakeError();
      showError("PIN incorrecto");
      setTimeout(resetPin, 600);
    }
  }

  // ── EVENTOS DEL TECLADO ──────────────────────────────────
  keyboard.addEventListener("click", ev => {
    const key = ev.target.closest(".pin-key");
    if (!key || key.disabled) return;
    if (key.id === "pinClear")           { removeDigit(); showError(""); return; }
    if (key.dataset.digit !== undefined) { addDigit(key.dataset.digit); showError(""); }
  });

  loginBtn.addEventListener("click", () => {
    if (pin.length === 4) attemptLogin();
  });

  document.addEventListener("keydown", ev => {
    if (overlay.style.display === "none") return;
    if (ev.key >= "0" && ev.key <= "9") addDigit(ev.key);
    if (ev.key === "Backspace")          removeDigit();
    if (ev.key === "Enter" && pin.length === 4) attemptLogin();
  });

  logoutBtn.addEventListener("click", logout);

  // ── API DE CONSOLA ────────────────────────────────────────
  window.LoginDev = {
    getToken()       { const t = getStoredToken(); console.info("[LoginDev] Token:", t ?? "(ninguno)"); return t; },
    expireNow()      { onInactivity(); },
    setInactivity(s) { maxInactivityMs = s * 1000; if (sessionToken) resetInactivityTimer(); console.info(`[LoginDev] Inactividad: ${s}s`); },
    status() {
      const stored  = getStoredToken();
      const elapsed = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : null;
      const info = { loggedIn: !!stored, token: stored ?? null, elapsedSeconds: elapsed, inactivityLimit: maxInactivityMs / 1000 + "s" };
      console.table(info);
      return info;
    }
  };

  // ── INIT ─────────────────────────────────────────────────
  (function init() {
    // Siempre arranca en el modelo público, sin PIN
    overlay.style.display  = "none";
    appRoot.style.display  = "";
    sessionBar.style.display = "none";

    if (typeof render === "function" && !window.__appInitialized) {
      window.__appInitialized = true;
      if (typeof preloadBaseAssets === "function") preloadBaseAssets();
      render();
    }

    // Restaurar sesión si existe token previo
    const stored = getStoredToken();
    if (stored) {
      sessionToken = stored;
      sessionStart = Date.now();
      resetInactivityTimer();
      updateSessionBar();
      console.info(`[Login] Sesión restaurada. Token: ${sessionToken}`);
    }
  })();

})();
