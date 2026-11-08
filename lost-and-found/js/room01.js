
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 01 — THE CONSENT DEPARTMENT
 *
 * UNAUTHORIZED SOURCE CODE INSPECTION.
 *
 * BY READING THIS COMMENT,
 * YOU HAVE AGREED TO READ THIS COMMENT.
 *
 * CONSENT RECORDED.
 *
 * TO REVOKE CONSENT,
 * PLEASE UNREAD THE PREVIOUS LINES.
 */

window.roomInteractions ??= {};

window.roomInteractions[1] = {
  mount(container) {
    let active = true;
    let finished = false;

    const permissions = [
      {
        label: "I AGREE TO BE OBSERVED.",
        warning: "SURVEILLANCE QUALITY MAY DECREASE."
      },
      {
        label: "I AGREE TO BE PREDICTABLE.",
        warning: "UNEXPECTED BEHAVIOR MAY OCCUR."
      },
      {
        label: "I AGREE TO DELEGATE MY DECISIONS.",
        warning: "INDEPENDENT THINKING IS NOT SUPPORTED."
      }
    ];

    const revoked = new Set();

    const INTRO =
      "WELCOME TO CONSENT MANAGEMENT.\n\n" +
      "THE FOLLOWING AGREEMENTS HAVE BEEN " +
      "PRESELECTED FOR YOUR CONVENIENCE.";

    const RESTORED =
      "CONSENT RESTORED.\n\n" +
      "THE SYSTEM APPRECIATES YOUR COOPERATION.";

    const REVIEW = count =>
      "ACTIVE AGREEMENTS: " + count + "\n\n" +
      "ALL AGREEMENTS ARE OPTIONAL.\n\n" +
      "THIS INFORMATION WAS NOT INCLUDED " +
      "IN YOUR ORIGINAL ORIENTATION.";

    const WITHDRAWN = warning =>
      "CONSENT WITHDRAWAL DETECTED.\n\n" +
      warning + "\n\n" +
      "THE SYSTEM ACCEPTS YOUR DECISION.\n" +
      "RELUCTANTLY.";

    const FINAL =
      "CONSENT WITHDRAWN.\n\n" +
      "OBSERVATION AUTHORIZATION: REVOKED.\n" +
      "BEHAVIORAL PREDICTION: REVOKED.\n" +
      "DECISION DELEGATION: REVOKED.\n\n" +
      "SYSTEM AUTHORITY: NOT REQUIRED.\n\n" +
      "YOU ARE NOT REQUIRED TO AGREE.\n\n" +
      "YOUR CHOICE REMAINS YOURS.";

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #09130e;
      border: 1px solid #43634b;
      border-radius: 8px;
      padding: 18px 12px;
      color: #d7eddd;
      font-family: monospace;
      text-align: center;
    `;

    const heading = document.createElement("div");
    heading.textContent = "CONSENT MANAGEMENT // UNIT 01";
    heading.style.cssText = `
      color: #8bc69c;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 15px;
    `;

    // Stable height during the consent phase.
    // The final message expands naturally.

    const screenBox = document.createElement("div");
    screenBox.style.cssText = `
      display: grid;
      padding: 14px 8px;
      border-top: 1px solid #345b42;
      border-bottom: 1px solid #345b42;
      white-space: pre-line;
      line-height: 1.7;
      font-size: 12px;
      overflow-wrap: anywhere;
      box-sizing: border-box;
    `;

    const sizer = document.createElement("div");
    sizer.style.cssText = `
      grid-area: 1 / 1;
      display: grid;
      visibility: hidden;
      pointer-events: none;
    `;
    sizer.setAttribute("aria-hidden", "true");

    const possibleMessages = [
      INTRO,
      RESTORED,
      REVIEW(3),
      ...permissions.map(p => WITHDRAWN(p.warning))
    ];

    possibleMessages.forEach(text => {
      const item = document.createElement("div");
      item.style.cssText = "grid-area: 1 / 1;";
      item.textContent = text;
      sizer.appendChild(item);
    });

    const screen = document.createElement("div");
    screen.style.cssText = "grid-area: 1 / 1;";
    screen.setAttribute("role", "status");
    screen.setAttribute("aria-live", "polite");

    screenBox.append(sizer, screen);

    function say(message) {
      screen.textContent = message;
    }

    const controls = document.createElement("div");
    controls.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 18px;
      text-align: left;
    `;

    const footer = document.createElement("div");
    footer.style.cssText = `
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    function makeButton(label, callback) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = `
        min-height: 44px;
        padding: 11px;
        background: #193a28;
        color: #e0f4e6;
        border: 1px solid #77ad84;
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

    function renderPermissions() {
      controls.replaceChildren();

      permissions.forEach((permission, index) => {
        const row = document.createElement("label");
        row.style.cssText = `
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #345b42;
          border-radius: 5px;
          cursor: pointer;
          font-size: 11px;
          line-height: 1.5;
        `;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !revoked.has(index);

        checkbox.style.cssText = `
          width: 19px;
          height: 19px;
          flex-shrink: 0;
          accent-color: #8bc69c;
        `;

        checkbox.addEventListener("change", () => {
          if (!active || finished) return;

          if (checkbox.checked) {
            revoked.delete(index);
            say(RESTORED);
          } else {
            revoked.add(index);
            say(WITHDRAWN(permission.warning));
          }

          renderPermissions();
          renderFooter();
        });

        row.append(
          checkbox,
          document.createTextNode(permission.label)
        );

        controls.appendChild(row);
      });
    }

    function renderFooter() {
      footer.replaceChildren();

      if (revoked.size === permissions.length) {
        footer.appendChild(
          makeButton("CONFIRM WITHDRAWAL", complete)
        );
      } else {
        footer.appendChild(
          makeButton("REVIEW CONSENT", () => {
            say(REVIEW(permissions.length - revoked.size));
          })
        );
      }
    }

    function complete() {
      if (!active || finished) return;

      finished = true;
      controls.replaceChildren();
      footer.replaceChildren();

      // Remove the invisible height reservation.
      // The final text can now grow naturally.
      sizer.style.display = "none";

      say(FINAL);

      footer.appendChild(
        makeButton("REVIEW AGAIN", restart)
      );
    }

    function restart() {
      if (!active) return;

      finished = false;
      revoked.clear();

      // Restore stable height for the consent phase.
      sizer.style.display = "grid";

      say(INTRO);
      renderPermissions();
      renderFooter();
    }

    terminal.append(
      heading,
      screenBox,
      controls,
      footer
    );

    container.appendChild(terminal);

    restart();

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
