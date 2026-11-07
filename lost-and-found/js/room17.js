"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 17 — THE THRESHOLD
 * Mini-jeu : « la porte qui s'éloigne »
 *
 * Installation :
 *   1. ce fichier dans js/room17.js
 *   2. dans map.js : AJOUTE 17 à la liste existante de interactiveRooms
 *      (ne remplace pas la liste : garde les numéros déjà présents).
 *
 * Règles (cachées au joueur) :
 *   - si tu marches VERS la porte, elle recule d'un pas (la distance ne change pas) ;
 *   - quand elle est acculée au mur, elle quitte le couloir et réapparaît à l'autre bout ;
 *   - si tu tournes le dos, elle te suit ;
 *   - une fois au seuil : OUVRIR, RESTER ou RECULER. Rester est un vrai choix.
 *
 * Tous les textes sont dans TEXT, les réglages dans CONFIG.
 */

window.roomInteractions = window.roomInteractions || {};

window.roomInteractions[17] = {
  mount(container) {
    let active = true;
    let mode = "move";                       // "move" | "choice"
    let busy = false;
    const timers = [];
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --------------------------------------------
    // RÉGLAGES
    // --------------------------------------------

    const CONFIG = {
      length: 24,          // positions du couloir : 0 à 24
      startPlayer: 9,
      startDoor: 19,       // distance de départ : 10
      followSteps: 2,      // pas de la porte quand tu lui tournes le dos
      storageKey: "rhl-room17-crossed"
    };

    // --------------------------------------------
    // TEXTES
    // --------------------------------------------

    const TEXT = {
      intro:
        "THE THRESHOLD.\n" +
        "ONE CORRIDOR. ONE DOOR.\n" +
        "THE DOOR IS EXACTLY WHERE IT SHOULD BE.",
      introBack:
        "WELCOME BACK.\n" +
        "THE DOOR REMEMBERS YOU.\n" +
        "IT PRETENDS IT DOESN'T.",
      again:
        "THE CORRIDOR RESETS.\n" +
        "THE DOOR IS EXACTLY WHERE IT SHOULD BE.\n" +
        "(IT IS NOT.)",
      // marcher vers la porte (le dernier message se répète)
      chase: [
        "YOU WALK TOWARD THE DOOR.",
        "THE DOOR IS FURTHER THAN IT APPEARS.",
        "DISTANCE TO THRESHOLD: UNCHANGED.",
        "THE SYSTEM ASSURES YOU: THE DOOR IS RIGHT THERE.\nTHE DOOR DISAGREES.",
        "IT WAS RIGHT THERE.\nIT IS NOW OVER THERE.",
        "PERSISTENCE NOTED.\nPERSISTENCE IS NOT A KEY."
      ],
      // tourner le dos à la porte (les messages tournent)
      follow: [
        "YOU TURN AWAY.\nTHE DOOR NOTICES.",
        "THE DOOR FOLLOWS.\nIT PRETENDS IT IS JUST WALKING THIS WAY.",
        "THE DOOR IS CURIOUS.",
        "THE DOOR IS CLOSER THAN IT APPEARS."
      ],
      // une fois la porte "calmée"
      free: [
        "THE DOOR WAITS.",
        "THE DOOR HAS STOPPED PLAYING.",
        "THE DOOR SEEMS RELIEVED.",
        "NO TRICKS. PROBABLY."
      ],
      wall: [
        "WALL.\nTHE SYSTEM IS PROUD OF IT.",
        "STILL A WALL.",
        "THE CORRIDOR ENDS HERE.\nTHE DOOR DOES NOT."
      ],
      vanish:
        "THE DOOR HAS LEFT THE CORRIDOR.\n\n" +
        "IT IS NOW AT THE OTHER END.\n" +
        "IT WAS NEVER AT THE END YOU WERE WALKING TO.\n\n" +
        "THE DOOR IS NO LONGER RUNNING.\n" +
        "YOU MAY APPROACH.",
      threshold:
        "THRESHOLD REACHED.\n\n" +
        "THE DOOR IS HERE.\n" +
        "THE CHOICE IS YOURS.",
      stay: [
        "THRESHOLD OCCUPIED.\nNOTHING HAPPENS.\nNOTHING IS ALSO A CHOICE.",
        "STILL HERE.\nTHE DOOR IS FLATTERED.",
        "THE SYSTEM HAS STOPPED TAKING NOTES.\nYOU MAY STAY AS LONG AS YOU LIKE.\nYOU MAY ALSO LEAVE."
      ],
      back:
        "YOU STEP BACK.\n" +
        "THE DOOR DOES NOT CHASE YOU.\n" +
        "THE DOOR DOES NOT NEED TO.",
      open:
        "THE DOOR OPENS.\n\n" +
        "BEHIND IT: THE SAME CORRIDOR.\n\n" +
        "DIFFERENCE DETECTED:\n" +
        "THIS TIME, YOU CHOSE."
    };

    const pickLast  = (arr, i) => arr[Math.min(i, arr.length - 1)];
    const pickCycle = (arr, i) => arr[i % arr.length];

    // mémoire entre deux visites (silencieuse si le navigateur la bloque, ex. dans Notion)
    const store = {
      get() { try { return window.localStorage.getItem(CONFIG.storageKey) === "1"; } catch (e) { return false; } },
      set() { try { window.localStorage.setItem(CONFIG.storageKey, "1"); } catch (e) { /* ignoré */ } }
    };

    // --------------------------------------------
    // ÉTAT DU JEU
    // --------------------------------------------

    const L = CONFIG.length;
    let s;

    function resetState() {
      s = {
        p: CONFIG.startPlayer, d: CONFIG.startDoor, dir: 1,
        phase: "chase",                      // "chase" | "free" | "threshold"
        steps: 0, chase: 0, follow: 0, free: 0, wall: 0, stays: 0
      };
    }

    resetState();

    // --------------------------------------------
    // INTERFACE
    // --------------------------------------------

    function el(tag, css, text) {
      const e = document.createElement(tag);
      if (css) e.style.cssText = css;
      if (text) e.textContent = text;
      return e;
    }

    const fx = el("style");
    fx.textContent = `
      @keyframes r17-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
      @keyframes r17-glow {
        0%,100% { box-shadow: 0 0 14px rgba(79,227,255,.55), inset 0 0 10px rgba(79,227,255,.3); }
        50%     { box-shadow: 0 0 24px rgba(79,227,255,.9),  inset 0 0 16px rgba(79,227,255,.5); }
      }
      @keyframes r17-glitch {
        0%   { transform: translateX(-6px); filter: brightness(1.8); }
        20%  { transform: translateX(7px) skewX(-8deg); filter: brightness(.6); }
        40%  { transform: translateX(-4px); filter: brightness(1.5); }
        60%  { transform: translateX(5px) skewX(5deg); filter: brightness(.8); }
        80%  { transform: translateX(-2px); filter: brightness(1.3); }
        100% { transform: none; filter: none; }
      }
      .r17-pulse   { animation: r17-pulse 1.6s ease-in-out infinite; }
      .r17-door    { animation: r17-glow 2.6s ease-in-out infinite; }
      .r17-reached { border-color: #bff6ff !important; box-shadow: 0 0 30px rgba(150,245,255,.95), inset 0 0 18px rgba(150,245,255,.6) !important; animation: none !important; }
      .r17-open    { background: linear-gradient(to bottom, rgba(235,255,255,.95), rgba(79,227,255,.6)) !important;
                     box-shadow: 0 0 46px rgba(190,250,255,1) !important; animation: none !important; }
      .r17-glitch  { animation: r17-glitch .45s steps(2, end); }
      .r17-btn { transition: background .15s, box-shadow .15s; }
      .r17-btn:hover:not(.r17-busy) { background: #21553a !important; box-shadow: 0 0 14px rgba(105,216,155,.5); }
      .r17-btn:active:not(.r17-busy) { transform: translateY(1px); }
      .r17-btn.r17-busy { opacity: .45; cursor: default !important; }
      @media (prefers-reduced-motion: reduce) {
        .r17-pulse, .r17-door, .r17-glitch { animation: none !important; }
        .r17-mover { transition: none !important; }
      }
    `;

    const terminal = el("section", `
      position: relative; overflow: hidden; padding: 12px 6px;
      background: #07130e; color: #d5f6df; font-family: monospace; text-align: center;
      border: 1px solid #285c3c; border-radius: 8px;
    `);

    const indicator = el("p", `color:#69d89b; font-size:11px; letter-spacing:1px; margin: 8px 0 14px;`);

    // couloir
    const corridor = el("div", `
      position: relative; height: 124px; overflow: hidden; margin: 0 4px;
      border: 1px solid #285c3c; border-radius: 6px;
      background: linear-gradient(to bottom, #040b08 0%, #0a1a12 70%, #0f2a1c 100%);
    `);
    corridor.setAttribute("aria-hidden", "true");

    const floor = el("div", `
      position: absolute; left: 0; right: 0; bottom: 0; height: 18px;
      background: repeating-linear-gradient(to right, rgba(105,216,155,.10) 0 2px, transparent 2px 22px), #0b2217;
      border-top: 1px solid #285c3c;
    `);

    const door = el("div", `
      position: absolute; bottom: 18px; width: 34px; height: 66px; transform: translateX(-50%);
      border: 2px solid #4fe3ff; border-radius: 4px 4px 0 0;
      background: linear-gradient(to bottom, rgba(79,227,255,.22), rgba(79,227,255,.05));
      transition: left .32s ease, opacity .25s, box-shadow .3s;
    `);
    door.className = "r17-door r17-mover";
    door.appendChild(el("div", `position:absolute; right:5px; top:34px; width:5px; height:5px; border-radius:50%; background:#bff6ff;`));

    const player = el("div", `
      position: absolute; bottom: 18px; width: 20px; height: 48px; transform: translateX(-50%);
      transition: left .28s ease;
    `);
    player.className = "r17-mover";
    const figure = el("div", `position: relative; width: 100%; height: 100%; transition: transform .15s;`);
    figure.appendChild(el("div", `position:absolute; left:4px; top:0; width:12px; height:12px; border-radius:50%; background:#d9f6ff; box-shadow:0 0 8px rgba(217,246,255,.6);`));
    figure.appendChild(el("div", `position:absolute; left:2px; top:14px; width:16px; height:32px; border-radius:8px 8px 3px 3px; background:#d9f6ff; box-shadow:0 0 8px rgba(217,246,255,.45);`));
    player.appendChild(figure);

    corridor.append(floor, door, player);

    // Hauteur stable : toutes les phrases possibles sont superposées (invisibles) dans la même
    // cellule de grille, qui prend donc la hauteur de la plus longue, quelle que soit la largeur.
    const screenBox = el("div", `
      display: grid; margin-top: 12px; padding: 16px 10px; white-space: pre-line;
      line-height: 1.8; font-size: 13px; overflow-wrap: anywhere;
      border-top: 1px solid #285c3c; border-bottom: 1px solid #285c3c;
    `);
    const sizer = el("div", `grid-area: 1 / 1; display: grid; visibility: hidden; pointer-events: none;`);
    sizer.setAttribute("aria-hidden", "true");
    [TEXT.intro, TEXT.introBack, TEXT.again, ...TEXT.chase, ...TEXT.follow, ...TEXT.free, ...TEXT.wall,
     TEXT.vanish, TEXT.threshold, ...TEXT.stay, TEXT.back, TEXT.open]
      .forEach(t => sizer.appendChild(el("div", `grid-area: 1 / 1;`, t)));

    const screen = el("div", `grid-area: 1 / 1;`);
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");
    screenBox.append(sizer, screen);

    const stats = el("p", `font-size: 11px; letter-spacing: 1px; color: #69d89b; margin: 10px 0 0; opacity: .85;`);

    const actions = el("div", `padding: 14px 8px 4px;`);

    terminal.append(fx, indicator, corridor, screenBox, stats, actions);
    container.appendChild(terminal);

    const BTN_CSS = `
      flex: 1; min-height: 48px; padding: 12px; background: #173c29; color: #e2f8e9;
      border: 1px solid #69d89b; border-radius: 6px; cursor: pointer;
      font-family: monospace; font-size: 12px; letter-spacing: .5px; white-space: normal;
    `;

    function makeButton(label, handler) {
      const b = el("button", BTN_CSS, label);
      b.type = "button";
      b.className = "r17-btn";
      b.addEventListener("click", () => { if (active) handler(); });
      return b;
    }

    // --------------------------------------------
    // AFFICHAGE
    // --------------------------------------------

    const pct = pos => 5 + 90 * pos / L;

    function setIndicator(text) {
      indicator.textContent = text;
      indicator.classList.toggle("r17-pulse", text.startsWith("●"));
    }

    function say(text) { screen.textContent = text; }

    function render() {
      player.style.left = pct(s.p) + "%";
      door.style.left = pct(s.d) + "%";
      figure.style.transform = "scaleX(" + s.dir + ")";
      stats.textContent = "STEPS: " + s.steps + "   DISTANCE TO THRESHOLD: " + Math.abs(s.d - s.p);
    }

    function glitch() {
      if (reducedMotion) return;
      corridor.classList.remove("r17-glitch");
      void corridor.offsetWidth;
      corridor.classList.add("r17-glitch");
      later(() => corridor.classList.remove("r17-glitch"), 450);
    }

    let moveButtons = [];

    function showMoveButtons() {
      mode = "move";
      const row = el("div", `display: flex; gap: 10px;`);
      const left = makeButton("◀  WALK LEFT", () => move(-1));
      const right = makeButton("WALK RIGHT  ▶", () => move(1));
      moveButtons = [left, right];
      row.append(left, right);
      actions.replaceChildren(row);
      return right;
    }

    function setBusy(on) {
      busy = on;                                  // pas de "disabled" : le focus clavier est conservé
      moveButtons.forEach(b => {
        b.classList.toggle("r17-busy", on);
        b.setAttribute("aria-disabled", String(on));
      });
    }

    function showChoices(list) {
      mode = "choice";
      const col = el("div", `display: flex; flex-direction: column; gap: 10px;`);
      list.forEach(([label, handler]) => col.appendChild(makeButton(label, handler)));
      actions.replaceChildren(col);
      if (col.firstElementChild) col.firstElementChild.focus({ preventScroll: true });
    }

    // clavier : flèches, A/Q (gauche), D (droite) — AZERTY et QWERTY
    terminal.addEventListener("keydown", event => {
      if (!active || mode !== "move" || busy) return;
      const k = String(event.key).toLowerCase();
      if (k === "arrowleft" || k === "a" || k === "q") { event.preventDefault(); move(-1); }
      else if (k === "arrowright" || k === "d") { event.preventDefault(); move(1); }
    });

    // --------------------------------------------
    // RÈGLES
    // --------------------------------------------

    function move(dir) {
      if (!active || busy || mode !== "move" || s.phase === "threshold") return;
      s.dir = dir;

      const np = Math.max(0, Math.min(L, s.p + dir));
      if (np === s.p) {
        say(pickLast(TEXT.wall, s.wall++));
        render();
        return;
      }

      const toward = Math.sign(s.d - s.p) === dir;   // la porte est du côté où tu marches
      s.p = np;
      s.steps++;

      let message;

      if (s.phase === "chase") {
        if (toward) {
          const nd = s.d + dir;
          if (nd < 0 || nd > L) { vanish(dir); return; }        // acculée : elle disparaît
          s.d = nd;                                              // elle recule d'un pas
          message = pickLast(TEXT.chase, s.chase++);
          if (s.chase >= 2) setIndicator("● DOOR LOCATION: UNCERTAIN");
        } else {
          const toPlayer = Math.sign(s.p - s.d);                 // elle te suit
          const gap = Math.abs(s.p - s.d);
          s.d += toPlayer * Math.min(CONFIG.followSteps, Math.max(0, gap - 1));
          message = pickCycle(TEXT.follow, s.follow++);
        }
      } else {                                                   // phase "free"
        if (toward) {                                            // elle vient à ta rencontre
          const toPlayer = Math.sign(s.p - s.d);
          if (Math.abs(s.p - s.d) > 1) s.d += toPlayer;
        }
        message = pickCycle(TEXT.free, s.free++);
      }

      if (Math.abs(s.d - s.p) <= 1) { reachThreshold(); return; }

      say(message);
      render();
    }

    function vanish(dir) {
      setBusy(true);
      s.phase = "free";
      setIndicator("● DOOR LOCATION: UPDATED");
      say(TEXT.vanish);
      render();
      glitch();
      door.style.opacity = "0";

      later(() => {
        s.d = dir > 0 ? 0 : L;
        render();
        door.style.opacity = "1";
        setBusy(false);
      }, reducedMotion ? 0 : 650);
    }

    function reachThreshold() {
      s.phase = "threshold";
      render();
      door.classList.add("r17-reached");
      setIndicator("● THRESHOLD REACHED");
      say(TEXT.threshold);
      showChoices([
        ["OPEN THE DOOR", open],
        ["STAY ON THE THRESHOLD", stay],
        ["STEP BACK", stepBack]
      ]);
    }

    function stay() {
      say(pickLast(TEXT.stay, s.stays++));
    }

    function stepBack() {
      const away = s.d >= s.p ? -1 : 1;
      s.p = Math.max(0, Math.min(L, s.p + away * 4));
      s.phase = "free";
      door.classList.remove("r17-reached");
      setIndicator("● THRESHOLD SYSTEM ONLINE");
      say(TEXT.back);
      render();
      showMoveButtons().focus({ preventScroll: true });
    }

    function open() {
      store.set();
      door.classList.add("r17-open");
      setIndicator("◈ THRESHOLD CROSSED");
      say(TEXT.open);
      glitch();
      showChoices([["WALK AGAIN", restart]]);
    }

    function restart() {
      door.classList.remove("r17-open", "r17-reached");
      resetState();
      setIndicator("● THRESHOLD SYSTEM ONLINE");
      say(TEXT.again);
      render();
      showMoveButtons().focus({ preventScroll: true });
    }

    // --------------------------------------------
    // DÉMARRAGE
    // --------------------------------------------

    setIndicator("● THRESHOLD SYSTEM ONLINE");
    say(store.get() ? TEXT.introBack : TEXT.intro);
    render();
    showMoveButtons().focus({ preventScroll: true });

    // --------------------------------------------
    // NETTOYAGE
    // --------------------------------------------

    return () => {
      active = false;
      timers.forEach(id => clearTimeout(id));
      terminal.remove();
    };
  }
};
