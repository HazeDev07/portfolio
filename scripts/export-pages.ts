import fs from "node:fs";
import path from "node:path";
import { prepareFramerHtml } from "../src/lib/framer/prepareFramerHtml";

const root = process.cwd();
const outDir = path.join(root, "out");
const publicDir = path.join(root, "public");
const sourceDir = path.join(root, "src", "content", "framer", "source");

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hazedev.xyz").replace(/\/$/, "");

function copyDir(from: string, to: string) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function rewriteRootPaths(content: string) {
  if (!basePath) return content;
  return content
    .replace(/(["'`(=])\/images\//g, `$1${basePath}/images/`)
    .replace(/(["'`(=])\/islands\//g, `$1${basePath}/islands/`);
}

function rewriteTree(dir: string) {
  if (!basePath || !fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteTree(full);
      continue;
    }
    if (!/\.(css|html|svg|txt|xml)$/i.test(entry.name)) continue;
    const raw = fs.readFileSync(full, "utf8");
    const next = rewriteRootPaths(raw);
    if (next !== raw) fs.writeFileSync(full, next);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
copyDir(publicDir, outDir);

const homeRaw = fs.readFileSync(path.join(sourceDir, "index.html"), "utf8");
const homeHtml = prepareFramerHtml(homeRaw, { pathname: "/", origin: siteUrl });
fs.writeFileSync(path.join(outDir, "index.html"), homeHtml);

const notFound = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Página não encontrada · Haze</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="${basePath}/images/brand/favicon.png" type="image/png">
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: #0a0a0a;
      color: #f5f5f5;
      text-align: center;
      padding: 24px;
    }
    a { color: #00ffae; text-decoration: none; }
    p { color: rgba(255,255,255,.65); }
  </style>
</head>
<body>
  <main>
    <h1>Página não encontrada</h1>
    <p>Esse endereço não existe neste portfólio.</p>
    <p><a href="${basePath}/">Voltar para o início</a></p>
  </main>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, "404.html"), notFound);
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

rewriteTree(outDir);

console.log(`GitHub Pages export ready at ${outDir}`);
console.log(`site: ${siteUrl}`);
console.log(`base: ${basePath || "/"}`);
