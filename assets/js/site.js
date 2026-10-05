(() => {
  const cfg = window.ZIRUPDF_CONFIG || {};
  const repo = cfg.githubRepo || "YOUR_GITHUB_USERNAME/ZiruPDF";
  const configured = !repo.includes("YOUR_GITHUB_USERNAME");
  const releaseUrl = configured ? `https://github.com/${repo}/releases/latest` : "#";
  const assetUrl = configured ? `https://github.com/${repo}/releases/latest/download/${encodeURIComponent(cfg.downloadAsset || "ZiruPDF_Setup.exe")}` : "#";

  document.querySelectorAll("[data-release-url]").forEach(a => a.href = releaseUrl);
  document.querySelectorAll("[data-download-url]").forEach(a => a.href = assetUrl);
  document.querySelectorAll("[data-version]").forEach(el => el.textContent = cfg.latestVersion || "Latest");
  document.querySelectorAll("[data-github-repo]").forEach(el => el.textContent = repo);

  const menu = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  toggle?.addEventListener("click", () => menu?.classList.toggle("open"));

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
