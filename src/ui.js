// DOM overlay: title card, HUD, prompt bubble, dialogue panel.
import { STATIONS, LINKS } from "./content.js";

export function createUI({ questIds, onClose, onStart, onJump }) {
  const $ = (id) => document.getElementById(id);
  const title = $("title");
  const hud = $("hud");
  const prompt = $("prompt");
  const dialog = $("dialog");
  const dKicker = $("d-kicker");
  const dTitle = $("d-title");
  const dBody = $("d-body");
  const dLinks = $("d-links");
  const dClose = $("d-close");
  const count = $("q-count");
  const bar = $("q-bar");
  const list = $("q-list");
  const toggle = $("q-toggle");
  const toast = $("toast");

  document.querySelectorAll("[data-href=classic]").forEach((a) => (a.href = LINKS.classic));

  // quest list
  for (const id of questIds) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.id = id;
    b.innerHTML = `<span class="tick" aria-hidden="true"></span><span>${STATIONS[id].label}</span><small>${STATIONS[id].kicker}</small>`;
    b.addEventListener("click", () => {
      list.parentElement.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      onJump(id);
    });
    li.appendChild(b);
    list.appendChild(li);
  }
  toggle.addEventListener("click", () => {
    const open = list.parentElement.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  let started = false;
  function start() {
    if (started) return;
    started = true;
    title.classList.add("gone");
    hud.hidden = false;
    setTimeout(() => (title.hidden = true), 500);
    onStart();
  }
  $("start").addEventListener("click", start);

  let lastFocus = null;
  function openDialog(st) {
    lastFocus = document.activeElement;
    dKicker.textContent = st.kicker;
    dTitle.textContent = st.title;
    dBody.innerHTML = st.body;
    dLinks.innerHTML = "";
    for (const l of st.links || []) {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.className = l.primary ? "btn primary" : "btn";
      if (!l.href.startsWith("mailto:") && !l.href.startsWith("/")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      dLinks.appendChild(a);
    }
    dLinks.hidden = !(st.links && st.links.length);
    dialog.hidden = false;
    requestAnimationFrame(() => dialog.classList.add("show"));
    dBody.scrollTop = 0;
    dClose.focus({ preventScroll: true });
  }
  function closeDialog() {
    dialog.classList.remove("show");
    dialog.hidden = true;
    onClose();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  dClose.addEventListener("click", closeDialog);

  function updateProgress(seen, justFound) {
    const n = questIds.filter((id) => seen.has(id)).length;
    count.textContent = `${n}/${questIds.length}`;
    bar.style.width = `${(n / questIds.length) * 100}%`;
    list.querySelectorAll("button").forEach((b) => b.classList.toggle("done", seen.has(b.dataset.id)));
    if (justFound) {
      const msg = n === questIds.length ? "Everything found. Thanks for looking around." : `Found: ${STATIONS[justFound].label}`;
      showToast(msg);
    }
  }

  let toastT = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  let promptLabel = "";
  function showPrompt(label, x, y) {
    if (label !== promptLabel) {
      prompt.querySelector("span").textContent = label;
      promptLabel = label;
    }
    prompt.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -100%)`;
    prompt.hidden = false;
  }
  function hidePrompt() {
    prompt.hidden = true;
  }
  prompt.addEventListener("click", () => {
    const ev = new KeyboardEvent("keydown", { code: "KeyE" });
    window.dispatchEvent(ev);
  });

  return { toast: showToast, start, openDialog, closeDialog, updateProgress, showPrompt, hidePrompt, dialogEl: dialog };
}
