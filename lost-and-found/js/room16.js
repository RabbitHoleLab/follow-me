
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 16 — EMERGENCY EXIT
 */

window.roomInteractions ??= {};

window.roomInteractions[16] = {
  mount(container) {
    let active = true;

    const terminal = document.createElement("section");

    terminal.style.cssText = `
      background: #08120e;
      border: 1px solid #47745a;
      border-radius: 8px;
      padding: 14px 12px;
      color: #d4eadb;
      font-family: monospace;
      text-align: left;
      box-shadow: inset 0 0 20px #153c2540;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      color: #90c9a3;
      font-size: 11px;
      letter-spacing: 1px;
      text-align: center;
      margin-bottom: 12px;
    `;
    header.textContent = "EMERGENCY EXIT // AUTHORIZATION TERMINAL";

    const description = document.createElement("div");
    description.style.cssText = `
      border-top: 1px solid #365344;
      padding: 12px 4px;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-line;
    `;
    description.textContent =
      "EXIT PROTOCOL ACTIVE.\n\n" +
      "PLEASE ENTER THE REQUIRED EXIT CODE.";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "ENTER EXIT CODE...";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Exit code");

    input.style.cssText = `
      display: block;
      width: 100%;
      min-height: 44px;
      padding: 10px;
      border: 1px solid #527c60;
      border-radius: 5px;
      outline-offset: 3px;
      background: #030b07;
      color: #d4eadb;
      font-family: monospace;
      font-size: 13px;
      box-sizing: border-box;
    `;

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = "REQUEST EXIT";

    submit.style.cssText = `
      display: block;
      width: 100%;
      min-height: 44px;
      margin-top: 10px;
      padding: 10px;
      background: #173629;
      border: 1px solid #69d89b;
      border-radius: 5px;
      color: #e2f8e9;
      font-family: monospace;
      font-size: 12px;
      cursor: pointer;
    `;

    // Fixed output area: no jumping when results appear.
    const output = document.createElement("div");
    output.style.cssText = `
      margin-top: 12px;
      border-top: 1px solid #365344;
      padding: 10px 5px;
      height: 165px;
      overflow-y: auto;
      box-sizing: border-box;
      white-space: pre-line;
      overflow-wrap: anywhere;
      font-size: 12px;
      line-height: 1.5;
      color: #a7d9b5;
    `;

    output.setAttribute("role", "status");
    output.setAttribute("aria-live", "polite");
    output.textContent = "AWAITING INPUT...\n\nEXIT STATUS: PENDING.";

    const footer = document.createElement("div");
    footer.style.cssText = `
      margin-top: 7px;
      font-size: 10px;
      text-align: center;
      color: #70947c;
    `;
    footer.textContent = "RABBITHOLELAB // LEVEL 0";

    terminal.append(
      header,
      description,
      input,
      submit,
      output,
      footer
    );

    container.appendChild(terminal);

    function requestExit() {
      if (!active) return;

      const answer = input.value.trim();
      let message;

      if (answer.toLowerCase() === ".fr") {
        message =
          "INPUT: .fr\n\n" +
          "SYSTEM ERROR.\n\n" +
          "YOU WERE NOT SUPPOSED TO KNOW THAT.\n" +
          "PLEASE PRETEND TO BE CONFUSED.\n\n" +
          "OUTPUT: .fr";
      } else if (answer === "") {
        message =
          "INPUT: [EMPTY]\n\n" +
          "OUTPUT: .fr\n\n" +
          "SILENCE IS ALSO AN ANSWER.";
      } else {
        message =
          "INPUT RECEIVED.\n\n" +
          "OUTPUT: .fr\n\n" +
          "THE MOST COMPLEX QUESTIONS\n" +
          "SOMETIMES HAVE THE SIMPLEST ANSWERS.";
      }

      output.textContent = message;
      output.scrollTop = 0;
    }

    submit.addEventListener("click", requestExit);

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        requestExit();
      }
    });

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
