
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 08 — PERCEPTION
 *
 * The answer is never displayed as a complete word.
 */

window.roomInteractions ??= {};

window.roomInteractions[8] = {
  mount(container) {
    let active = true;
    let animationId = null;
    let lastTime = 0;
    let elapsed = 0;
    let pointer = null;
    let calm = 0;

    const room = document.createElement("section");

    room.innerHTML = `
      <style>
        .r8-room {
          padding: 12px;
          border: 1px solid #254633;
          border-radius: 8px;
          background: #08140f;
          color: #a6d7b5;
          font-family: monospace;
          text-align: center;
        }

        .r8-heading {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #7da98b;
          margin-bottom: 14px;
        }

        .r8-field {
          position: relative;
          height: 300px;
          overflow: hidden;
          border: 1px solid #1b3a2a;
          border-radius: 5px;
          background:
            radial-gradient(
              ellipse at center,
              #193b29 0%,
              #0c2116 42%,
              #030a07 100%
            );
          touch-action: none;
          cursor: crosshair;
        }

        .r8-field::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 4px,
              #79dca506 5px
            );
        }

        .r8-letter {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          color: #9adbb1;
          font-family: monospace;
          font-weight: bold;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity;
          text-shadow: 0 0 12px #55d78b77;
        }

        .r8-observer {
          position: absolute;
          width: 110px;
          height: 110px;
          border: 1px solid #7ddd9b33;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          opacity: 0;
          background:
            radial-gradient(
              circle,
              #8af5ac0a,
              transparent 70%
            );
          transition: opacity 0.2s;
        }

        .r8-field.is-observed .r8-observer {
          opacity: 1;
        }

        .r8-message {
          margin-top: 16px;
          min-height: 36px;
          color: #83ac90;
          font-size: 11px;
          letter-spacing: 1px;
          line-height: 1.7;
        }

        .r8-footer {
          margin-top: 14px;
          color: #456b53;
          font-size: 10px;
          letter-spacing: 1px;
        }

        @media (max-width: 480px) {
          .r8-field {
            height: 260px;
          }

          .r8-heading {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .r8-letter {
            will-change: auto;
          }
        }
      </style>

      <div class="r8-room">
        <div class="r8-heading">
          VISUAL SIGNAL // (8)
        </div>

        <div class="r8-field"
             aria-label="An unstable visual signal containing drifting letters">
          <div class="r8-observer"></div>
        </div>

        <div class="r8-message" aria-live="polite">
          THE PATTERN IS NOT MISSING.
        </div>

        <div class="r8-footer">
          OBSERVATION DOES NOT GUARANTEE UNDERSTANDING.
        </div>
      </div>
    `;

    container.appendChild(room);

    const field = room.querySelector(".r8-field");
    const observer = room.querySelector(".r8-observer");
    const message = room.querySelector(".r8-message");

    /*
     * Deliberately shuffled.
     * The complete answer is never written as a string.
     */
    const symbols = [
      "E", "T", "P", "O", "C",
      "N", "R", "E", "I", "P"
    ];

    const letters = symbols.map((symbol, index) => {
      const element = document.createElement("span");

      element.className = "r8-letter";
      element.textContent = symbol;
      element.style.fontSize =
        (18 + (index % 4) * 4) + "px";

      field.appendChild(element);

      return {
        element,
        index,
        x: (0.12 + (index * 0.173) % 0.76),
        y: (0.16 + (index * 0.237) % 0.67),
        phase: index * 1.91,
        speed: 0.32 + (index % 5) * 0.09
      };
    });

    function setPointer(event) {
      const rect = field.getBoundingClientRect();

      pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      calm = 0;

      observer.style.left = pointer.x + "px";
      observer.style.top = pointer.y + "px";

      field.classList.add("is-observed");
    }

    function clearPointer() {
      pointer = null;
      field.classList.remove("is-observed");
    }

    field.addEventListener("pointermove", setPointer);
    field.addEventListener("pointerdown", setPointer);
    field.addEventListener("pointerleave", clearPointer);
    field.addEventListener("pointerup", event => {
      if (event.pointerType !== "mouse") {
        clearPointer();
      }
    });
    field.addEventListener("pointercancel", clearPointer);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function animate(timestamp) {
      if (!active) return;

      if (!lastTime) lastTime = timestamp;

      const delta = Math.min(
        (timestamp - lastTime) / 1000,
        0.05
      );

      lastTime = timestamp;
      elapsed += delta;

      if (!pointer) {
        calm = Math.min(calm + delta, 5);
      }

      const width = field.clientWidth;
      const height = field.clientHeight;

      letters.forEach(letter => {
        const t = elapsed * letter.speed;

        let x =
          width * letter.x +
          Math.sin(t + letter.phase) * 24;

        let y =
          height * letter.y +
          Math.cos(t * 0.77 + letter.phase) * 20;

        let opacity = 0.5 +
          0.35 * Math.sin(t * 0.8 + letter.phase);

        if (pointer) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 100 && distance > 0.01) {
            const force = (100 - distance) / 100;

            x += (dx / distance) * force * 36;
            y += (dy / distance) * force * 36;

            opacity = Math.max(opacity, 0.95);
          }
        } else {
          // When left alone, the signal becomes easier to read.
          const stillness = Math.min(calm / 3, 1);

          x = x * (1 - stillness) +
              width * letter.x * stillness;

          y = y * (1 - stillness) +
              height * letter.y * stillness;

          opacity = Math.max(
            opacity,
            0.55 + stillness * 0.3
          );
        }

        if (reducedMotion) {
          x = width * letter.x;
          y = height * letter.y;
          opacity = 0.85;
        }

        x = Math.max(8, Math.min(width - 30, x));
        y = Math.max(8, Math.min(height - 30, y));

        letter.element.style.transform =
          "translate(" + x + "px," + y + "px)";

        letter.element.style.opacity = opacity;
      });

      if (pointer) {
        message.textContent =
          "THE CLOSER YOU LOOK, THE MORE IT MOVES.";
      } else if (calm > 2.5) {
        message.textContent =
          "SOMETIMES YOU NEED TO STOP LOOKING.";
      } else {
        message.textContent =
          "THE PATTERN IS NOT MISSING.";
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      active = false;

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      room.remove();
    };
  }
};
