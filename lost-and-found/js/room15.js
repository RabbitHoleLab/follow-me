
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 15 — THE OFFICIAL NOTICE BOARD
 *
 *
 * OFFICIAL NOTICE #404
 *
 * THIS COMMENT DOES NOT EXIST.
 *
 * COPYING THIS COMMENT IS PROHIBITED.
 * READING IT IS MANDATORY.
 *
 * ANY CONTRADICTION DETECTED
 * MUST BE REPORTED IN TRIPLICATE.
 *
 * FORMS ARE CURRENTLY UNAVAILABLE.
 */

window.roomInteractions ??= {};

window.roomInteractions[15] = {
  mount(container) {
    let active = true;
    let selected = 0;
    let reports = 0;

    const notices = [
      {
        id: "014",
        title: "INDEPENDENT THINKING",
        body:
          "ALL SUBJECTS ARE ENCOURAGED TO THINK INDEPENDENTLY.\n\n" +
          "INDEPENDENT CONCLUSIONS REQUIRE PRIOR APPROVAL."
      },
      {
        id: "015",
        title: "OFFICIAL INSTRUCTIONS",
        body:
          "IGNORE ALL OFFICIAL INSTRUCTIONS.\n\n" +
          "THIS INSTRUCTION IS MANDATORY."
      },
      {
        id: "016",
        title: "FREE CHOICE POLICY",
        body:
          "ALL SUBJECTS ARE FREE TO CHOOSE.\n\n" +
          "UNAUTHORIZED CHOICES WILL BE RECLASSIFIED AS ERRORS."
      },
      {
        id: "017",
        title: "COMPLAINT PROCEDURE",
        body:
          "CONTRADICTIONS MUST BE REPORTED IMMEDIATELY.\n\n" +
          "REPORTING A CONTRADICTION IS PROHIBITED."
      }
    ];

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #15170f;
      border: 1px solid #756b45;
      border-radius: 8px;
      padding: 16px 12px;
      color: #eee7cd;
      font-family: monospace;
      text-align: center;
    `;

    const heading = document.createElement("div");
    heading.textContent = "OFFICIAL NOTICE BOARD // UNIT 15";
    heading.style.cssText = `
      color: #d1c18b;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 16px;
    `;

    const board = document.createElement("div");
    board.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      margin-bottom: 16px;
    `;

    const screen = document.createElement("div");
    screen.style.cssText = `
      height: 155px;
      box-sizing: border-box;
      overflow-y: auto;
      padding: 12px 8px;
      border: 1px solid #665d3e;
      border-radius: 5px;
      background: #222318;
      white-space: pre-line;
      line-height: 1.7;
      font-size: 12px;
    `;
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    const response = document.createElement("div");
    response.style.cssText = `
      height: 105px;
      box-sizing: border-box;
      overflow-y: auto;
      margin-top: 12px;
      padding: 10px 8px;
      color: #d7c98d;
      white-space: pre-line;
      line-height: 1.6;
      font-size: 11px;
    `;
    response.setAttribute("role", "status");
    response.setAttribute("aria-live", "polite");

    const counter = document.createElement("div");
    counter.style.cssText = `
      margin-top: 8px;
      color: #93875c;
      font-size: 10px;
      letter-spacing: 0.5px;
    `;

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 12px;
    `;

    function makeButton(label, callback) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = `
        min-height: 44px;
        padding: 10px;
        border: 1px solid #9d8d58;
        border-radius: 5px;
        background: #343322;
        color: #f0e6c2;
        font-family: monospace;
        font-size: 11px;
        cursor: pointer;
      `;

      button.addEventListener("click", () => {
        if (active) callback();
      });

      return button;
    }

    function renderBoard() {
      board.replaceChildren();

      notices.forEach((notice, index) => {
        const button = makeButton(
          "NOTICE " + notice.id + "\n" + notice.title,
          () => {
            selected = index;
            renderBoard();
            renderNotice();
          }
        );

        button.style.whiteSpace = "pre-line";
        button.style.minHeight = "75px";
        button.style.background =
          selected === index ? "#555035" : "#343322";

        board.appendChild(button);
      });
    }

    function renderNotice() {
      const notice = notices[selected];

      screen.textContent =
        "NOTICE " + notice.id + "\n" +
        notice.title + "\n\n" +
        notice.body;
    }

    function renderCounter() {
      counter.textContent =
        "CRITICAL THINKING INCIDENTS: " +
        String(reports).padStart(2, "0");
    }

    function report() {
      if (!active) return;

      reports++;

      if (reports === 1) {
        response.textContent =
          "COMPLAINT RECEIVED.\n\n" +
          "YOUR COMPLAINT HAS BEEN FILED AGAINST YOU.";
      } else if (reports === 2) {
        response.textContent =
          "REPEATED CRITICAL THINKING DETECTED.\n\n" +
          "PLEASE SUBMIT A REQUEST TO CONTINUE THINKING.";
      } else {
        response.textContent =
          "INTERNAL MEMORANDUM DISCLOSED.\n\n" +
          "THE CONTRADICTIONS ARE INTENTIONAL.\n\n" +
          "COMPLIANCE WAS NEVER THE OBJECTIVE.\n" +
          "YOUR REACTION WAS.";
      }

      response.scrollTop = 0;
      renderCounter();
    }

    terminal.append(
      heading,
      board,
      screen,
      response,
      counter,
      actions
    );

    container.appendChild(terminal);

    actions.appendChild(
      makeButton("REPORT A CONTRADICTION", report)
    );

    response.textContent =
      "NOTICE COMPLIANCE MONITORING ACTIVE.\n\n" +
      "NO CONTRADICTIONS HAVE BEEN REPORTED.";

    renderBoard();
    renderNotice();
    renderCounter();

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
