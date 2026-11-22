import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const SITE_NAME = "Haze";
const TITLE = "Haze · Desenvolvedor Full Stack";
const DESC =
  "Desenvolvedor Full Stack. Crio sites, aplicações e sistemas com criatividade, atenção aos detalhes e propósito.";
const SHORT_DESC = "Sites, apps e sistemas desenvolvidos com criatividade e propósito.";
const KEYWORDS =
  "Haze, desenvolvedor full stack, portfólio, desenvolvimento web, Next.js, React, TypeScript, sistemas sob medida";

const DISCORD = "https://discord.com/channels/@me/1178377773321035807";

const TECH: [string, string][] = [
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

const DISCORD_ICON =
  '<span class="haze-discord" data-haze="discord" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></span>';

function basePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
}

function asset(filePath: string) {
  const normalized = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${basePath()}${normalized}`;
}

function brandMarkup() {
  return `<span class="haze-brand" data-haze-brand><img src="${asset("/images/brand/logo.png")}" alt="Haze" /><img class="haze-brand-green" src="${asset("/images/brand/logo-verde.png")}" alt="" /></span>`;
}

const imageDir = path.join(process.cwd(), "public", "images", "framer");
const localImages = new Set(fs.existsSync(imageDir) ? fs.readdirSync(imageDir) : []);

function rewriteAssets(html: string) {
  return html.replace(
    /https:\\?\/\\?\/framerusercontent\.com\\?\/images\\?\/([A-Za-z0-9._~-]+\.(?:png|jpe?g|webp|gif|svg|avif))/gi,
    (full, name: string) => (localImages.has(name) ? asset(`/images/framer/${name}`) : full),
  );
}

function rolling(label: string) {
  const chars = [...label];
  return chars
    .map((char, index) => {
      const value = char === " " ? "\u00a0" : char.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      return `<span style="--i:${index};--n:${chars.length}"><b data-char="${value}">${value}</b></span>`;
    })
    .join("");
}

function techMarkup() {
  const icons = TECH.map(
    ([file, name]) =>
      `<img class="haze-tech" data-tech="${file}" src="${asset(`/images/tech/${file}.svg`)}" alt="${name}" />`,
  ).join("");
  return `<div class="haze-marquee" data-haze-marquee><div class="haze-marquee-track">${icons}${icons}</div></div>`;
}

function mountBrand($: cheerio.CheerioAPI, box: cheerio.Cheerio<AnyNode>) {
  if (!box.length || box.find("[data-haze-brand]").length) return;
  box.attr("data-haze-brand-box", "");
  box.html(brandMarkup());
}

function removeComments($: cheerio.CheerioAPI) {
  $("*")
    .contents()
    .each((_, node) => {
      if (node.type === "comment") $(node).remove();
    });
}

function setMeta($: cheerio.CheerioAPI, origin: string, canonical: string) {
  const ogImage = `${origin}/images/brand/og.png`;

  $("title").text(TITLE);
  $('meta[name="description"]').attr("content", DESC);
  if (!$('meta[name="description"]').length) {
    $("head").append(`<meta name="description" content="${DESC}">`);
  }

  $('meta[name="keywords"]').remove();
  $("head").append(`<meta name="keywords" content="${KEYWORDS}">`);
  $('meta[name="author"]').remove();
  $("head").append(`<meta name="author" content="${SITE_NAME}">`);
  $('meta[name="theme-color"]').remove();
  $("head").append('<meta name="theme-color" content="#0a0a0a">');
  $('meta[name="robots"]').remove();
  $("head").append('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">');
  $('meta[name="googlebot"]').remove();
  $("head").append('<meta name="googlebot" content="index, follow">');
  $('meta[name="language"]').remove();
  $("head").append('<meta name="language" content="pt-BR">');
  $('meta[http-equiv="content-language"]').remove();
  $("head").append('<meta http-equiv="content-language" content="pt-BR">');

  $('meta[name="generator"]').remove();
  $('meta[name="framer-search-index"]').remove();
  $('link[rel="alternate"][hreflang]').remove();

  $('link[rel="canonical"]').attr("href", canonical);
  if (!$('link[rel="canonical"]').length) {
    $("head").append(`<link rel="canonical" href="${canonical}">`);
  }

  const og = {
    "og:type": "website",
    "og:locale": "pt_BR",
    "og:site_name": SITE_NAME,
    "og:url": canonical,
    "og:title": TITLE,
    "og:description": DESC,
    "og:image": ogImage,
    "og:image:secure_url": ogImage,
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": TITLE,
  };
  for (const [property, content] of Object.entries(og)) {
    const el = $(`meta[property="${property}"]`);
    if (el.length) el.attr("content", content);
    else $("head").append(`<meta property="${property}" content="${content}">`);
  }

  const twitter = {
    "twitter:card": "summary_large_image",
    "twitter:title": TITLE,
    "twitter:description": DESC,
    "twitter:image": ogImage,
    "twitter:image:alt": TITLE,
  };
  for (const [name, content] of Object.entries(twitter)) {
    const el = $(`meta[name="${name}"]`);
    if (el.length) el.attr("content", content);
    else $("head").append(`<meta name="${name}" content="${content}">`);
  }

  $('link[rel="icon"]').remove();
  $('link[rel="apple-touch-icon"]').remove();
  $("head").append(`<link rel="icon" href="${asset("/images/brand/favicon.png")}" type="image/png">`);
  $("head").append(`<link rel="apple-touch-icon" href="${asset("/images/brand/apple-touch.png")}">`);

  $('script[type="application/ld+json"]').remove();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: canonical,
        name: SITE_NAME,
        description: DESC,
        inLanguage: "pt-BR",
        publisher: { "@id": `${origin}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${origin}/#person`,
        name: SITE_NAME,
        url: canonical,
        jobTitle: "Desenvolvedor Full Stack",
        description: SHORT_DESC,
        image: `${origin}/images/brand/logo.png`,
        sameAs: [DISCORD],
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: TITLE,
        description: DESC,
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#person` },
        inLanguage: "pt-BR",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: ogImage,
          width: 1200,
          height: 630,
        },
      },
    ],
  };
  $("head").append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
}

function stripHeaderMenu($: cheerio.CheerioAPI) {
  $('[data-framer-name="Desktop Closed"] [data-framer-name="Out"], nav.haze-pc-header [data-framer-name="Out"]').remove();
}

function patchNav($: cheerio.CheerioAPI) {
  const map: Record<string, { href: string; label: string }> = {
    home: { href: "#inicio", label: "Início" },
    about: { href: "#sobre", label: "Sobre" },
    blog: { href: "#solutions", label: "Projetos" },
    contact: { href: DISCORD, label: "Discord" },
  };

  $("a").each((_, el) => {
    const link = $(el);
    if (link.closest('[data-framer-name="Desktop Closed"], nav.haze-pc-header').length) return;
    if (link.attr("data-framer-name") === "Out") return;
    const href = (link.attr("href") || "").trim().toLowerCase();
    const text = link.text().replace(/\s+/g, " ").trim().toLowerCase();
    let key = "";
    if (href === "/" || href === "./" || href === "" || href === "./#" || text === "home") key = "home";
    else if (href.includes("about") || text === "about") key = "about";
    else if (href.includes("blog") || text === "blog") key = "blog";
    else if (href.includes("contact") || text === "contact") key = "contact";
    if (!key) return;
    const item = map[key];
    link.attr("href", item.href);
    if (key === "contact") {
      link.attr("target", "_blank");
      link.attr("rel", "noopener noreferrer");
    } else {
      link.removeAttr("target");
      link.removeAttr("rel");
    }
    if (link.children().length === 0) link.text(item.label);
    else {
      const leaf = link.find("p, span").last();
      if (leaf.length) leaf.text(item.label);
      else link.text(item.label);
    }
  });
}

function scrubTemplateTraces($: cheerio.CheerioAPI) {
  $(
    "a[href*='duplicateType=siteTemplate'], a[href*='framer.link/1YNSJpf'], a[href*='framer.com/projects']",
  ).each((_, el) => {
    const box = $(el).closest(".framer-1qebla2-container");
    if (box.length) box.remove();
    else $(el).remove();
  });
  $("#__framer-badge-container").remove();
  $('script[src*="framer.com/edit"]').remove();
  $("script").each((_, el) => {
    const html = $(el).html() || "";
    if (html.includes("__framer_force_showing_editorbar_since") || html.includes("framer.com/edit/init")) {
      $(el).remove();
    }
  });

  $(
    '[data-framer-name="Case Study"], [data-framer-name="Testimonials"], [data-framer-name="Pricing"], [data-framer-name="FAQs"]',
  ).remove();
}

export function prepareFramerHtml(html: string, page: { pathname: string; origin: string }) {
  const $ = cheerio.load(rewriteAssets(html));
  const origin = page.origin.replace(/\/$/, "");
  const pathname = page.pathname || "/";
  const canonical = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  $("html").attr("lang", "pt-BR").attr("data-haze-home", "1");
  $("html").removeAttr("data-redirect-timezone");

  removeComments($);
  scrubTemplateTraces($);
  setMeta($, origin, canonical);
  stripHeaderMenu($);
  patchNav($);
  stripHeaderMenu($);

  $('[data-framer-name="Logo + Menu Icon"] [data-framer-name="Logo"] [data-framer-component-type="SVG"]').each(
    (_, el) => {
      mountBrand($, $(el));
    },
  );
  $(
    '[data-framer-name="CTA"] [data-framer-name="Logo"] [data-framer-component-type="SVG"], [data-framer-name="Footer"] [data-framer-name="Logo"] [data-framer-component-type="SVG"]',
  ).each((_, el) => {
    mountBrand($, $(el));
  });
  $(
    '[data-framer-name="CTA"] [data-framer-name="Logo"] p, [data-framer-name="Footer"] [data-framer-name="Logo"] p',
  ).each((_, el) => {
    $(el).text("Haze");
  });

  const desktopNav = $('[data-framer-name="Desktop Closed"]').first();
  if (desktopNav.length) {
    const variant = desktopNav.parents(".ssr-variant").first();
    if (variant.length) {
      const next = (variant.attr("class") || "").replace(/\bhidden-1j9zbg5\b/g, "").replace(/\s+/g, " ").trim();
      variant.attr("class", next);
    }
    if (!$("#haze-pc-header").length) {
      const copy = desktopNav.clone();
      copy.addClass("haze-pc-header");
      copy.removeAttr("data-framer-name");
      $("body").append(`<template id="haze-pc-header">${$.html(copy)}</template>`);
    }
  }

  const hero = $('[data-framer-name="Hero"]');
  if (hero.length) {
    hero.attr("id", "inicio");
    hero.find("h1").first().text("Haze Dev");
    hero.find('[data-framer-name="Heading + subheading"] p').first().text(DESC).addClass("haze-shine");

    hero.find('[data-framer-name="Half"], [data-framer-name="Full"]').each((_, el) => {
      const shell = $(el);
      const pill = shell.find('[data-framer-name="new"]');
      pill.addClass("haze-badge");
      const pillStyle = pill.attr("style") || "";
      if (!pillStyle.includes("#00ffae")) pill.attr("style", `${pillStyle};background-color:#00ffae`);
      pill.find("p").first().text("Disponivel").addClass("haze-badge-label");
      shell.find(".haze-badge-side, .framer-1uas8sm").remove();
      shell.append(
        '<div class="framer-1uas8sm" data-framer-component-type="RichTextContainer" data-haze="badge-side"><p class="framer-text framer-styles-preset-141u1yr" data-styles-preset="pAzayDUZg">Para Novos Projetos</p></div>',
      );
    });

    hero.find('a[data-framer-name="Light"]').each((_, el) => {
      const link = $(el);
      link.addClass("haze-cta");
      link.attr("href", DISCORD);
      link.attr("target", "_blank");
      link.attr("rel", "noopener noreferrer");
      const p = link.find("p").first();
      p.addClass("haze-roll");
      p.attr("data-haze-label", "Haze Dev");
      p.html(rolling("Haze Dev"));
      const pad = link.find(".framer-esl6hy-container > div").first();
      if (pad.length && !pad.find("[data-haze='discord']").length) pad.prepend(DISCORD_ICON);
    });

    hero.find('a[data-framer-name="Dark"]').each((_, el) => {
      const link = $(el);
      link.addClass("haze-cta");
      link.attr("href", "#solutions");
      const p = link.find("p").first();
      p.addClass("haze-roll");
      p.attr("data-haze-label", "Meu Portfolio");
      p.html(rolling("Meu Portfolio"));
    });

    hero.find(".framer-fgh9n2").first().html(techMarkup());
  }

  $('[data-framer-name="Intro"]').attr("id", "sobre");
  $('[data-framer-name="Solutions"]').attr("id", "solutions");
  $('[data-framer-name="Benefits"]').attr("id", "beneficios");

  const stepsFile = path.join(process.cwd(), "public", "islands", "steps.html");
  if (fs.existsSync(stepsFile)) {
    const stepsHtml = fs.readFileSync(stepsFile, "utf8");
    if (!$("#haze-steps-tpl").length) $("body").append(`<template id="haze-steps-tpl">${stepsHtml}</template>`);
    $("section[data-framer-name='Process']").each((_, el) => {
      const section = $(el);
      if (!/How we help you get real results/i.test(section.text()) && !section.attr("data-haze-process")) return;
      section.attr("data-haze-process", "1");
      section.html(stepsHtml);
    });
  }

  const intro = $('[data-framer-name="Intro"]');
  if (intro.length) {
    intro.find("p.framer-styles-preset-tebz1a").first().text("Criatividade").addClass("haze-intro-mark");
    const sub = intro.find("h3 span").first();
    if (sub.length) sub.text("Sem limites para criar.");
    else intro.find("h3").first().text("Sem limites para criar.");
  }

  $('[data-framer-name="Comparison"]').each((_, el) => {
    const section = $(el);
    section.find('[data-framer-name="Badge"] p').text("Comparativo");
    section.find("h2").text("A diferença entre improvisar e desenvolver bem.");
    section.find('[data-framer-name="Traditional"] p').text("Serviços improvisados");
    section.find('[data-framer-name="Automated"] p').text("Meu desenvolvimento");
    section.find("p").each((__, pEl) => {
      const node = $(pEl);
      const text = node.text().replace(/\s+/g, " ").trim();
      if (/notch automation/i.test(text)) node.text("Meu desenvolvimento");
      if (/traditional way/i.test(text) && !/vs/i.test(text)) node.text("Serviços improvisados");
    });
  });

  $("section[data-framer-name='CTA']").each((_, el) => {
    const section = $(el);
    section.find("h2").text("Tem um projeto em mente?");
    section.find('a[data-framer-name="Light"]').each((__, linkEl) => {
      const link = $(linkEl);
      link.attr("href", DISCORD);
      link.attr("target", "_blank");
      link.attr("rel", "noopener noreferrer");
      const p = link.find("p").first();
      p.attr("data-haze-label", "Conversar pelo Discord");
      p.html(rolling("Conversar pelo Discord"));
      const pad = link.find(".framer-esl6hy-container > div").first();
      if (pad.length && !pad.find("[data-haze='discord']").length) pad.prepend(DISCORD_ICON);
    });
    section.find('a[data-framer-name="Dark"]').each((__, linkEl) => {
      $(linkEl).attr("style", "display:none");
    });
  });

  $('[data-framer-name="Footer"]').each((_, el) => {
    const footer = $(el);
    footer.find('[data-framer-name="Tagline"] p').text("Desenvolvendo ideias em soluções digitais.");
    const news = footer.find('[data-framer-name="newsletter"]');
    news.find("strong, p").first().text(
      "Sites, aplicações e sistemas desenvolvidos com criatividade, atenção aos detalhes e propósito.",
    );
    news.find("form, input, button, .framer-auzm4l-container").remove();
    news.attr("data-haze-footer-desc", "");

    footer.find('[data-framer-name="Legals"] a').each((i, linkEl) => {
      const link = $(linkEl);
      link.removeAttr("href").removeAttr("target").removeAttr("rel");
      if (i === 0) link.text("© 2026 Haze. Todos os direitos reservados.");
      else if (i === 1) link.text("Feito por Haze.");
    });
  });

  if (!$("style[data-haze-fouc]").length) {
    $("head").prepend(
      `<style data-haze-fouc>html[data-haze-home]:not(.haze-painted) #main{opacity:0!important;pointer-events:none!important}html[data-haze-home].haze-painted #main{opacity:1!important;pointer-events:auto!important;transition:opacity .28s ease}html[data-haze-home] [data-framer-name="Case Study"],html[data-haze-home] [data-framer-name="Testimonials"],html[data-haze-home] [data-framer-name="Pricing"],html[data-haze-home] [data-framer-name="FAQs"]{display:none!important}html[data-haze-home] nav[data-framer-name="Desktop Closed"] [data-framer-name="Mid"],html[data-haze-home] nav[data-framer-name="Desktop Closed"] .framer-jyjdtl{width:48px!important;max-width:48px!important}html[data-haze-home] nav[data-framer-name="Desktop Closed"] [data-framer-name="Out"],html[data-haze-home] nav.haze-pc-header [data-framer-name="Out"]{display:none!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;overflow:hidden!important;position:absolute!important;visibility:hidden!important}html[data-haze-home] nav[data-framer-name="Desktop Closed"],html[data-haze-home] nav[data-framer-name="Desktop Closed"] *{transition:none!important;animation:none!important}</style>`,
    );
  }

  if (!$("script[data-haze-title-lock]").length) {
    $("head").prepend(
      `<script data-haze-title-lock>(function(){var T=${JSON.stringify(TITLE)};var D=${JSON.stringify(DESC)};function applyTitle(){try{var n=document.querySelector("title");if(!n){n=document.createElement("title");document.head&&document.head.appendChild(n)}if(n.textContent!==T)n.textContent=T}catch(e){}try{if(document.title!==T)document.title=T}catch(e){}}function lockMeta(){applyTitle();document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(function(m){var k=m.getAttribute("property")||m.getAttribute("name")||"";var v=k.indexOf("title")>=0?T:D;if(m.getAttribute("content")!==v)m.setAttribute("content",v)})}try{var desc=Object.getOwnPropertyDescriptor(Document.prototype,"title");Object.defineProperty(document,"title",{configurable:true,enumerable:true,get:function(){return T},set:function(){applyTitle()}});if(desc&&desc.set){var rawSet=desc.set;Object.defineProperty(Document.prototype,"title",{configurable:true,enumerable:true,get:function(){return T},set:function(){try{rawSet.call(this,T)}catch(e){}applyTitle()}})}}catch(e){}lockMeta();document.addEventListener("DOMContentLoaded",lockMeta);setInterval(lockMeta,250);try{new MutationObserver(lockMeta).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["content"]})}catch(e){}})();</script>`,
    );
  }

  if (!$("script[data-haze-base]").length) {
    $("head").prepend(
      `<script data-haze-base>window.__HAZE_BASE__=${JSON.stringify(basePath())};</script>`,
    );
  }

  if (!$("link[data-haze-css]").length) {
    $("head").append(`<link data-haze-css rel="stylesheet" href="${asset("/islands/site.css?v=39")}" />`);
    $("head").append(`<link data-haze-steps rel="stylesheet" href="${asset("/islands/steps.css?v=8")}" />`);
    $("head").append(`<link data-haze-solutions rel="stylesheet" href="${asset("/islands/solutions.css?v=10")}" />`);
    $("head").append(`<link data-haze-benefits rel="stylesheet" href="${asset("/islands/benefits.css?v=6")}" />`);
    $("head").append(`<link data-haze-closeout rel="stylesheet" href="${asset("/islands/closeout.css?v=2")}" />`);
  }
  const scripts = [
    asset("/islands/haze-react.js?v=16"),
    asset("/islands/hero.js?v=22"),
    asset("/islands/brand.js?v=9"),
    asset("/islands/appear.js?v=8"),
    asset("/islands/steps.js?v=6"),
    asset("/islands/solutions.js?v=8"),
    asset("/islands/benefits.js?v=4"),
    asset("/islands/comparison.js?v=1"),
    asset("/islands/closeout.js?v=5"),
    asset("/islands/boot.js?v=23"),
  ];
  for (const src of scripts) {
    if (!$(`script[src="${src}"]`).length) $("body").append(`<script src="${src}" defer></script>`);
  }

  $("p, a, strong, h2, h3, span, li").each((_, el) => {
    const node = $(el);
    if (node.children().length) return;
    const text = node.text();
    if (!/notch/i.test(text)) return;
    node.text(text.replace(/Notch/g, "Haze").replace(/notch/g, "Haze"));
  });

  removeComments($);
  return $.html().replace(/<!--[\s\S]*?-->/g, "");
}
