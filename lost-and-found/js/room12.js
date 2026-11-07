
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 12 — DO NOT TOUCH
 */

window.roomInteractions ??= {};

window.roomInteractions[12] = {
  mount(container) {
    let active = true;
    let touches = 0;

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #10120d;
      border: 1px solid #8b7843;
      border-radius: 8px;
      padding: 20px 14px;
      color: #eee3bd;
      font-family: monospace;
      text-align: center;
    `;

    const heading = document.createElement("div");
    heading.textContent = "ARTIFACT CONTAINMENT // UNIT 12";
    heading.style.cssText = `
      color: #d5bb70;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 18px;
    `;

    const object = document.createElement("button");
    object.type = "button";
    object.setAttribute("aria-label", "Touch the artifact");
    object.textContent = "◇";
    object.style.cssText = `
      display: block;
      width: 116px;
      height: 116px;
      margin: 0 auto 18px;
      border: 1px solid #c6a85c;
      border-radius: 18px;
      background: radial-gradient(
        circle,
        #d5b86c 0%,
        #705522 40%,
        #18180f 85%
      );
      color: #fff0ad;
      font-size: 68px;
      cursor: pointer;
      box-shadow: 0 0 28px #c9a04b55;
      transition: transform 150ms, box-shadow 150ms;
    `;

    const screen = document.createElement("div");
    screen.style.cssText = `
      min-height: 140px;
      padding: 16px 8px;
      border-top: 1px solid #67592f;
      white-space: pre-line;
      line-height: 1.8;
      font-size: 12px;
    `;
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "RESET EXPERIMENT";
    reset.style.cssText = `
      display: none;
      margin: 16px auto 0;
      min-height: 44px;
      padding: 10px 18px;
      border: 1px solid #8b7843;
      border-radius: 5px;
      background: #292516;
      color: #eee3bd;
      font-family: monospace;
      cursor: pointer;
    `;

    const messages = [
      "OBJECT STATUS: STABLE.\n\n" +
      "DO NOT TOUCH THE ARTIFACT.\n\n" +
      "THIS IS NOT A SUGGESTION.",

      "WARNING.\n\n" +
      "UNAUTHORIZED PHYSICAL CONTACT DETECTED.\n\n" +
      "PLEASE REFRAIN FROM BEING CURIOUS.",

      "CRITICAL VIOLATION.\n\n" +
      "YOU HAVE COMPROMISED AN EXPERIMENT " +
      "THAT HAS BEEN RUNNING FOR 847 YEARS.\n\n" +
      "YOUR APOLOGY HAS BEEN AUTOMATICALLY REJECTED.",

      "EMERGENCY PROTOCOL ACTIVATED.\n\n" +
      "EVACUATING NONESSENTIAL PERSONNEL.\n\n" +
      "ALL PERSONNEL HAVE BEEN CLASSIFIED " +
      "AS NONESSENTIAL.",

      "FINAL REPORT.\n\n" +
      "THE ARTIFACT WAS NOT CONNECTED TO ANYTHING.\n\n" +
      "OBJECT STATUS: UNCHANGED.\n" +
      "SECURITY RESPONSE: EXCESSIVE.\n\n" +
      "THANK YOU FOR PARTICIPATING IN " +
      "AN EXPERIMENT THAT DID NOT EXIST."
    ];

    function render() {
      screen.textContent = messages[touches];
      reset.style.display = touches === 4 ? "block" : "none";
      object.style.transform =
        touches > 0 && touches < 4
          ? `rotate(${touches * 12}deg)`
          : "none";
    }

    function touchArtifact() {
      if (!active || touches >= 4) return;
      touches++;
      render();
    }

    function resetExperiment() {
      if (!active) return;
      touches = 0;
      render();
    }

    object.addEventListener("click", touchArtifact);
    reset.addEventListener("click", resetExperiment);

    terminal.append(heading, object, screen, reset);
    container.appendChild(terminal);

    render();

    return () => {
      active = false;
      object.removeEventListener("click", touchArtifact);
      reset.removeEventListener("click", resetExperiment);
      terminal.remove();
    };
  }
};
