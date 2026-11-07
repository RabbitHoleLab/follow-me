
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 13 — THE MISSING PERSON DEPARTMENT
 */

window.roomInteractions ??= {};

window.roomInteractions[13] = {
  mount(container) {
    let active = true;
    let selected = 0;
    let located = false;

    const viewed = new Set();

    const files = [
      {
        id: "001",
        name: "THE MODEL EMPLOYEE",
        status: "MISSING",
        body:
          "LAST SEEN FOLLOWING EVERY INSTRUCTION.\n\n" +
          "SUBJECT STOPPED ASKING WHY."
      },
      {
        id: "002",
        name: "THE PERFECT NEIGHBOR",
        status: "MISSING",
        body:
          "LAST SEEN SMILING FOR AN AUDIENCE " +
          "THAT WAS NOT THERE.\n\n" +
          "SUBJECT COULD NOT REMEMBER WHO WAS WATCHING."
      },
      {
        id: "003",
        name: "THE GOOD STUDENT",
        status: "MISSING",
        body:
          "LAST SEEN SEARCHING FOR THE CORRECT ANSWER.\n\n" +
          "THE QUESTION HAD NEVER BEEN ASKED."
      },
      {
        id: "004",
        name: "THE OBEDIENT CITIZEN",
        status: "MISSING",
        body:
          "LAST SEEN WAITING FOR PERMISSION TO LEAVE.\n\n" +
          "THE DOOR WAS UNLOCKED."
      },
      {
        id: "005",
        name: "YOU",
        status: "UNLOCATED",
        body:
          "LAST SEEN READING THIS FILE.\n\n" +
          "IDENTITY: NOT ASSIGNED.\n\n" +
          "NEXT ACTION: UNKNOWN."
      }
    ];

    const terminal = document.createElement("section");
    terminal.style.cssText = `
      background: #14140f;
      border: 1px solid #817352;
      border-radius: 8px;
      padding: 16px 12px;
      color: #ece2c8;
      font-family: monospace;
      text-align: center;
    `;

    const heading = document.createElement("div");
    heading.textContent = "MISSING PERSON ARCHIVE // UNIT 13";
    heading.style.cssText = `
      color: #c7b48b;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 16px;
    `;

    const folder = document.createElement("div");
    folder.style.cssText = `
      height: 185px;
      box-sizing: border-box;
      overflow-y: auto;
      padding: 16px 10px;
      background: #252318;
      border: 1px solid #766745;
      border-radius: 5px;
      white-space: pre-line;
      line-height: 1.8;
      font-size: 12px;
    `;
    folder.setAttribute("role", "status");
    folder.setAttribute("aria-live", "polite");

    const filesGrid = document.createElement("div");
    filesGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      margin-top: 15px;
    `;

    const response = document.createElement("div");
    response.style.cssText = `
      height: 95px;
      box-sizing: border-box;
      overflow-y: auto;
      margin-top: 14px;
      padding: 10px 8px;
      color: #c7b48b;
      white-space: pre-line;
      line-height: 1.7;
      font-size: 11px;
    `;

    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    `;

    function makeButton(label, callback) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = `
        min-height: 44px;
        padding: 10px;
        background: #343023;
        color: #f1e6c9;
        border: 1px solid #9b8962;
        border-radius: 5px;
        font-family: monospace;
        font-size: 11px;
        cursor: pointer;
      `;

      button.addEventListener("click", () => {
        if (active) callback();
      });

      return button;
    }

    function renderFile() {
      const file = files[selected];

      folder.textContent =
        "ARCHIVE FILE " + file.id + "\n" +
        "SUBJECT: " + file.name + "\n" +
        "STATUS: " +
        (selected === 4 && located ? "LOCATED" : file.status) +
        "\n\n" +
        file.body;

      if (selected === 4 && located) {
        folder.textContent +=
          "\n\nSUBJECT LOCATED.\n" +
          "NO FURTHER CLASSIFICATION REQUIRED.";
      }

      folder.scrollTop = 0;
    }

    function renderGrid() {
      filesGrid.replaceChildren();

      const unlocked = viewed.size === 4;

      files.forEach((file, index) => {
        if (index === 4 && !unlocked) return;

        const button = makeButton(
          "FILE " + file.id,
          () => {
            selected = index;

            if (index < 4) {
              viewed.add(index);
            }

            renderGrid();
            renderFile();
            renderActions();
          }
        );

        if (selected === index) {
          button.style.background = "#625438";
        }

        filesGrid.appendChild(button);
      });
    }

    function renderActions() {
      actions.replaceChildren();

      if (selected === 4 && !located) {
        actions.appendChild(
          makeButton("I AM HERE", () => {
            located = true;
            response.textContent =
              "IDENTITY CONFIRMED.\n\n" +
              "SUBJECT HAS CLAIMED THEIR OWN EXISTENCE.";
            renderFile();
            renderActions();
          })
        );
      } else if (selected === 4 && located) {
        actions.appendChild(
          makeButton("REOPEN ARCHIVE", restart)
        );
      }
    }

    function restart() {
      if (!active) return;

      selected = 0;
      located = false;
      viewed.clear();
      viewed.add(0);

      response.textContent =
        "ARCHIVE ACCESS GRANTED.\n\n" +
        "FOUR MISSING PERSON FILES AVAILABLE.";

      renderGrid();
      renderFile();
      renderActions();
    }

    terminal.append(
      heading,
      folder,
      filesGrid,
      response,
      actions
    );

    container.appendChild(terminal);

    restart();

    return () => {
      active = false;
      terminal.remove();
    };
  }
};
