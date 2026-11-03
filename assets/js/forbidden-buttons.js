/*
 * FORBIDDEN ROUTES
 * Every completed journey reveals another decoy.
 * The routes are public Easter eggs, not a security mechanism.
 */
const forbiddenRoutes = Object.freeze([
  { label: "DO NOT CLICK HERE", href: "ABSOLUTELY_NOT_THE_EXIT/" },
  { label: "RESTRICTED ACCESS", href: "DO_NOT_OPEN/escape.html" },
  { label: "CLASSIFIED — KEEP OUT", href: "CLASSIFIED/README.md" },
  { label: "DO NOT FOLLOW THIS", href: "here/here/here/here/here/read.md" },
  { label: "THE TRUTH IS FORBIDDEN", href: "THE_TRUTH/FINAL_ANSWER.txt" },
  { label: "RECOVERY FILE DETECTED", href: "SYSTEM_BACKUP/old_exit.txt" },
  { label: "SYSTEM CORE — DO NOT REASSEMBLE", href: "SYSTEM_CORE/README.md" }
]);

function renderForbiddenRoutes(completedJourneys) {
  const container = document.getElementById("forbidden-routes");
  if (!container) return;
  const count = Math.min(forbiddenRoutes.length, Math.max(1, completedJourneys + 1));
  container.replaceChildren();
  for (const route of forbiddenRoutes.slice(0, count)) {
    const link = document.createElement("a");
    link.className = "forbidden-route";
    link.href = route.href;
    link.textContent = route.label;
    container.append(link);
  }
}
