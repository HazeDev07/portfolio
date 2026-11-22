(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const files = [
    {
      name: "schema.ts",
      lines: ["type Cobranca = {", "  cliente: string", "  valor: number", "  pago: boolean", "}"],
    },
    {
      name: "pix.ts",
      lines: ["function pix() {", "  const qr = criar()", "  return qr", "}"],
    },
    {
      name: "painel.tsx",
      lines: ["function Painel() {", "  const rows = use()", "  return <Tabela />", "}"],
    },
  ];

  function colorize(line) {
    const frag = document.createDocumentFragment();
    const re = /("[^"]*"|'[^']*'|\b(?:const|type|export|async|function|return|await)\b|\b(?:string|number|boolean)\b)/g;
    let last = 0;
    let match;
    while ((match = re.exec(line))) {
      if (match.index > last) frag.append(line.slice(last, match.index));
      const token = document.createElement("span");
      const word = match[0];
      token.className = word.startsWith('"') || word.startsWith("'") ? "str" : /string|number|boolean/.test(word) ? "ty" : "kw";
      token.textContent = word;
      frag.append(token);
      last = match.index + word.length;
    }
    if (last < line.length) frag.append(line.slice(last));
    return frag;
  }

  function mountIde(root) {
    const ide = root.querySelector("[data-haze-ide]");
    if (!ide || ide.dataset.ready === "1") return;
    ide.dataset.ready = "1";
    const items = [...ide.querySelectorAll("[data-haze-files] li")];
    const view = ide.querySelector("[data-haze-codeview]");
    const tab = ide.querySelector("[data-haze-tab]");
    const status = ide.querySelector("[data-haze-ide-status]");

    function paint(file, lineIndex, charIndex) {
      const current = file.lines[lineIndex] || "";
      const finished = lineIndex >= file.lines.length;
      const saved = finished || (lineIndex === file.lines.length - 1 && charIndex >= current.length && current.length > 0);
      items.forEach((item, index) => item.classList.toggle("is-on", files[index] === file));
      tab.textContent = file.name;
      status.textContent = lineIndex === 0 && charIndex === 0 ? "abrindo " + file.name : saved ? "arquivo salvo" : "escrevendo " + file.name;
      view.replaceChildren();
      const total = finished ? file.lines.length : lineIndex + 1;
      for (let index = 0; index < total; index += 1) {
        const full = file.lines[index];
        const text = finished || index < lineIndex ? full : full.slice(0, charIndex);
        const row = document.createElement("span");
        row.className = "haze-ln";
        const num = document.createElement("i");
        num.textContent = String(index + 1);
        const code = document.createElement("b");
        code.append(colorize(text));
        if (!finished && index === lineIndex) {
          const caret = document.createElement("i");
          caret.className = "haze-caret";
          code.append(caret);
        }
        row.append(num, code);
        view.append(row);
      }
    }

    if (reduce) {
      const last = files[files.length - 1];
      paint(last, last.lines.length, 0);
      return;
    }

    let fileIndex = 0;
    let lineIndex = 0;
    let charIndex = 0;
    const tick = () => {
      const file = files[fileIndex];
      if (lineIndex >= file.lines.length) {
        fileIndex = (fileIndex + 1) % files.length;
        lineIndex = 0;
        charIndex = 0;
        window.setTimeout(tick, 280);
        return;
      }
      const line = file.lines[lineIndex];
      if (charIndex > line.length) {
        lineIndex += 1;
        charIndex = 0;
        window.setTimeout(tick, lineIndex >= file.lines.length ? 980 : 140);
        return;
      }
      paint(file, lineIndex, charIndex);
      charIndex += 1;
      window.setTimeout(tick, charIndex === 1 ? 280 : 36);
    };
    tick();
  }

  function mountDrop(root) {
    const drop = root.querySelector("[data-haze-drop]");
    if (!drop || drop.dataset.ready === "1") return;
    drop.dataset.ready = "1";
    const steps = [...drop.querySelectorAll("[data-haze-drop-step]")];
    const card = drop.querySelector("[data-haze-drop-card]");
    const label = drop.querySelector("[data-haze-drop-label]");
    const labels = ["revisando o código", "publicando o deploy", "enviando ao cliente", "projeto entregue"];

    function paint(cursor) {
      steps.forEach((step, index) => {
        step.classList.toggle("is-done", index < cursor);
        step.classList.toggle("is-run", index === cursor);
      });
      const done = cursor >= steps.length;
      card.classList.toggle("is-live", done);
      label.textContent = labels[Math.min(cursor, labels.length - 1)];
    }

    if (reduce) {
      paint(steps.length);
      return;
    }

    let cursor = 0;
    const tick = () => {
      paint(cursor);
      const done = cursor >= steps.length;
      cursor = done ? 0 : cursor + 1;
      window.setTimeout(tick, done ? 1600 : 780);
    };
    tick();
  }

  function syncStages(root) {
    const stages = [...root.querySelectorAll(".haze-stage")];
    const chat = root.querySelector(".haze-chat");
    if (!chat || !stages.length) return;
    chat.style.height = "auto";
    const tallest = Math.max(chat.offsetHeight, 292);
    stages.forEach((stage) => {
      stage.style.height = tallest + "px";
    });
  }

  function play(root) {
    if (root.dataset.played === "1") return;
    root.dataset.played = "1";
    const messages = [...root.querySelectorAll("[data-haze-msg]")];
    messages.forEach((node, index) => {
      window.setTimeout(() => node.classList.add("is-in"), reduce ? 0 : 180 + index * 420);
    });
  }

  function mountCarousel(root) {
    const track = root.querySelector("[data-haze-track]");
    const slides = [...track.querySelectorAll("[data-haze-slide]")];
    const dots = [...root.querySelectorAll("[data-haze-dots] button")];
    const mq = window.matchMedia("(max-width: 809.98px)");
    let index = 0;
    let pointer = null;

    function apply() {
      syncStages(root);
      const mobile = mq.matches;
      slides.forEach((slide, i) => {
        const off = i - index;
        slide.style.setProperty("--off", String(off));
        slide.style.setProperty("--abs", String(Math.abs(off)));
        slide.classList.toggle("is-front", off === 0);
        if (mobile && off !== 0) slide.setAttribute("inert", "");
        else slide.removeAttribute("inert");
      });
      dots.forEach((dot, i) => {
        const on = i === index;
        dot.classList.toggle("is-on", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      slides.forEach((slide) => {
        slide.style.height = "";
      });
      if (!mobile) {
        track.style.height = "";
        track.style.removeProperty("--drag");
        return;
      }
      const tallest = Math.max(...slides.map((slide) => slide.offsetHeight));
      slides.forEach((slide) => {
        slide.style.height = tallest + "px";
      });
      track.style.height = tallest + "px";
    }

    function go(next) {
      index = Math.max(0, Math.min(slides.length - 1, next));
      track.style.removeProperty("--drag");
      apply();
    }

    track.addEventListener("pointerdown", (event) => {
      if (!mq.matches || !event.isPrimary) return;
      if (event.target.closest("button, input, a, textarea")) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, drag: false };
    });

    track.addEventListener("pointermove", (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.drag) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          pointer = null;
          return;
        }
        pointer.drag = true;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }
      pointer.dx = dx;
      track.style.setProperty("--drag", dx + "px");
    });

    function end(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = pointer.dx;
      const dragged = pointer.drag;
      pointer = null;
      track.classList.remove("is-dragging");
      if (!dragged) {
        track.style.removeProperty("--drag");
        return;
      }
      if (dx <= -48) go(index + 1);
      else if (dx >= 48) go(index - 1);
      else go(index);
    }

    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => go(i));
    });
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    apply();
    return apply;
  }

  function bind(root) {
    if (root.dataset.bound === "1") return;
    root.dataset.bound = "1";
    mountCarousel(root);
    mountIde(root);
    mountDrop(root);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play(root);
          io.disconnect();
        }
      },
      { threshold: 0.28 }
    );
    io.observe(root);
  }

  function ensure() {
    const tpl = document.getElementById("haze-steps-tpl");
    document.querySelectorAll('section[data-framer-name="Process"], section[data-haze-process]').forEach((section) => {
      if (section.tagName !== "SECTION") return;
      const ours = section.querySelector("[data-haze-steps]");
      const original = /How we help you get real results/i.test(section.textContent || "");
      if (!ours && tpl && (section.hasAttribute("data-haze-process") || original)) {
        const node = tpl.content.firstElementChild;
        if (!node) return;
        section.setAttribute("data-haze-process", "1");
        section.replaceChildren(node.cloneNode(true));
      }
      const root = section.querySelector("[data-haze-steps]");
      if (root) bind(root);
    });
  }

  window.HazeSteps = { ensure };
})();
