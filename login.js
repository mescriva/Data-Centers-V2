// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — login.js
//
//  PIN: 0000  |  Inactividad: 3 min
//
//  Flujo:
//  · Arranca siempre en m6 (público). Pill: "Log in →"
//  · Clic "Log in →" O clic en m1–m5 sin sesión → modal PIN.
//    El modal muestra la app desenfocada detrás.
//  · PIN correcto → sesión activa. Pill: "Log out →".
//    - Desde "Log in →" (estaba en m6): se queda en m6.
//    - Desde clic en m1–m5: navega al modelo clicado.
//  · Con sesión: navegación libre por todos los modelos.
//  · "Log out →" o inactividad → vuelve a m6, pill "Log in →".
//  · X en el modal → cierra sin logear, se queda donde está.
// ═══════════════════════════════════════════════════════════

(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const CORRECT_PIN       = "0000";
  const MAX_INACTIVITY_MS = 3 * 60 * 1000;
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
  const backdrop   = document.getElementById("loginBackdrop");
  const appRoot    = document.getElementById("appRoot");
  const pinDots    = document.getElementById("pinDots");
  const dots       = pinDots.querySelectorAll(".pin-dot");
  const keyboard   = document.getElementById("pinKeyboard");
  const loginBtn   = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");
  const btnLogin   = document.getElementById("sessionLoginBtn");
  const btnLogout  = document.getElementById("sessionLogoutBtn");
  const btnClose   = document.getElementById("loginClose");

  // ── TOKEN ────────────────────────────────────────────────
  function generateToken() {
    const a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
  }
  function saveToken(t)     { sessionStorage.setItem(SESSION_KEY, t); }
  function clearToken()     { sessionStorage.removeItem(SESSION_KEY); sessionToken = null; }
  function getStoredToken() { return sessionStorage.getItem(SESSION_KEY); }

  // ── PILL DE SESIÓN ───────────────────────────────────────
  function updatePill() {
    if (sessionToken) {
      btnLogin.style.display  = "none";
      btnLogout.style.display = "flex";
    } else {
      btnLogin.style.display  = "flex";
      btnLogout.style.display = "none";
    }
  }

  window.onModelChanged = updatePill;

  // ── INACTIVIDAD ──────────────────────────────────────────
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(onInactivity, maxInactivityMs);
  }

  function onInactivity() {
    console.info("[Login] Inactividad → volviendo a m6.");
    doLogout();
  }

  ["mousemove", "mousedown", "keydown", "touchstart", "click"].forEach(ev =>
    document.addEventListener(ev, () => { if (sessionToken) resetInactivityTimer(); }, { passive: true })
  );

  // ── MODAL ────────────────────────────────────────────────
  function showModal() {
    backdrop.style.display = "flex";
    appRoot.classList.add("app--blurred");
    resetPin();
    showError("");
  }

  function hideModal() {
    backdrop.style.display = "none";
    appRoot.classList.remove("app--blurred");
  }

  // ── LOGIN ────────────────────────────────────────────────
  function doLogin() {
    sessionToken = generateToken();
    sessionStart = Date.now();
    saveToken(sessionToken);
    console.info(`[Login] Sesión iniciada. Token: ${sessionToken}`);

    hideModal();
    resetInactivityTimer();
    updatePill();

    if (pendingModelId) {
      const mid = pendingModelId;
      pendingModelId = null;
      if (typeof setModel === "function") setModel(mid);
    }
  }

  // ── LOGOUT ───────────────────────────────────────────────
  function doLogout() {
    clearToken();
    clearTimeout(inactivityTimer);
    pendingModelId = null;
    console.info("[Login] Sesión cerrada.");
    updatePill();
    if (typeof setModel === "function") setModel(PUBLIC_MODEL_ID);
  }

  // ── API PÚBLICA para app.js ──────────────────────────────
  // Llamada cuando el usuario clica m1–m5 sin sesión.
  window.requireLoginForModel = function (modelId) {
    // Si ya hay sesión activa, navegar directamente sin modal
    if (sessionToken) {
      if (typeof setModel === "function") setModel(modelId);
      return;
    }
    pendingModelId = modelId;
    showModal();
  };

  // ── EVENTOS PILL ─────────────────────────────────────────
  btnLogin.addEventListener("click", () => {
    pendingModelId = null; // Log in desde m6 → se queda en m6
    showModal();
  });

  btnLogout.addEventListener("click", doLogout);

  // X del modal → cierra sin logear
  btnClose.addEventListener("click", hideModal);

  // Clic en el backdrop oscuro → cierra
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) hideModal();
  });

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
      doLogin();
    } else {
      shakeError();
      showError("Incorrect PIN");
      setTimeout(resetPin, 600);
    }
  }

  // ── EVENTOS TECLADO ──────────────────────────────────────
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
    if (backdrop.style.display === "none") return;
    if (ev.key >= "0" && ev.key <= "9") addDigit(ev.key);
    if (ev.key === "Backspace")          removeDigit();
    if (ev.key === "Escape")             hideModal();
    if (ev.key === "Enter" && pin.length === 4) attemptLogin();
  });

  // ── CONSOLA DEV ──────────────────────────────────────────
  window.LoginDev = {
    getToken()       { const t = getStoredToken(); console.info("[LoginDev] Token:", t ?? "(ninguno)"); return t; },
    expireNow()      { onInactivity(); },
    setInactivity(s) { maxInactivityMs = s * 1000; if (sessionToken) resetInactivityTimer(); },
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
    // App siempre visible desde el arranque
    backdrop.style.display = "none";

    if (typeof render === "function" && !window.__appInitialized) {
      window.__appInitialized = true;
      if (typeof preloadBaseAssets  === "function") preloadBaseAssets();
      if (typeof preloadGraphAssets === "function") preloadGraphAssets();
      render();
    }

    // Restaurar sesión previa
    const stored = getStoredToken();
    if (stored) {
      sessionToken = stored;
      sessionStart = Date.now();
      resetInactivityTimer();
      console.info(`[Login] Sesión restaurada. Token: ${sessionToken}`);
    }

    updatePill();
  })();

})();
