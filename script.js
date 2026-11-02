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
let showAllProjects = false;

function playingCard(number) {
  // Stable deck mapping: 01 = 2♣, 02 = 3♣ ... 13 = A♣, then ♦, ♠, ♥.
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suits = [
    { symbol: "♣", name: "clubs" },
    { symbol: "♦", name: "diamonds" },
    { symbol: "♠", name: "spades" },
    { symbol: "♥", name: "hearts" }
  ];
  const projectNumber = Math.max(1, Number.parseInt(number, 10) || 1);
  const deckIndex = (projectNumber - 1) % 52;
  const rank = ranks[deckIndex % 13];
  const suit = suits[Math.floor(deckIndex / 13)];
  return `<div class="playing-card suit-${suit.name}" role="img" aria-label="${rank} of ${suit.name}">
    <span class="card-corner card-top">${rank}<b>${suit.symbol}</b></span>
    <span class="card-center">${suit.symbol}</span>
    <span class="card-corner card-bottom">${rank}<b>${suit.symbol}</b></span>
  </div>`;
}

function bindCadPreviewButtons(grid) {
  $$(".preview-cad", grid).forEach(button => {
    button.addEventListener("click", () => openCad(button.dataset.file, button.dataset.title));
  });
}

function renderProjects(category) {
  const grid = $("#projectGrid");
  const data = [...(window.PROJECTS?.[category] || [])];
  const meta = {
    autocad: ["DRAFTING / 2D DESIGN", "AutoCAD drawings"],
    github: ["SOFTWARE / OPEN SOURCE", "GitHub projects"],
    revit: ["BIM / ARCHITECTURAL MODELLING", "Revit projects"],
    staad: ["STRUCTURAL ANALYSIS / DESIGN", "STAAD.Pro projects"]
  };

  if (category !== "github") {
    data.sort((a, b) => Number.parseInt(b.number || "0", 10) - Number.parseInt(a.number || "0", 10));
  }

  $("#projectEyebrow").textContent = meta[category][0];
  $("#projectTitle").textContent = meta[category][1];
  $("#projectCount").textContent = `${String(data.length).padStart(2, "0")} ${category === "github" ? "REPOSITORIES" : "PROJECTS"}`;

  const showAllButton = $("#showAllProjects");
  showAllProjects = false;
  showAllButton.hidden = data.length <= 3;

  if (!data.length) {
    const label = category === "revit" ? "Revit" : "STAAD.Pro";
    grid.innerHTML = `<div class="empty-project"><span class="empty-symbol">＋</span><div class="mini-label">NO PROJECTS PUBLISHED</div><h3>${label} projects will appear here.</h3></div>`;
    return;
  }

  const renderCards = items => {
    if (category === "github") {
      return items.map((item, i) => `
        <article class="project-card github-card">
          <div class="project-card-top"><span class="project-number">GH / 0${i + 1}</span><span class="file-pill">${escapeHTML(item.type)}</span></div>
          <div class="project-visual github-visual"><span>{ }</span><i>OPEN SOURCE / PERSONAL PROJECT</i></div>
          <div class="project-card-body"><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description)}</p><div class="tag-list">${(item.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div><a class="project-link" href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div>
        </article>`).join("");
    }

    return items.map((item, i) => `
      <article class="project-card">
        <div class="project-card-top"><span class="project-number">${escapeHTML(item.number || String(i + 1).padStart(2, "0"))} / ${category.toUpperCase()}</span><span class="file-pill">${escapeHTML(item.type || "PROJECT")}</span></div>
        <div class="project-visual cad-visual"><div class="blueprint-grid"></div>${playingCard(item.number || i + 1)}<i>TECHNICAL DRAWING / ${escapeHTML(item.type || "FILE")}</i></div>
        <div class="project-card-body"><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description || "Project details will be added soon.")}</p>
        <div class="project-card-actions">
          ${item.viewer && item.file ? `<button class="small-action preview-cad" data-file="${escapeHTML(item.file)}" data-title="${escapeHTML(item.title)}">Preview drawing ↗</button>` : ""}
          ${item.file ? `<a class="small-action secondary" href="${escapeHTML(item.file)}" download>Download ${escapeHTML(item.type || "file")} ↓</a>` : ""}
          ${item.preview ? `<a class="small-action secondary" href="${escapeHTML(item.preview)}" target="_blank" rel="noreferrer">View sheets ↗</a>` : ""}
        </div></div>
      </article>`).join("");
  };

  const renderVisible = () => {
    grid.innerHTML = renderCards(showAllProjects ? data : data.slice(0, 3));
    bindCadPreviewButtons(grid);
  };

  renderVisible();
  showAllButton.textContent = `Show all ${data.length} projects ↓`;
  showAllButton.onclick = () => {
    showAllProjects = !showAllProjects;
    renderVisible();
    showAllButton.textContent = showAllProjects ? "Show less ↑" : `Show all ${data.length} projects ↓`;
  };
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

// Contact form: Web3Forms delivery with its zero-configuration hCaptcha integration.
const contactForm = $("#contactForm");
const emailInput = contactForm.querySelector('input[name="email"]');
const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
const configuredAccessKey = window.PORTFOLIO_CONFIG?.web3formsAccessKey || "";

if (accessKeyInput) accessKeyInput.value = configuredAccessKey;

function validVisitorEmail(value) {
  const email = String(value || "").trim();
  if (!email || email.length > 254 || /\s/.test(email) || email.includes("+")) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[A-Za-z0-9.!#$%&'*\/=?^_`{|}~-]+$/.test(local)) return false;
  if (!domain || domain.length > 253 || !domain.includes(".")) return false;
  const labels = domain.toLowerCase().split(".");
  if (labels.some(label => !label || label.length > 63 || label.startsWith("-") || label.endsWith("-") || !/^[a-z0-9-]+$/.test(label))) return false;
  if (!/^[a-z]{2,}$/i.test(labels[labels.length - 1])) return false;
  const localLooksFake = /^(test|testing|fake|spam|asdf|qwerty|no.?reply|example)([0-9._-]*|)$/i;
  if (localLooksFake.test(local)) return false;
  const disposableDomains = new Set([
    "mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com",
    "yopmail.com", "throwawaymail.com", "temp-mail.org", "getnada.com",
    "dispostable.com", "maildrop.cc", "sharklasers.com", "guerrillamail.net"
  ]);
  if (disposableDomains.has(domain.toLowerCase())) return false;
  return true;
}

emailInput.addEventListener("input", () => {
  emailInput.setCustomValidity(
    emailInput.value && !validVisitorEmail(emailInput.value)
      ? "Enter a valid email address. Plus-addressing and temporary email services are not accepted."
      : ""
  );
});

contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  const status = $("#formStatus");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const data = new FormData(contactForm);

  if (data.get("botcheck")) return;
  if (!validVisitorEmail(emailInput.value)) {
    emailInput.setCustomValidity("Enter a valid email address. Plus-addressing and temporary email services are not accepted.");
    emailInput.reportValidity();
    return;
  }
  emailInput.setCustomValidity("");

  const captchaResponse = contactForm.querySelector('textarea[name="h-captcha-response"]')?.value;
  if (!captchaResponse) {
    status.textContent = "PLEASE COMPLETE THE CAPTCHA";
    contactForm.querySelector(".h-captcha")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (!configuredAccessKey) {
    status.textContent = "FORM NOT CONFIGURED";
    return;
  }

  data.set("access_key", configuredAccessKey);
  data.set("subject", `Portfolio enquiry — ${String(data.get("name") || "Visitor").trim()}`);
  data.set("from_name", "Portfolio Contact Form");
  data.set("replyto", String(data.get("email") || "").trim());

  status.textContent = "SENDING...";
  submitButton.disabled = true;
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Submission failed");

    status.textContent = "MESSAGE SENT ✓";
    contactForm.reset();
    accessKeyInput.value = configuredAccessKey;
    emailInput.setCustomValidity("");
    if (window.hcaptcha && typeof window.hcaptcha.reset === "function") window.hcaptcha.reset();
  } catch (error) {
    status.textContent = "COULDN'T SEND — TRY AGAIN";
  } finally {
    submitButton.disabled = false;
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
