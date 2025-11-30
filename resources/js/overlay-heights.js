// Measure each .overlay-content height and set a CSS variable on the parent .item
// so the overlay reveal can translate up by the exact content height.
function updateOverlayHeights() {
  document.querySelectorAll(".item").forEach((item) => {
    const content = item.querySelector(".overlay-content");
    const title = item.querySelector(".overlay-content h2");
    if (!content) return;
    // Use scrollHeight to include padding and wrapped text reliably
    const contentHeight = Math.ceil(content.scrollHeight);
    // Measure the title height (h2). Use getBoundingClientRect for precise fractional values
    const titleHeight = title
      ? Math.ceil(title.getBoundingClientRect().height)
      : 0;
    // const titleHeight = Math.ceil(title.scrollHeight);
    // bottom spacing applied to .title in CSS (keep in sync with CSS bottom value)
    const titleBottomSpacing = 46; // px
    // add a small buffer so the content doesn't butt up against the title
    const buffer = 12;
    // set two CSS variables: visible height for overlay content and title space
    item.style.setProperty(
      "--overlay-visible-height",
      contentHeight + buffer + "px"
    );
    item.style.setProperty(
      "--title-space",
      titleHeight + titleBottomSpacing + "px"
    );
  });
}

// Debounce helper
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  updateOverlayHeights();

  // Wait for images to load, then recalculate
  // This fixes the issue where background images haven't loaded yet
  if (document.readyState === "loading") {
    window.addEventListener("load", updateOverlayHeights);
  } else {
    // Page already fully loaded
    window.addEventListener("load", updateOverlayHeights);
  }

  // Small delay as additional safety measure
  setTimeout(updateOverlayHeights, 500);

  // update on resize (debounced)
  window.addEventListener("resize", debounce(updateOverlayHeights, 120));

  // observe mutations inside overlay-content (useful if you dynamically change text)
  const observer = new MutationObserver(debounce(updateOverlayHeights, 80));
  document.querySelectorAll(".item .overlay-content").forEach((node) => {
    observer.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
});
