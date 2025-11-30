// Lightbox modal functionality - used for both work experience and projects
function initialiseLightbox() {
  const backdrop = document.getElementById("lightbox-backdrop");
  if (!backdrop) return;

  const lbImg = backdrop.querySelector(".lightbox-img");
  const lbTitle = backdrop.querySelector(".lightbox-title");
  const lbDesc = backdrop.querySelector(".lightbox-desc");
  const lbSkills = backdrop.querySelector(".lightbox-skills");
  const closeBtn = backdrop.querySelector(".lightbox-close");
  let lastFocused = null;

  function openLightbox(item) {
    lastFocused = document.activeElement;
    const img = item.dataset.img || "";
    const title = item.dataset.title || "";
    const desc = item.dataset.desc || "";
    const skills = item.dataset.skills || "";

    lbImg.src = img;
    lbImg.alt = title;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    lbSkills.textContent = skills;

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

  function attachClickHandlers(selector) {
    document.querySelectorAll(selector).forEach((item) => {
      // Remove existing listeners by cloning (to avoid duplicates)
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener("click", () => openLightbox(newItem));
      newItem.style.cursor = "pointer";
      newItem.tabIndex = 0;
      newItem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(newItem);
        }
      });
    });
  }

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

  // Focus trap
  document.addEventListener(
    "focus",
    (e) => {
      if (!backdrop.classList.contains("active")) return;
      if (!backdrop.contains(e.target)) {
        e.stopPropagation();
        closeBtn.focus();
      }
    },
    true
  );

  // Return function to attach handlers to new items
  return attachClickHandlers;
}

// Initialise on page load
document.addEventListener("DOMContentLoaded", () => {
  const attachClickHandlers = initialiseLightbox();
  // Attach to work experience items
  attachClickHandlers(".work-grid .item");
});
