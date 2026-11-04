
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 01 — OBSERVATION ROOM
 * Terminal effects edition
 */

window.roomInteractions ??= {};

window.roomInteractions[1] = {
  mount(container) {
    let active = true;
    let typingTimer = null;
    let effectTimer = null;
    let sequence = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    const actions = document.createElement("div");

    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 18px 8px 4px;
    `;

    terminal.append(indicator, screen, actions);
    container.appendChild(terminal);

    // --------------------------------------------
    // TIMERS
    // --------------------------------------------

    function clearEffects() {
      clearInterval(typingTimer);
      clearTimeout(effectTimer);

      typingTimer = null;
      effectTimer = null;

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

      let index = 0;

      typingTimer = setInterval(() => {
        if (!active || currentSequence !== sequence) {
          clearInterval(typingTimer);
          return;
        }

        index = Math.min(index + 2, message.length);
        screen.textContent = message.slice(0, index);

        if (index >= message.length) {
          clearInterval(typingTimer);
          typingTimer = null;
          done();
        }
      }, 24);
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
        screen.style.opacity = "0.55";
        screen.style.transform = "translateX(2px)";

        effectTimer = setTimeout(() => {
          if (!active) return;

          screen.style.opacity = "1";
          screen.style.transform = "";

          typeMessage(message, () => {
            showButtons(choices);
          });
        }, 180);

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

      screen.style.color = "#8fd8a6";
      screen.textContent = frames[frame];

      const interval = setInterval(() => {
        if (!active || currentSequence !== sequence) {
          clearInterval(interval);
          return;
        }

        frame++;

        if (frame >= frames.length) {
          clearInterval(interval);
          screen.style.color = "";

          typeMessage(message, () => {
            showButtons(choices);
          });

          return;
        }

        screen.textContent = frames[frame];
      }, 220);

      typingTimer = interval;
    }

    // --------------------------------------------
    // ROOM STATES
    // --------------------------------------------

    function start() {
      indicator.textContent =
        "● OBSERVATION SYSTEM ONLINE";

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
      indicator.textContent =
        "● CAMERA CONNECTION UNSTABLE";

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
      indicator.textContent =
        "● ANOMALY DETECTED";

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
      indicator.textContent =
        "○ OBSERVATION DISABLED";

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
