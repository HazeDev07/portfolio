(function () {
  const ICONS = {
    "user-round":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0115 0"/></svg>',
    "sliders-horizontal":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 5h11"/><path d="M3 5h2"/><path d="M14 12h7"/><path d="M3 12h6"/><path d="M12 19h9"/><path d="M3 19h4"/><circle cx="8" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="10" cy="19" r="2"/></svg>',
    palette:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1110-10c0 1.7-1.3 3-3 3h-1.5a2.5 2.5 0 00-2.3 3.4A2.5 2.5 0 0112 22z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>',
    "code-2":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M14 4l-4 16"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
    "trending-up":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l7-7 4 4 7-7"/><path d="M14 7h7v7"/></svg>',
  };

  const CARDS = [
    {
      keys: ["Cost Efficient.", "Cost Efficient", "Atendimento próximo.", "Atendimento próximo"],
      title: "Atendimento próximo.",
      description: "Comunicação direta durante todo o desenvolvimento do projeto.",
      icon: "user-round",
    },
    {
      keys: ["Better Insights.", "Better Insights", "Feito sob medida.", "Feito sob medida"],
      title: "Feito sob medida.",
      description: "Cada solução é desenvolvida de acordo com suas necessidades.",
      icon: "sliders-horizontal",
    },
    {
      keys: ["Time saving.", "Time saving", "Design cuidadoso.", "Design cuidadoso"],
      title: "Design cuidadoso.",
      description: "Interfaces modernas, intuitivas e com atenção aos detalhes.",
      icon: "palette",
    },
    {
      keys: ["Faster Workflows.", "Faster Workflows", "Código organizado.", "Código organizado"],
      title: "Código organizado.",
      description: "Estruturas bem planejadas e preparadas para futuras melhorias.",
      icon: "code-2",
    },
    {
      keys: ["Higher Accuracy.", "Higher Accuracy", "Performance.", "Performance"],
      title: "Performance.",
      description: "Aplicações rápidas, leves e responsivas.",
      icon: "zap",
    },
    {
      keys: ["Easy Scaling.", "Easy Scaling", "Sempre evoluindo.", "Sempre evoluindo"],
      title: "Sempre evoluindo.",
      description: "Projetos pensados para crescer e receber novas funcionalidades.",
      icon: "trending-up",
    },
  ];

  function setText(el, value) {
    if (!el) return;
    if ((el.textContent || "").trim() !== value) el.textContent = value;
  }

  function findCardRoot(strong) {
    let el = strong;
    for (let i = 0; i < 10 && el; i++) {
      if (el.querySelector?.('[data-framer-name="Icon holder"]') && el.querySelectorAll("p").length >= 2) {
        return el;
      }
      el = el.parentElement;
    }
    return strong.closest('[class*="-container"]');
  }

  function replaceIcon(holder, key, html) {
    if (!holder) return;
    const slot =
      holder.querySelector(".framer-btlkxv-container, [class*='-container']") || holder;
    let mark = holder.querySelector(":scope .haze-ben-icon, .haze-ben-icon");
    if (!mark) {
      mark = document.createElement("span");
      mark.className = "haze-ben-icon";
      slot.appendChild(mark);
    }
    if (mark.getAttribute("data-haze-icon") !== key) {
      mark.setAttribute("data-haze-icon", key);
      mark.innerHTML = html;
    }
    holder.querySelectorAll("svg").forEach((svg) => {
      if (svg.closest(".haze-ben-icon")) return;
      svg.style.display = "none";
      svg.setAttribute("aria-hidden", "true");
    });
  }

  function patchCard(root, spec) {
    if (!root) return;
    const strong = root.querySelector("strong");
    if (strong) setText(strong, spec.title);
    const paragraphs = Array.from(root.querySelectorAll("p"));
    const titleP = paragraphs.find((p) => p.querySelector("strong")) || paragraphs[0];
    const descP = paragraphs.find((p) => p !== titleP) || paragraphs[1];
    if (descP) setText(descP, spec.description);
    replaceIcon(root.querySelector('[data-framer-name="Icon holder"]'), spec.icon, ICONS[spec.icon]);
  }

  function patchLogo(section) {
    const holder = section.querySelector('[data-framer-name="Logo holder"]');
    if (!holder) return;
    holder.querySelectorAll('[data-framer-component-type="SVG"], svg').forEach((node) => {
      if (node.closest("[data-haze-ben-logo]")) return;
      node.style.display = "none";
      node.setAttribute("aria-hidden", "true");
    });
    let mark = holder.querySelector("[data-haze-ben-logo]");
    if (!mark) {
      mark = document.createElement("span");
      mark.className = "haze-ben-logo";
      mark.setAttribute("data-haze-ben-logo", "");
      const base = typeof window !== "undefined" && window.__HAZE_BASE__ ? window.__HAZE_BASE__ : "";
      mark.innerHTML = `<img src="${base}/images/brand/logo.png" alt="Haze" />`;
      holder.appendChild(mark);
    }
  }

  function patch() {
    const section = document.querySelector('[data-framer-name="Benefits"]');
    if (!section) return false;

    setText(section.querySelector('[data-framer-name="Badge"] p'), "Diferenciais");

    const heading = section.querySelector('[data-framer-name="Heading"]');
    const h2 = heading?.querySelector("h2");
    setText(h2, "Por que trabalhar comigo?");
    if (heading) {
      heading.style.overflow = "visible";
      heading.style.height = "auto";
    }
    if (h2) {
      h2.style.overflow = "visible";
      h2.style.height = "auto";
      h2.style.maxHeight = "none";
      h2.style.lineHeight = "1.35em";
      h2.style.paddingBottom = "0.2em";
    }

    const strongs = Array.from(section.querySelectorAll("strong"));
    CARDS.forEach((spec) => {
      const strong = strongs.find((s) => spec.keys.includes((s.textContent || "").trim()));
      if (!strong) return;
      patchCard(findCardRoot(strong), spec);
    });

    patchLogo(section);

    return true;
  }

  function ensure() {
    patch();
    window.setTimeout(patch, 200);
    window.setTimeout(patch, 800);
    window.setTimeout(patch, 1600);
  }

  window.HazeBenefits = { ensure };
})();
