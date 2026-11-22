import { createRoot, type Root } from "react-dom/client";
import Lightfall from "../components/Lightfall/Lightfall";
import TechText from "../components/TechText/TechText";

const home = () => {
  const base = (window.__HAZE_BASE__ || "").replace(/\/$/, "");
  const path = (location.pathname || "/").replace(/\/$/, "") || "/";
  return path === "/" || (!!base && path === base);
};

declare global {
  interface Window {
    __HAZE_BASE__?: string;
  }
}

let lightRoot: Root | null = null;
let lightHost: HTMLElement | null = null;
let lightMode: "webgl" | "scatter" | null = null;
let textRoot: Root | null = null;
let textHost: HTMLElement | null = null;
let textSize = 0;
let textShift = 0;

function titleSize() {
  const w = window.innerWidth;
  if (w < 810) return 98;
  if (w < 1200) return 144;
  return 176;
}

function isTall() {
  return window.innerHeight / Math.max(window.innerWidth, 1) > 1.2 || window.innerWidth < 810;
}

function anchorShift(host: HTMLElement) {
  const slot = document.getElementById("haze-tech-slot");
  if (!slot) return 0;
  const stage = host.getBoundingClientRect();
  const box = slot.getBoundingClientRect();
  if (stage.height < 1 || box.height < 1) return 0;
  const mid = box.top + box.height / 2 - stage.top;
  return mid - stage.height / 2;
}

function placeholder(): HTMLElement | null {
  const node = document.querySelector(
    '[data-framer-name="Hero"] > [data-framer-name="Placeholder"], [data-framer-name="Hero"] > .framer-pskmbs',
  );
  return node instanceof HTMLElement ? node : null;
}

function clearLight(el: HTMLElement) {
  if (lightRoot) {
    lightRoot.unmount();
    lightRoot = null;
  }
  lightHost = null;
  lightMode = null;
  el.replaceChildren();
}

function startScatter(canvas: HTMLCanvasElement) {
  if ((canvas as HTMLCanvasElement & { __hazeLoop?: boolean }).__hazeLoop) return;
  (canvas as HTMLCanvasElement & { __hazeLoop?: boolean }).__hazeLoop = true;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const COLOR = "#02311d";
  const stars: { x: number; y: number; r: number; a: number; s: number; drift: number }[] = [];
  const streaks: { x: number; y: number; len: number; w: number; a: number; s: number; drift: number }[] = [];
  let width = 0;
  let height = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seed() {
    stars.length = 0;
    streaks.length = 0;
    const starCount = Math.round((width * height) / 4200);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.25,
        a: 0.18 + Math.random() * 0.7,
        s: 0.12 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.18,
      });
    }
    const streakCount = Math.round(width / 18);
    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 18 + Math.random() * 70,
        w: Math.random() < 0.2 ? 1.8 : 0.5 + Math.random() * 0.9,
        a: 0.08 + Math.random() * 0.28,
        s: 0.25 + Math.random() * 1.1,
        drift: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function draw() {
    ctx.fillStyle = COLOR;
    ctx.fillRect(0, 0, width, height);

    for (const streak of streaks) {
      if (!reduced) {
        streak.y += streak.s;
        streak.x += streak.drift;
      }
      if (streak.y - streak.len > height) {
        streak.y = -streak.len;
        streak.x = Math.random() * width;
      }
      if (streak.x < -20) streak.x = width + 20;
      if (streak.x > width + 20) streak.x = -20;
      const grad = ctx.createLinearGradient(streak.x, streak.y - streak.len, streak.x, streak.y);
      grad.addColorStop(0, "rgba(0,255,174,0)");
      grad.addColorStop(0.55, `rgba(170,255,220,${streak.a})`);
      grad.addColorStop(1, "rgba(0,255,174,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = streak.w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y - streak.len);
      ctx.lineTo(streak.x + streak.drift * 10, streak.y);
      ctx.stroke();
    }

    for (const star of stars) {
      if (!reduced) {
        star.y += star.s;
        star.x += star.drift;
      }
      if (star.y > height + 4) {
        star.y = -4;
        star.x = Math.random() * width;
      }
      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;
      ctx.fillStyle = `rgba(220,255,240,${star.a})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    const glow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.42,
      width * 0.08,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.72,
    );
    glow.addColorStop(0, "rgba(0,255,174,0.05)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const shade = ctx.createLinearGradient(0, height * 0.58, 0, height);
    shade.addColorStop(0, "rgba(2,49,29,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
  }

  resize();
  draw();
  const observer = new ResizeObserver(() => {
    resize();
    draw();
  });
  if (canvas.parentElement) observer.observe(canvas.parentElement);
  if (reduced) return;

  function loop() {
    if (!canvas.isConnected) {
      (canvas as HTMLCanvasElement & { __hazeLoop?: boolean }).__hazeLoop = false;
      observer.disconnect();
      return;
    }
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function paintScatter(el: HTMLElement) {
  clearLight(el);
  const wrap = document.createElement("div");
  wrap.className = "lightfall-container";
  wrap.style.width = "100%";
  wrap.style.height = "100%";
  const canvas = document.createElement("canvas");
  canvas.className = "lightfall-canvas";
  canvas.setAttribute("aria-hidden", "true");
  wrap.appendChild(canvas);
  el.appendChild(wrap);
  lightHost = el;
  lightMode = "scatter";
  startScatter(canvas);
}

function paintWebgl(el: HTMLElement) {
  if (lightMode === "scatter") clearLight(el);
  if (lightRoot && lightHost !== el) {
    lightRoot.unmount();
    lightRoot = null;
  }
  if (!lightRoot) lightRoot = createRoot(el);
  lightHost = el;
  lightMode = "webgl";
  lightRoot.render(
    <Lightfall
      colors={["#0a4a32", "#0d6b48", "#14c98a", "#00ffae"]}
      backgroundColor="#02311d"
      speed={0.42}
      streakCount={5}
      streakWidth={0.7}
      streakLength={1.4}
      backgroundGlow={0.14}
      glow={1.55}
      depth={1.75}
      density={1}
      mouseStrength={0}
      mouseInteraction={false}
      bloom={0.16}
      zoom={1.8}
      twinkle={0.9}
      headGlow={0.7}
      intro={false}
      style={{ width: "100%", height: "100%" }}
    />,
  );
}

function paintLight(el: HTMLElement) {
  if (isTall()) paintScatter(el);
  else paintWebgl(el);
}

function paintText(el: HTMLElement, shift: number) {
  const size = titleSize();
  if (textRoot && textHost !== el) {
    textRoot.unmount();
    textRoot = null;
  }
  if (!textRoot) textRoot = createRoot(el);
  textHost = el;
  textSize = size;
  textShift = shift;
  textRoot.render(
    <TechText
      text="Haze Dev"
      softness={0.85}
      intro="none"
      introDuration={1.4}
      reveal="area"
      reach={170}
      specks={0}
      strokeWidth={0.5}
      accentColor="#00ffae"
      letterSpacing={-0.02}
      color="#ffffff"
      fontSize={size}
      fontWeight={600}
      align="center"
      fontFamily='"Inter Display", Inter, sans-serif'
      offsetY={shift}
      style={{ width: "100%", height: "100%" }}
    />,
  );
  document.documentElement.classList.add("haze-title-live");
}

function mountLight() {
  if (!home()) return;
  const host = placeholder();
  if (!host) return;
  let el = document.getElementById("haze-lightfall-root");
  if (!(el instanceof HTMLElement)) {
    el = document.createElement("div");
    el.id = "haze-lightfall-root";
    el.setAttribute("aria-hidden", "true");
  }
  if (el.parentElement !== host) host.prepend(el);
  const nextMode = isTall() ? "scatter" : "webgl";
  if (lightHost === el && lightMode === nextMode) {
    if (nextMode === "webgl") paintWebgl(el);
    return;
  }
  paintLight(el);
}

function mountText() {
  if (!home()) return;
  const host = placeholder();
  const box = document.querySelector('[data-framer-name="Heading + subheading"] .framer-kpfuh9');
  if (!host || !(box instanceof HTMLElement)) return;
  const h1 = box.querySelector("h1");
  let slot = document.getElementById("haze-tech-slot");
  if (!(slot instanceof HTMLElement)) {
    slot = document.createElement("div");
    slot.id = "haze-tech-slot";
  }
  if (h1 instanceof HTMLElement) {
    if (slot.previousElementSibling !== h1) h1.insertAdjacentElement("afterend", slot);
  } else if (slot.parentElement !== box) {
    box.append(slot);
  }
  let el = document.getElementById("haze-tech-text-root");
  if (!(el instanceof HTMLElement)) {
    el = document.createElement("div");
    el.id = "haze-tech-text-root";
  }
  if (el.parentElement !== host) host.append(el);
  const shift = anchorShift(host);
  if (textHost === el && textSize === titleSize() && Math.abs(textShift - shift) < 1) {
    document.documentElement.classList.add("haze-title-live");
    return;
  }
  paintText(el, shift);
}

function ensure() {
  mountLight();
  mountText();
}

function boot() {
  ensure();
  const root = document.getElementById("main") || document.documentElement;
  const observer = new MutationObserver(() => {
    const host = placeholder();
    const light = document.getElementById("haze-lightfall-root");
    const text = document.getElementById("haze-tech-text-root");
    if (
      host &&
      light &&
      light.parentElement === host &&
      light.querySelector("canvas") &&
      text &&
      text.parentElement === host &&
      text.querySelector("canvas")
    ) {
      return;
    }
    window.requestAnimationFrame(ensure);
  });
  observer.observe(root, { childList: true, subtree: true });
  window.addEventListener("resize", () => {
    if (lightHost) paintLight(lightHost);
    const host = placeholder();
    if (!textHost || !host) return;
    const shift = anchorShift(host);
    if (textSize !== titleSize() || Math.abs(textShift - shift) > 1) paintText(textHost, shift);
  });
}

function whenFramer(run: () => void) {
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    run();
  };
  window.addEventListener("haze-settle", go, { once: true });
  setTimeout(go, 2200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => whenFramer(boot), { once: true });
} else {
  whenFramer(boot);
}
