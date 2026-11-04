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
 
    const map = document.getElementById("map");
    const dialog = document.getElementById("archive");

    rooms.forEach(([number, x, y, width, height]) => {
      const button = document.createElement("button");
      button.className = "room";
      button.style.left = x + "%";
      button.style.top = y + "%";
      button.style.width = width + "%";
      button.style.height = height + "%";
      button.setAttribute("aria-label", "Room " + number);
      button.title = "Room " + number;

      button.addEventListener("click", () => {
        document.getElementById("room-title").textContent =
          "ROOM " + String(number).padStart(2, "0");

        document.getElementById("room-text").textContent =
          window.roomContent[number] ||
          "UNDER CONSTRUCTION. This archive is not yet available.";

        dialog.showModal();
      });

      map.appendChild(button);
    });

    document.getElementById("close").onclick = () => dialog.close();

    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });//map


    const viewport = document.getElementById("map-viewport");
    
    // Return to the previous page, when possible.
    document.getElementById("back").addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "../";
      }
    });
    
    // Reset map position.
    document.getElementById("reset-view").addEventListener("click", () => {
      viewport.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth"
      });
    });

