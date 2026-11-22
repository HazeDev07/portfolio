(function () {
  function ensureHeader() {
    const narrow = window.matchMedia("(max-width: 809.98px)").matches;
    if (!narrow) {
      document.querySelectorAll("nav.haze-pc-header").forEach((node) => node.remove());
      return;
    }
    if (document.querySelector('nav[data-framer-name="Desktop Closed"]')) return;
    if (document.querySelector("nav.haze-pc-header")) return;
    const phone = document.querySelector('[data-framer-name="Phone Closed"]');
    const tpl = document.getElementById("haze-pc-header");
    const node = tpl && tpl.content && tpl.content.firstElementChild;
    if (!phone || !node || !phone.parentElement) return;
    phone.parentElement.insertBefore(node.cloneNode(true), phone);
  }

  function run() {
    ensureHeader();
    window.HazeHero?.ensure();
    window.HazeBrand?.ensure();
    window.HazeAppear?.ensure();
    window.HazeSteps?.ensure();
    if (window.HazeSolutions) window.HazeSolutions.ensure();
    if (window.HazeBenefits) window.HazeBenefits.ensure();
    if (window.HazeComparison) window.HazeComparison.ensure();
    if (window.HazeCloseout) window.HazeCloseout.ensure();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  }

  function whenFramer(done) {
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      done();
    };
    const main = document.querySelector('script[data-framer-bundle="main"]');
    if (main) main.addEventListener("load", go, { once: true });
    window.addEventListener("load", go, { once: true });
    setTimeout(go, 1600);
  }

  function whenQuiet(done) {
    const root = document.getElementById("main") || document.body;
    let timer;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      clearTimeout(cap);
      done();
    };
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(finish, 280);
    });
    observer.observe(root, { childList: true, subtree: true });
    timer = setTimeout(finish, 280);
    const cap = setTimeout(finish, 2000);
  }

  function revealHero() {
    document.documentElement.classList.add("haze-settled");
    const content = document.querySelector('[data-framer-name="Hero"] [data-framer-name="content"]');
    if (!content) return;
    content.style.transform = "none";
  }

  let badgeStarted = false;
  function startBadge() {
    if (badgeStarted) return;
    badgeStarted = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.add("haze-badge-in");
        window.setTimeout(() => {
          document.documentElement.classList.add("haze-badge-open");
        }, 760);
      });
    });
  }

  function present() {
    document.documentElement.classList.add("haze-ready");
  }

  function titleDrawn() {
    try {
      const canvas = document.querySelector("#haze-tech-text-root canvas");
      if (!(canvas instanceof HTMLCanvasElement) || canvas.width < 2) return false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const w = canvas.width;
      const h = canvas.height;
      const data = ctx.getImageData(Math.floor(w * 0.28), Math.floor(h * 0.32), Math.max(1, Math.floor(w * 0.44)), Math.max(1, Math.floor(h * 0.36))).data;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 16) return true;
      return false;
    } catch {
      return false;
    }
  }

  function whenShown(done) {
    const light = () => document.querySelector("#haze-lightfall-root canvas");
    const finish = () => {
      const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fonts.then(() => {
        const started = performance.now();
        const tick = () => {
          if (titleDrawn() || performance.now() - started > 900) {
            done();
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    if (light() && document.querySelector("#haze-tech-text-root canvas")) {
      finish();
      return;
    }
    const root = document.getElementById("main") || document.body;
    const observer = new MutationObserver(() => {
      if (!light() || !document.querySelector("#haze-tech-text-root canvas")) return;
      observer.disconnect();
      clearTimeout(cap);
      finish();
    });
    observer.observe(root, { childList: true, subtree: true });
    const cap = setTimeout(() => {
      observer.disconnect();
      finish();
    }, 1200);
  }

  function begin() {
    run();
    startBadge();
    const observer = new MutationObserver(schedule);
    observer.observe(document.getElementById("main") || document.body, { childList: true, subtree: true });
    whenFramer(() => {
      whenQuiet(() => {
        window.dispatchEvent(new Event("haze-settle"));
        run();
        revealHero();
        whenShown(present);
      });
    });
  }

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      if (link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      location.href = url.pathname + url.search + url.hash;
    },
    true
  );

  window.addEventListener("resize", ensureHeader);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin);
  else begin();
})();
