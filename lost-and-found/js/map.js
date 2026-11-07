
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * Interactive map controller
 *
 * Coordinates are calibrated.
 * Do not modify them unless the map image changes.
 */

// ==================================================
// 1. ROOM COORDINATES
// ==================================================

const rooms = [
  // [number, centerX%, centerY%, width%, height%]

  [1, 21.93, 22.55, 6.5, 14],
  [2, 32.33, 22.18, 11, 16],
  [3, 43.00, 22.68, 9, 15],
  [4, 53.50, 22.50, 9, 15],
  [5, 63.60, 21.93, 8, 15],
  [6, 74.13, 22.80, 10, 14],

  [7, 75.27, 40.89, 8, 12],
  [8, 60.00, 41.50, 16, 12],

  [9, 59.00, 58.73, 13, 12],
  [10, 73.53, 59.85, 14, 13],

  [11, 34.27, 77.82, 12, 18],
  [12, 47.50, 80.00, 14, 17],
  [13, 20.00, 70.26, 12, 16],
  [14, 21.13, 53.65, 9, 10],
  [15, 30.47, 42.50, 10, 12],

  [16, 77.13, 77.45, 9, 14],
  [17, 65.07, 79.92, 12, 14]
];

// ==================================================
// 2. CONFIGURATION
// ==================================================

// Add a room number when its interactive script exists.
// Example: new Set([1, 2, 3])
const interactiveRooms = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16]);

const map = document.getElementById("map");
const dialog = document.getElementById("archive");
const roomTitle = document.getElementById("room-title");
const roomText = document.getElementById("room-text");
const closeButton = document.getElementById("close");
const backButton = document.getElementById("back");

// Cache script loading promises to avoid duplicates.
const roomLoads = new Map();

// Cleanup function supplied by the active room.
let cleanupInteraction = null;

// Prevent outdated asynchronous loads from opening.
let clickToken = 0;

// ==================================================
// 3. LOAD INTERACTIVE ROOM
// ==================================================

function loadRoomScript(number) {
  if (window.roomInteractions?.[number]) {
    return Promise.resolve(true);
  }

  if (roomLoads.has(number)) {
    return roomLoads.get(number);
  }

  const promise = new Promise(resolve => {
    const script = document.createElement("script");

    script.src =
      "js/room" + String(number).padStart(2, "0") + ".js";

    script.onload = () => {
      resolve(Boolean(window.roomInteractions?.[number]));
    };

    script.onerror = () => {
      console.error("Unable to load room:", number);
      resolve(false);
    };

    document.head.appendChild(script);
  });

  roomLoads.set(number, promise);

  // Allow retry if loading fails.
  promise.then(success => {
    if (!success) {
      roomLoads.delete(number);
    }
  });

  return promise;
}

// ==================================================
// 4. CLEAN UP CURRENT INTERACTION
// ==================================================

function clearInteraction() {
  if (typeof cleanupInteraction === "function") {
    try {
      cleanupInteraction();
    } catch (error) {
      console.error("Room cleanup error:", error);
    }
  }

  cleanupInteraction = null;

  const old = document.getElementById("room-interactive");

  if (old) {
    old.remove();
  }
}

// ==================================================
// 5. MOUNT ROOM INTERFACE
// ==================================================

function mountInteraction(number) {
  const box = document.createElement("div");

  box.id = "room-interactive";
  roomText.insertAdjacentElement("afterend", box);

  try {
    const interaction = window.roomInteractions[number];

    const cleanup = interaction.mount(box);

    cleanupInteraction =
      typeof cleanup === "function" ? cleanup : null;

  } catch (error) {
    console.error("Room interaction error:", error);

    box.textContent =
      "SYSTEM ERROR. THIS ROOM IS TEMPORARILY UNAVAILABLE.";

    cleanupInteraction = null;
  }
}

// ==================================================
// 6. OPEN ROOM
// ==================================================

async function openRoom(number) {
  const token = ++clickToken;

  // Close the previous room before loading another.
  if (dialog.open) {
    dialog.close();
  }

  clearInteraction();

  roomTitle.textContent =
    "ROOM " + String(number).padStart(2, "0");

  // ROOM 05 — the waiting room has no visible CLOSE button.
  closeButton.hidden = number === 5;
  closeButton.style.display = number === 5 ? "none" : "";
  
  roomText.textContent = "";
 

  // Interactive room
  if (interactiveRooms.has(number)) {
    roomText.textContent = "ACCESSING ARCHIVE...";

    const loaded = await loadRoomScript(number);

    // Ignore outdated requests.
    if (token !== clickToken) return;

    if (loaded && window.roomInteractions?.[number]) {
      roomText.textContent = "";

      mountInteraction(number);

      dialog.showModal();
      return;
    }

    roomText.textContent =
      "CONNECTION FAILED. ARCHIVE TEMPORARILY UNAVAILABLE.";

  } else {
    // Standard room
    roomText.textContent =
      window.roomContent?.[number] ||
      "UNDER CONSTRUCTION. This archive is not yet available.";
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}

// ==================================================
// 7. CREATE CLICKABLE ROOM ZONES
// ==================================================

rooms.forEach(([number, x, y, width, height]) => {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "room";

  button.style.left = x + "%";
  button.style.top = y + "%";
  button.style.width = width + "%";
  button.style.height = height + "%";

  button.setAttribute("aria-label", "Room " + number);
  button.title = "Room " + number;

  button.addEventListener("click", () => {
    openRoom(number);
  });

  map.appendChild(button);
});

// ==================================================
// 8. CLOSE ROOM
// ==================================================

function closeRoom() {
  // Invalidate any pending script load.
  ++clickToken;
  closeButton.hidden = false;
  closeButton.style.display = "";
  
  if (dialog.open) {
    dialog.close();
  }

  clearInteraction();
}

closeButton.addEventListener("click", closeRoom);

// Click outside the dialog.
dialog.addEventListener("click", event => {
  if (event.target === dialog) {
    closeRoom();
  }
});

// Escape key or native dialog closing.
dialog.addEventListener("close", () => {
  ++clickToken;
  clearInteraction();
});

// ==================================================
// 9. EXIT NAVIGATION
// ==================================================

const isEmbedded = window.self !== window.top;

if (isEmbedded) {
  // Hide navigation inside embedded environments.
  backButton.hidden = true;
  backButton.style.display = "none";
} else {
  // Navigation available in standalone mode.
  backButton.textContent = "← NOWHERE";

  backButton.addEventListener("click", () => {
    window.location.href = "../";
  });
}
