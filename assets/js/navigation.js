document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("about-follow-me");
  if (!link) return;

  link.addEventListener("click", (event) => {
    const visited = sessionStorage.getItem("about-visited");

    if (visited === "yes") {
      event.preventDefault();
      window.location.href = "https://follow-me-project.notion.site/FOLLOW-ME-40d166c9793280fcaefde86877d599d5";
    } else {
      sessionStorage.setItem("about-visited", "yes");
    }
  });
});
