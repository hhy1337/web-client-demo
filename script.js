// ===== Utilities =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const EMAIL = "hehehong2006@163.com";

function showToast(msg) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.style.opacity = "0";
  }, 1600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for older browsers / permission issues
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      ta.remove();
    }
  }
}

// ===== Year =====
$("#year").textContent = String(new Date().getFullYear());

// ===== Copy email buttons =====
function bindCopy(btnSelector) {
  const btn = $(btnSelector);
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const ok = await copyText(EMAIL);
    if (ok) showToast("Email copied ✅");
    else showToast("Copy failed (browser restriction)");
  });
}
bindCopy("#copyEmailBtn");
bindCopy("#copyEmailBtn2");

// ===== Back to top =====
$("#toTopBtn")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Work filter =====
const chips = $$(".chip");
const cards = $$(".card", $("#workGrid"));

function setActiveChip(activeBtn) {
  chips.forEach((b) => {
    const isActive = b === activeBtn;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function applyFilter(tag) {
  cards.forEach((card) => {
    const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
    const show = tag === "all" || tags.includes(tag);
    card.style.display = show ? "" : "none";
  });
}

chips.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.filter || "all";
    setActiveChip(btn);
    applyFilter(tag);
  });
});

// ===== Demo form: generate email draft =====
const form = $("#demoForm");
const draftBox = $("#draftBox");
const copyDraftBtn = $("#copyDraftBtn");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const type = (data.get("type") || "").toString().trim();
  const desc = (data.get("desc") || "").toString().trim();

  const subject = `[Project] ${type || "Inquiry"} - ${name || "Client"}`;
  const body = [
    `Hi Haoyu,`,
    ``,
    `My name is ${name || "(your name)"} and I'd like to discuss a ${type || "(project type)"} project.`,
    ``,
    `Project brief:`,
    `${desc || "(brief description)"}`,
    ``,
    `Timeline: (e.g., 1–2 weeks)`,
    `Budget: (optional)`,
    `Reference links: (optional)`,
    ``,
    `Thanks!`,
    `${name || "(your name)"}`
  ].join("\n");

  const draft = `Subject: ${subject}\n\n${body}`;
  draftBox.textContent = draft;

  copyDraftBtn.disabled = false;
  showToast("Draft generated ✉️");
});

copyDraftBtn?.addEventListener("click", async () => {
  const text = draftBox?.textContent || "";
  if (!text) return;
  const ok = await copyText(text);
  if (ok) showToast("Draft copied ✅");
  else showToast("Copy failed (browser restriction)");
});
// ===== reveal on scroll =====
const revealTargets = document.querySelectorAll(".hero-card, .section");

revealTargets.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("reveal-in");
    io.unobserve(e.target);
  }
}, {
  threshold: 0.12,
  rootMargin: "80px 0px"
});

revealTargets.forEach(el => io.observe(el));
