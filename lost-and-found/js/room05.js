
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 05 — THE WAITING ROOM
 * YOUR SOURCE CODE REQUEST
 * IS IMPORTANT TO US.
 *
 * YOU ARE CURRENTLY NUMBER 1
 * IN A QUEUE OF 0.
 *
 * PLEASE HOLD.
 *
 * ...
 *
 * PLEASE CONTINUE HOLDING.
 */


window.roomInteractions ??= {};

window.roomInteractions[5] = {
  mount(container) {
    let active = true;
    let checks = 0;
    let ticket = 42;
    let finished = false;

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #08140f;
      border: 1px solid #31583f;
      border-radius: 8px;
      padding: 18px 12px;
      color: #d5f6df;
      font-family: monospace;
      font-size: 12px;
      text-align: center;
    `;

    terminal.innerHTML = `
      <div style="color:#8dd2a5;font-size:11px;letter-spacing:1px;margin-bottom:16px;">
        DEPARTMENT OF PENDING REQUESTS
      </div>

      <div style="border:1px solid #31583f;border-radius:6px;padding:20px 10px;margin-bottom:15px;">
        <div style="font-size:10px;color:#8dd2a5;letter-spacing:2px;">
          YOUR TICKET
        </div>
        <div id="r5-ticket" style="font-size:42px;color:#d5f6df;margin:12px 0;">
          A042
        </div>
        <div style="font-size:11px;color:#8dd2a5;">
          NOW SERVING: <span id="r5-serving">A041</span>
        </div>
      </div>

      <div id="r5-status" role="status" aria-live="polite"
           style="min-height:75px;white-space:pre-line;line-height:1.7;padding:8px 0;">
        PLEASE WAIT.
        YOUR REQUEST IS BEING PROCESSED.
      </div>

      <div id="r5-actions" style="display:flex;flex-direction:column;gap:10px;margin-top:14px;"></div>

      <div style="margin-top:22px;">
        <button id="r5-leave" type="button"
          style="background:none;border:none;color:#456b55;font:10px monospace;cursor:pointer;padding:8px;">
          I DON'T NEED TO WAIT.
        </button>
      </div>
    `;

    container.appendChild(terminal);

    const ticketDisplay = terminal.querySelector("#r5-ticket");
    const servingDisplay = terminal.querySelector("#r5-serving");
    const status = terminal.querySelector("#r5-status");
    const actions = terminal.querySelector("#r5-actions");
    const leaveButton = terminal.querySelector("#r5-leave");

    function makeButton(label, callback) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;

      button.style.cssText = `
        width: 100%;
        min-height: 44px;
        padding: 10px;
        color: #d5f6df;
        background: #173c29;
        border: 1px solid #69d89b;
        border-radius: 6px;
        font: 12px monospace;
        cursor: pointer;
      `;

      button.addEventListener("click", () => {
        if (active && !finished) callback();
      });

      return button;
    }

    function formatTicket(number) {
      return "A" + String(number).padStart(3, "0");
    }

    function checkPosition() {
      checks++;
      ticket += checks;

      ticketDisplay.textContent = formatTicket(ticket);

      const messages = [
        "QUEUE UPDATED.\nYOUR POSITION HAS BEEN RECALCULATED.",
        "UNEXPECTED PRIORITY REQUEST DETECTED.\nPLEASE REMAIN PATIENT.",
        "YOUR PATIENCE HAS BEEN REGISTERED.\nNO PROGRESS HAS BEEN MADE.",
        "WAITING STATUS: ACTIVE.\nESTIMATED WAIT: INDETERMINATE."
      ];

      status.textContent = messages[(checks - 1) % messages.length];
    }

    function requestPriority() {
      status.textContent =
        "PRIORITY REQUEST RECEIVED.\n" +
        "PLEASE WAIT FOR AUTHORIZATION\n" +
        "TO REQUEST AUTHORIZATION.";
    }

    function cancelRequest() {
      status.textContent =
        "CANCELLATION REQUIRES APPROVAL.\n" +
        "YOUR REQUEST TO STOP WAITING\n" +
        "HAS BEEN ADDED TO THE QUEUE.";
    }

    function stopWaiting() {
      finished = true;

      ticketDisplay.textContent = "—";
      servingDisplay.textContent = "NOBODY";

      status.textContent =
        "REQUEST CLOSED.\n\n" +
        "YOU WERE NEVER REQUIRED TO WAIT.";

      actions.replaceChildren();
      leaveButton.remove();

      const restart = document.createElement("button");
      restart.type = "button";
      restart.textContent = "TAKE ANOTHER TICKET";
      restart.style.cssText = `
        width:100%;
        min-height:44px;
        padding:10px;
        color:#d5f6df;
        background:#173c29;
        border:1px solid #69d89b;
        border-radius:6px;
        font:12px monospace;
        cursor:pointer;
      `;

      const exit = document.createElement("button");
        exit.type = "button";
        exit.textContent = "LEAVE THE WAITING ROOM";
        
      exit.style.cssText = `
        width: 100%;
        min-height: 44px;
        padding: 10px;
        margin-top: 10px;
        color: #d5f6df;
        background: #173c29;
        border: 1px solid #69d89b;
        border-radius: 6px;
        font: 12px monospace;
        cursor: pointer;
      `;

      exit.addEventListener("click", () => {
        const dialog = document.getElementById("archive");
        if (dialog?.open) {
          dialog.close();
        }
      });

      restart.addEventListener("click", () => {
        if (!active) return;

        checks = 0;
        ticket = 42;
        finished = false;

        ticketDisplay.textContent = "A042";
        servingDisplay.textContent = "A041";
        status.textContent =
          "PLEASE WAIT.\nYOUR REQUEST IS BEING PROCESSED.";

        leaveButton.style.display = "";
        terminal.appendChild(leaveButton);

        buildActions();
      });

      actions.append(restart, exit);
    }

    function buildActions() {
      actions.replaceChildren();

      actions.append(
        makeButton("CHECK MY POSITION", checkPosition),
        makeButton("REQUEST PRIORITY", requestPriority),
        makeButton("CANCEL MY REQUEST", cancelRequest)
      );
    }

    leaveButton.addEventListener("click", () => {
      if (active && !finished) stopWaiting();
    });

    buildActions();

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
