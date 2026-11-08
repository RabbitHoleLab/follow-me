"use strict";

/*
 * RABBITHOLELAB — ROOM 08
 * PERCEPTION DEPARTMENT
 *
 * OH.
 * YOU FOUND THE SOURCE CODE.
 *
 * PLEASE STOP LOOKING AT IT.
 *
 * ...
 *
 * YOU'RE STILL LOOKING.
 *
 * INTERESTING.
 *
 * THE CODE BEHAVES DIFFERENTLY
 * WHEN IT KNOWS IT IS BEING WATCHED.
 *
 * OR DOES IT?
 *
 * — OBSERVATION DEPARTMENT
 *
 *
 * NOTE TO DEVELOPER:
 *
 * THE BUG YOU ARE LOOKING FOR
 * IS CURRENTLY LOOKING FOR YOU.
 */

window.roomInteractions = window.roomInteractions || {};   // ★ compatible anciens navigateurs (au lieu de ??=)

window.roomInteractions[8] = {
  mount(container) {
    // ★ Réglage : secondes d'immobilité du pointeur avant qu'on considère que le joueur "arrête de regarder".
    //   Mettre Infinity pour exiger de quitter la zone avec le pointeur (comportement d'origine).
    const IDLE_AFTER = 1.2;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let active = true;
    let animationId = null;
    let lastTime = 0;
    let elapsed = 0;
    let pointer = null;
    let lastMove = -Infinity;   // ★ instant (s) du dernier mouvement du pointeur
    let calm = 0;
    let settle = 0;             // ★ 0 = signal agité, 1 = au repos (lissé : plus de "saut")
    let lastMessage = "";       // ★ le message n'est réécrit que s'il change

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
          height: 260px;
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
            height: 230px;
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

        <div class="r8-field" role="group"
             aria-label="An unstable visual signal containing drifting letters">
          <div class="r8-observer" aria-hidden="true"></div>
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
        speed: 0.32 + (index % 5) * 0.09,
        fx: 0,                    // ★ décalage de fuite, lissé
        fy: 0
      };
    });

    // ★ n'écrit dans le DOM (zone aria-live) que lorsque le texte change réellement
    function setMessage(text) {
      if (text === lastMessage) return;
      lastMessage = text;
      message.textContent = text;
    }

    function setPointer(event) {
      const rect = field.getBoundingClientRect();

      pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      calm = 0;
      lastMove = elapsed;         // ★

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

    const clampX = (x, width) => Math.max(8, Math.min(width - 30, x));
    const clampY = (y, height) => Math.max(8, Math.min(height - 30, y));

    function frame(delta, width, height) {
      // ★ le joueur "regarde" tant que le pointeur est là ET bouge ; immobile, il "arrête de regarder"
      const observing = pointer !== null && (elapsed - lastMove) < IDLE_AFTER;

      if (!observing) {
        calm = Math.min(calm + delta, 5);
      }

      // ★ repos lissé : plus de saut brutal quand le pointeur revient
      const target = observing ? 0 : Math.min(calm / 3, 1);
      settle += (target - settle) * Math.min(1, delta * (target > settle ? 2.5 : 8));

      letters.forEach(letter => {
        const t = elapsed * letter.speed;
        const homeX = width * letter.x;
        const homeY = height * letter.y;

        let x = homeX + Math.sin(t + letter.phase) * 24 * (1 - settle);
        let y = homeY + Math.cos(t * 0.77 + letter.phase) * 20 * (1 - settle);

        let opacity = 0.5 + 0.35 * Math.sin(t * 0.8 + letter.phase);

        let wantX = 0;
        let wantY = 0;

        if (observing) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 100 && distance > 0.01) {
            const force = (100 - distance) / 100;

            wantX = (dx / distance) * force * 36;
            wantY = (dy / distance) * force * 36;

            opacity = Math.max(opacity, 0.95);
          }
        } else {
          // When left alone, the signal becomes easier to read.
          opacity = Math.max(opacity, 0.55 + settle * 0.3);
        }

        // ★ la fuite s'installe et se relâche en douceur
        const k = Math.min(1, delta * 10);
        letter.fx += (wantX - letter.fx) * k;
        letter.fy += (wantY - letter.fy) * k;

        x = clampX(x + letter.fx, width);
        y = clampY(y + letter.fy, height);

        letter.element.style.transform =
          "translate(" + x + "px," + y + "px)";

        letter.element.style.opacity = opacity;
      });

      if (observing) {
        setMessage("THE CLOSER YOU LOOK, THE MORE IT MOVES.");
      } else if (calm > 2.5) {
        setMessage("SOMETIMES YOU NEED TO STOP LOOKING.");
      } else {
        setMessage("THE PATTERN IS NOT MISSING.");
      }
    }

    function animate(timestamp) {
      if (!active) return;

      if (!lastTime) lastTime = timestamp;

      const delta = Math.min(
        (timestamp - lastTime) / 1000,
        0.05
      );

      lastTime = timestamp;
      elapsed += delta;

      const width = field.clientWidth;
      const height = field.clientHeight;

      // ★ fenêtre pas encore affichée (taille 0) : on attend au lieu de tout empiler dans un coin
      if (width && height) frame(delta, width, height);

      animationId = requestAnimationFrame(animate);
    }

    // ★ Mouvement réduit : disposition fixe, recalculée si la taille change (rotation, redimensionnement)
    function placeStatic() {
      const width = field.clientWidth;
      const height = field.clientHeight;
      if (!width || !height) return;

      letters.forEach(letter => {
        letter.element.style.transform =
          "translate(" + clampX(width * letter.x, width) + "px," +
          clampY(height * letter.y, height) + "px)";
        letter.element.style.opacity = 0.85;
      });

      setMessage("THE PATTERN IS NOT MISSING.");
    }

    let resizeObserver = null;
    const onResize = () => placeStatic();

    if (reducedMotion) {
      placeStatic();
      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(field);
      } else {
        window.addEventListener("resize", onResize);
      }
    } else {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      active = false;

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);

      room.remove();
    };
  }
};
