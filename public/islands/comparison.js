(function () {
  const LEFT = [
    "Lentidão e desempenho inconsistente",
    "Preços abusivos ou cobranças escondidas",
    "Uso exagerado e desnecessário de IA",
    "Falhas de segurança e pouca proteção",
    "Soluções genéricas e pouco personalizadas",
    "Código desorganizado e difícil de manter",
    "Comunicação confusa e pouco transparente",
    "Prazos incertos e atrasos frequentes",
    "Dificuldade para adicionar funcionalidades",
    "Pouco cuidado após a entrega",
  ];

  const RIGHT = [
    "Aplicações rápidas e otimizadas",
    "Valores transparentes e alinhados ao projeto",
    "Tecnologia aplicada com propósito",
    "Atenção às boas práticas de segurança",
    "Soluções personalizadas para cada necessidade",
    "Código organizado e sustentável",
    "Comunicação direta com o cliente",
    "Prazos e etapas bem alinhados",
    "Estrutura preparada para evoluir",
    "Testes e revisões antes da entrega",
  ];

  function setText(el, value) {
    if (!el) return;
    if ((el.textContent || "").trim() !== value) el.textContent = value;
  }

  function patchPoints(root, items) {
    if (!root) return;
    const points = Array.from(root.querySelectorAll('[data-framer-name="Feature point"]'));
    points.forEach((point, i) => {
      if (!items[i]) return;
      const p = point.querySelector("p") || point;
      setText(p, items[i]);
    });
  }

  function patch() {
    const section = document.querySelector('[data-framer-name="Comparison"]');
    if (!section) return false;

    setText(section.querySelector('[data-framer-name="Badge"] p'), "Comparativo");
    setText(
      section.querySelector('[data-framer-name="Heading"] h2'),
      "A diferença entre improvisar e desenvolver bem.",
    );

    setText(section.querySelector('[data-framer-name="Traditional"] p'), "Serviços improvisados");
    setText(section.querySelector('[data-framer-name="Automated"] p'), "Meu desenvolvimento");

    const tradTitle = section.querySelector('[data-framer-name="Traditional"]');
    if (tradTitle && !tradTitle.querySelector("p")) setText(tradTitle, "Serviços improvisados");
    const autoTitle = section.querySelector('[data-framer-name="Automated"]');
    if (autoTitle && !autoTitle.querySelector("p")) setText(autoTitle, "Meu desenvolvimento");

    patchPoints(section.querySelector('[data-framer-name="Traditional way"]'), LEFT);
    patchPoints(section.querySelector('[data-framer-name="Automation"]'), RIGHT);

    return true;
  }

  function ensure() {
    patch();
    window.setTimeout(patch, 200);
    window.setTimeout(patch, 800);
    window.setTimeout(patch, 1600);
  }

  window.HazeComparison = { ensure };
})();
