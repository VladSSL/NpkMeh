const CONTACT = {
  label: "8 800 600 88 89",
  href: "tel:+78006008889",
};

const documents = {
  machines: {
    slug: "stanki.html",
    title: "Станки",
    homeLabel: "Каталог станков",
    navLabel: "Станки",
    description: "Полный каталог станков с ценами.",
    pageCount: 27,
    pdfHref: "./docs/machines.pdf",
    downloadFileName: "kp-stanki.pdf",
    pagePath: "./docs/machines/pages",
    accentClass: "accent-red",
  },
  materials: {
    slug: "rashodnye-materialy.html",
    title: "Расходные материалы",
    homeLabel: "Каталог доп. оборудования",
    navLabel: "Расходные материалы",
    description: "Дополнительное оборудование и расходные позиции.",
    pageCount: 14,
    pdfHref: "./docs/materials.pdf",
    downloadFileName: "kp-rashodnye-materialy.pdf",
    pagePath: "./docs/materials/pages",
    accentClass: "accent-steel",
  },
};

/* ------------------------------- Icons (SVG) -------------------------------- */

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5c0-1 .8-2 2-2h2.2c.5 0 1 .3 1.2.8l1.2 3c.2.5 0 1-.4 1.4L9 9.4c1 2 2.6 3.6 4.6 4.6l1.2-1.2c.4-.4.9-.5 1.4-.4l3 1.2c.5.2.8.7.8 1.2V17c0 1.1-.9 2-2 2h-1C8.6 19 5 15.4 5 11V5Z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>`,
  arrowUpRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>`,
  zoom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/><path d="M11 8.5v5"/><path d="M8.5 11h5"/></svg>`,
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });

function pageImage(doc, index) {
  const page = String(index + 1).padStart(2, "0");
  return `${doc.pagePath}/page-${page}.jpg`;
}

function navHtml(activeKey) {
  return Object.entries(documents)
    .map(([key, doc]) => {
      const current = key === activeKey ? ' aria-current="page"' : "";
      return `<a href="./${doc.slug}"${current}>${escapeHtml(doc.navLabel)}</a>`;
    })
    .join("");
}

function actionBarHtml(doc, extraClass = "", label = "Контакты и PDF") {
  const className = `header-actions${extraClass ? ` ${extraClass}` : ""}`;

  return `
    <div class="${className}" aria-label="${label}">
      <a class="header-action" href="${CONTACT.href}">${ICONS.phone}<span>${CONTACT.label}</span></a>
      <a class="header-action header-action-primary" href="${CONTACT.href}">Оставить заявку</a>
      <a class="header-action" href="${doc.pdfHref}" download="${doc.downloadFileName}">${ICONS.download}<span>Скачать PDF</span></a>
    </div>
  `;
}

function renderDocument() {
  const app = document.querySelector("#document-app");

  if (!app) return;

  const key = app.dataset.doc;
  const doc = documents[key];

  if (!doc) return;

  const pages = Array.from({ length: doc.pageCount }, (_, index) => {
    const src = pageImage(doc, index);
    const loading = index === 0 ? "eager" : "lazy";
    const lqip = window.LQIP?.[key]?.[index];
    const lqipStyle = lqip ? ` style="background-image:url('${lqip}')"` : "";

    return `
      <figure class="document-page" data-page-index="${index}">
        <div class="document-page-frame" data-lightbox-trigger="${index}">
          <div class="page-lqip" aria-hidden="true"${lqipStyle}></div>
          <img
            src="${src}"
            width="1587"
            height="2244"
            alt="${escapeHtml(doc.title)}. Страница ${index + 1}"
            loading="${loading}"
            decoding="async"
          />
          <span class="document-page-zoom" aria-hidden="true">${ICONS.zoom}</span>
        </div>
        <figcaption>${index + 1} / ${doc.pageCount}</figcaption>
      </figure>
    `;
  }).join("");

  app.className = `site-shell document-shell ${doc.accentClass}`;
  app.innerHTML = `
    <div class="viewer-progress" aria-hidden="true"><div class="viewer-progress-fill"></div></div>

    <header class="site-header document-header">
      <a class="brand-lockup" href="./index.html" aria-label="На главную">
        <span class="brand-mark">M</span>
        <span>
          <strong>МЕХАНИК.РФ</strong>
          <small>${escapeHtml(doc.title)}</small>
        </span>
      </a>

      <nav class="main-nav" aria-label="Каталоги">
        ${navHtml(key)}
      </nav>

      ${actionBarHtml(doc)}
    </header>

    ${actionBarHtml(doc, "sticky-action-bar", "Быстрые действия")}

    <section class="document-hero" aria-labelledby="document-title">
      <div class="document-hero-inner">
        <a class="back-link" href="./index.html">${ICONS.chevronLeft}На главную</a>
        <p class="eyebrow">Каталог</p>
        <h1 id="document-title">${escapeHtml(doc.title)}</h1>
        <p>${escapeHtml(doc.description)}</p>
      </div>
    </section>

    <section class="document-viewer" aria-label="PDF: ${escapeHtml(doc.title)}">
      ${pages}
    </section>

    <section class="contacts-band document-contact" id="contacts">
      <div class="glow-layer" aria-hidden="true"></div>
      <div class="contacts-band-info">
        <p class="eyebrow">Заявка</p>
        <h2>Нужна консультация?</h2>
        <p>Позвоните, и мы подготовим предложение по выбранному каталогу.</p>
      </div>
      <div class="contact-actions">
        <a class="contact-phone" href="${CONTACT.href}">${ICONS.phone}${CONTACT.label}</a>
        <a class="button primary" href="${CONTACT.href}">Оставить заявку</a>
      </div>
    </section>

    <div class="page-counter" role="status" aria-live="polite">
      <span data-current>1</span> / ${doc.pageCount}
    </div>

    <button class="back-to-top" type="button" aria-label="Наверх">${ICONS.chevronUp}</button>

    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр страницы ${escapeHtml(doc.title)}">
      <button class="lightbox-close" type="button" data-lightbox-close aria-label="Закрыть">${ICONS.close}</button>
      <button class="lightbox-nav lightbox-prev" type="button" data-lightbox-prev aria-label="Предыдущая страница">${ICONS.chevronLeft}</button>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-nav lightbox-next" type="button" data-lightbox-next aria-label="Следующая страница">${ICONS.chevronRight}</button>
      <div class="lightbox-counter"><span data-lightbox-current>1</span> / ${doc.pageCount}</div>
    </div>
  `;

  initDocumentViewer(doc);
}

/* ------------------------------ Shared behaviors ------------------------------ */

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 6);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initScrollReveal(selector, staggerMs = 70) {
  if (prefersReducedMotion()) return;

  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add("is-visible", "revealed");
          io.unobserve(el);

          // после завершения анимации снять reveal-классы и delay,
          // чтобы не перебивали hover/press-трансформации
          const delay = parseFloat(el.style.transitionDelay) || 0;
          window.setTimeout(() => {
            el.classList.remove("reveal", "is-visible");
            el.style.transitionDelay = "";
          }, delay + 620);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  els.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i, 6) * staggerMs}ms`;
    io.observe(el);
  });
}

function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  const update = () => btn.classList.toggle("is-visible", window.scrollY > 480);

  update();
  window.addEventListener("scroll", update, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function initGlowLayer(selector) {
  if (prefersReducedMotion()) return;

  document.querySelectorAll(selector).forEach((section) => {
    const glow = section.querySelector(".glow-layer");
    if (!glow) return;

    section.addEventListener("mousemove", (event) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty("--gx", `${x}%`);
      glow.style.setProperty("--gy", `${y}%`);
    });
  });
}

let toastTimer = null;

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function initCopyPhone() {
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => {
      const phone = link.getAttribute("href").replace("tel:", "");
      copyText(phone)
        .then(() => {
          showToast("Номер скопирован");
          if (navigator.vibrate) navigator.vibrate(10);
        })
        .catch(() => {});
    });
  });
}

function initImageFadeIn(scope = document) {
  scope.querySelectorAll(".document-page img").forEach((img) => {
    if (img.complete && img.naturalWidth) {
      img.classList.add("is-loaded");
      return;
    }
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  });
}

/* --------------------------- Document viewer features -------------------------- */

function initDocumentViewer(doc) {
  initHeaderShadow();
  initScrollReveal(".document-page, .document-hero-inner, .contacts-band");
  initBackToTop();
  initImageFadeIn();
  initReadingProgress();
  initPageCounter(doc);
  initLightbox(doc);
  initGlowLayer(".contacts-band");
  initCopyPhone();
}

function initReadingProgress() {
  const fill = document.querySelector(".viewer-progress-fill");
  const viewer = document.querySelector(".document-viewer");
  if (!fill || !viewer) return;

  const update = () => {
    const rect = viewer.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    fill.style.width = `${Math.min(Math.max(pct, 0), 100)}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initPageCounter(doc) {
  const counter = document.querySelector(".page-counter");
  const currentEl = counter?.querySelector("[data-current]");
  const pages = document.querySelectorAll(".document-page");
  if (!counter || !pages.length) return;

  let visiblePages = new Set();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.pageIndex);
        if (entry.isIntersecting) {
          visiblePages.add(index);
        } else {
          visiblePages.delete(index);
        }
      });

      if (visiblePages.size) {
        const current = Math.min(...visiblePages) + 1;
        if (currentEl) currentEl.textContent = current;
      }

      counter.classList.toggle("is-visible", window.scrollY > 240);
    },
    { threshold: 0.4 }
  );

  pages.forEach((page) => io.observe(page));

  window.addEventListener(
    "scroll",
    () => counter.classList.toggle("is-visible", window.scrollY > 240),
    { passive: true }
  );
}

function initLightbox(doc) {
  const lightbox = document.querySelector("#lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".lightbox-image");
  const counterEl = lightbox.querySelector("[data-lightbox-current]");
  const closeBtn = lightbox.querySelector("[data-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");

  let current = 0;
  let lastFocused = null;
  let isSwitching = false;

  const normalize = (index) => ((index % doc.pageCount) + doc.pageCount) % doc.pageCount;

  const setImage = (index) => {
    current = normalize(index);
    img.src = pageImage(doc, current);
    img.alt = `${doc.title}. Страница ${current + 1}`;
    if (counterEl) counterEl.textContent = current + 1;
  };

  const show = (index) => {
    const next = normalize(index);
    if (next === current || isSwitching || prefersReducedMotion()) {
      setImage(next);
      return;
    }

    isSwitching = true;
    img.style.opacity = "0";
    window.setTimeout(() => {
      setImage(next);
      requestAnimationFrame(() => {
        img.style.opacity = "1";
        window.setTimeout(() => {
          isSwitching = false;
        }, 220);
      });
    }, 160);
  };

  const open = (index) => {
    lastFocused = document.activeElement;
    img.style.opacity = "1";
    setImage(index);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => open(Number(trigger.dataset.lightboxTrigger)));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
        show(dx < 0 ? current + 1 : current - 1);
      }
    },
    { passive: true }
  );
}

/* ---------------------------------- Bootstrap ---------------------------------- */

function initHomePage() {
  initHeaderShadow();
  initScrollReveal(".home-copy, .catalog-card, .contacts-band", 90);
  initBackToTop();
  initGlowLayer(".contacts-band");
  initCopyPhone();
}

if (document.querySelector("#document-app")) {
  renderDocument();
} else {
  document.addEventListener("DOMContentLoaded", initHomePage);
}
