(function () {
  const BRAND =
    '<span class="haze-brand" data-haze-brand><img src="/images/brand/logo.png" alt="Haze" /><img class="haze-brand-green" src="/images/brand/logo-verde.png" alt="" /></span>';

  function boxes() {
    return document.querySelectorAll(
      '[data-framer-name="Logo + Menu Icon"] [data-framer-name="Logo"] [data-framer-component-type="SVG"], [data-framer-name="CTA"] [data-framer-name="Logo"] [data-framer-component-type="SVG"], [data-framer-name="Footer"] [data-framer-name="Logo"] [data-framer-component-type="SVG"]'
    );
  }

  function ensure() {
    boxes().forEach((box) => {
      if (box.querySelector("[data-haze-brand]")) return;
      box.setAttribute("data-haze-brand-box", "");
      box.innerHTML = BRAND;
    });
    document.querySelectorAll('[data-framer-name="CTA"] [data-framer-name="Logo"] p, [data-framer-name="Footer"] [data-framer-name="Logo"] p').forEach((node) => {
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (text !== "Haze") node.textContent = "Haze";
    });
    document.querySelectorAll("img[src*='framerusercontent.com'], img[srcset*='framerusercontent.com']").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const next = src.replace(/https?:\/\/framerusercontent\.com\/images\/([^?]+)/, "/images/framer/$1");
      if (next && next !== src && !next.endsWith("/")) img.setAttribute("src", next.split("?")[0]);
      const set = img.getAttribute("srcset");
      if (set && set.includes("framerusercontent.com")) {
        img.setAttribute(
          "srcset",
          set.replace(/https?:\/\/framerusercontent\.com\/images\/([^?\s,]+)/g, "/images/framer/$1")
        );
      }
    });
  }

  if (!window.__hazeBrandMove) {
    window.__hazeBrandMove = true;
    document.addEventListener(
      "pointermove",
      (event) => {
        document.querySelectorAll("[data-haze-brand]").forEach((brand) => {
          if (brand.closest("nav")) return;
          const green = brand.querySelector(".haze-brand-green");
          if (!green) return;
          const rect = brand.getBoundingClientRect();
          const inside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          if (!inside) {
            green.style.setProperty("--hx", "-80px");
            green.style.setProperty("--hy", "-80px");
            return;
          }
          green.style.setProperty("--hx", event.clientX - rect.left + "px");
          green.style.setProperty("--hy", event.clientY - rect.top + "px");
        });
      },
      { passive: true }
    );
  }

  window.HazeBrand = { ensure };
})();
