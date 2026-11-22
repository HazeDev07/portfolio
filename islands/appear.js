(function () {
  function show(el) {
    if (el.closest("[data-framer-name='Half'], [data-framer-name='Full']")) return;
    const style = el.getAttribute("style") || "";
    const hidden = /opacity:\s*0(?:\.001)?(?![.\d])/.test(style);
    const shift = /translateY\(/.test(style);
    if (!hidden && !shift && !el.hasAttribute("data-framer-appear-id")) return;
    el.style.opacity = "1";
    el.style.transform = "none";
  }

  function ensure() {
    document.querySelectorAll("[data-framer-appear-id], [style*='opacity:0']").forEach(show);
  }

  window.HazeAppear = { ensure };
})();
