(function () {
  const TITLE = "Haze Dev";
  const DESC =
    "Desenvolvedor Full Stack. Crio sites, aplicações e sistemas com criatividade, atenção aos detalhes e propósito.";
  const DISCORD = "https://discord.com/channels/@me/1178377773321035807";
  const ICON =
    '<span class="haze-discord" data-haze="discord" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></span>';
  const TECH = [
    ["python", "Python"],
    ["javascript", "JavaScript"],
    ["typescript", "TypeScript"],
    ["react", "React"],
    ["nextjs", "Next.js"],
    ["nodejs", "Node.js"],
    ["docker", "Docker"],
    ["postgresql", "PostgreSQL"],
    ["redis", "Redis"],
    ["php", "PHP"],
    ["go", "Go"],
    ["tailwind", "Tailwind CSS"],
    ["git", "Git"],
    ["github", "GitHub"],
  ];

  function norm(value) {
    return (value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function rolling(label) {
    const chars = [...label];
    return chars
      .map((char, index) => {
        const value = char === " " ? "\u00a0" : char.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        return `<span style="--i:${index};--n:${chars.length}"><b data-char="${value}">${value}</b></span>`;
      })
      .join("");
  }

  function paintLink(link, label, href, blank) {
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    link.classList.add("haze-cta");
    if (!link.dataset.hazeRoll) {
      link.dataset.hazeRoll = "1";
      link.addEventListener("mouseenter", () => link.classList.add("haze-roll-on"));
      link.addEventListener("mouseleave", () => link.classList.remove("haze-roll-on"));
    }
    if (blank) {
      if (link.getAttribute("target") !== "_blank") link.setAttribute("target", "_blank");
      if (link.getAttribute("rel") !== "noopener noreferrer") link.setAttribute("rel", "noopener noreferrer");
    }
    const p = link.querySelector("p");
    if (!p) return;
    p.classList.add("haze-roll");
    if (p.getAttribute("data-haze-label") !== label || !p.querySelector("b[data-char]")) {
      p.innerHTML = rolling(label);
      p.setAttribute("data-haze-label", label);
    }
  }

  function marquee() {
    const icons = TECH.map(
      ([file, name]) => `<img class="haze-tech" data-tech="${file}" src="/images/tech/${file}.svg" alt="${name}" />`
    ).join("");
    return `<div class="haze-marquee" data-haze-marquee><div class="haze-marquee-track">${icons}${icons}</div></div>`;
  }

  function ensure() {
    const home = location.pathname === "/" || location.pathname === "";
    const hero = home ? document.querySelector('[data-framer-name="Hero"]') : null;
    if (hero) {
    hero.querySelectorAll("h1").forEach((node) => {
      if (norm(node.textContent) !== TITLE) node.textContent = TITLE;
    });
    const copy = hero.querySelector('[data-framer-name="Heading + subheading"] p');
    if (copy) {
      copy.classList.add("haze-shine");
      if (norm(copy.textContent) !== DESC) copy.textContent = DESC;
    }

    hero.querySelectorAll('[data-framer-name="Half"], [data-framer-name="Full"]').forEach((shell) => {
      const pill = shell.querySelector('[data-framer-name="new"]');
      if (pill) {
        pill.classList.add("haze-badge");
        if (pill.style.backgroundColor !== "rgb(0, 255, 174)") pill.style.backgroundColor = "#00ffae";
        const label = pill.querySelector("p");
        if (label) {
          label.classList.add("haze-badge-label");
          if (norm(label.textContent) !== "Disponivel") label.textContent = "Disponivel";
        }
      }
      let side = shell.querySelector("[data-haze='badge-side']");
      shell.querySelectorAll(".haze-badge-side, .framer-1uas8sm").forEach((node) => {
        if (node !== side) node.remove();
      });
      if (!side) {
        side = document.createElement("div");
        side.className = "framer-1uas8sm";
        side.setAttribute("data-framer-component-type", "RichTextContainer");
        side.dataset.haze = "badge-side";
        side.innerHTML =
          '<p class="framer-text framer-styles-preset-141u1yr" data-styles-preset="pAzayDUZg">Para Novos Projetos</p>';
        shell.appendChild(side);
      } else if (norm(side.textContent) !== "Para Novos Projetos") {
        const label = side.querySelector("p");
        if (label) label.textContent = "Para Novos Projetos";
        else side.textContent = "Para Novos Projetos";
      }
      const text = side.querySelector("p");
      if (text && !side.style.getPropertyValue("--haze-side")) {
        const width = text.scrollWidth;
        if (width > 20) side.style.setProperty("--haze-side", width + "px");
      }
    });

    hero.querySelectorAll('a[data-framer-name="Light"]').forEach((link) => {
      paintLink(link, "Haze Dev", DISCORD, true);
      const pad = link.querySelector(".framer-esl6hy-container > div");
      if (pad && !pad.querySelector("[data-haze='discord']")) pad.insertAdjacentHTML("afterbegin", ICON);
    });
    hero.querySelectorAll('a[data-framer-name="Dark"]').forEach((link) => {
      paintLink(link, "Meu Portfolio", "#solutions", false);
    });

    const dock = hero.querySelector(".framer-fgh9n2");
    if (dock && !dock.querySelector("[data-haze-marquee]")) dock.innerHTML = marquee();

    const solutions = document.querySelector('[data-framer-name="Solutions"]');
    if (solutions && solutions.id !== "solutions") solutions.id = "solutions";
    }

    const intro = document.querySelector('[data-framer-name="Intro"]');
    if (intro) {
      const mark = intro.querySelector("p.framer-styles-preset-tebz1a");
      if (mark) {
        mark.classList.add("haze-intro-mark");
        if (norm(mark.textContent) !== "Criatividade") mark.textContent = "Criatividade";
        fitIntroMark(mark);
      }
      const sub = intro.querySelector("h3 span") || intro.querySelector("h3");
      if (sub && norm(sub.textContent) !== "Sem limites para criar.") {
        sub.textContent = "Sem limites para criar.";
      }
    }

    document
      .querySelectorAll(
        "a[href*='duplicateType=siteTemplate'], a[href*='framer.link/1YNSJpf']",
      )
      .forEach((link) => {
        const box = link.closest(".framer-1qebla2-container");
        (box || link).remove();
      });
    document.getElementById("__framer-badge-container")?.remove();
  }

  function fitIntroMark(mark) {
    if (!(mark instanceof HTMLElement)) return;
    const available = Math.max(
      0,
      Math.floor(Math.min(window.innerWidth - 16, mark.parentElement?.clientWidth || window.innerWidth - 16)),
    );
    if (!available) return;

    mark.style.removeProperty("font-size");
    mark.style.removeProperty("--framer-font-size");

    let lo = 18;
    let hi = Math.min(window.innerWidth * 0.14, 220);
    let best = lo;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      mark.style.setProperty("font-size", `${mid}px`, "important");
      mark.style.setProperty("--framer-font-size", `${mid}px`, "important");
      if (mark.scrollWidth <= available) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    mark.style.setProperty("font-size", `${best}px`, "important");
    mark.style.setProperty("--framer-font-size", `${best}px`, "important");
  }

  let introFitBound = false;
  function bindIntroFit() {
    if (introFitBound) return;
    introFitBound = true;
    let timer = 0;
    const run = () => {
      const mark = document.querySelector(
        '[data-framer-name="Intro"] p.framer-styles-preset-tebz1a',
      );
      if (mark) fitIntroMark(mark);
    };
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(run, 80);
      },
      { passive: true },
    );
  }
  bindIntroFit();

  window.HazeHero = { ensure };
})();