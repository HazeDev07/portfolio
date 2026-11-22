import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { prepareFramerHtml } from "@/lib/framer/prepareFramerHtml";

const sourceDir = path.join(process.cwd(), "src", "content", "framer", "source");
const memory = new Map<string, string>();

function safeFile(slug: string[] | undefined) {
  const parts = slug?.filter(Boolean) ?? [];
  if (parts.some((part) => part === "." || part === ".." || part.includes("\\") || part.includes("/"))) return null;
  const rel = parts.length === 0 ? "index.html" : `${parts.join("/")}.html`;
  const file = path.resolve(sourceDir, rel);
  const relative = path.relative(sourceDir, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return file;
}

async function readPage(file: string) {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  const pathname = request.nextUrl.pathname || "/";
  const origin = request.nextUrl.origin;
  const requested = safeFile(slug);
  let status = 200;
  let raw = requested ? await readPage(requested) : null;
  if (!raw) {
    status = 404;
    raw = await readPage(path.join(sourceDir, "404.html"));
  }
  if (!raw) {
    return new Response("Página não encontrada", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const key = `v26:${status}:${requested ?? "404"}:${origin}`;
  let html = memory.get(key);
  if (!html) {
    html = prepareFramerHtml(raw, { pathname, origin });
    memory.set(key, html);
  }
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
