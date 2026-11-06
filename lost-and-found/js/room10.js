
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 10 — NOTHING TO SEE HERE
 */

window.roomInteractions ??= {};

window.roomInteractions[10] = {
  mount(container) {
    let active = true;
    let discovered = false;

    const room = document.createElement("section");

    room.innerHTML = `
      <style>
        .r10-wall {
          position: relative;
          height: 330px;
          overflow: hidden;
          border: 1px solid #18352a;
          border-radius: 6px;
          background:
            radial-gradient(
              ellipse at 60% 35%,
              #12271d 0%,
              #07120d 75%
            );
        }

        .r10-message {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          text-align: center;
          font: 12px monospace;
          letter-spacing: 2px;
          color: #668a72;
        }

        .r10-crack {
          position: absolute;
          left: 68%;
          top: 49%;
          width: 30px;
          height: 74px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: default;
          touch-action: manipulation;
        }

        .r10-crack svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .r10-crack path {
          fill: none;
          stroke: #263e31;
          stroke-width: 1.3;
          transition:
            stroke 0.3s,
            filter 0.3s;
        }

        .r10-crack:hover path,
        .r10-crack:focus-visible path {
          stroke: #789c7d;
          filter: drop-shadow(0 0 4px #6eac7a);
        }

        .r10-crack:focus-visible {
          outline: 1px dotted #8dbb92;
          outline-offset: 6px;
        }

        .r10-paper {
          position: absolute;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%) rotate(-5deg);
          width: 115px;
          min-height: 105px;
          display: none;
          align-items: center;
          justify-content: center;
          background: #c6b99a;
          color: #333126;
          font: 42px Georgia, serif;
          box-shadow: 3px 6px 18px #0009;
          clip-path: polygon(
            0 5%, 12% 0, 29% 4%, 48% 0,
            68% 3%, 85% 0, 100% 6%,
            97% 38%, 100% 68%, 95% 100%,
            72% 96%, 53% 100%, 28% 96%,
            7% 100%, 0 86%, 3% 55%
          );
        }

        .r10-paper.revealed {
          display: flex;
          animation: r10-appear 0.65s ease-out both;
        }

        @keyframes r10-appear {
          from {
            opacity: 0;
            transform:
              translate(-50%, -44%)
              rotate(-9deg)
              scale(0.85);
          }
          to {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              rotate(-5deg)
              scale(1);
          }
        }

        .r10-footnote {
          margin-top: 14px;
          text-align: center;
          font: 10px monospace;
          color: #4a6754;
          letter-spacing: 1px;
        }
      </style>

      <div class="r10-wall">
        <div class="r10-message">
          NOTHING TO SEE HERE.
        </div>

        <button
          class="r10-crack"
          type="button"
          aria-label="Examine the crack in the wall"
          title=""
        >
          <svg viewBox="0 0 30 74" aria-hidden="true">
            <path d="
              M16 0
              L12 13
              L18 24
              L10 36
              L15 48
              L11 59
              L17 74
            "/>
          </svg>
        </button>

        <div class="r10-paper" aria-hidden="true">
          ♠
        </div>
      </div>

      <div class="r10-footnote">
        ARCHIVE STATUS: EMPTY
      </div>
    `;

    container.appendChild(room);

    const crack = room.querySelector(".r10-crack");
    const paper = room.querySelector(".r10-paper");
    const footnote = room.querySelector(".r10-footnote");

    crack.addEventListener("click", () => {
      if (!active || discovered) return;

      discovered = true;

      crack.hidden = true;
      crack.style.display = "none";

      paper.classList.add("revealed");
      paper.setAttribute("aria-hidden", "false");

      footnote.textContent = "ARCHIVE STATUS: UNCHANGED";
    });

    return () => {
      active = false;
      room.remove();
    };
  }
};
