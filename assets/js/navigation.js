document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("about-follow-me");
  if (!link) return;

  link.addEventListener("click", (event) => {
    const visited = sessionStorage.getItem("about-visited");

    if (visited === "yes") {
      event.preventDefault();
      window.location.href = "URL_NOTION";
    } else {
      sessionStorage.setItem("about-visited", "yes");
    }
  });
});
