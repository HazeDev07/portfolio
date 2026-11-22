(function () {
  const ICONS = {
    discord:
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',
    tasks:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    refresh:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 11-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7"/></svg>',
    checkCircle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
    panel:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    code:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9l-4 3 4 3"/><path d="M16 9l4 3-4 3"/><path d="M14 5l-4 14"/></svg>',
    db:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
    ui:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M8 21h8"/></svg>',
    jobs:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
    bell:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 20a2 2 0 004 0"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-8"/></svg>',
    rocket:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c2-1 3.5-2.2 5-4"/><path d="M14 4l6 6-8 3-3 8-3-3 8-3z"/><path d="M9 15l-4 1 1-4"/></svg>',
    plug:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7v4"/><path d="M15 7v4"/><path d="M8 11h8v2a4 4 0 01-4 4h0a4 4 0 01-4-4v-2z"/><path d="M12 17v4"/></svg>',
    app:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    react:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(120 12 12)"/></svg>',
    next:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.7 14.8h-1.5l-4.7-7v7H8.2V7.2h1.6l4.6 6.9V7.2h1.3v9.6z"/></svg>',
    ts:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h18v18H3V3zm9.2 9.3H8.7v-1.4h8.1v1.4h-3.5V18h-1.1v-5.7zM16.8 15.2c.2.4.6.7 1.2.7.5 0 .8-.2.8-.6 0-.4-.2-.6-1-.9l-.7-.3c-1.1-.4-1.8-1.1-1.8-2.3 0-1.3 1.1-2.2 2.7-2.2 1.2 0 2.1.4 2.6 1.4l-1.1.7c-.2-.4-.6-.7-1.2-.7-.5 0-.7.2-.7.5 0 .4.3.6 1 .9l.7.3c1.3.5 1.9 1.2 1.9 2.5 0 1.5-1.1 2.4-2.9 2.4-1.4 0-2.4-.5-3-1.4l1.1-.7z"/></svg>',
    node:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.4l8 4.6v9.8l-8 4.6-8-4.6V7z"/><path d="M12 12.2V21"/><path d="M12 12.2L4.4 7.7"/><path d="M12 12.2l7.6-4.5"/></svg>',
    css:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l1.5 16L12 22l6.5-2L20 4H4z"/><path d="M8.5 8h7l-.4 4H9.2l.2 2.2h4.8l-.3 2.8L12 18l-2-.5"/></svg>',
    api:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h6"/><path d="M4 16h6"/><path d="M10 8v8"/><path d="M14 7l6 5-6 5"/></svg>',
    deploy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v10"/><path d="M8 7l4-4 4 4"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/></svg>',
  };

  const MODULE_ICONS = {
    Auth: "lock",
    Painel: "panel",
    API: "code",
    Banco: "db",
    UI: "ui",
    Jobs: "jobs",
    Notificar: "bell",
    Relatórios: "chart",
    Deploy: "rocket",
    App: "app",
    Webhook: "plug",
    Serviço: "plug",
  };

  const STACK_ICONS = {
    Linkedin: "react",
    Email: "next",
    Messenger: "ts",
    "Cold calling": "node",
    SMS: "css",
    Whatsapp: "api",
    Instagram: "deploy",
  };

  function setText(el, value) {
    if (!el) return;
    if ((el.textContent || "").trim() !== value) el.textContent = value;
  }

  function setCardCopy(card, title, description) {
    if (!card) return;
    const p = card.querySelector("p.framer-styles-preset-sbzkm0");
    if (!p) return;
    const label = /[.!?]$/.test(title) ? title : `${title}.`;
    const strong = p.querySelector("strong");
    if (strong) setText(strong, label);
    const htmlTitle = strong
      ? strong.outerHTML
      : `<span class="framer-text" style="--framer-text-color: var(--token-55fce8bf-ab86-42dc-8b77-6335cf9cf588, rgb(255, 255, 255));"><strong class="framer-text">${label}</strong></span>`;
    const next = `${htmlTitle} ${description}`;
    if (p.innerHTML.replace(/\s+/g, " ").trim() !== next.replace(/\s+/g, " ").trim()) {
      p.innerHTML = next;
    }
  }

  function replaceMap(root, map) {
    if (!root) return;
    root.querySelectorAll("p").forEach((p) => {
      const key = (p.textContent || "").trim();
      if (Object.prototype.hasOwnProperty.call(map, key)) setText(p, map[key]);
    });
  }

  function replaceSvgSlot(slot, key, html, className) {
    if (!slot) return;
    slot.setAttribute("data-haze-icon", key);
    slot.querySelectorAll('[data-framer-component-type="SVG"], svg').forEach((node) => {
      if (node.closest(".haze-sol-icon")) return;
      node.style.display = "none";
      node.setAttribute("aria-hidden", "true");
    });
    let wrap = slot.querySelector(":scope > .haze-sol-icon");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = className || "haze-sol-icon";
      slot.appendChild(wrap);
    } else {
      wrap.className = className || "haze-sol-icon";
    }
    if (wrap.getAttribute("data-haze-icon") !== key) {
      wrap.setAttribute("data-haze-icon", key);
      wrap.innerHTML = html;
    }
  }

  function replaceFaceWithIcon(host, key, html) {
    if (!host) return;
    const wrap =
      host.querySelector("[data-framer-background-image-wrapper]") ||
      host.querySelector("img")?.closest("[data-framer-background-image-wrapper]");
    const img = host.querySelector("img");
    const target =
      wrap ||
      img?.parentElement ||
      host.querySelector('[data-framer-name="Icon holder"]') ||
      host;
    if (!target) return;
    target.setAttribute("data-haze-icon", key);
    target.querySelectorAll("img").forEach((node) => {
      node.style.display = "none";
    });
    let icon = target.querySelector(":scope > .haze-sol-face-icon");
    if (!icon) {
      icon = document.createElement("span");
      icon.className = "haze-sol-face-icon";
      target.appendChild(icon);
    }
    if (icon.getAttribute("data-haze-icon") !== key) {
      icon.setAttribute("data-haze-icon", key);
      icon.innerHTML = html;
    }
  }

  function patchWorkflow(card) {
    if (!card) return;
    const steps = [
      { name: "1st step", icon: "tasks", status: "check", statusClass: "haze-sol-icon haze-sol-icon--status haze-sol-icon--ok" },
      { name: "2nd step", icon: "refresh", status: "refresh", statusClass: "haze-sol-icon haze-sol-icon--status" },
      { name: "3rd step", icon: "checkCircle", status: "check", statusClass: "haze-sol-icon haze-sol-icon--status haze-sol-icon--ok" },
    ];
    steps.forEach((step) => {
      const root = card.querySelector(`[data-framer-name="${step.name}"]`);
      if (!root) return;
      replaceSvgSlot(
        root.querySelector('[data-framer-name="Icon holder"]'),
        step.icon,
        ICONS[step.icon],
        "haze-sol-icon haze-sol-icon--step",
      );
      const status = root.querySelector('[data-framer-name="Status icon"]');
      if (status) {
        status.style.color = "#9dffb5";
        status.style.background = "transparent";
      }
      replaceSvgSlot(
        status,
        `status-${step.status}`,
        ICONS[step.status],
        step.statusClass,
      );
    });
  }

  function patchAgents(card) {
    if (!card) return;
    const people = ["Calista", "David", "Kate", "Chris", "Sophie", "Badger", "Emma", "Jhonny", "Julie"];
    people.forEach((name) => {
      const el = card.querySelector(`[data-framer-name="${name}"]`);
      if (!el) return;
      const label = (el.querySelector("p")?.textContent || "").trim();
      const iconKey = MODULE_ICONS[label] || "plug";
      replaceFaceWithIcon(el, iconKey, ICONS[iconKey]);
    });
  }

  function patchMarketing(card) {
    if (!card) return;
    Object.entries(STACK_ICONS).forEach(([name, iconKey]) => {
      const row = card.querySelector(`[data-framer-name="${name}"]`);
      if (!row) return;
      const slot =
        row.querySelector('[data-framer-component-type="SVG"]')?.parentElement ||
        row.querySelector("svg")?.parentElement ||
        row.querySelector('[data-framer-name="Icon and Label"], [data-framer-name="Icon and label"], [data-framer-name="Icon and Lable"], [data-framer-name="Text and lable"]');
      if (!slot) return;
      replaceSvgSlot(slot, iconKey, ICONS[iconKey], "haze-sol-icon haze-sol-icon--stack");
    });
  }

  function patchChatbots(card) {
    if (!card) return;
    card.querySelectorAll('[data-framer-name="Calista"]').forEach((el) => {
      const label = (el.querySelector("p")?.textContent || "").trim() || "API";
      const iconKey = MODULE_ICONS[label] || "code";
      replaceFaceWithIcon(el, iconKey, ICONS[iconKey]);
    });
    card.querySelectorAll('[data-framer-name="Customer"]').forEach((el) => {
      const label = (el.querySelector("p")?.textContent || "").trim();
      const holder = el.querySelector('[data-framer-name="Icon holder"]');
      if (!holder) return;
      const iconKey = MODULE_ICONS[label] || (label === "Hub de conexões" ? "plug" : "app");
      replaceFaceWithIcon(holder, iconKey, ICONS[iconKey]);
    });
    card.querySelectorAll('[data-framer-name="Icon holder"]').forEach((holder) => {
      const img = holder.querySelector("img");
      if (!img) return;
      const nearby = (
        holder
          .closest('[data-framer-name="Calista"], [data-framer-name="Customer"], [data-framer-name="Conversation"]')
          ?.querySelector("p")?.textContent || ""
      ).trim();
      const iconKey = MODULE_ICONS[nearby] || (nearby === "Hub de conexões" ? "plug" : nearby === "App" ? "app" : "code");
      replaceFaceWithIcon(holder, iconKey, ICONS[iconKey]);
    });
    card.querySelectorAll("img").forEach((img) => {
      img.style.display = "none";
      img.setAttribute("aria-hidden", "true");
    });
  }

  function ensureVoiceDiscord(card) {
    if (!card) return;
    card.querySelectorAll("[data-haze-voice-meet]").forEach((node) => node.remove());

    const icon = card.querySelector('[data-framer-name="Icon"]');
    const host = icon || card.querySelector('[data-framer-name="Waves"]') || card;
    if (!host) return;

    host.querySelectorAll('[data-framer-component-type="SVG"], svg').forEach((node) => {
      if (node.closest("[data-haze-voice-discord]")) return;
      node.style.display = "none";
    });

    host.style.opacity = "1";
    host.classList.add("haze-sol-voice-icon-host");

    let mark = card.querySelector("[data-haze-voice-discord]");
    if (!mark) {
      mark = document.createElement("span");
      mark.setAttribute("data-haze-voice-discord", "");
      host.appendChild(mark);
    } else if (mark.parentElement !== host) {
      host.appendChild(mark);
    }
    mark.className = "haze-sol-voice-discord";
    mark.innerHTML = ICONS.discord;
  }

  function patch() {
    const section = document.querySelector('[data-framer-name="Solutions"]');
    if (!section) return false;

    const badge = section.querySelector('[data-framer-name="Badge"] p');
    setText(badge, "O que eu faço");

    const heading = section.querySelector('[data-framer-name="Heading"] h2');
    setText(heading, "O que posso desenvolver");

    const workflow = section.querySelector('[data-framer-name="Workflow automation"]');
    const agents = section.querySelector('[data-framer-name="Custom AI Agents"]');
    const voice = section.querySelector('[data-framer-name="Voice agent"]');
    const marketing = section.querySelector('[data-framer-name="Marketing automation"]');
    const data = section.querySelector('[data-framer-name="AI data analysis"]');
    const chatbots = section.querySelector('[data-framer-name="Custom chatbots"]');

    setCardCopy(
      workflow,
      "Automações",
      "Desenvolvo automações para reduzir tarefas repetitivas e tornar processos mais rápidos e eficientes.",
    );
    setCardCopy(
      voice,
      "Vamos conversar?",
      "Podemos marcar reuniões pelo Discord para conversar sobre sua ideia, alinhar os detalhes e acompanhar o desenvolvimento do projeto.",
    );
    setCardCopy(
      data,
      "Desenvolvimento Full Stack",
      "Desenvolvo aplicações completas, trabalhando tanto na interface quanto na lógica por trás de cada projeto.",
    );
    setCardCopy(
      agents,
      "Sistemas personalizados",
      "Crio sistemas e funcionalidades de acordo com as necessidades e objetivos de cada projeto.",
    );
    setCardCopy(
      marketing,
      "Desenvolvimento Web",
      "Desenvolvo sites e aplicações web com interfaces modernas, responsivas e funcionais.",
    );
    setCardCopy(
      chatbots,
      "Integrações",
      "Conecto ferramentas e funcionalidades para criar aplicações mais completas e integradas.",
    );

    replaceMap(workflow, {
      "Count hours work": "Organizar tarefas",
      "Add to CRM": "Atualizar sistema",
      "Send invoice": "Processo concluído",
      "/ban · moderation": "Organizar tarefas",
      "/role · auto assign": "Atualizar sistema",
      "/ticket · support": "Processo concluído",
    });

    replaceMap(agents, {
      Calista: "Auth",
      "Customer support specialist": "Login e acesso",
      David: "Painel",
      "Sales manager": "Gestão do sistema",
      Kate: "API",
      "Business Development": "Rotas e regras",
      Chris: "Banco",
      "Social Media Manager": "Persistência",
      Sophie: "UI",
      Designer: "Telas e fluxos",
      Badger: "Jobs",
      "SEO specialist": "Filas e tarefas",
      Emma: "Notificar",
      Recruiter: "Alertas",
      Jhonny: "Relatórios",
      "Data Analyst": "Métricas",
      Julie: "Deploy",
      Copywriter: "Publicação",
      Trigger: "Auth",
      "Watch events": "Login e acesso",
      Filter: "Painel",
      "Validate data": "Gestão do sistema",
      Transform: "API",
      "Map fields": "Rotas e regras",
      Connect: "Banco",
      "Call service": "Persistência",
      Branch: "UI",
      "If / else": "Telas e fluxos",
      Queue: "Jobs",
      "Retry · backoff": "Filas e tarefas",
      Notify: "Notificar",
      "Send webhook": "Alertas",
      Store: "Relatórios",
      "Write database": "Métricas",
      Complete: "Deploy",
      "Mark done": "Publicação",
    });

    replaceMap(data, {
      EXPENSE: "INTERFACE",
      METRICS: "INTERFACE",
      "$320,000": "App",
      "12.4k": "App",
      PAID: "BACKEND",
      ACTIVE: "BACKEND",
      "$120,000": "API",
      "8.1k": "API",
      DUE: "STATUS",
      GROWTH: "STATUS",
      "$200,000": "Online",
      "+24%": "Online",
      Payroll: "Login",
      Sessions: "Login",
      $2539: "OK",
      "2.5k": "OK",
      Tools: "Dashboard",
      "API calls": "Dashboard",
      $1320: "OK",
      "1.3k": "OK",
      Marketing: "Pedidos",
      Conversion: "Pedidos",
      $2450: "12",
      "4.2%": "12",
      Supplies: "Usuários",
      Latency: "Usuários",
      $1110: "48",
      "118ms": "48",
      Freelance: "API",
      Errors: "API",
      $3750: "OK",
      "0.4%": "OK",
      Training: "Deploy",
      Uptime: "Deploy",
      $1680: "Live",
      "99.9%": "Live",
      Support: "Cache",
      Users: "Cache",
      $2190: "ON",
      "9.8k": "ON",
    });

    replaceMap(marketing, {
      "Marketing Suite": "Meu Site",
      "Web Studio": "Meu Site",
      "Searching for leads…": "Carregando página…",
      "Building interface…": "Carregando página…",
      "Outreaching Methods..": "Stack do projeto",
      "Frontend stack": "Stack do projeto",
      Linkedin: "React",
      Email: "Next.js",
      Messenger: "TypeScript",
      "Cold calling": "Node.js",
      SMS: "CSS",
      Whatsapp: "API",
      Instagram: "Deploy",
    });

    replaceMap(chatbots, {
      "Custom chat bots": "Hub de conexões",
      "API Gateway": "Hub de conexões",
      Customer: "App",
      Service: "Serviço",
      Calista: "API",
      "/v1/sync": "Webhook",
    });

    const chatTitle = chatbots?.querySelector(
      '[data-framer-name="Chatbot"] p, [data-framer-name="Background chat"] p',
    );
    if (chatTitle) setText(chatTitle, "Hub de conexões");

    patchWorkflow(workflow);
    patchAgents(agents);
    patchMarketing(marketing);
    patchChatbots(chatbots);
    ensureVoiceDiscord(voice);

    return true;
  }

  function ensure() {
    patch();
    window.setTimeout(patch, 200);
    window.setTimeout(patch, 800);
    window.setTimeout(patch, 1600);
    window.setTimeout(patch, 3200);

    const section = document.querySelector('[data-framer-name="Solutions"]');
    const chat = section?.querySelector('[data-framer-name="Custom chatbots"]');
    if (chat && !chat.getAttribute("data-haze-chat-obs")) {
      chat.setAttribute("data-haze-chat-obs", "1");
      const mo = new MutationObserver(() => {
        window.clearTimeout(mo._t);
        mo._t = window.setTimeout(() => patchChatbots(chat), 50);
      });
      mo.observe(chat, { childList: true, subtree: true });
    }
  }

  window.HazeSolutions = { ensure };
})();
