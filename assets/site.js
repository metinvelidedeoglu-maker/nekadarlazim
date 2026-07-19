import {
  clearShoppingList,
  formatShoppingListText,
  readShoppingList,
  removeShoppingItem,
} from "./shopping-list.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

const searchInput = document.querySelector("#tool-search");
const toolCards = [...document.querySelectorAll("[data-tool-card]")];
const emptyState = document.querySelector("#empty-tools");

if (searchInput && toolCards.length) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
    let visible = 0;

    toolCards.forEach((card) => {
      const matches = card.dataset.search.toLocaleLowerCase("tr-TR").includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible !== 0;
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

function initShoppingList() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<button class="shopping-list-trigger" type="button" aria-haspopup="dialog" aria-controls="shopping-list-dialog">
      <span class="shopping-list-icon" aria-hidden="true">✓</span>
      <span>Listem</span>
      <strong class="shopping-list-count" aria-label="0 kayıt">0</strong>
    </button>
    <dialog class="shopping-list-dialog" id="shopping-list-dialog" aria-labelledby="shopping-list-title">
      <div class="shopping-list-shell">
        <header class="shopping-list-header">
          <div><span class="shopping-list-eyebrow">Cihazınızda saklanır</span><h2 id="shopping-list-title">Alışveriş listem</h2></div>
          <button class="shopping-list-close" type="button" aria-label="Listeyi kapat">×</button>
        </header>
        <div class="shopping-list-content"></div>
        <footer class="shopping-list-footer">
          <button class="list-secondary list-clear" type="button">Listeyi temizle</button>
          <button class="list-primary list-share" type="button">Paylaş / kopyala</button>
        </footer>
      </div>
    </dialog>`
  );

  const trigger = document.querySelector(".shopping-list-trigger");
  const dialog = document.querySelector(".shopping-list-dialog");
  const closeButton = dialog.querySelector(".shopping-list-close");
  const count = trigger.querySelector(".shopping-list-count");
  const content = dialog.querySelector(".shopping-list-content");
  const clearButton = dialog.querySelector(".list-clear");
  const shareButton = dialog.querySelector(".list-share");
  let currentItems = readShoppingList();

  function render(items = readShoppingList()) {
    currentItems = items;
    count.textContent = String(items.length);
    count.setAttribute("aria-label", `${items.length} kayıt`);
    trigger.classList.toggle("has-items", items.length > 0);
    clearButton.disabled = items.length === 0;
    shareButton.disabled = items.length === 0;

    if (!items.length) {
      content.innerHTML = `<div class="shopping-list-empty"><span aria-hidden="true">＋</span><h3>Listeniz henüz boş</h3><p>Bir hesaplama yapın ve sonuçtaki “Listeme ekle” düğmesine dokunun.</p></div>`;
      return;
    }

    content.innerHTML = `<ol class="saved-results">${items
      .map((item) => {
        const name = item.projectName || item.title;
        const subtitle = item.projectName ? item.title : "Hesaplama sonucu";
        return `<li class="saved-result">
          <div class="saved-result-heading"><div><span>${escapeHtml(subtitle)}</span><h3>${escapeHtml(name)}</h3></div><button type="button" data-remove-item="${escapeHtml(item.id)}" aria-label="${escapeHtml(name)} kaydını sil">Sil</button></div>
          <strong class="saved-result-total">${escapeHtml(item.headline)}</strong>
          <details><summary>Ayrıntıları göster</summary><dl>${item.items
            .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
            .join("")}</dl></details>
        </li>`;
      })
      .join("")}</ol>`;
  }

  function openDialog() {
    render();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  trigger.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  content.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-item]");
    if (!removeButton) return;
    render(removeShoppingItem(removeButton.dataset.removeItem));
  });

  clearButton.addEventListener("click", () => {
    if (currentItems.length && window.confirm("Alışveriş listesindeki tüm hesapları silmek istiyor musunuz?")) {
      render(clearShoppingList());
    }
  });

  shareButton.addEventListener("click", async () => {
    const text = formatShoppingListText(currentItems);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ne Kadar Lazım? — Alışveriş listem", text });
        shareButton.textContent = "Paylaşıldı";
        window.setTimeout(() => (shareButton.textContent = "Paylaş / kopyala"), 1800);
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      shareButton.textContent = "Kopyalandı";
    } catch {
      shareButton.textContent = "Kopyalanamadı";
    }
    window.setTimeout(() => (shareButton.textContent = "Paylaş / kopyala"), 1800);
  });

  window.addEventListener("nkl:list-changed", (event) => render(event.detail?.items));
  window.addEventListener("storage", () => render());
  render(currentItems);
}

initShoppingList();
