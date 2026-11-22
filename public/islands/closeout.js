(function () {
  const DISCORD = "https://discord.com/channels/@me/1178377773321035807";
  const DISCORD_ICON =
    '<span class="haze-discord" data-haze="discord" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></span>';

  function setText(el, value) {
    if (!el) return;
    if ((el.textContent || "").trim() !== value) el.textContent = value;
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
    if (!link) return;
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    link.classList.add("haze-cta");
    if (!link.dataset.hazeRoll) {
      link.dataset.hazeRoll = "1";
      link.addEventListener("mouseenter", () => link.classList.add("haze-roll-on"));
      link.addEventListener("mouseleave", () => link.classList.remove("haze-roll-on"));
    }
    if (blank) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
    const p = link.querySelector("p");
    if (!p) return;
    p.classList.add("haze-roll");
    if (p.getAttribute("data-haze-label") !== label || !p.querySelector("b[data-char]")) {
      p.innerHTML = rolling(label);
      p.setAttribute("data-haze-label", label);
    }
  }

  function ensureIds() {
    const hero = document.querySelector('[data-framer-name="Hero"]');
    if (hero && hero.id !== "inicio") hero.id = "inicio";
    const intro = document.querySelector('[data-framer-name="Intro"]');
    if (intro && intro.id !== "sobre") intro.id = "sobre";
    const solutions = document.querySelector('[data-framer-name="Solutions"]');
    if (solutions && solutions.id !== "solutions") solutions.id = "solutions";
    const benefits = document.querySelector('[data-framer-name="Benefits"]');
    if (benefits && benefits.id !== "beneficios") benefits.id = "beneficios";
  }

  function patchCta() {
    document.querySelectorAll('section[data-framer-name="CTA"]').forEach((section) => {
      const content = section.querySelector('[data-framer-name="Content"]');
      if (!content) return;

      const heading = content.querySelector('[data-framer-name="Heading"] h2');
      setText(heading, "Tem um projeto em mente?");

      let badge = content.querySelector("[data-haze-cta-badge]");
      if (!badge) {
        badge = document.createElement("div");
        badge.className = "haze-cta-badge";
        badge.setAttribute("data-haze-cta-badge", "");
        badge.innerHTML = "<p></p>";
        const headingBox = content.querySelector('[data-framer-name="Heading"]');
        if (headingBox) content.insertBefore(badge, headingBox);
        else content.prepend(badge);
      }
      setText(badge.querySelector("p"), "Vamos tirar sua ideia do papel");

      let desc = content.querySelector("[data-haze-cta-desc]");
      if (!desc) {
        desc = document.createElement("div");
        desc.className = "haze-cta-desc";
        desc.setAttribute("data-haze-cta-desc", "");
        desc.innerHTML = "<p></p>";
        const headingBox = content.querySelector('[data-framer-name="Heading"]');
        if (headingBox) headingBox.insertAdjacentElement("afterend", desc);
        else content.appendChild(desc);
      }
      setText(desc.querySelector("p"), "Vamos conversar e transformar sua ideia em algo incrível.");

      section.querySelectorAll('a[data-framer-name="Light"]').forEach((link) => {
        paintLink(link, "Conversar pelo Discord", DISCORD, true);
        const pad = link.querySelector(".framer-esl6hy-container > div");
        if (pad && !pad.querySelector("[data-haze='discord']")) pad.insertAdjacentHTML("afterbegin", DISCORD_ICON);
      });
      section.querySelectorAll('a[data-framer-name="Dark"]').forEach((link) => {
        link.style.display = "none";
      });
    });
  }

  function patchFooterNav(root, title, items) {
    if (!root) return;
    const strong = root.querySelector("strong");
    if (strong) setText(strong, title);
    const anchors = Array.from(root.querySelectorAll("a"));
    anchors.forEach((a, i) => {
      const item = items[i];
      const wrap = a.closest('[data-framer-component-type="RichTextContainer"]') || a.parentElement;
      if (!item) {
        if (wrap) wrap.style.display = "none";
        return;
      }
      if (wrap) wrap.style.display = "";
      setText(a, item.label);
      if (a.getAttribute("href") !== item.href) a.setAttribute("href", item.href);
      if (item.blank) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      } else {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
    });
  }

  function patchFooterRoot(footer) {
    if (!footer) return;

    setText(footer.querySelector('[data-framer-name="Tagline"] p'), "Desenvolvendo ideias em soluções digitais.");

    const news = footer.querySelector('[data-framer-name="newsletter"]');
    if (news) {
      const label = news.querySelector("strong") || news.querySelector("p");
      if (label) {
        setText(
          label,
          "Sites, aplicações e sistemas desenvolvidos com criatividade, atenção aos detalhes e propósito.",
        );
      }
      news.querySelectorAll("form, input, button, .framer-auzm4l-container").forEach((node) => {
        node.style.display = "none";
      });
      news.setAttribute("data-haze-footer-desc", "");
    }

    patchFooterNav(footer.querySelector('[data-framer-name="Pages"]'), "Navegação", [
      { label: "Início", href: "#inicio" },
      { label: "Sobre mim", href: "#sobre" },
      { label: "Projetos", href: "#solutions" },
      { label: "Diferenciais", href: "#beneficios" },
    ]);

    patchFooterNav(footer.querySelector('[data-framer-name="Socials"]'), "Conecte-se", [
      { label: "Discord", href: DISCORD, blank: true },
    ]);

    const bottom =
      footer.querySelector('[data-framer-name="Legals"]') ||
      Array.from(footer.querySelectorAll('[data-framer-name="Links"]')).find((node) => {
        const text = (node.textContent || "").toLowerCase();
        return text.includes("privacy") || text.includes("visioned") || text.includes("haze") || text.includes("©");
      });

    if (bottom) {
      const anchors = Array.from(bottom.querySelectorAll("a")).filter(
        (a) => !a.closest('[data-framer-name="Pages"]') && !a.closest('[data-framer-name="Socials"]'),
      );
      if (anchors[0]) {
        anchors[0].removeAttribute("href");
        anchors[0].removeAttribute("target");
        anchors[0].removeAttribute("rel");
        setText(anchors[0], "© 2026 Haze. Todos os direitos reservados.");
      }
      if (anchors[1]) {
        anchors[1].removeAttribute("href");
        anchors[1].removeAttribute("target");
        anchors[1].removeAttribute("rel");
        setText(anchors[1], "Feito por Haze.");
      }
    }
  }

  function patch() {
    ensureIds();
    patchCta();
    document.querySelectorAll('[data-framer-name="Footer"]').forEach((footer) => patchFooterRoot(footer));
    return true;
  }

  function ensure() {
    patch();
    window.setTimeout(patch, 200);
    window.setTimeout(patch, 800);
    window.setTimeout(patch, 1600);
  }

  window.HazeCloseout = { ensure };
})();
