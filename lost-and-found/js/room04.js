
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 04 — CONTROL PANEL
 */

window.roomInteractions ??= {};

window.roomInteractions[4] = {
  mount(container) {
    let active = true;
    let attempts = 0;
    let released = false;

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #08140f;
      border: 1px solid #31583f;
      border-radius: 8px;
      padding: 14px 10px;
      color: #d5f6df;
      font-family: monospace;
      font-size: 12px;
      text-align: center;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      color: #8dd2a5;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 12px;
    `;

    const controls = document.createElement("div");
    controls.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    const status = document.createElement("div");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = `
      border-top: 1px solid #31583f;
      margin-top: 10px;
      padding: 10px 4px;
      color: #8dd2a5;
      white-space: pre-line;
      line-height: 1.5;
      min-height: 90px;
      height: auto;
      overflow: visible;
    `;

    const actions = document.createElement("div");
    actions.style.marginTop = "12px";

    terminal.append(header, controls, status, actions);
    container.appendChild(terminal);

    const values = {
      REALITY: 50,
      FREEDOM: 50,
      TRUTH: 50
    };

    function makeButton(label, callback) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;

      button.style.cssText = `
        display: block;
        width: 100%;
        min-height: 44px;
        padding: 10px;
        color: #d5f6df;
        background: #173c29;
        border: 1px solid #69d89b;
        border-radius: 6px;
        font-family: monospace;
        font-size: 12px;
        cursor: pointer;
      `;

      button.addEventListener("click", () => {
        if (active) callback();
      });

      return button;
    }

    function buildControls() {
      controls.replaceChildren();
      actions.replaceChildren();

      header.textContent =
        "ENVIRONMENT CONTROL PANEL // ONLINE";

      status.textContent =
        "ALL PARAMETERS WITHIN ACCEPTABLE LIMITS.";

      for (const name of Object.keys(values)) {
        const group = document.createElement("div");

        const label = document.createElement("label");
        label.style.cssText = `
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        `;

        const nameText = document.createElement("span");
        nameText.textContent = name;

        const valueText = document.createElement("span");
        valueText.textContent = values[name] + "%";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.step = "5";
        slider.value = String(values[name]);

        slider.style.cssText = `
          width: 100%;
          accent-color: #69d89b;
          cursor: pointer;
        `;

        label.append(nameText, valueText);
        label.htmlFor = "r4-" + name;
        slider.id = "r4-" + name;

        slider.addEventListener("input", () => {
          if (!active || released) return;

          values[name] = Number(slider.value);
          valueText.textContent = values[name] + "%";

          attempts++;

          status.textContent =
            "PARAMETER: " + name + "\n" +
            "CHANGE ACCEPTED.\n" +
            "ENVIRONMENT UNCHANGED.";

          if (attempts >= 3 && !actions.hasChildNodes()) {
            actions.appendChild(
              makeButton("RELEASE CONTROL", release)
            );
          }
        });

        group.append(label, slider);
        controls.appendChild(group);
      }
    }

    function release() {
      released = true;

      header.textContent =
        "ENVIRONMENT CONTROL PANEL // OFFLINE";

      controls.replaceChildren();
      actions.replaceChildren();

      status.textContent =
        "CONTROL RELEASED.\n\n" +
        "NO PARAMETERS REQUIRED.\n" +
        "NO PERMISSION NECESSARY.\n\n" +
        "YOU MAY CONTINUE.";

      actions.appendChild(
        makeButton("RESTART PANEL", restart)
      );
    }

    function restart() {
      released = false;
      attempts = 0;

      values.REALITY = 50;
      values.FREEDOM = 50;
      values.TRUTH = 50;

      buildControls();
    }

    buildControls();

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
