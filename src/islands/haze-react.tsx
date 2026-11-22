import { createRoot, type Root } from "react-dom/client";
import Lightfall from "../components/Lightfall/Lightfall";
import TechText from "../components/TechText/TechText";

const home = () => location.pathname === "/";

let lightRoot: Root | null = null;
let lightHost: HTMLElement | null = null;
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

function paintLight(el: HTMLElement) {
  if (lightRoot && lightHost !== el) {
    lightRoot.unmount();
    lightRoot = null;
  }
  if (!lightRoot) lightRoot = createRoot(el);
  lightHost = el;
  lightRoot.render(
    <Lightfall
      colors={["#023624", "#023624", "#023624"]}
      backgroundColor="#02311d"
      speed={0.5}
      streakWidth={1}
      streakLength={1.6}
      backgroundGlow={0.18}
      glow={1.95}
      depth={2}
      mouseStrength={0}
      mouseInteraction={false}
      bloom={0.2}
      zoom={2.2}
      twinkle={1}
      intro={false}
      style={{ width: "100%", height: "100%" }}
    />,
  );
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
  if (lightHost === el) return;
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
    const host = placeholder();
    if (!textHost || !host) return;
    const shift = anchorShift(host);
    if (textSize !== titleSize() || Math.abs(textShift - shift) > 1) paintText(textHost, shift);
  });
}

function whenFramer(run) {
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
