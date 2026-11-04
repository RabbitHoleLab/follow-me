window.roomInteractions ??= {};

window.roomInteractions[1] = {
  mount(container) {
    // Create the room's interface here.
    container.textContent = "OBSERVATION SYSTEM ONLINE.";

    // Optional cleanup when leaving the room.
    return () => {
      // Stop animations, remove listeners, etc.
    };
  }
};
