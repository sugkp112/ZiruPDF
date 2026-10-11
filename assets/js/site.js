(() => {
  /* Release info comes from ONE place: /version.json (also read by the desktop app's update check).
     Pages only carry data-* hooks; no version, file name or download link is written in HTML. */
  const cfg = window.ZIRUPDF_CONFIG || {};
  // Downloads are served only from the verified URL in /version.json.
  // Never silently send visitors to a source-code hosting service.
  document.querySelectorAll("[data-download-url]").forEach(a => {
    if (a.closest(".d-top")) {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("title", "Installer temporarily unavailable");
      a.style.pointerEvents = "none";
      a.style.opacity = "0.55";
    }
  });

  // Page language from <html lang>: zh-CN / ja / en (see /zh/, /ja/, /en/).
  const lang = (document.documentElement.lang || "zh").slice(0, 2).toLowerCase();
  const fmtSize = n => (Number(n) > 0 ? `${Math.round(Number(n) / 1048576)} MB` : "");
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const fmtDate = d => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || "")); if (!m) return String(d || "");
    return lang === "en" ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : lang === "ja" ? `${m[1]}年${+m[2]}月${+m[3]}日` : `${m[1]} 年 ${+m[2]} 月 ${+m[3]} 日`;
  };
  const currentNotes = (notes, version) => {
    const key = lang === "ja" ? "ja" : lang === "en" ? "en" : "zh-CN";
    const text = String((notes && typeof notes === "object") ? (notes[key] || notes["zh-CN"] || notes.en || "") : (notes || "")).trim();
    const first = text.split(/\s+(?=\d+\.\d+(?:\.\d+)?\s*[：:])/)[0] || "";
    const m = /^(\d+\.\d+(?:\.\d+)?)\s*[：:]\s*/.exec(first);
    if (m && m[1] !== version) return "";
    return first.replace(/^\d+\.\d+(?:\.\d+)?\s*[：:]\s*/, "");
  };
  const showState = state => document.querySelectorAll("[data-release-state]").forEach(el => { el.hidden = el.dataset.releaseState !== state; });

  if (!document.querySelector("[data-release],[data-version],[data-download-url],[data-release-state]")) return;
  fetch(cfg.releaseManifest || "/version.json", {cache: "no-cache"})
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(m => {
      const version = String(m.latest || "");
      if (!version) throw new Error("no version");
      const values = {
        version, date: fmtDate(m.released), installer: m.installer || "", size: fmtSize(m.size),
        notes: currentNotes(m.notes, version),
        sha256: /^[0-9a-f]{64}$/i.test(String(m.sha256 || "")) ? String(m.sha256).toLowerCase() : ""
      };
      document.querySelectorAll("[data-release]").forEach(el => {
        const v = values[el.dataset.release] || "";
        el.textContent = v;
        const wrap = el.closest("[data-release-optional]");
        if (wrap) wrap.hidden = !v;
      });
      document.querySelectorAll("[data-version]").forEach(el => el.textContent = version);
      // Allow download only when a verified HTTPS installer URL matches the release metadata.
      const url = String(m.url || ""), file = url.split("/").pop();
      const consistent = /^https:\/\//.test(url) && file.includes(version) && (!m.installer || file === m.installer);
      document.querySelectorAll("[data-download-url]").forEach(a => {
        if (!a.closest(".d-top")) return; // Homepage links to the public download page.
        if (consistent) {
          a.href = url;
          a.removeAttribute("aria-disabled");
          a.removeAttribute("title");
          a.style.pointerEvents = "";
          a.style.opacity = "";
        } else {
          a.removeAttribute("href");
          a.setAttribute("aria-disabled", "true");
          a.style.pointerEvents = "none";
          a.style.opacity = "0.55";
        }
      });
      showState("ready");
    })
    .catch(() => showState("error"));
})();

(() => {
  const menu = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  toggle?.addEventListener("click", () => {const open=menu?.classList.toggle("open");toggle.setAttribute("aria-expanded",String(!!open));});
  document.addEventListener("keydown", e => { if (e.key === "Escape" && menu?.classList.contains("open")) { menu.classList.remove("open"); toggle?.setAttribute("aria-expanded","false"); toggle?.focus(); } });

  // Highlight the current section; URLs are /<lang>/<section>/…
  const parts = location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean);
  const prefix = /^(zh|ja|en)$/.test(parts[0] || "") ? "/" + parts.shift() : "";
  const section = parts.length ? "/" + parts[0] + "/" : "/";
  const alias = {"/pdf/":"/online/","/image/":"/online/","/faq/":"/guides/"};
  const key = prefix + (alias[section] || section);
  menu?.querySelectorAll("a").forEach(a => { if (new URL(a.href).pathname === key) a.setAttribute("aria-current", "page"); });

  // Language menu: remember the choice (used by the language page at /) and close on outside click.
  document.querySelectorAll("[data-lang-link]").forEach(a => a.addEventListener("click", () => { try { localStorage.setItem("zirupdf.lang", a.dataset.langLink); } catch (_) {} }));
  document.addEventListener("click", e => document.querySelectorAll("details.lang-menu[open]").forEach(d => { if (!d.contains(e.target)) d.removeAttribute("open"); }));
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll("details.lang-menu[open]").forEach(d => { d.removeAttribute("open"); d.querySelector("summary")?.focus(); }); });

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const search = document.querySelector("#toolSearch");
  const cards = [...document.querySelectorAll("#toolGrid .tool-card")];
  const noResults = document.querySelector("#noResults");
  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const text = `${card.textContent} ${card.dataset.tool || ""}`.toLowerCase();
      const visible = !q || text.includes(q);
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (noResults) noResults.hidden = shown !== 0;
  });
})();

(()=>{const paths={"pdf-tools.html?mode=merge": "/pdf/merge/", "pdf-tools.html?mode=split": "/pdf/split/", "pdf-tools.html?mode=organize": "/pdf/organize/", "pdf-tools.html?mode=export": "/pdf/to-image/", "pdf-tools.html?mode=watermark": "/pdf/watermark/", "tools.html?mode=pdf": "/image/to-pdf/", "tools.html?mode=resize": "/image/resize/", "image-tools.html?mode=convert": "/image/convert/", "image-tools.html?mode=crop": "/image/crop-rotate/", "image-tools.html?mode=compress": "/image/compress/", "tools.html?mode=ico": "/image/png-to-ico/", "image-tools.html?mode=target": "/image/compress-to-size/", "online.html": "/online/", "download.html": "/download/", "features.html": "/features/", "guides.html": "/guides/", "faq.html": "/faq/", "privacy.html": "/privacy/", "license.html": "/license/", "changelog.html": "/changelog/", "sponsor.html": "/sponsor/", "guide-images-pdf.html": "/guides/images-to-pdf/", "guide-resize.html": "/guides/resize-image/", "guide-ico.html": "/guides/png-to-ico/", "guide-pdf-tools.html": "/guides/pdf-tools/", "guide-image-tools.html": "/guides/image-tools/"};const name=location.pathname.split("/").pop();const mode=new URLSearchParams(location.search).get("mode");const key=name+(mode?"?mode="+mode:"");const path=paths[key];if(path){const href="https://zirupdf.zirulab.org"+path;document.querySelector("link[rel=canonical]")?.setAttribute("href",href);document.querySelector('meta[property="og:url"]')?.setAttribute("content",href);}})();

(()=>{const current=document.querySelector("link[rel=canonical]")?.href;document.querySelectorAll(".tool-tabs a").forEach(a=>{if(current&&new URL(a.href).pathname===new URL(current).pathname)a.classList.add("active");});})();

(()=>{const input=document.querySelector('#onlineSearch');if(!input)return;const cards=[...document.querySelectorAll('[data-online-tool]')];input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const text=(card.dataset.search+' '+card.textContent).toLowerCase();card.hidden=q&&!text.includes(q);if(!card.hidden)shown++;});document.querySelectorAll('.catalog-group').forEach(g=>g.hidden=![...g.querySelectorAll('[data-online-tool]')].some(c=>!c.hidden));const sg=document.querySelector('.scenario-grid');if(sg)sg.hidden=!cards.slice(0,3).some(c=>!c.hidden);document.querySelector('#onlineEmpty').hidden=shown>0;});})();
