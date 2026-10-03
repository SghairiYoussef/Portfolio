// DOM overlay: title card, HUD, prompt bubble, dialogue panel.
import { STATIONS, LINKS, GROUPS } from "./content.js";

export function createUI({ questIds, secretIds, onClose, onStart, onJump }) {
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
  const roomName = $("room-name");

  document.querySelectorAll("[data-href=classic]").forEach((a) => (a.href = LINKS.classic));

  // quest list, grouped by area, plus a secrets row
  for (const group of GROUPS) {
    const ids = questIds.filter((id) => STATIONS[id].group === group.id);
    const head = document.createElement("li");
    head.className = "group";
    head.innerHTML = `<span>${group.label}</span><b data-group="${group.id}"></b>`;
    list.appendChild(head);
    for (const id of ids) {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.id = id;
      b.innerHTML = `<span class="tick" aria-hidden="true"></span><span>${STATIONS[id].label}</span><small>${STATIONS[id].kicker}</small>`;
      b.addEventListener("click", () => {
        closeList();
        onJump(id);
      });
      li.appendChild(b);
      list.appendChild(li);
    }
  }
  const secretsLi = document.createElement("li");
  secretsLi.className = "secrets";
  list.appendChild(secretsLi);

  function closeList() {
    list.parentElement.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = list.parentElement.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("pointerdown", (e) => {
    if (!list.parentElement.contains(e.target)) closeList();
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
    dialog.dataset.group = st.group;
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

  function updateProgress(seen, secrets, justFound) {
    const n = questIds.filter((id) => seen.has(id)).length;
    count.textContent = `${n}/${questIds.length}`;
    bar.style.width = `${(n / questIds.length) * 100}%`;
    list.querySelectorAll("button[data-id]").forEach((b) => b.classList.toggle("done", seen.has(b.dataset.id)));
    for (const group of GROUPS) {
      const ids = questIds.filter((id) => STATIONS[id].group === group.id);
      const el = list.querySelector(`[data-group="${group.id}"]`);
      el.textContent = `${ids.filter((id) => seen.has(id)).length}/${ids.length}`;
    }
    secretsLi.innerHTML =
      `<span>Secrets</span><b>${secrets.size}/${secretIds.length}</b>` +
      `<small>${secrets.size === secretIds.length ? "All of them. Impressive." : "Some things only answer if you get close. Old codes still work."}</small>`;
    if (justFound) {
      const msg = n === questIds.length ? "Everything found. Thanks for looking around." : `Found: ${STATIONS[justFound].label} · ${n}/${questIds.length}`;
      showToast(msg);
    }
  }

  let toastT = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  let promptLabel = "";
  function showPrompt(label, x, y, isExit) {
    if (label !== promptLabel) {
      prompt.querySelector("span").textContent = isExit ? `${label} →` : label;
      promptLabel = label;
    }
    prompt.classList.toggle("exit", !!isExit);
    const half = Math.max(40, prompt.offsetWidth / 2 + 8);
    const cx = Math.min(window.innerWidth - half, Math.max(half, x));
    const cy = Math.max(prompt.offsetHeight + 72, y);
    prompt.style.transform = `translate(${Math.round(cx)}px, ${Math.round(cy)}px) translate(-50%, -100%)`;
    prompt.hidden = false;
  }
  function hidePrompt() {
    prompt.hidden = true;
  }
  prompt.addEventListener("click", () => window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE" })));

  function setRoom(name) {
    roomName.textContent = name;
  }

  return { toast: showToast, start, openDialog, closeDialog, updateProgress, showPrompt, hidePrompt, setRoom, dialogEl: dialog, closeEl: dClose };
}
