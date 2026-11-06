/* ==========================================
       CHARACTER SELECTION
    ========================================== */

    const main = document.querySelector("main");
    const heroes = document.querySelector(".heroes");
    const cards = document.querySelectorAll(".hero");

    const message = document.getElementById("message");
    const subtitle = document.querySelector(".subtitle");
    const title = document.querySelector("h1");

    const ending = document.getElementById("ending");
    const capsule = document.getElementById("choice-capsule");
    const replay = document.getElementById("play-again");

    const reducedMotion =
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    let playing = false;

    /* ==========================================
       PLAYER PROGRESSION
       Saved in the browser
    ========================================== */

    const progressKey = "follow-me-progress";

    let attemptCount = Number(
      localStorage.getItem(progressKey) || 0
    );

    // Restore previously unlocked routes on reload.
    renderForbiddenRoutes(attemptCount);

    /* ==========================================
       WAIT HELPER
    ========================================== */

    const wait = ms =>
      new Promise(resolve =>
        setTimeout(resolve, reducedMotion ? 0 : ms)
      );

    /* ==========================================
       REVELATION TEXT
    ========================================== */

    async function reveal(text, duration = 2600) {

      message.style.opacity = "0";

      await wait(500);

      message.textContent = text;
      message.style.opacity = "1";

      await wait(duration);

    }

    /* ==========================================
       SELECT CHARACTER
    ========================================== */

    async function selectCharacter(card) {

      if (playing) return;

      playing = true;
      main.classList.add("is-playing");

      /* ==========================================
         MATRIX COLOR
         Blue characters / Red characters
      ========================================== */

      const isBlue = card.classList.contains("blue");

      matrixColor = isBlue
        ? "#51baff"
        : "#ff5a55";

      /* ==========================================
         HIGHLIGHT SELECTED CHARACTER
      ========================================== */

      heroes.classList.add("has-selection");
      card.classList.add("selected");

      subtitle.textContent = "CHARACTER SELECTED";

      await wait(1900);

      /* ==========================================
         MAKE CHARACTERS DISAPPEAR
      ========================================== */

      heroes.classList.add("vanish");
      subtitle.style.opacity = "0";
      title.classList.add("fade-out");

      await wait(1200);

      heroes.style.visibility = "hidden";

      main.classList.add("revelation-mode");
      message.classList.add("revelation");

      /* ==========================================
         ENDLESS LOOP — AFTER THE ANOMALY

         From the fourth journey onward:
         - Show capsule
         - Show one question
         - Show PLAY AGAIN
      ========================================== */

      if (attemptCount >= 3) {

        /* Choose the capsule image */

        
       capsule.src = isBlue
         ? "assets/images/capsule-blue.webp"
         : "assets/images/capsule-red.webp";


       capsule.style.opacity = "0";
       main.classList.add("endless-loop");
       
       requestAnimationFrame(() => {
         requestAnimationFrame(() => {
           capsule.style.opacity = "1";
         });
       });
             
        /* Only one message remains */

        await reveal(
          "IS THAT REALLY ENOUGH FOR YOU ?",
          5000
        );

        // Journeys after the anomaly also count for route unlocks.
        // This does not alter the original endless-loop revelation.
        attemptCount++;
        localStorage.setItem(progressKey, String(attemptCount));

        /* Show PLAY AGAIN */

        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            ending.classList.add("visible")
          )
        );

        /* Skip all original revelations */

        return;
      }

      /* ==========================================
         PHILOSOPHICAL REVELATION
      ========================================== */

      await reveal("YOU CHOSE A CHARACTER");

      await reveal(
        "BUT WHO CHOSE THE GAME ?",
        3200
      );

      await reveal(
        "YOU'RE THE PLAYER",
        2500
      );

      await reveal(
        "NOT THE CHARACTER",
        3200
      );

      /* ==========================================
         FINAL MESSAGE — BLUE OR RED
      ========================================== */

      const finalMessage = isBlue
        ? "DON'T FORGET TO LOVE YOURSELF ❤️"
        : "DID YOU REALLY CHOOSE YOURSELF ?";

      await reveal(finalMessage, 5000);

      /* ==========================================
         ATTEMPT COUNTER
      ========================================== */

      attemptCount++;

      localStorage.setItem(
        progressKey,
        String(attemptCount)
      );

      /* ==========================================
         REMAINING ATTEMPTS
      ========================================== */

      if (attemptCount === 1) {

        await reveal(
          "2 ATTEMPTS REMAINING",
          3500
        );

      } else if (attemptCount === 2) {

        await reveal(
          "1 ATTEMPT REMAINING",
          3500
        );

      }

      /* ==========================================
         SYSTEM ANOMALY — ONLY ONCE
      ========================================== */

      else if (attemptCount === 3) {

        matrixColor = "#57d98b";

        await reveal(
          "SYSTEM ANOMALY",
          2500
        );

        await reveal(
          "EXPAND YOUR MIND",
          3500
        );

        await reveal(
          "THINK OUTSIDE THE BOX",
          5000
        );

      }

      /* ==========================================
         SHOW REPLAY OPTION
      ========================================== */

      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          ending.classList.add("visible")
        )
      );

    }

    /* ==========================================
       CHARACTER CLICK EVENTS
    ========================================== */

    cards.forEach(card => {

      card.addEventListener("click", () => {
        selectCharacter(card);
      });

    });

    
    // Internal migration notes.
    // These references are intentionally obsolete.
    
    const legacyRoutes = Object.freeze({
      authentication: "DO_NOT_OPEN/escape.html",
      recovery: "SYSTEM_BACKUP/old_exit.txt",
      classified: "CLASSIFIED/README.md",
      finalAnswer: "THE_TRUTH/FINAL_ANSWER.txt",
      exit: "ABSOLUTELY_NOT_THE_EXIT/"
    });


    /* ==========================================
       PLAY AGAIN — RESET GAME
    ========================================== */

    replay.addEventListener("click", async () => {

      if (
        !playing ||
        !ending.classList.contains("visible")
      ) {
        return;
      }

      replay.disabled = true;

      /* Restore original Matrix color */

      matrixColor = "#57d98b";

      /* Hide ending */

      ending.classList.remove("visible");
      message.style.opacity = "0";
      capsule.style.opacity = "0";

      await wait(1000);

      /* Remove special modes */

      main.classList.remove("revelation-mode");
      main.classList.remove("endless-loop");

      /* Remove capsule image */

      capsule.removeAttribute("src");
      capsule.style.opacity = "";

      /* Reset revelation */

      message.textContent = "";
      message.classList.remove("revelation");
      message.style.opacity = "1";

      /* Reset characters */

      cards.forEach(card => {
        card.classList.remove("selected");
      });

      heroes.classList.remove("has-selection");
      heroes.style.visibility = "visible";

      /* Fade characters back in */

      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          heroes.classList.remove("vanish")
        )
      );

      /* Reset subtitle */

      subtitle.textContent = "CHOOSE YOUR CHARACTER";
      subtitle.style.opacity = "1";

      title.classList.remove("fade-out");

      /* Restore routes after the character-selection screen returns */
      renderForbiddenRoutes(attemptCount);
      main.classList.remove("is-playing");

      /* Unlock game */

      replay.disabled = false;
      playing = false;

    });
