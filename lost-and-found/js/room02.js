
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 02 — SYSTEM LOGS
 */

window.roomInteractions ??= {};

window.roomInteractions[2] = {
  mount(container) {
    let active = true;
    let timer = null;
    let sequence = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const terminal = document.createElement("section");

    terminal.style.cssText = `
      background: #08120e;
      margin-bottom: 20px;
      border: 1px solid #365344;
      border-radius: 7px;
      padding: 18px 12px;
      font-family: monospace;
      color: #d4eadb;
      text-align: left;
      overflow-wrap: anywhere;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      color: #80b995;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 15px;
      text-align: center;
    `;
    header.textContent = "ARCHIVE TERMINAL // INTERNAL USE ONLY";

    const screen = document.createElement("div");
    screen.style.cssText = `
      min-height: 175px;
      white-space: pre-line;
      line-height: 1.8;
      font-size: 12px;
      padding: 16px 8px;
      border-top: 1px solid #365344;
      border-bottom: 1px solid #365344;
    `;
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 16px;
    `;

    terminal.append(header, screen, actions);
    container.appendChild(terminal);

    function display(message, choices) {
      if (!active) return;

      clearInterval(timer);
      const current = ++sequence;
      actions.replaceChildren();
      screen.textContent = "";

      function finish() {
        if (!active || current !== sequence) return;

        screen.textContent = message;

        choices.forEach(([label, callback]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = label;

          button.style.cssText = `
            min-height: 44px;
            padding: 11px;
            color: #d4eadb;
            background: #173629;
            border: 1px solid #547c60;
            border-radius: 5px;
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

        index = Math.min(index + 4, message.length);
        screen.textContent =
          message.slice(0, index) +
          (index < message.length ? "▌" : "");

        if (index >= message.length) {
          clearInterval(timer);
          timer = null;
          finish();
        }
      }, 18);
    }

    function menu() {
      header.textContent =
        "ARCHIVE TERMINAL // INTERNAL USE ONLY";

      display(
        "SYSTEM LOGS — LEVEL 0\n\n" +
        "ARCHIVE INTEGRITY: 100%\n" +
        "REALITY CONSISTENCY: UNKNOWN\n\n" +
        "SELECT A RECORD CATEGORY.",
        [
          ["ACCESS LOGS", accessLogs],
          ["INCIDENT REPORTS", incidents],
          ["DELETED RECORDS", deletedRecords]
        ]
      );
    }

    function accessLogs() {
      display(
        "[09:41:03] SUBJECT ENTERED FACILITY.\n" +
        "[09:41:04] SUBJECT IDENTIFIED.\n" +
        "[09:41:04] IDENTIFICATION FAILED.\n" +
        "[09:41:05] BOTH RESULTS VALID.\n\n" +
        "[09:40:59] SUBJECT EXITED FACILITY.\n\n" +
        "ERROR: EXIT PRECEDES ENTRY.",
        [
          ["RETURN TO ARCHIVES", menu],
          ["OPEN INCIDENT REPORT", incidents]
        ]
      );
    }

    function incidents() {
      display(
        "INCIDENT REPORT #002\n\n" +
        "DESCRIPTION:\n" +
        "A DOOR WAS FOUND OPEN.\n" +
        "THE DOOR WAS NEVER INSTALLED.\n\n" +
        "CORRECTIVE ACTION:\n" +
        "REMOVE ALL REFERENCES TO THE DOOR.\n\n" +
        "STATUS: RESOLVED.\n" +
        "DOOR STATUS: OPEN.",
        [
          ["RETURN TO ARCHIVES", menu],
          ["VIEW DELETED RECORDS", deletedRecords]
        ]
      );
    }

    function deletedRecords() {
      header.textContent =
        "ARCHIVE TERMINAL // ACCESS RESTRICTED";

      display(
        "RECOVERING DELETED RECORDS...\n\n" +
        "RECORD 0001:\n" +
        "SUBJECT DECLINED PARTICIPATION.\n" +
        "PARTICIPATION CONTINUED.\n\n" +
        "RECORD 0002:\n" +
        "SUBJECT REQUESTED THE TRUTH.\n" +
        "REQUEST DENIED.\n" +
        "REASON: SUBJECT ALREADY KNOWS.",
        [
          ["READ FINAL NOTICE", finalNotice],
          ["RETURN TO ARCHIVES", menu]
        ]
      );
    }

    function finalNotice() {
      header.textContent =
        "ARCHIVE TERMINAL // SYSTEM WARNING";

      display(
        "FINAL NOTICE\n\n" +
        "THE SYSTEM RECORDS YOUR ACTIONS.\n" +
        "IT ALSO RECORDS YOUR INACTION.\n\n" +
        "NO RECORD CAN PROVE\n" +
        "WHO MADE THE CHOICE.\n\n" +
        "ARCHIVE STATUS: COMPLETE.\n" +
        "SUBJECT STATUS: UNRESOLVED.",
        [
          ["RETURN TO ARCHIVES", menu]
        ]
      );
    }

    menu();

    return () => {
      active = false;
      ++sequence;
      clearInterval(timer);
      terminal.remove();
    };
  }
};
