/* Trellis prototype: shared navigation + small UI helpers. */
(function () {
  const STAGES = [
    { id: "overview", href: "index.html", n: "0", name: "Overview", sub: "The idea, the loop, the bet" },
    { id: "connect", href: "connect.html", n: "1", name: "Connect", sub: "Every system becomes a typed node" },
    { id: "compose", href: "canvas.html", n: "2", name: "Compose", sub: "Draw the system on the canvas" },
    { id: "check", href: "check.html", n: "3", name: "Check", sub: "Pre-flight: lint, forecast, rate" },
    { id: "run", href: "run.html", n: "4", name: "Run & observe", sub: "Durable runs, goals, memory" },
    { id: "learn", href: "learn.html", n: "5", name: "Learn", sub: "Runs turn into improvements" },
  ];

  const MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="29" rx="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 16 16 6l10 10-10 10z M11 11l10 10 M21 11 11 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="16" r="2.6" fill="var(--accent)"/></svg>';
  const SHIELD = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 3.5 4.5v5c0 4 2.8 7 6.5 8.5 3.7-1.5 6.5-4.5 6.5-8.5v-5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m7 10 2.2 2.2L13.3 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const PLAN = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 8h14M8 8v9" stroke="currentColor" stroke-width="1.6"/></svg>';
  const BACK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15 4v5a4 4 0 0 1-4 4H4m0 0 3.5-3.5M4 13l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const WRENCH = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 3a4 4 0 0 0-3.8 5.3L3.5 13.5a1.4 1.4 0 0 0 2 2l5.2-5.2A4 4 0 0 0 16 6.5l-2.3 2.3-2-.5-.5-2L13.5 4A4 4 0 0 0 12.5 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function renderRail() {
    const shell = document.querySelector(".shell");
    const rail = document.getElementById("rail");
    if (!shell || !rail) return;
    const page = shell.dataset.page;
    const cur = (id) => (id === page ? ' aria-current="page"' : "");
    rail.innerHTML = `
      <a class="brand" href="index.html" aria-label="Trellis overview">${MARK}<span><b>Trellis</b><small>Concept prototype</small></span></a>
      <div class="rail-nav">
        <div class="rail-group">
          <p class="rail-label">The loop</p>
          <ol class="loop">
            ${STAGES.map((s) => `<li><a href="${s.href}" title="${s.n}. ${s.name}"${cur(s.id)}><span class="dot">${s.n}</span><span><span class="stage-name">${s.name}</span><span class="stage-sub">${s.sub}</span></span></a></li>`).join("")}
          </ol>
          <div class="loop-back">${BACK}<span>Learn feeds back into Compose</span></div>
        </div>
        <div class="rail-group">
          <p class="rail-label">Change safely</p>
          <a class="frame-link" style="border-color:var(--accent)" href="workshop.html" title="Workshop"${cur("workshop")}><span class="dot">${WRENCH}</span><span><span class="stage-name">Workshop</span><span class="stage-sub">Sandbox, test, ship a PR</span></span></a>
        </div>
        <div class="rail-group">
          <p class="rail-label">Across every stage</p>
          <a class="frame-link" href="govern.html" title="Govern"${cur("govern")}><span class="dot">${SHIELD}</span><span><span class="stage-name">Govern</span><span class="stage-sub">Policy, guardrails, approvals, audit</span></span></a>
        </div>
        <div class="rail-group">
          <p class="rail-label">Making it real</p>
          <a class="frame-link" style="border-style:dashed" href="blueprint.html" title="Blueprint"${cur("blueprint")}><span class="dot">${PLAN}</span><span><span class="stage-name">Blueprint</span><span class="stage-sub">Architecture, roadmap, risks</span></span></a>
        </div>
      </div>
      <p class="rail-foot">Concept prototype. Every number on these pages is illustrative sample data, not a measurement.</p>`;
  }

  // ---------- helpers ----------
  window.$ = (s, r = document) => r.querySelector(s);
  window.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  window.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastTimer;
  window.toast = function (msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  };

  window.openDrawer = function (html) {
    closeDrawer();
    const scrim = document.createElement("div"); scrim.className = "scrim"; scrim.addEventListener("click", closeDrawer);
    const d = document.createElement("aside"); d.className = "drawer"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = html;
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeDrawer));
    document.body.append(scrim, d);
    const f = d.querySelector("button, a, select, input"); if (f) f.focus();
    return d;
  };
  window.openModal = function (html) {
    closeDrawer();
    const scrim = document.createElement("div"); scrim.className = "scrim"; scrim.addEventListener("click", closeDrawer);
    const d = document.createElement("section"); d.className = "modal"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = html;
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeDrawer));
    document.body.append(scrim, d);
    const f = d.querySelector("button"); if (f) f.focus();
    return d;
  };
  window.closeDrawer = function () { $$(".scrim, .drawer, .modal").forEach((n) => n.remove()); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  window.copyText = function (text, btn) {
    const done = () => toast("Copied to clipboard");
    try {
      navigator.clipboard.writeText(text).then(done, () => toast("Copy was blocked here. Select the text and copy it instead."));
    } catch (e) { toast("Copy was blocked here. Select the text and copy it instead."); }
  };

  // Tabs: <div class="tabs" data-tabs="name"><button data-tab="a">…</button></div> + panels with data-panel="name:a"
  function initTabs() {
    $$("[data-tabs]").forEach((bar) => {
      const group = bar.dataset.tabs;
      const btns = $$("button[data-tab]", bar);
      btns.forEach((b) => b.setAttribute("role", "tab"));
      bar.setAttribute("role", "tablist");
      const select = (key) => {
        btns.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === key)));
        $$(`[data-panel^="${group}:"]`).forEach((p) => { p.hidden = p.dataset.panel !== `${group}:${key}`; });
      };
      btns.forEach((b) => b.addEventListener("click", () => select(b.dataset.tab)));
      const first = btns.find((b) => b.getAttribute("aria-selected") === "true") || btns[0];
      if (first) select(first.dataset.tab);
    });
  }

  // Shared money/time formatting
  window.fmt$ = (v) => (v >= 100 ? "$" + Math.round(v).toLocaleString("en-US") : v >= 1 ? "$" + v.toFixed(2) : "$" + v.toFixed(3));
  window.fmtS = (ms) => (ms >= 60000 ? (ms / 60000).toFixed(1) + " min" : (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + " s");

  renderRail();
  initTabs();
})();
