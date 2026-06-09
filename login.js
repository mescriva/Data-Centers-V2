// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — login.js
//
//  PIN por defecto: 1234
//  Tiempo máximo de inactividad: 3 minutos (180 s)
//
//  API de consola:
//    LoginDev.getToken()          → muestra el token actual
//    LoginDev.expireNow()         → expira la sesión inmediatamente
//    LoginDev.setInactivity(seg)  → cambia el timeout
//    LoginDev.status()            → estado completo
// ═══════════════════════════════════════════════════════════

(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const CORRECT_PIN         = "1234";
  const MAX_INACTIVITY_MS   = 3 * 60 * 1000; // 3 min
  const SESSION_KEY         = "dc_session_token";
  const PUBLIC_MODEL_ID     = MODELS.find(m => m.isPublic)?.id ?? "m6";

  // ── ESTADO ──────────────────────────────────────────────
  let pin             = "";
  let inactivityTimer = null;
  let sessionStart    = null;
  let sessionToken    = null;
  let maxInactivityMs = MAX_INACTIVITY_MS;
  let pendingModelId  = null; // model the user wants to switch to after login

  // ── DOM ─────────────────────────────────────────────────
  const overlay       = document.getElementById("loginOverlay");
  const appRoot       = document.getElementById("appRoot");
  const pinDots       = document.getElementById("pinDots");
  const dots          = pinDots.querySelectorAll(".pin-dot");
  const keyboard      = document.getElementById("pinKeyboard");
  const loginBtn      = document.getElementById("loginBtn");
  const loginError    = document.getElementById("loginError");
  const sessionBar    = document.getElementById("sessionBar");
  const logoutBtn     = document.getElementById("sessionLogout");

  // ── TOKEN HELPERS ────────────────────────────────────────
  function generateToken() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }
  function saveToken(t)   { sessionStorage.setItem(SESSION_KEY, t); }
  function clearToken()   { sessionStorage.removeItem(SESSION_KEY); sessionToken = null; }
  function getStoredToken(){ return sessionStorage.getItem(SESSION_KEY); }

  // ── INACTIVIDAD ──────────────────────────────────────────
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(handleInactivityExpire, maxInactivityMs);
  }

  function handleInactivityExpire() {
    console.info("[Login] Sesión expirada por inactividad.");
    logout();
  }

  const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "click"];
  function onUserActivity() {
    if (sessionToken) resetInactivityTimer();
  }
  ACTIVITY_EVENTS.forEach(ev =>
    document.addEventListener(ev, onUserActivity, { passive: true })
  );

  // ── LOGIN / LOGOUT ───────────────────────────────────────
  function login() {
    sessionToken = generateToken();
    sessionStart = Date.now();
    saveToken(sessionToken);

    console.info(`[Login] Sesión iniciada. Token: ${sessionToken}`);

    // Hide login overlay
    overlay.classList.add("hidden");
    overlay.addEventListener("animationend", () => {
      overlay.style.display = "none";
    }, { once: true });

    appRoot.style.display = "";
    sessionBar.style.display = "flex";
    resetInactivityTimer();

    // Switch to the pending model if set
    if (pendingModelId) {
      const mid = pendingModelId;
      pendingModelId = null;
      if (typeof setModel === "function") setModel(mid);
    }

    // Init app
    if (typeof render === "function" && !window.__appInitialized) {
      window.__appInitialized = true;
      if (typeof preloadBaseAssets === "function") preloadBaseAssets();
      if (typeof preloadBaseGraphs === "function") preloadBaseGraphs();
      render();
    }
  }

  function logout() {
    clearToken();
    clearTimeout(inactivityTimer);

    console.info("[Login] Sesión cerrada.");

    // Return to the public model
    if (typeof setModel === "function") {
      setModel(PUBLIC_MODEL_ID);
    }

    // Hide session bar, show overlay
    sessionBar.style.display = "none";
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    overlay.style.opacity = "";
    // Keep the app visible behind the overlay (it shows the public model)
    // No need to hide appRoot — the overlay sits on top

    resetPin();
    showError("");
    pendingModelId = null;
  }

  // ── PUBLIC API — called from app.js ──────────────────────
  // Triggered when the user taps a protected model button
  window.requireLoginForModel = function(modelId) {
    if (sessionToken) {
      // Already logged in → just switch
      if (typeof setModel === "function") setModel(modelId);
      return;
    }
    // Store which model to activate after successful login
    pendingModelId = modelId;
    // Show login overlay on top of the running app
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    overlay.style.opacity = "";
    resetPin();
    showError("");
  };

  // ── PIN ──────────────────────────────────────────────────
  function addDigit(d) {
    if (pin.length >= 4) return;
    pin += d;
    updateDots();
    if (pin.length === 4) loginBtn.removeAttribute("disabled");
  }

  function removeDigit() {
    if (!pin.length) return;
    pin = pin.slice(0, -1);
    updateDots();
    if (pin.length < 4) loginBtn.setAttribute("disabled", "");
  }

  function resetPin() {
    pin = "";
    loginBtn.setAttribute("disabled", "");
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("filled", i < pin.length);
    });
  }

  function showError(msg) {
    loginError.textContent = msg;
    loginError.classList.toggle("visible", Boolean(msg));
  }

  function triggerErrorFeedback() {
    pinDots.classList.add("error");
    pinDots.addEventListener("animationend", () => {
      pinDots.classList.remove("error");
    }, { once: true });
  }

  function attemptLogin() {
    if (pin === CORRECT_PIN) {
      login();
    } else {
      triggerErrorFeedback();
      showError("PIN incorrecto");
      setTimeout(resetPin, 600);
    }
  }

  // ── EVENTOS DEL TECLADO ──────────────────────────────────
  keyboard.addEventListener("click", ev => {
    const key = ev.target.closest(".pin-key");
    if (!key || key.disabled) return;
    const digit = key.dataset.digit;
    if (key.id === "pinClear") { removeDigit(); showError(""); return; }
    if (digit !== undefined)   { addDigit(digit); showError(""); }
  });

  loginBtn.addEventListener("click", () => {
    if (pin.length === 4) attemptLogin();
  });

  document.addEventListener("keydown", ev => {
    if (!overlay || overlay.style.display === "none") return;
    if (ev.key >= "0" && ev.key <= "9") addDigit(ev.key);
    if (ev.key === "Backspace") removeDigit();
    if (ev.key === "Enter" && pin.length === 4) attemptLogin();
  });

  // Botón cerrar sesión
  logoutBtn.addEventListener("click", logout);

  // ── API DE CONSOLA ────────────────────────────────────────
  window.LoginDev = {
    getToken() {
      const t = getStoredToken();
      console.info("[LoginDev] Token actual:", t ?? "(ninguno)");
      return t;
    },
    expireNow() {
      console.info("[LoginDev] Expirando sesión ahora...");
      handleInactivityExpire();
    },
    setInactivity(segundos) {
      maxInactivityMs = segundos * 1000;
      sessionStart    = Date.now();
      console.info(`[LoginDev] Inactividad ajustada a ${segundos} s.`);
      if (sessionToken) resetInactivityTimer();
    },
    status() {
      const stored  = getStoredToken();
      const elapsed = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : null;
      const info = {
        loggedIn:        Boolean(stored),
        token:           stored ?? null,
        sessionStarted:  sessionStart ? new Date(sessionStart).toISOString() : null,
        elapsedSeconds:  elapsed,
        inactivityLimit: maxInactivityMs / 1000 + " s",
      };
      console.table(info);
      return info;
    },
  };

  // ── INIT ─────────────────────────────────────────────────
  (function init() {
    // App always starts on the public model — no login required
    overlay.style.display = "none";
    appRoot.style.display = "";
    sessionBar.style.display = "none";

    // Init app immediately (no login gate for public model)
    if (typeof render === "function" && !window.__appInitialized) {
      window.__appInitialized = true;
      if (typeof preloadBaseAssets === "function") preloadBaseAssets();
      if (typeof preloadBaseGraphs === "function") preloadBaseGraphs();
      render();
    }

    // If a session token exists from a previous page load, restore it
    const stored = getStoredToken();
    if (stored) {
      sessionToken = stored;
      sessionStart = Date.now();
      sessionBar.style.display = "flex";
      resetInactivityTimer();
      console.info(`[Login] Sesión restaurada. Token: ${sessionToken}`);
    }
  })();

})();
