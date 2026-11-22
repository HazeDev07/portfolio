(function () {
  const COLOR = "#02311d";

  function start(canvas) {
    if (canvas.__hazeLoop) return;
    canvas.__hazeLoop = true;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const streaks = [];
    const dots = [];
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function seed() {
      streaks.length = 0;
      dots.length = 0;
      const count = Math.round(width / 14);
      for (let i = 0; i < count; i++) {
        streaks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          len: 40 + Math.random() * 180,
          speed: 0.35 + Math.random() * 1.8,
          w: Math.random() < 0.15 ? 2.2 : 0.6 + Math.random() * 1.1,
          drift: (Math.random() - 0.5) * 0.25,
          alpha: 0.08 + Math.random() * 0.38,
        });
      }
      for (let i = 0; i < Math.round(width / 18); i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.3,
          speed: 0.2 + Math.random() * 0.9,
          alpha: 0.15 + Math.random() * 0.55,
        });
      }
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx.fillStyle = COLOR;
      ctx.fillRect(0, 0, width, height);
      ctx.lineCap = "round";
      for (const s of streaks) {
        if (!reduced) {
          s.y += s.speed;
          s.x += s.drift;
        }
        if (s.y - s.len > height) {
          s.y = -s.len;
          s.x = Math.random() * width;
        }
        const grad = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
        grad.addColorStop(0, "rgba(0,255,174,0)");
        grad.addColorStop(0.55, `rgba(170,255,220,${s.alpha})`);
        grad.addColorStop(1, "rgba(0,255,174,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.w;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.len);
        ctx.lineTo(s.x + s.drift * 12, s.y);
        ctx.stroke();
      }
      for (const d of dots) {
        if (!reduced) d.y += d.speed;
        if (d.y > height) d.y = -4;
        ctx.fillStyle = `rgba(210,255,235,${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      const glow = ctx.createRadialGradient(width * 0.5, height * 0.42, width * 0.1, width * 0.5, height * 0.5, width * 0.72);
      glow.addColorStop(0, "rgba(0,255,174,0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      const shade = ctx.createLinearGradient(0, height * 0.62, 0, height);
      shade.addColorStop(0, "rgba(2,49,29,0)");
      shade.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, width, height);
    }

    resize();
    draw();
    const observer = new ResizeObserver(() => {
      resize();
      draw();
    });
    observer.observe(canvas.parentElement);
    if (reduced) return;
    function loop() {
      if (!canvas.isConnected) {
        canvas.__hazeLoop = false;
        observer.disconnect();
        return;
      }
      draw();
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
    hero.querySelectorAll("video").forEach((video) => {
      video.style.setProperty("display", "none", "important");
    });
    let host = hero.querySelector("[data-haze='lightfall']");
    if (!host) {
      const slot = hero.querySelector(".framer-1n4jtxs-container") || hero;
      host = document.createElement("div");
      host.className = "haze-lightfall-host";
      host.dataset.haze = "lightfall";
      slot.appendChild(host);
    }
    if (!host.querySelector("canvas.haze-lightfall")) {
      const canvas = document.createElement("canvas");
      canvas.className = "haze-lightfall";
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      start(canvas);
    }
  }

  window.HazeLightfall = { ensure };
})();
