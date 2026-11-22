import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { prepareFramerHtml } from "@/lib/framer/prepareFramerHtml";

const sourceDir = path.join(process.cwd(), "src", "content", "framer", "source");
const memory = new Map<string, string>();

async function readHome() {
  try {
    return await fs.readFile(path.join(sourceDir, "index.html"), "utf8");
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  const parts = slug?.filter(Boolean) ?? [];
  const origin = request.nextUrl.origin;

  if (parts.length > 0) {
    return Response.redirect(new URL("/", origin), 308);
  }

  const raw = await readHome();
  if (!raw) {
    return new Response("Página não encontrada", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const key = `v50:${origin}`;
  let html = memory.get(key);
  if (!html) {
    html = prepareFramerHtml(raw, { pathname: "/", origin });
    memory.set(key, html);
  }

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
