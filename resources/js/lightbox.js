document.addEventListener("DOMContentLoaded", () => {
  const backdrop = document.getElementById("lightbox-backdrop");
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

    // focus on close button for accessibility
    closeBtn.focus();
  }

  function closeLightbox() {
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  // attach click handlers to items
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", (e) => {
      // if a link inside item is clicked, let it handle navigation
      openLightbox(item);
    });
    item.style.cursor = "pointer";
    // make keyboard accessible
    item.tabIndex = 0;
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  // backdrop click closes if clicked outside the modal
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("active"))
      closeLightbox();
  });

  // simple focus trap: keep focus inside modal while open
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
});
