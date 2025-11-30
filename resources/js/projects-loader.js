// Load projects from JSON and populate the grid
document.addEventListener("DOMContentLoaded", () => {
  const projGrid = document.querySelector(".proj-grid");

  if (!projGrid) return; // Exit if no proj-grid element

  console.log("Starting to load projects...");
  fetch("resources/data/projects.json")
    .then((response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok)
        throw new Error("Failed to load projects.json: " + response.status);
      return response.json();
    })
    .then((projects) => {
      console.log("Projects loaded successfully:", projects);
      // Clear existing placeholder items
      projGrid.innerHTML = "";

      // Create and append grid items from JSON
      projects.forEach((project) => {
        const item = document.createElement("div");
        item.className = "item";
        item.style.backgroundImage = `url('${project.image}')`;
        item.dataset.img = project.image;
        item.dataset.title = project.title;
        item.dataset.desc = project.fullDesc;
        item.dataset.skills = project.skills;

        item.innerHTML = `
          <div class="overlay">
            <div class="overlay-content">
              <h2>${project.title}</h2>
              <p>${project.shortDesc}</p>
              <div class="overlay-instruction">Click to learn more!</div>
            </div>
          </div>
        `;

        projGrid.appendChild(item);
      });

      // Re-attach lightbox handlers to newly created project items
      // initialiseLightbox() is defined in lightbox.js
      if (typeof initialiseLightbox === "function") {
        const attachClickHandlers = initialiseLightbox();
        attachClickHandlers(".proj-grid .item");
      }
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
      projGrid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: #999;">Error loading projects. Please check resources/data/projects.json</p>';
    });
});
