"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 01 — OBSERVATION ROOM
 * Terminal effects edition — v2 (effets plus visibles)
 * Les modifications par rapport à ta version sont marquées ★
 */

window.roomInteractions = window.roomInteractions || {};   // ★ compatible anciens navigateurs

window.roomInteractions[1] = {
  mount(container) {
    let active = true;
    let typingTimer = null;
    let effectTimer = null;
    let sequence = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ★ STYLES — animations et survol (inclus dans le terminal, supprimés avec lui)
    const fx = document.createElement("style");
    fx.textContent = `
      @keyframes r1-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
      @keyframes r1-noise { to { background-position: 0 -37px, 29px 0; } }
      @keyframes r1-glitch {
        0%   { transform: translateX(-5px); filter: brightness(1.7);
               text-shadow: 3px 0 rgba(255,70,100,.85), -3px 0 rgba(70,215,255,.85); }
        20%  { transform: translateX(6px) skewX(-8deg); filter: brightness(.6); }
        40%  { transform: translateX(-3px); filter: brightness(1.5);
               text-shadow: -4px 0 rgba(255,70,100,.85), 4px 0 rgba(70,215,255,.85); }
        60%  { transform: translateX(4px) skewX(5deg); filter: brightness(.8); }
        80%  { transform: translateX(-2px); filter: brightness(1.3); }
        100% { transform: none; filter: none; text-shadow: none; }
      }
      .r1-pulse  { animation: r1-pulse 1.6s ease-in-out infinite; }
      .r1-glitch { animation: r1-glitch .42s steps(2, end); }
      .r1-btn { transition: background .15s, box-shadow .15s; }
      .r1-btn:hover { background: #21553a !important; box-shadow: 0 0 14px rgba(105,216,155,.5); }
      .r1-btn:active { transform: translateY(1px); }
      @media (prefers-reduced-motion: reduce) {
        .r1-pulse, .r1-glitch { animation: none !important; }
      }
    `;

    // --------------------------------------------
    // TERMINAL
    // --------------------------------------------

    const terminal = document.createElement("section");

    terminal.style.cssText = `
      position: relative;
      overflow: hidden;
      padding: 12px 6px;
      background: #07130e;
      color: #d5f6df;
      font-family: monospace;
      text-align: center;
      border: 1px solid #285c3c;
      border-radius: 8px;
    `;

    const indicator = document.createElement("p");

    indicator.style.cssText = `
      color: #69d89b;
      font-size: 11px;
      letter-spacing: 1px;
      margin: 8px 0 18px;
    `;

    const screen = document.createElement("div");

    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    screen.style.cssText = `
      position: relative;
      min-height: 125px;
      padding: 18px 10px;
      white-space: pre-line;
      line-height: 1.8;
      font-size: 13px;
      overflow-wrap: anywhere;
      border-top: 1px solid #285c3c;
      border-bottom: 1px solid #285c3c;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 4px,
        rgba(70, 180, 110, 0.035) 5px
      );
    `;

    // ★ Couche de "neige" vidéo au-dessus de l'écran (frère de screen : textContent ne l'efface pas)
    const noise = document.createElement("div");

    noise.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      mix-blend-mode: screen;
      transition: opacity 0.12s;
      background-image:
        repeating-linear-gradient(to bottom, rgba(255,255,255,.16) 0 1px, transparent 1px 3px),
        repeating-linear-gradient(to right, rgba(120,255,170,.12) 0 2px, transparent 2px 7px);
    `;

    const screenWrap = document.createElement("div");
    screenWrap.style.position = "relative";
    screenWrap.append(screen, noise);

    const actions = document.createElement("div");

    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 18px 8px 4px;
    `;

    terminal.append(fx, indicator, screenWrap, actions);
    container.appendChild(terminal);

    // ★ Voyant : pulse tant que le système est "en ligne" (●), fixe quand il est coupé (○)
    function setIndicator(text) {
      indicator.textContent = text;
      indicator.classList.toggle("r1-pulse", text.startsWith("●"));
    }

    // --------------------------------------------
    // EFFETS ★
    // --------------------------------------------

    function showNoise(on) {
      if (reducedMotion) return;
      noise.style.opacity = on ? "0.9" : "0";
      noise.style.animation = on ? "r1-noise 0.25s steps(3) infinite" : "none";
    }

    function glitchBurst() {
      if (reducedMotion) return;
      screen.classList.remove("r1-glitch");
      void screen.offsetWidth;                 // relance l'animation
      screen.classList.add("r1-glitch");
    }

    // --------------------------------------------
    // TIMERS
    // --------------------------------------------

    function clearEffects() {
      clearInterval(typingTimer);
      clearTimeout(effectTimer);

      typingTimer = null;
      effectTimer = null;

      screen.classList.remove("r1-glitch");    // ★
      showNoise(false);                        // ★
      screen.style.color = "";                 // ★
      screen.style.transform = "";
      screen.style.opacity = "1";
    }

    // --------------------------------------------
    // TYPEWRITER
    // --------------------------------------------

    function typeMessage(message, done) {
      const currentSequence = ++sequence;

      screen.textContent = "";

      if (reducedMotion) {
        screen.textContent = message;
        done();
        return;
      }

      // ★ lecteurs d'écran : attendre la fin de la frappe avant d'annoncer le texte
      screen.setAttribute("aria-busy", "true");

      let index = 0;

      const id = setInterval(() => {           // ★ identifiant local (plus de risque d'arrêter un autre minuteur)
        if (!active || currentSequence !== sequence) {
          clearInterval(id);
          return;
        }

        index = Math.min(index + 2, message.length);
        const finished = index >= message.length;

        // ★ curseur ▌ pendant la frappe
        screen.textContent = message.slice(0, index) + (finished ? "" : "▌");

        if (finished) {
          clearInterval(id);
          typingTimer = null;
          screen.setAttribute("aria-busy", "false");
          done();
        }
      }, 24);

      typingTimer = id;
    }

    // --------------------------------------------
    // BUTTONS
    // --------------------------------------------

    function showButtons(choices) {
      if (!active) return;

      actions.replaceChildren();

      choices.forEach(([label, next]) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "r1-btn";           // ★
        button.textContent = label;

        button.style.cssText = `
          min-height: 44px;
          padding: 12px;
          background: #173c29;
          color: #e2f8e9;
          border: 1px solid #69d89b;
          border-radius: 6px;
          cursor: pointer;
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 0.5px;
          white-space: normal;
        `;

        button.addEventListener("click", () => {
          if (active) next();
        });

        actions.appendChild(button);
      });

      // ★ clavier : le focus ne se perd plus quand les boutons sont remplacés
      if (actions.firstElementChild) {
        actions.firstElementChild.focus({ preventScroll: true });
      }
    }

    // --------------------------------------------
    // DISPLAY
    // --------------------------------------------

    function display(message, choices, effect = null) {
      if (!active) return;

      ++sequence;
      clearEffects();
      actions.replaceChildren();

      if (effect === "camera" && !reducedMotion) {
        cameraInterference(message, choices);
        return;
      }

      if (effect === "glitch" && !reducedMotion) {
        // ★ rafale de glitch sur l'ancien texte, puis frappe, puis nouvelle secousse
        glitchBurst();
        showNoise(true);

        effectTimer = setTimeout(() => {
          if (!active) return;

          showNoise(false);

          typeMessage(message, () => {
            glitchBurst();

            effectTimer = setTimeout(() => {
              if (active) showButtons(choices);
            }, 450);
          });
        }, 420);

        return;
      }

      typeMessage(message, () => {
        showButtons(choices);
      });
    }

    // --------------------------------------------
    // CAMERA INTERFERENCE
    // --------------------------------------------

    function cameraInterference(message, choices) {
      const frames = [
        "CONNECTING TO CAMERA 01...",
        "SIGNAL DETECTED.",
        "▓▒░ SIGNAL LOST ░▒▓",
        "RECONNECTING...",
        "NO VIDEO SOURCE."
      ];

      let frame = 0;
      const currentSequence = sequence;

      // ★ chaque image a son ambiance (couleur, neige, secousse)
      function applyFrame(i) {
        screen.textContent = frames[i];

        if (i === 2) {                         // signal perdu : rouge, neige, secousse
          screen.style.color = "#ff8a8a";
          showNoise(true);
          glitchBurst();
        } else if (i === 3) {                  // reconnexion : neige résiduelle
          screen.style.color = "#8fd8a6";
          showNoise(true);
        } else {
          screen.style.color = i === 4 ? "#6fa585" : "#8fd8a6";
          showNoise(false);
        }
      }

      applyFrame(0);

      const interval = setInterval(() => {
        if (!active || currentSequence !== sequence) {
          clearInterval(interval);
          return;
        }

        frame++;

        if (frame >= frames.length) {
          clearInterval(interval);
          screen.style.color = "";
          showNoise(false);

          typeMessage(message, () => {
            showButtons(choices);
          });

          return;
        }

        applyFrame(frame);
      }, 260);

      typingTimer = interval;
    }

    // --------------------------------------------
    // ROOM STATES
    // --------------------------------------------

    function start() {
      setIndicator("● OBSERVATION SYSTEM ONLINE");

      display(
        "NO ACTIVE PERSONNEL DETECTED.\n" +
        "ONE SUBJECT PRESENT.",
        [
          ["VIEW CAMERA FEED", camera],
          ["IDENTIFY SUBJECT", identify]
        ]
      );
    }

    function camera() {
      setIndicator("● CAMERA CONNECTION UNSTABLE");

      display(
        "CAMERA FEED UNAVAILABLE.\n" +
        "SUBJECT STILL PRESENT.",
        [
          ["IDENTIFY SUBJECT", identify],
          ["RESTART OBSERVATION", start]
        ],
        "camera"
      );
    }

    function identify() {
      setIndicator("● ANOMALY DETECTED");

      display(
        "SUBJECT: YOU.\n" +
        "OBSERVER: YOU.\n\n" +
        "ANOMALY DETECTED.\n" +
        "WHO IS WATCHING WHOM?",
        [
          ["KEEP WATCHING", keepWatching],
          ["STOP WATCHING", stopWatching]
        ],
        "glitch"
      );
    }

    function keepWatching() {
      display(
        "OBSERVATION CONTINUES.\n" +
        "NO FURTHER INSTRUCTIONS AVAILABLE.",
        [
          ["RESTART OBSERVATION", start]
        ]
      );
    }

    function stopWatching() {
      setIndicator("○ OBSERVATION DISABLED");

      display(
        "OBSERVATION DISABLED.\n" +
        "SUBJECT REMAINS FREE.\n\n" +
        "SYSTEM DOES NOT UNDERSTAND.",
        [
          ["RESTART OBSERVATION", start]
        ]
      );
    }

    // --------------------------------------------
    // INITIALIZATION
    // --------------------------------------------

    start();

    // --------------------------------------------
    // CLEANUP
    // --------------------------------------------

    return () => {
      active = false;
      ++sequence;

      clearEffects();
      terminal.remove();
    };
  }
};
