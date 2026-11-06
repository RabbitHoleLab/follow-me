
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 06 — UNDER CONSTRUCTION
 *
 * A maintenance page that never finishes.
 * Or does it?
 */

window.roomInteractions ??= {};

window.roomInteractions[6] = {
  mount(container) {
    let active = true;
    let progress = 0;
    let inspectionCount = 0;
    let revealed = false;
    let timer = null;

    // Counts visits during the current browser session.
    const visitKey = "rabbitholelab_room06_visits";

    let visits = 1;

    try {
      visits =
        Number(sessionStorage.getItem(visitKey) || 0) + 1;

      sessionStorage.setItem(visitKey, String(visits));
    } catch {
      // The room remains playable without storage.
    }

    const room = document.createElement("section");

    room.innerHTML = `
      <style>
        .r6-panel {
          padding: 14px 12px;
          border: 1px solid #3d4934;
          border-radius: 8px;
          background:
            radial-gradient(
              ellipse at 50% 20%,
              #18241a,
              #08110c 75%
            );
          color: #c8d9c7;
          font-family: monospace;
          text-align: center;
        }

        .r6-header {
          color: #8b9d8a;
          font-size: 10px;
          letter-spacing: 2px;
          margin-bottom: 16px;
        }

        .r6-icon {
          font-size: 45px;
          margin-bottom: 6px;
          filter: drop-shadow(0 0 10px #d5a34b44);
        }

        .r6-title {
          color: #e2b35b;
          font-size: clamp(17px, 5vw, 25px);
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .r6-description {
          font-size: 12px;
          line-height: 1.8;
          color: #a1b5a2;
          margin-bottom: 18px;
        }

        .r6-progress-label {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 9px;
          color: #9cab94;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .r6-progress-track {
          height: 9px;
          border: 1px solid #5b6544;
          background: #142018;
          border-radius: 3px;
          overflow: hidden;
        }

        .r6-progress-fill {
          height: 100%;
          width: 0%;
          background:
            linear-gradient(
              90deg,
              #8b6935,
              #e2b35b
            );
          transition: width 0.25s ease;
        }

        .r6-estimate {
          margin-top: 14px;
          color: #788575;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .r6-status {
          min-height: 52px;
          margin-top: 16px;
          padding: 12px 8px;
          border-top: 1px solid #354335;
          color: #a9c2ab;
          font-size: 11px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .r6-inspect {
          display: inline-block;
          margin-top: 8px;
          padding: 9px 12px;
          border: 1px solid #586f4b;
          border-radius: 4px;
          background: #17251a;
          color: #b3c9b2;
          font: 11px monospace;
          cursor: pointer;
        }

        .r6-inspect:hover,
        .r6-inspect:focus-visible {
          border-color: #e2b35b;
          color: #e2b35b;
        }

        .r6-footer {
          margin-top: 14px;
          color: #536453;
          font-size: 9px;
          letter-spacing: 1px;
        }
      </style>

      <div class="r6-panel">
        <div class="r6-header">
          RABBITHOLELAB // MAINTENANCE
        </div>

        <div class="r6-icon" aria-hidden="true">
          🚧
        </div>

        <div class="r6-title">
          UNDER CONSTRUCTION
        </div>

        <div class="r6-description">
          THIS ROOM IS NOT READY YET.<br>
          PLEASE COME BACK LATER.
        </div>

        <div class="r6-progress-label">
          <span>RECONSTRUCTION STATUS</span>
          <span id="r6-percent">0%</span>
        </div>

        <div class="r6-progress-track"
             role="progressbar"
             aria-label="Reconstruction progress"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-valuenow="0">
          <div class="r6-progress-fill"></div>
        </div>

        <div class="r6-estimate">
          ESTIMATED COMPLETION: SOON™
        </div>

        <div class="r6-status" role="status" aria-live="polite">
          INITIALIZING RECONSTRUCTION...
        </div>

        <button class="r6-inspect" type="button">
          CHECK FOR UPDATES
        </button>

        <div class="r6-footer">
          SYSTEM INTEGRITY: QUESTIONABLE
        </div>
      </div>
    `;

    container.appendChild(room);

    const percent = room.querySelector("#r6-percent");
    const fill = room.querySelector(".r6-progress-fill");
    const track = room.querySelector(".r6-progress-track");
    const status = room.querySelector(".r6-status");
    const inspect = room.querySelector(".r6-inspect");

    function setProgress(value) {
      progress = value;
      percent.textContent = progress + "%";
      fill.style.width = progress + "%";
      track.setAttribute("aria-valuenow", String(progress));
    }

    function showVisitMessage() {
      if (visits === 1) {
        status.textContent =
          "PLEASE WAIT.\nRECONSTRUCTION IN PROGRESS.";
      } else if (visits === 2) {
        status.textContent =
          "STILL UNDER CONSTRUCTION.\n" +
          "THANK YOU FOR YOUR UNNECESSARY PATIENCE.";
      } else {
        status.textContent =
          "WHY ARE YOU STILL CHECKING?\n" +
          "THE ROOM IS FINISHED. YOU ARE NOT.";
      }
    }

    // Fake progress: always stops at 99%.
    function startProgress() {
      let step = 0;

      timer = window.setInterval(() => {
        if (!active) return;

        step++;

        let next;

        if (step < 12) {
          next = Math.min(step * 8, 88);
        } else {
          next = Math.min(88 + (step - 11) * 2, 99);
        }

        setProgress(next);

        if (next === 99) {
          clearInterval(timer);
          timer = null;
          showVisitMessage();
        }
      }, 180);
    }

    function checkUpdates() {
      if (!active || revealed) return;

      inspectionCount++;

      const messages = [
        "UPDATE CHECK COMPLETE.\nNO UPDATES AVAILABLE.",
        "RECONSTRUCTION DELAYED.\nREASON: PENDING RECONSTRUCTION.",
        "PLEASE DO NOT INTERRUPT THE WAITING PROCESS.",
        "SYSTEM NOTICE:\nYOUR INTEREST HAS BEEN RECORDED."
      ];

      status.textContent =
        messages[(inspectionCount - 1) % messages.length];

      if (inspectionCount >= 4) {
        revealed = true;

        status.textContent =
          "UNAUTHORIZED INSPECTION DETECTED.\n\n" +
          "NO CONSTRUCTION ACTIVITY DETECTED.";

        inspect.textContent = "NO FURTHER UPDATES";
        inspect.disabled = true;
        inspect.style.opacity = "0.5";
        inspect.style.cursor = "default";
      }
    }

    inspect.addEventListener("click", checkUpdates);

    startProgress();

    return () => {
      active = false;

      if (timer !== null) {
        clearInterval(timer);
      }

      room.remove();
    };
  }
};
