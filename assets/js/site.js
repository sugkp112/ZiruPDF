(() => {
  const cfg = window.ZIRUPDF_CONFIG || {};
  const repo = cfg.githubRepo || "YOUR_GITHUB_USERNAME/ZiruPDF";
  const configured = !repo.includes("YOUR_GITHUB_USERNAME");
  const releaseUrl = configured ? `https://github.com/${repo}/releases/latest` : "#";
  const assetUrl = configured ? `https://github.com/${repo}/releases/latest/download/${encodeURIComponent(cfg.downloadAsset || "ZiruPDF_Setup.exe")}` : "#";

  document.querySelectorAll("[data-release-url]").forEach(a => a.href = releaseUrl);
  document.querySelectorAll("[data-download-url]").forEach(a => a.href = cfg.downloadAsset ? assetUrl : releaseUrl);
  document.querySelectorAll("[data-version]").forEach(el => el.textContent = cfg.latestVersion || "Latest");
  document.querySelectorAll("[data-github-repo]").forEach(el => el.textContent = repo);

  const menu = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  toggle?.addEventListener("click", () => {const open=menu?.classList.toggle("open");toggle.setAttribute("aria-expanded",String(!!open));});

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

(()=>{const input=document.querySelector('#onlineSearch');if(!input)return;const cards=[...document.querySelectorAll('[data-online-tool]')];input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const text=(card.dataset.search+' '+card.textContent).toLowerCase();card.hidden=q&&!text.includes(q);if(!card.hidden)shown++;});document.querySelectorAll('.catalog-group').forEach(g=>g.hidden=![...g.querySelectorAll('[data-online-tool]')].some(c=>!c.hidden));document.querySelector('.scenario-grid').hidden=!cards.slice(0,3).some(c=>!c.hidden);document.querySelector('#onlineEmpty').hidden=shown>0;});})();
