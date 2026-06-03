// ═══════════════════════════════════════════════════════════
//  DATA CENTERS — login.js
//
//  PIN por defecto: 1234
//  Tiempo máximo de inactividad: 3 minutos (180 s)
//
//  API de consola (para pruebas):
//    LoginDev.getToken()          → muestra el token actual
//    LoginDev.expireNow()         → expira la sesión inmediatamente
//    LoginDev.setInactivity(seg)  → cambia el timeout (ej: 10 s para probar)
//    LoginDev.status()            → estado completo de la sesión
// ═══════════════════════════════════════════════════════════

(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const CORRECT_PIN         = "1234";        // PIN de acceso
  const MAX_INACTIVITY_MS   = 3 * 60 * 1000; // 3 minutos en ms
  const WARNING_THRESHOLD_S = 30;            // aviso los últimos 30 s
  const SESSION_KEY         = "dc_session_token";

  // ── ESTADO ──────────────────────────────────────────────
  let pin             = "";
  let inactivityTimer = null;
  let sessionStart    = null;
  let sessionToken    = null;
  let maxInactivityMs = MAX_INACTIVITY_MS;
  let tickInterval    = null;

  // ── DOM ─────────────────────────────────────────────────
  const overlay     = document.getElementById("loginOverlay");
  const appRoot     = document.getElementById("appRoot");
  const pinDots     = document.getElementById("pinDots");
  const dots        = pinDots.querySelectorAll(".pin-dot");
  const keyboard    = document.getElementById("pinKeyboard");
  const loginBtn    = document.getElementById("loginBtn");
  const loginError  = document.getElementById("loginError");
  const sessionBar  = document.getElementById("sessionBar");
  const sessionStatus = document.getElementById("sessionStatus");
  const sessionTimer  = document.getElementById("sessionTimer");
  const logoutBtn   = document.getElementById("sessionLogout");

  // ── TOKEN HELPERS ────────────────────────────────────────
  function generateToken() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }

  function saveToken(token) {
    sessionStorage.setItem(SESSION_KEY, token);
  }

  function clearToken() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionToken = null;
  }

  function getStoredToken() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  // ── INACTIVIDAD ──────────────────────────────────────────
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(handleInactivityExpire, maxInactivityMs);
  }

  function handleInactivityExpire() {
    console.info("[Login] Sesión expirada por inactividad.");
    logout();
  }

  // Actividad del usuario
  const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "click"];
  function onUserActivity() {
    if (sessionToken) resetInactivityTimer();
  }
  ACTIVITY_EVENTS.forEach(ev =>
    document.addEventListener(ev, onUserActivity, { passive: true })
  );

  // ── TICK DEL TEMPORIZADOR (barra de debug) ───────────────
  function startTick() {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(updateSessionBar, 1000);
  }

  function stopTick() {
    clearInterval(tickInterval);
    tickInterval = null;
  }

  function updateSessionBar() {
    if (!sessionToken) return;
    const elapsed   = Date.now() - sessionStart;
    const remaining = Math.max(0, maxInactivityMs - elapsed);
    const secs      = Math.ceil(remaining / 1000);
    const mins      = Math.floor(secs / 60);
    const s         = String(secs % 60).padStart(2, "0");

    sessionTimer.textContent = `Sesión activa · Inactividad en ${mins}:${s}`;

    if (secs <= WARNING_THRESHOLD_S) {
      sessionStatus.classList.add("warning");
    } else {
      sessionStatus.classList.remove("warning");
    }
  }

  // ── LOGIN / LOGOUT ───────────────────────────────────────
  function login() {
    sessionToken  = generateToken();
    sessionStart  = Date.now();
    saveToken(sessionToken);

    console.info(`[Login] Sesión iniciada. Token: ${sessionToken}`);

    // Oculta login, muestra app
    overlay.classList.add("hidden");
    overlay.addEventListener("animationend", () => {
      overlay.style.display = "none";
    }, { once: true });

    appRoot.style.display = "";

    // Barra de debug
    sessionBar.style.display  = "flex";
    sessionStatus.textContent = "●";
    sessionStatus.classList.remove("warning");
    updateSessionBar();
    startTick();
    resetInactivityTimer();

    // Inicia la app principal si aún no está inicializada
    if (typeof render === "function" && !window.__appInitialized) {
      window.__appInitialized = true;
      preloadBaseAssets();
      preloadBaseGraphs();
      render();
    }
  }

  function logout() {
    clearToken();
    clearTimeout(inactivityTimer);
    stopTick();

    console.info("[Login] Sesión cerrada. Token eliminado.");

    // Restaura overlay
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    overlay.style.opacity  = "";
    appRoot.style.display  = "none";

    sessionBar.style.display = "none";

    // Resetea el PIN
    resetPin();
    showError("");
  }

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

    if (key.id === "pinClear") {
      removeDigit();
      showError("");
      return;
    }

    if (digit !== undefined) {
      addDigit(digit);
      showError("");
    }
  });

  loginBtn.addEventListener("click", () => {
    if (pin.length === 4) attemptLogin();
  });

  // Teclado físico (accesibilidad y pruebas en escritorio)
  document.addEventListener("keydown", ev => {
    if (!overlay || overlay.style.display === "none") return;
    if (ev.key >= "0" && ev.key <= "9") addDigit(ev.key);
    if (ev.key === "Backspace") removeDigit();
    if (ev.key === "Enter" && pin.length === 4) attemptLogin();
  });

  // Botón cerrar sesión (barra de debug)
  logoutBtn.addEventListener("click", logout);

  // ── API DE CONSOLA PARA DESARROLLO ───────────────────────
  window.LoginDev = {
    /**
     * Muestra el token de sesión actual en consola.
     * @returns {string|null}
     */
    getToken() {
      const t = getStoredToken();
      console.info("[LoginDev] Token actual:", t ?? "(ninguno)");
      return t;
    },

    /**
     * Expira la sesión inmediatamente.
     */
    expireNow() {
      console.info("[LoginDev] Expirando sesión ahora...");
      handleInactivityExpire();
    },

    /**
     * Cambia el timeout de inactividad en tiempo real.
     * @param {number} segundos
     */
    setInactivity(segundos) {
      maxInactivityMs = segundos * 1000;
      sessionStart    = Date.now(); // resetea el contador
      console.info(`[LoginDev] Inactividad ajustada a ${segundos} segundos.`);
      if (sessionToken) {
        resetInactivityTimer();
        updateSessionBar();
      }
    },

    /**
     * Estado completo de la sesión.
     */
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
  // Comprueba si ya había sesión al recargar
  (function init() {
    const stored = getStoredToken();
    if (stored) {
      // Token válido en sessionStorage → acceso directo
      sessionToken  = stored;
      sessionStart  = Date.now();
      console.info(`[Login] Sesión restaurada. Token: ${sessionToken}`);
      login();
    } else {
      // Asegura que el overlay está visible
      overlay.style.display = "flex";
      overlay.style.opacity = "";
    }
  })();

})();
