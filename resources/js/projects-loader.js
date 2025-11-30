// Load projects from JSON and populate the grid
document.addEventListener("DOMContentLoaded", () => {
  const projGrid = document.querySelector(".proj-grid");

  if (!projGrid) return; // Exit if no proj-grid element

  console.log("Starting to load projects...");
  fetch("resources/data/projects.json")
    .then((response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok) throw new Error("Failed to load projects.json: " + response.status);
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

        item.innerHTML = `
          <div class="overlay">
            <div class="overlay-content">
              <h2>${project.title}</h2>
              <p>${project.shortDesc}</p>
            </div>
          </div>
        `;

        projGrid.appendChild(item);
      });

      // Re-attach lightbox click handlers to newly created items
      attachLightboxHandlers();
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
      projGrid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: #999;">Error loading projects. Please check resources/data/projects.json</p>';
    });
});

// Function to attach lightbox click handlers (call after DOM elements are created)
function attachLightboxHandlers() {
  const backdrop = document.getElementById("lightbox-backdrop");
  if (!backdrop) return;

  const lbImg = backdrop.querySelector(".lightbox-img");
  const lbTitle = backdrop.querySelector(".lightbox-title");
  const lbDesc = backdrop.querySelector(".lightbox-desc");
  const closeBtn = backdrop.querySelector(".lightbox-close");
  let lastFocused = null;

  function openLightbox(item) {
    lastFocused = document.activeElement;
    const img = item.dataset.img || "";
    const title = item.dataset.title || "";
    const desc = item.dataset.desc || "";

    lbImg.src = img;
    lbImg.alt = title;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;

    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  // Attach click handlers to all project items
  document.querySelectorAll(".proj-grid .item").forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
    item.style.cursor = "pointer";
    item.tabIndex = 0;
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  // Backdrop click closes
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  // Escape key closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("active"))
      closeLightbox();
  });
}
