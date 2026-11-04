
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 01 — OBSERVATION ROOM
 */

window.roomInteractions ??= {};

window.roomInteractions[1] = {
  mount(container) {
    let active = true;

    // Build the observation terminal.
    const terminal = document.createElement("section");
    terminal.className = "observation-terminal";

    terminal.style.cssText = `
      text-align: center;
      font-family: monospace;
      color: #d5f6df;
    `;

    const indicator = document.createElement("p");
    indicator.textContent = "● OBSERVATION SYSTEM ONLINE";
    indicator.style.cssText = `
      color: #69d89b;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 20px;
    `;

    const screen = document.createElement("div");
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    screen.style.cssText = `
      white-space: pre-line;
      line-height: 1.8;
      font-size: 13px;
      padding: 20px 10px;
      border-top: 1px solid #285c3c;
      border-bottom: 1px solid #285c3c;
      overflow-wrap: anywhere;
    `;

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    `;

    terminal.append(indicator, screen, actions);
    container.appendChild(terminal);

    function show(message, choices) {
      if (!active) return;

      screen.textContent = message;
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

    function start() {
      indicator.textContent = "● OBSERVATION SYSTEM ONLINE";

      show(
        "NO ACTIVE PERSONNEL DETECTED.\n" +
        "ONE SUBJECT PRESENT.",
        [
          ["VIEW CAMERA FEED", camera],
          ["IDENTIFY SUBJECT", identify]
        ]
      );
    }

    function camera() {
      show(
        "CAMERA FEED UNAVAILABLE.\n" +
        "SUBJECT STILL PRESENT.",
        [
          ["IDENTIFY SUBJECT", identify],
          ["RESTART OBSERVATION", start]
        ]
      );
    }

    function identify() {
      indicator.textContent = "● ANOMALY DETECTED";

      show(
        "SUBJECT: YOU.\n" +
        "OBSERVER: YOU.\n\n" +
        "ANOMALY DETECTED.\n" +
        "WHO IS WATCHING WHOM?",
        [
          ["KEEP WATCHING", keepWatching],
          ["STOP WATCHING", stopWatching]
        ]
      );
    }

    function keepWatching() {
      show(
        "OBSERVATION CONTINUES.\n" +
        "NO FURTHER INSTRUCTIONS AVAILABLE.",
        [
          ["RESTART OBSERVATION", start]
        ]
      );
    }

    function stopWatching() {
      indicator.textContent = "○ OBSERVATION DISABLED";

      show(
        "OBSERVATION DISABLED.\n" +
        "SUBJECT REMAINS FREE.\n\n" +
        "SYSTEM DOES NOT UNDERSTAND.",
        [
          ["RESTART OBSERVATION", start]
        ]
      );
    }

    start();

    // Clean up when the player closes the room.
    return () => {
      active = false;
      terminal.remove();
    };
  }
};
