"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 14 — LOST PROPERTY
 *
 * Le bureau des objets trouvés : six objets "prêtés" au joueur (histoire, rôle, opinion...).
 * Il choisit pour chacun GARDER (bleu) ou RENDRE (rouge). Aucune réponse n'est la bonne.
 * Puis une étiquette vierge : "SOMETHING YOU LOST". Rien n'est enregistré ni envoyé.
 * Discret : un réveil bloqué sur 01:08 (touche SNOOZE).
 *
 * Installation :
 *   1. ce fichier dans js/room14.js
 *   2. dans map.js : const interactiveRooms = new Set([1, 14, 17]);
 *
 * Tous les textes sont dans TEXT, les réglages dans CONFIG.
 */

window.roomInteractions = window.roomInteractions || {};

window.roomInteractions[14] = {
  mount(container) {
    let active = true;
    const timers = [];
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const CONFIG = {
      maxNote: 40,          // longueur max de ce que le joueur peut écrire
      revealMs: 1100        // pause entre les phrases de la fin
    };

    // --------------------------------------------
    // TEXTES
    // --------------------------------------------

    const TEXT = {
      intro:
        "LOST PROPERTY.\n" +
        "ITEMS FOUND IN THIS ROOM: 6.\n" +
        "OWNER: NOT RECORDED.\n\n" +
        "THE DESK IS NOT ACCUSING ANYONE.\n" +
        "(THE DESK HAS A LIST.)",

      items: [
        {
          ask:  "A STORY ABOUT WHO YOU SHOULD BE BY NOW.",
          keep: "KEPT.\nSOME STORIES ARE USEFUL.\nTHE DESK ONLY ASKS THAT YOU KNOW WHO WROTE IT.",
          ret:  "RETURNED.\nTHE STORY GOES BACK ON THE SHELF.\nIT SEEMS FINE WITH IT."
        },
        {
          ask:  "A SCRIPT PAGE:\nYOUR LINES FOR TODAY.",
          keep: "KEPT.\nYOU MAY IMPROVISE.\nTHE SCRIPT HAS NEVER BEEN ENFORCED.\n(IT IS VERY CONVINCING.)",
          ret:  "RETURNED.\nTHE SCRIPT LOOKS AROUND FOR ANOTHER ACTOR.\nTHE STAGE IS QUIET."
        },
        {
          ask:  "AN OPINION YOU DON'T REMEMBER CHOOSING.",
          keep: "KEPT.\nPLEASE CHECK THE LABEL.\nSOMEONE ELSE'S HANDWRITING MAY BE ON IT.",
          ret:  "RETURNED.\nYOU CAN PICK IT UP AGAIN AT ANY TIME.\nTHE DESK IS ALWAYS OPEN."
        },
        {
          ask:  "THE RULE:\nEVERYONE ELSE KNOWS WHAT THEY'RE DOING.",
          keep: "KEPT.\nTHE DESK MUST INFORM YOU:\nTHIS RULE IS A RUMOR.",
          ret:  "RETURNED.\nTHANK YOU.\nTHE DESK HAS BEEN IMPROVISING SINCE 2026."
        },
        {
          ask:  "A VOICE THAT SOUNDS LIKE YOURS.\nIT SPEAKS WITHOUT BEING ASKED.",
          keep: "KEPT.\nYOU MAY ASK IT TO USE A KINDER TONE.\nIT SOMETIMES LISTENS.",
          ret:  "RETURNED.\nTHE SILENCE IS NOT EMPTY.\nIT IS MOSTLY YOU."
        },
        {
          ask:  "A FUTURE, PRE-FILLED.\nSIGNATURE REQUIRED.",
          keep: "KEPT.\nSIGNATURE NOT FOUND.\nTHE FORM ACCEPTS A PENCIL.",
          ret:  "RETURNED.\nTHE FORM IS NOW BLANK.\nBLANK FORMS ARE ALLOWED."
        }
      ],

      label: "ITEM 07 / 07\n\nSOMETHING YOU LOST:",
      labelHint: "(OPTIONAL. NOTHING YOU WRITE HERE LEAVES THIS PAGE.)",

      // le réveil bloqué sur 01:08 (les messages tournent)
      clock: [
        "SNOOZE: 9 MINUTES. TIME REMAINS 01:08.",
        "SNOOZE AGAIN? THE CLOCK ADMIRES YOUR OPTIMISM.",
        "THE ALARM IS NOT BROKEN. IT IS WAITING.",
        "01:08."
      ]
    };

    // --------------------------------------------
    // ÉTAT
    // --------------------------------------------

    let index = 0;
    let kept = 0;
    let returned = 0;
    let clockCount = 0;
    let noteTimer = null;

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
      @keyframes r14-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
      @keyframes r14-flicker { 0%,90%,100% { opacity: 1; } 92% { opacity: .35; } 94% { opacity: 1; } 96% { opacity: .55; } }
      @keyframes r14-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
      .r14-pulse   { animation: r14-pulse 1.6s ease-in-out infinite; }
      .r14-clock   { animation: r14-flicker 5s infinite; }
      .r14-fade    { animation: r14-in .35s ease-out; }
      .r14-btn { transition: filter .15s, box-shadow .15s; }
      .r14-btn:hover:not(:disabled)  { filter: brightness(1.25); box-shadow: 0 0 14px currentColor; }
      .r14-btn:active:not(:disabled) { transform: translateY(1px); }
      .r14-btn:disabled { opacity: .45; cursor: default !important; }
      .r14-input:focus-visible { outline: 2px solid #69d89b; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) {
        .r14-pulse, .r14-clock, .r14-fade { animation: none !important; }
      }
    `;

    const terminal = el("section", `
      position: relative; overflow: hidden; padding: 12px 6px;
      background: #07130e; color: #d5f6df; font-family: monospace; text-align: center;
      border: 1px solid #285c3c; border-radius: 8px;
    `);

    // en-tête : table de chevet + réveil
    const header = el("div", `display: flex; justify-content: space-between; align-items: center; padding: 0 8px;`);
    header.appendChild(el("span", `font-size: 10px; letter-spacing: 1px; color: #69d89b; opacity: .8;`, "NIGHTSTAND // LOST PROPERTY"));

    const clock = el("button", `
      font-family: monospace; font-size: 15px; letter-spacing: 2px; cursor: pointer;
      color: #ff5a5a; background: #1a0a0a; border: 1px solid #5a2020; border-radius: 4px;
      padding: 4px 8px; text-shadow: 0 0 8px rgba(255,70,70,.8);
    `, "01:08");
    clock.type = "button";
    clock.className = "r14-clock";
    clock.title = "SNOOZE";
    clock.setAttribute("aria-label", "Alarm clock, stuck at 01:08. Press to snooze.");
    header.appendChild(clock);

    const clockNote = el("p", `font-size: 10px; letter-spacing: .5px; color: #d99; margin: 6px 8px 0; min-height: 14px; text-align: right;`);
    clockNote.setAttribute("aria-live", "polite");

    const indicator = el("p", `color: #69d89b; font-size: 11px; letter-spacing: 1px; margin: 12px 0 12px;`);

    const screen = el("div", `
      min-height: 150px; max-height: 260px; overflow: auto; margin: 0 4px; padding: 18px 12px;
      white-space: pre-line; line-height: 1.8; font-size: 13px; overflow-wrap: anywhere;
      border: 1px dashed #3f8a5d; border-radius: 6px; background: rgba(10, 30, 20, .55);
    `);
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    const stats = el("p", `font-size: 11px; letter-spacing: 1px; color: #69d89b; margin: 10px 0 0; opacity: .85;`);

    const actions = el("div", `padding: 14px 8px 4px;`);

    terminal.append(fx, header, clockNote, indicator, screen, stats, actions);
    container.appendChild(terminal);

    const BTN_BASE = `
      flex: 1; min-height: 48px; padding: 12px 18px; cursor: pointer;
      font-family: monospace; font-size: 12px; letter-spacing: .8px; white-space: normal;
    `;
    const BTN_STYLE = {
      plain: BTN_BASE + `background: #173c29; color: #e2f8e9; border: 1px solid #69d89b; border-radius: 6px;`,
      blue:  BTN_BASE + `background: #12306b; color: #e6f0ff; border: 1px solid #5da0ff; border-radius: 999px;`,
      red:   BTN_BASE + `background: #5a1520; color: #ffe6ea; border: 1px solid #ff6b7d; border-radius: 999px;`
    };

    function makeButton(label, kind, handler) {
      const b = el("button", BTN_STYLE[kind], label);
      b.type = "button";
      b.className = "r14-btn";
      b.addEventListener("click", () => { if (active) handler(); });
      return b;
    }

    function row(...buttons) {
      const r = el("div", `display: flex; gap: 12px;`);
      r.append(...buttons);
      return r;
    }

    function setActions(...nodes) {
      const col = el("div", `display: flex; flex-direction: column; gap: 10px;`);
      col.append(...nodes);
      actions.replaceChildren(col);
      return col;
    }

    function setIndicator(text) {
      indicator.textContent = text;
      indicator.classList.toggle("r14-pulse", text.startsWith("●"));
    }

    function say(text) {
      screen.textContent = text;
      screen.scrollTop = screen.scrollHeight;
      if (!reducedMotion) {
        screen.classList.remove("r14-fade");
        void screen.offsetWidth;
        screen.classList.add("r14-fade");
      }
    }

    function pad(n) { return String(n).padStart(2, "0"); }

    function setStats() {
      stats.textContent = index >= TEXT.items.length
        ? "ITEMS PROCESSED: " + TEXT.items.length + "/" + TEXT.items.length
        : "ITEMS PROCESSED: " + index + "/" + TEXT.items.length;
    }

    // --------------------------------------------
    // LE RÉVEIL
    // --------------------------------------------

    clock.addEventListener("click", () => {
      if (!active) return;
      clockNote.textContent = TEXT.clock[clockCount % TEXT.clock.length];
      clockCount++;
      clearTimeout(noteTimer);
      noteTimer = later(() => { clockNote.textContent = ""; }, 6000);
    });

    // --------------------------------------------
    // PARCOURS
    // --------------------------------------------

    function start() {
      index = 0; kept = 0; returned = 0;
      setIndicator("● LOST PROPERTY OFFICE — OPEN");
      setStats();
      say(TEXT.intro);
      setActions(makeButton("BEGIN INVENTORY", "plain", () => showItem())).firstElementChild.focus({ preventScroll: true });
    }

    function showItem() {
      const item = TEXT.items[index];
      setIndicator("● INVENTORY: " + pad(index + 1) + " / " + pad(TEXT.items.length));
      setStats();
      say("ITEM " + pad(index + 1) + " / 07\n\n" + item.ask);
      const keepBtn = makeButton("KEEP", "blue", () => choose("keep"));
      const retBtn  = makeButton("RETURN", "red", () => choose("ret"));
      setActions(row(keepBtn, retBtn));
      keepBtn.focus({ preventScroll: true });
    }

    function choose(kind) {
      const item = TEXT.items[index];
      if (kind === "keep") kept++; else returned++;
      index++;
      setStats();
      say(item[kind]);
      const last = index >= TEXT.items.length;
      const next = makeButton(last ? "FINAL ITEM  ▶" : "NEXT ITEM  ▶", "plain", () => (last ? showLabel() : showItem()));
      setActions(next);
      next.focus({ preventScroll: true });
    }

    function showLabel() {
      setIndicator("● FORM 07: PENDING");
      say(TEXT.label);

      const input = el("input", `
        width: 100%; box-sizing: border-box; padding: 12px; text-align: center;
        font-family: monospace; font-size: 14px; letter-spacing: 1px;
        background: #04100a; color: #e2f8e9; border: 1px solid #69d89b; border-radius: 6px;
      `);
      input.className = "r14-input";
      input.type = "text";
      input.maxLength = CONFIG.maxNote;
      input.setAttribute("autocomplete", "off");
      input.setAttribute("spellcheck", "false");
      input.setAttribute("aria-label", "Something you lost (optional, stays on this page)");
      input.placeholder = "...";

      const hint = el("p", `font-size: 10px; letter-spacing: .5px; color: #69d89b; opacity: .8; margin: 0;`, TEXT.labelHint);

      const file = () => finale(input.value.trim());
      const fileBtn  = makeButton("FILE IT", "plain", file);
      const blankBtn = makeButton("LEAVE IT BLANK", "plain", () => finale(""));
      input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); file(); } });

      setActions(input, hint, row(fileBtn, blankBtn));
      input.focus({ preventScroll: true });
    }

    function finaleGroups(note) {
      return [
        note
          ? "FILED: \u201C" + note + "\u201D\nNOTHING YOU WRITE HERE LEAVES THIS PAGE."
          : "FORM LEFT BLANK.\nBLANK FORMS ARE ALLOWED.\nSOME THINGS ARE NOT LOST. THEY ARE ONLY QUIET.",
        "NOTHING IS MISSING.\nIT WAS WAITING FOR YOU TO STOP LOOKING ELSEWHERE.",
        "ITEMS KEPT: " + kept + "   ITEMS RETURNED: " + returned + "\nNEITHER NUMBER IS THE RIGHT ONE.",
        "THE WHITE RABBIT WAS NEVER LEADING YOU.\nIT WAS KEEPING YOU COMPANY."
      ];
    }

    function finale(note) {
      setIndicator("◈ FILE CLOSED");
      actions.replaceChildren();
      const groups = finaleGroups(note);
      const shown = [];

      (function next(k) {
        if (!active) return;
        shown.push(groups[k]);
        say(shown.join("\n\n"));

        if (k + 1 < groups.length) {
          later(() => next(k + 1), reducedMotion ? 0 : CONFIG.revealMs);
        } else {
          const again = makeButton("BACK TO THE DESK", "plain", start);
          setActions(again);
          again.focus({ preventScroll: true });
        }
      })(0);
    }

    // --------------------------------------------
    // DÉMARRAGE / NETTOYAGE
    // --------------------------------------------

    start();

    return () => {
      active = false;
      timers.forEach(id => clearTimeout(id));
      terminal.remove();
    };
  }
};
