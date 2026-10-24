// Callisto Down: download links from config.js, nav state, reveal on scroll, gallery lightbox. No tracking.
(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  // Downloads (config.js, detect.js). Without JS the primary button only jumps to #download.
  setupDownloads();

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

  function setupDownloads() {
    const cfg = window.CALLISTO_DOWNLOADS;
    const box = document.getElementById("dl-platforms");
    const primary = document.getElementById("dl-primary");
    if (!cfg || !box || !primary) return;
    const icons = {
      win: '<svg viewBox="0 0 24 24"><path d="M3 5.5l7.5-1v7H3zM11.5 4.4L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.4z"/></svg>',
      linux: '<svg viewBox="0 0 24 24"><path d="M12 2.5c-2.3 0-3.6 1.9-3.6 4.4 0 1.5.3 2.4-.8 4-1.2 1.7-2.6 3.6-2.6 6 0 .6.1 1.1.3 1.6-.6.4-1.3.9-1.3 1.6 0 1 1.6 1.3 3.3 1.6 1.2.2 2.2.8 3 .8.7 0 1.2-.4 1.7-.4s1 .4 1.7.4c.8 0 1.8-.6 3-.8 1.7-.3 3.3-.6 3.3-1.6 0-.7-.7-1.2-1.3-1.6.2-.5.3-1 .3-1.6 0-2.4-1.4-4.3-2.6-6-1.1-1.6-.8-2.5-.8-4 0-2.5-1.3-4.4-3.6-4.4z"/></svg>',
      osx: '<svg viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C7 7.3 5.6 8.2 4.8 9.6c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4 1.2-.1 1.6-.8 3-.8s1.8.8 3 .8c1.3 0 2.1-1.2 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.9zM14.2 5.5c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z"/></svg>',
    };
    const family = (rid) => rid.split("-")[0];
    const rids = Object.keys(cfg.platforms);
    let rid = null;
    let stability = cfg.defaultStability === "unstable" ? "unstable" : "stable";
    let detected = null;

    // The platform list
    rids.forEach((r) => {
      const p = cfg.platforms[r];
      const label = document.createElement("label");
      label.className = "dl-plat" + (p.available ? "" : " is-later");
      label.innerHTML =
        '<input type="radio" name="dl-rid" value="' + r + '"' + (p.available ? "" : " disabled") + ">" +
        '<span class="dl-plat-icon" aria-hidden="true">' + icons[family(r)] + "</span>" +
        "<span class=\"dl-plat-name\"><b>" + p.os + "</b><small>" + p.arch + "</small></span>" +
        '<em class="dl-plat-tag">' + (p.available ? "" : "Coming later") + "</em>";
      box.appendChild(label);
    });

    const soon = document.getElementById("dl-soon");
    if (soon) soon.hidden = !!cfg.released;
    const channelOpen = (c) => !cfg.channels || cfg.channels[c] !== false;
    if (!channelOpen(stability)) stability = stability === "stable" ? "unstable" : "stable";
    document.querySelectorAll('input[name="dl-channel"]').forEach((i) => {
      i.checked = i.value === stability;
      i.disabled = !channelOpen(i.value);
      i.closest("label").title = i.disabled ? "Coming later" : "";
    });

    function render() {
      box.querySelectorAll("input").forEach((i) => {
        i.checked = i.value === rid;
        i.closest("label").classList.toggle("is-detected", i.value === detected);
        const tag = i.closest("label").querySelector(".dl-plat-tag");
        if (cfg.platforms[i.value].available) tag.textContent = i.value === detected ? "Detected" : "";
      });
      const shown = rid || detected;
      const p = shown ? cfg.platforms[shown] : null;
      const icon = document.getElementById("dl-primary-icon");
      const label = document.getElementById("dl-primary-label");
      const sub = document.getElementById("dl-primary-sub");
      const ok = !!(cfg.released && rid && cfg.platforms[rid].available);
      icon.innerHTML = p ? icons[family(shown)] : "";
      if (!p) { label.textContent = "Download the launcher"; sub.textContent = "Pick your platform below"; }
      else if (!p.available) { label.textContent = p.os + " " + p.arch; sub.textContent = "Coming later · pick another platform below"; }
      else {
        label.textContent = (cfg.released ? "Download for " : "") + p.os + " " + p.arch;
        sub.textContent = cfg.released
          ? (stability === "stable" ? "Stable" : "Unstable") + " · " + cfg.kind(shown)
          : "First public test build coming soon";
      }
      primary.classList.toggle("is-unstable", stability === "unstable");
      if (ok) {
        primary.href = cfg.url(rid, stability);
        primary.removeAttribute("aria-disabled");
        primary.classList.remove("is-off");
      } else {
        primary.removeAttribute("href");
        primary.setAttribute("aria-disabled", "true");
        primary.classList.add("is-off");
      }
      document.getElementById("dl-channel-note").textContent = stability === "stable"
        ? "Stable: the builds we have tested."
        : "Unstable: testing builds with the newest changes. They may break, and worlds may not carry over.";
    }

    box.addEventListener("change", (e) => { if (e.target.name === "dl-rid") { rid = e.target.value; render(); } });
    document.querySelectorAll('input[name="dl-channel"]').forEach((i) =>
      i.addEventListener("change", () => { stability = i.value; render(); }));

    render();
    const detectedNote = document.getElementById("dl-detected");
    (window.CallistoDetect ? window.CallistoDetect.detectRid() : Promise.resolve(null)).then((d) => {
      detected = d && cfg.platforms[d] ? d : null;
      // Preselect the detected platform when it can be downloaded; otherwise leave the choice to the visitor.
      if (detected && cfg.platforms[detected].available) rid = detected;
      if (detected) {
        const p = cfg.platforms[detected];
        detectedNote.textContent = "Detected: " + p.os + " " + p.arch + ". Not right? Pick your platform below.";
      } else {
        detectedNote.textContent = "We could not detect a desktop platform. Pick yours below.";
      }
      render();
    }).catch(() => render());
  }
})();
