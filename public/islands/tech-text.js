(function () {
  const TEXT = "Haze Dev";
  const GLYPHS = "01HXZ#/<>";

  function start(canvas, h1) {
    if (canvas.__hazeLoop) return;
    canvas.__hazeLoop = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const started = performance.now();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let size = 64;

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      width = Math.max(280, rect.width);
      size = width < 640 ? 44 : width < 980 ? 58 : 68;
      height = Math.round(size * 1.35);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function shown(now) {
      if (motion) return TEXT;
      const t = (now - started) / 900;
      if (t >= 1) return TEXT;
      return [...TEXT]
        .map((char, i) => {
          if (char === " ") return " ";
          if (t > i / TEXT.length) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `600 ${size}px "Inter Display", Inter, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = shown(now);
      const x = width / 2;
      const y = height / 2 + size * 0.04;
      ctx.save();
      ctx.shadowColor = "rgba(0,255,174,0.28)";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#f7fffb";
      ctx.fillText(label, x, y);
      ctx.restore();
      if (!motion) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        const sweep = ((now / 2200) % 1) * (width + 120) - 60;
        const grad = ctx.createLinearGradient(sweep - 36, 0, sweep + 36, 0);
        grad.addColorStop(0, "rgba(0,255,174,0)");
        grad.addColorStop(0.5, "rgba(0,255,174,0.7)");
        grad.addColorStop(1, "rgba(0,255,174,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(sweep - 36, 0, 72, height);
        ctx.restore();
      }
      if (h1 && !h1.classList.contains("haze-sr-only")) h1.classList.add("haze-sr-only");
    }

    resize();
    draw(started);
    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    observer.observe(canvas.parentElement);
    if (motion) return;
    function loop(now) {
      if (!canvas.isConnected) {
        canvas.__hazeLoop = false;
        observer.disconnect();
        return;
      }
      draw(now);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function ensure() {
    const base = (window.__HAZE_BASE__ || "").replace(/\/$/, "");
    const path = (location.pathname || "/").replace(/\/$/, "") || "/";
    if (path !== "/" && path !== base) return;
    const hero = document.querySelector('[data-framer-name="Hero"]');
    if (!hero) return;
    const h1 = hero.querySelector("h1");
    if (!h1) return;
    if (h1.textContent.trim() !== TEXT) h1.textContent = TEXT;
    const host = h1.parentElement;
    if (!host) return;
    host.style.position = host.style.position || "relative";
    let canvas = host.querySelector("canvas.haze-tech-text");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "haze-tech-text";
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      start(canvas, h1);
    } else if (!h1.classList.contains("haze-sr-only")) {
      h1.classList.add("haze-sr-only");
    }
  }

  window.HazeTechText = { ensure };
})();
