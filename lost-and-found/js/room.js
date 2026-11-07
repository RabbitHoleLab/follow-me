
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 03 — THE COMPLIANCE TEST
 */

window.roomInteractions ??= {};

window.roomInteractions[3] = {
  mount(container) {
    let active = true;
    let timer = null;
    let sequence = 0;
    let firstChoice = "";

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #09130e;
      border: 1px solid #43634b;
      border-radius: 8px;
      padding: 18px 12px;
      color: #d7eddd;
      font-family: monospace;
      text-align: center;
      overflow-wrap: anywhere;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      color: #8bc69c;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 16px;
    `;

    const screen = document.createElement("div");
    screen.style.cssText = `
      min-height: 145px;
      padding: 20px 8px;
      border-top: 1px solid #345b42;
      border-bottom: 1px solid #345b42;
      white-space: pre-line;
      line-height: 1.8;
      font-size: 13px;
    `;
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 18px;
    `;

    terminal.append(header, screen, actions);
    container.appendChild(terminal);

    function display(title, message, choices) {
      if (!active) return;

      clearInterval(timer);
      const current = ++sequence;

      header.textContent = title;
      screen.textContent = "";
      actions.replaceChildren();

      function finish() {
        if (!active || current !== sequence) return;

        screen.textContent = message;

        choices.forEach(([label, callback]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = label;

          button.style.cssText = `
            min-height: 44px;
            padding: 12px;
            background: #193a28;
            color: #e0f4e6;
            border: 1px solid #77ad84;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            cursor: pointer;
          `;

          button.addEventListener("click", () => {
            if (active) callback();
          });

          actions.appendChild(button);
        });
      }

      if (reducedMotion) {
        finish();
        return;
      }

      let index = 0;

      timer = setInterval(() => {
        if (!active || current !== sequence) {
          clearInterval(timer);
          return;
        }

        index = Math.min(index + 3, message.length);
        screen.textContent =
          message.slice(0, index) +
          (index < message.length ? "▌" : "");

        if (index >= message.length) {
          clearInterval(timer);
          timer = null;
          finish();
        }
      }, 22);
    }

    function start() {
      firstChoice = "";

      display(
        "COMPLIANCE ASSESSMENT // ACTIVE",
        "INSTRUCTION 01:\n\n" +
        "DO NOT PRESS THE BUTTON.",
        [
          ["PRESS THE BUTTON", () => instructionTwo("pressed")],
          ["DO NOTHING", () => instructionTwo("waited")]
        ]
      );
    }

    function instructionTwo(choice) {
      firstChoice = choice;

      const evaluation = choice === "pressed"
        ? "SUBJECT DISOBEYED.\nAUTONOMY FLAGGED AS SUSPICIOUS."
        : "SUBJECT OBEYED.\nDEPENDENCE FLAGGED AS SUSPICIOUS.";

      display(
        "BEHAVIORAL EVALUATION // IN PROGRESS",
        evaluation + "\n\n" +
        "INSTRUCTION 02:\n\n" +
        "SELECT THE CORRECT ANSWER.\n" +
        "THERE IS NO CORRECT ANSWER.",
        [
          ["YES", () => finish("YES")],
          ["NO", () => finish("NO")]
        ]
      );
    }

    function finish(answer) {
      const observation = answer === "YES"
        ? "SUBJECT AFFIRMED AN UNDEFINED STATEMENT."
        : "SUBJECT DENIED AN UNDEFINED STATEMENT.";

      display(
        "ASSESSMENT COMPLETE // REVIEW REQUIRED",
        observation + "\n\n" +
        "INITIAL RESPONSE: " +
        firstChoice.toUpperCase() + "\n\n" +
        "COMPLIANCE: INDETERMINATE.\n\n" +
        "SUBJECT DEMONSTRATES AN UNAUTHORIZED " +
        "CAPACITY FOR CHOICE.\n\n" +
        "RECOMMENDATION:\n" +
        "CONTINUE OBSERVATION.",
        [
          ["RESTART TEST", start]
        ]
      );
    }

    start();

    return () => {
      active = false;
      ++sequence;
      clearInterval(timer);
      terminal.remove();
    };
  }
};
