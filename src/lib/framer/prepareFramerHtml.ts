import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const DESC =
  "Desenvolvedor Full Stack. Gosto de criar App's e sistemas, diversificando diferentes linguagens e tecnologias.";

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

const BRAND =
  '<span class="haze-brand" data-haze-brand><img src="/images/brand/logo.png" alt="Haze" /><img class="haze-brand-green" src="/images/brand/logo-verde.png" alt="" /></span>';

const imageDir = path.join(process.cwd(), "public", "images", "framer");
const localImages = new Set(fs.existsSync(imageDir) ? fs.readdirSync(imageDir) : []);

function rewriteAssets(html: string) {
  return html.replace(
    /https:\\?\/\\?\/framerusercontent\.com\\?\/images\\?\/([A-Za-z0-9._~-]+\.(?:png|jpe?g|webp|gif|svg|avif))/gi,
    (full, name: string) => (localImages.has(name) ? `/images/framer/${name}` : full)
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
      `<img class="haze-tech" data-tech="${file}" src="/images/tech/${file}.svg" alt="${name}" />`
  ).join("");
  return `<div class="haze-marquee" data-haze-marquee><div class="haze-marquee-track">${icons}${icons}</div></div>`;
}

function mountBrand($: cheerio.CheerioAPI, box: cheerio.Cheerio<AnyNode>) {
  if (!box.length || box.find("[data-haze-brand]").length) return;
  box.attr("data-haze-brand-box", "");
  box.html(BRAND);
}

export function prepareFramerHtml(html: string, page: { pathname: string; origin: string }) {
  const $ = cheerio.load(rewriteAssets(html));
  const origin = page.origin.replace(/\/$/, "");
  const pathname = page.pathname || "/";
  const canonical = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  $("html").attr("lang", "pt-BR");

  $("title").each((_, el) => {
    const text = $(el).text();
    if (text.includes("Knotch - AI Automation")) $(el).text("Haze Dev");
    else if (text.includes("My Framer Site")) $(el).text(text.replace("My Framer Site", "Haze Dev"));
  });

  $('meta[property="og:title"]').each((_, el) => {
    const text = $(el).attr("content") || "";
    if (text.includes("Knotch - AI Automation")) $(el).attr("content", "Haze Dev");
    else if (text.includes("My Framer Site")) $(el).attr("content", text.replace("My Framer Site", "Haze Dev"));
  });

  $('meta[name="description"], meta[property="og:description"]').each((_, el) => {
    const text = $(el).attr("content") || "";
    if (text.includes("Knotch is a sleek")) $(el).attr("content", DESC);
  });

  $('link[rel="canonical"]').attr("href", canonical);
  $('meta[property="og:url"]').attr("content", canonical);
  $('link[rel="icon"]').attr("href", "/images/brand/favicon.png").attr("type", "image/png");
  $('link[rel="apple-touch-icon"]').attr("href", "/images/brand/apple-touch.png");
  $('meta[property="og:image"]').attr("content", `${origin}/images/brand/og.png`);

  $("a[href*='duplicateType=siteTemplate'], a[href*='framer.link/1YNSJpf']").each((_, el) => {
    const box = $(el).closest(".framer-1qebla2-container");
    if (box.length) box.remove();
    else $(el).remove();
  });
  $("#__framer-badge-container").remove();

  $('[data-framer-name="Logo + Menu Icon"] [data-framer-name="Logo"] [data-framer-component-type="SVG"]').each((_, el) => {
    mountBrand($, $(el));
  });
  $('[data-framer-name="CTA"] [data-framer-name="Logo"] [data-framer-component-type="SVG"], [data-framer-name="Footer"] [data-framer-name="Logo"] [data-framer-component-type="SVG"]').each((_, el) => {
    mountBrand($, $(el));
  });
  $('[data-framer-name="CTA"] [data-framer-name="Logo"] p, [data-framer-name="Footer"] [data-framer-name="Logo"] p').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text === "Notch" || text === "Haze") $(el).text("Haze");
  });

  const isHome = pathname === "/" || pathname === "";
  if (isHome) $("html").attr("data-haze-home", "1");
  const hero = $('[data-framer-name="Hero"]');
  if (isHome && hero.length) {
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
        '<div class="framer-1uas8sm" data-framer-component-type="RichTextContainer" data-haze="badge-side"><p class="framer-text framer-styles-preset-141u1yr" data-styles-preset="pAzayDUZg">Para Novos Projetos</p></div>'
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
      link.attr("href", "#portfolio");
      const p = link.find("p").first();
      p.addClass("haze-roll");
      p.attr("data-haze-label", "Meu Portfolio");
      p.html(rolling("Meu Portfolio"));
    });

    hero.find(".framer-fgh9n2").first().html(techMarkup());
    $('[data-framer-name="Case Study"]').first().attr("id", "portfolio");
  }

  const intro = $('[data-framer-name="Intro"]');
  if (isHome && intro.length) {
    intro.find("p.framer-styles-preset-tebz1a").first().text("Haze").addClass("haze-intro-mark");
    const sub = intro.find("h3 span").first();
    if (sub.length) sub.text("Dev Fullstack");
    else intro.find("h3").first().text("Dev Fullstack");
  }

  if (!$("link[data-haze-css]").length) {
    $("head").append('<link data-haze-css rel="stylesheet" href="/islands/site.css?v=25" />');
  }
  const scripts = [
    "/islands/haze-react.js?v=12",
    "/islands/hero.js?v=16",
    "/islands/brand.js?v=6",
    "/islands/appear.js?v=8",
    "/islands/boot.js?v=11",
  ];
  for (const src of scripts) {
    if (!$(`script[src="${src}"]`).length) $("body").append(`<script src="${src}" defer></script>`);
  }

  return $.html();
}
