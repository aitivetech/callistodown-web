// Callisto Down: download links from config.js, nav state, reveal on scroll, gallery lightbox. No tracking.
(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  // Download links (config.js). Without JS the buttons only jump to #download.
  const dl = window.CALLISTO_DOWNLOADS || {};
  const soon = document.getElementById("dl-soon");
  document.querySelectorAll("[data-download]").forEach((a) => {
    const url = dl[a.dataset.download];
    if (dl.released && url) {
      a.href = url;
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.classList.add("dl-off");
    }
  });
  if (soon) soon.hidden = !!dl.released;

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Nav background after the hero
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Reveal on scroll
  const targets = document.querySelectorAll(".feature, .pillars li, .band, .gate, .status-card, .grid li, .facts");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
  }

  // Lightbox
  const box = document.getElementById("lightbox");
  const links = [...document.querySelectorAll("#grid a")];
  if (!box || !links.length || typeof box.showModal !== "function") return;
  const img = document.getElementById("lb-img");
  const cap = document.getElementById("lb-cap");
  let index = 0, opener = null;

  const show = (i) => {
    index = (i + links.length) % links.length;
    const a = links[index];
    img.src = a.getAttribute("href");
    img.alt = a.querySelector("img").alt;
    cap.textContent = `${a.dataset.caption || ""}  ·  ${index + 1} / ${links.length}`;
    const next = links[(index + 1) % links.length];
    new Image().src = next.getAttribute("href");
  };
  links.forEach((a, i) => a.addEventListener("click", (ev) => {
    ev.preventDefault();
    opener = a;
    show(i);
    box.showModal();
  }));
  box.querySelector(".lb-close").addEventListener("click", () => box.close());
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.tagName === "FIGURE") box.close(); });
  box.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight") show(index + 1);
    else if (ev.key === "ArrowLeft") show(index - 1);
  });
  box.addEventListener("close", () => { img.removeAttribute("src"); opener && opener.focus(); });

  // Swipe on touch screens
  let x0 = null;
  box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
