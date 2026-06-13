/* =========================================================================
   Ormia Abdullah — Digital CV : interactions & rendering
========================================================================= */
(function () {
  "use strict";
  const data = window.CV;
  let lang = localStorage.getItem("cv-lang") || "sv";
  const L = (obj) => (obj && (obj[lang] ?? obj.sv)) || "";
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  const ICONS = {
    mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.8a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.1c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.97 1.32-1.97 2.7V21H9z"/></svg>'
  };

  function renderContact() {
    const root = document.getElementById("contactRow");
    if (!root) return;
    const c = data.contact;
    let html = `
      <a href="mailto:${c.email}" class="chip-link">${ICONS.mail}${c.email}</a>
      <a href="tel:${c.phoneHref}" class="chip-link">${ICONS.phone}${c.phone}</a>`;
    if (c.linkedin) html += `
      <a href="${c.linkedin.href}" target="_blank" rel="noopener" class="chip-link">${ICONS.linkedin}${c.linkedin.label}</a>`;
    html += `
      <span class="chip-link static">${ICONS.pin}<span data-i18n="about.location"></span></span>`;
    root.innerHTML = html;
    const loc = root.querySelector('[data-i18n="about.location"]');
    if (loc) loc.textContent = data.i18n[lang]["about.location"];
  }

  function renderExperience() {
    const root = document.getElementById("timeline");
    root.innerHTML = "";
    data.experience.forEach((e, i) => {
      const item = el("div", "tl-item reveal");
      item.dataset.delay = String(Math.min(i + 1, 4));
      item.innerHTML = `
        <div class="tl-period">${L(e.period)}</div>
        <div class="tl-main">
          <div class="tl-role">${L(e.role)}</div>
          <div class="tl-company">${e.company}</div>
          <p class="tl-body">${L(e.body)}</p>
          <div class="tl-tags">${e.tags.map((x) => `<span class="tag">${x}</span>`).join("")}</div>
        </div>`;
      root.appendChild(item);
    });
  }

  function renderSkills() {
    const root = document.getElementById("skillGroups");
    root.innerHTML = "";
    data.skills.forEach((g, i) => {
      const card = el("div", "skill-card reveal");
      card.dataset.delay = String(Math.min(i + 1, 4));
      card.innerHTML = `
        <h3>${L(g.title)}</h3>
        <div class="skill-chips">${g.items.map((x) => `<span class="skill-chip">${x}</span>`).join("")}</div>`;
      root.appendChild(card);
    });
  }

  function renderEducation() {
    const lineItem = (o) => `<li><span class="li-title">${L(o.title)}</span><span class="li-meta">${o.meta}</span></li>`;
    document.getElementById("eduList").innerHTML = data.education.map(lineItem).join("");
    document.getElementById("certList").innerHTML = data.certs.map(lineItem).join("");
    const engRoot = document.getElementById("engageList");
    if (engRoot && data.engagements) engRoot.innerHTML = data.engagements.map(lineItem).join("");
    document.getElementById("langList").innerHTML = data.languages
      .map(
        (lg) => `
        <li>
          <div class="lang-head"><span class="l-name">${L(lg.name)}</span><span class="l-level">${L(lg.level)}</span></div>
          <div class="lang-dots">${Array.from({ length: 5 }, (_, i) => `<span class="${i < lg.dots ? "on" : ""}"></span>`).join("")}</div>
        </li>`
      )
      .join("");
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (data.i18n[lang] && data.i18n[lang][key] != null) node.textContent = data.i18n[lang][key];
    });
    document.documentElement.lang = lang;
    document.title = lang === "sv"
      ? "Ormia Abdullah — Analytiker & Civilingenjör"
      : "Ormia Abdullah — Analyst & M.Sc. Engineer";
  }

  function renderAll() {
    applyStaticI18n();
    renderContact();
    renderExperience();
    renderSkills();
    renderEducation();
    observeReveals();
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    localStorage.setItem("cv-lang", lang);
    document.querySelectorAll(".lang-opt").forEach((o) => o.classList.toggle("is-active", o.dataset.lang === lang));
    document.body.classList.add("lang-swapping");
    setTimeout(() => {
      renderAll();
      requestAnimationFrame(() => document.body.classList.remove("lang-swapping"));
    }, 180);
  }
  document.getElementById("langToggle").addEventListener("click", () => setLang(lang === "sv" ? "en" : "sv"));

  const savedTheme = localStorage.getItem("cv-theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cv-theme", next);
  });

  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((n) => io.observe(n));
  }

  const topbar = document.querySelector(".topbar");
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const glow = document.querySelector(".cursor-glow");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let rx = 0, ry = 0, gx = 0, gy = 0, raf;
    window.addEventListener("mousemove", (e) => {
      rx = e.clientX; ry = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      gx += (rx - gx) * 0.12; gy += (ry - gy) * 0.12;
      glow.style.transform = `translate(${gx - 230}px, ${gy - 230}px)`;
      raf = Math.abs(rx - gx) > 0.5 || Math.abs(ry - gy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
  }

  // download as PDF — uses the browser's print-to-PDF (vector text, always current)
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", () => window.print());
  let titleBeforePrint;
  window.addEventListener("beforeprint", () => {
    titleBeforePrint = document.title;
    document.title = "Ormia Abdullah - CV"; // becomes the suggested PDF filename
  });
  window.addEventListener("afterprint", () => {
    if (titleBeforePrint) document.title = titleBeforePrint;
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll(".lang-opt").forEach((o) => o.classList.toggle("is-active", o.dataset.lang === lang));
  renderAll();
})();
