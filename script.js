const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  $("#mainNav").classList.toggle("open", open);
});
$$('#mainNav a').forEach(link => link.addEventListener("click", () => {
  $("#mainNav").classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".section-block, .quick-links a, .timeline-item, .credential-card").forEach(el => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// CAD embed URL: MLightCAD reads the public DWG/DXF URL in the browser.
function cadViewerUrl(filePath) {
  const absoluteFileUrl = new URL(filePath, window.location.href).href;
  return "https://mlightcad.com/embed.html?url=" + encodeURIComponent(absoluteFileUrl) + "&mode=review&toolbar=1";
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function renderProjects(category) {
  const grid = $("#projectGrid");
  const data = window.PROJECTS?.[category] || [];
  const meta = {
    autocad: ["DRAFTING / 2D DESIGN", "AutoCAD drawings"],
    github: ["SOFTWARE / OPEN SOURCE", "GitHub projects"],
    revit: ["BIM / ARCHITECTURAL MODELLING", "Revit projects"],
    staad: ["STRUCTURAL ANALYSIS / DESIGN", "STAAD.Pro projects"]
  };
  $("#projectEyebrow").textContent = meta[category][0];
  $("#projectTitle").textContent = meta[category][1];
  $("#projectCount").textContent = `${String(data.length).padStart(2, "0")} ${category === "github" ? "REPOSITORIES" : "PROJECTS"}`;

  if (!data.length) {
    grid.innerHTML = `<div class="empty-project"><span class="empty-symbol">＋</span><div class="mini-label">WORK IN PROGRESS</div><h3>New ${category === "staad" ? "STAAD.Pro" : "Revit"} work will appear here.</h3><p>This category is ready. Add your project files and an entry in <code>projects.js</code> whenever you have work to share.</p></div>`;
    return;
  }

  if (category === "github") {
    grid.innerHTML = data.map((item, i) => `
      <article class="project-card github-card">
        <div class="project-card-top"><span class="project-number">GH / 0${i + 1}</span><span class="file-pill">${escapeHTML(item.type)}</span></div>
        <div class="project-visual github-visual"><span>{ }</span><i>OPEN SOURCE / PERSONAL PROJECT</i></div>
        <div class="project-card-body"><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description)}</p><div class="tag-list">${(item.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div><a class="project-link" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div>
      </article>`).join("");
    return;
  }

  grid.innerHTML = data.map((item, i) => `
    <article class="project-card">
      <div class="project-card-top"><span class="project-number">${escapeHTML(item.number || String(i + 1).padStart(2, "0"))} / ${category.toUpperCase()}</span><span class="file-pill">${escapeHTML(item.type || "PROJECT")}</span></div>
      <div class="project-visual cad-visual"><div class="blueprint-grid"></div><div class="blueprint-shape shape-${i % 4}"><span>${escapeHTML(item.number || "＋")}</span></div><i>TECHNICAL DRAWING / ${escapeHTML(item.type || "FILE")}</i></div>
      <div class="project-card-body"><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description || "Project details will be added soon.")}</p>
      <div class="project-card-actions">
        ${item.viewer && item.file ? `<button class="small-action preview-cad" data-file="${escapeHTML(item.file)}" data-title="${escapeHTML(item.title)}">Preview drawing ↗</button>` : ""}
        ${item.file ? `<a class="small-action secondary" href="${escapeHTML(item.file)}" download>Download ${escapeHTML(item.type || "file")} ↓</a>` : ""}
        ${item.preview ? `<a class="small-action secondary" href="${escapeHTML(item.preview)}" target="_blank" rel="noreferrer">View sheets ↗</a>` : ""}
      </div></div>
    </article>`).join("");
  $$(".preview-cad", grid).forEach(button => button.addEventListener("click", () => openCad(button.dataset.file, button.dataset.title)));
}
function openCad(file, title) {
  const modal = $("#cadModal");
  if (!modal) return;
  $("#cadModalTitle").textContent = title;
  $("#cadFrame").src = cadViewerUrl(file);
  $("#cadDownload").href = file;
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}
function closeCad() {
  const modal = $("#cadModal");
  if (!modal) return;
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
  $("#cadFrame").src = "about:blank";
  document.body.classList.remove("modal-open");
}
const modalMarkup = `<div class="cad-modal" id="cadModal" aria-hidden="true"><div class="cad-modal-panel"><div class="cad-modal-head"><div><span class="mini-label">MLIGHTCAD / BROWSER VIEWER</span><h3 id="cadModalTitle">Drawing preview</h3></div><div class="modal-actions"><a id="cadDownload" class="small-action secondary" href="#" download>Download ↓</a><button class="modal-close" id="cadClose" aria-label="Close viewer">×</button></div></div><iframe id="cadFrame" title="MLightCAD drawing preview" allowfullscreen></iframe><div class="cad-modal-foot">If the preview does not load, use Download to open the DWG in a CAD application. The drawing must be publicly accessible for the embedded viewer.</div></div></div>`;
document.body.insertAdjacentHTML("beforeend", modalMarkup);
$("#cadClose").addEventListener("click", closeCad);
$("#cadModal").addEventListener("click", e => { if (e.target.id === "cadModal") closeCad(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCad(); });

$$(".project-tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".project-tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  renderProjects(tab.dataset.category);
}));
renderProjects("autocad");

// Contact form: Formspree endpoint if configured; otherwise open a prefilled email.
$("#contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  const status = $("#formStatus");
  const endpoint = window.PORTFOLIO_CONFIG?.formspreeEndpoint || "";
  if (endpoint.trim()) {
    status.textContent = "SENDING...";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("Submission failed");
      status.textContent = "MESSAGE SENT ✓";
      form.reset();
    } catch {
      status.textContent = "COULDN'T SEND — USE EMAIL LINK";
    }
  } else {
    const subject = encodeURIComponent(`Portfolio enquiry from ${payload.name}`);
    const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
    window.location.href = `mailto:${window.PORTFOLIO_CONFIG.email}?subject=${subject}&body=${body}`;
    status.textContent = "OPENING YOUR EMAIL APP...";
  }
});

// Active nav marker
const sections = $$("main section[id]");
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('#mainNav a').forEach(a => a.classList.toggle("current", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => navObserver.observe(section));
