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
        <section class="quote-panel" hidden>
          <div class="quote-panel-heading">
            <span class="shopping-list-eyebrow">İlk adım ücretsiz</span>
            <h3>Satıcıdan teklif alın</h3>
            <p>Listenizdeki hesapları ve iletişim bilgilerinizi girin. Talep, seçtiğiniz satıcıya gönderilmek üzere e-posta taslağına dönüştürülür.</p>
          </div>
          <form class="quote-form">
            <label class="quote-field"><span>Satıcının e-posta adresi</span><input name="quoteSellerEmail" type="email" maxlength="160" autocomplete="email" required></label>
            <label class="quote-field"><span>Adınız soyadınız</span><input name="quoteName" type="text" maxlength="100" autocomplete="name" required></label>
            <label class="quote-field"><span>E-posta adresiniz</span><input name="quoteEmail" type="email" maxlength="160" autocomplete="email" required></label>
            <label class="quote-field"><span>Telefon <small>(isteğe bağlı)</small></span><input name="quotePhone" type="tel" maxlength="40" autocomplete="tel"></label>
            <label class="quote-field"><span>İl / ilçe <small>(isteğe bağlı)</small></span><input name="quoteLocation" type="text" maxlength="100" autocomplete="address-level2"></label>
            <label class="quote-field quote-field-wide"><span>Notunuz <small>(isteğe bağlı)</small></span><textarea name="quoteNote" rows="3" maxlength="500" placeholder="Örn. Uygulama dahil fiyat ve uygun teslim tarihini de öğrenmek istiyorum."></textarea></label>
            <p class="quote-disclaimer">Gönder düğmesi, listenizi içeren bir e-posta taslağı açar. Göndermeden önce bilgileri kontrol edebilirsiniz.</p>
            <div class="quote-form-actions"><button class="list-secondary quote-cancel" type="button">Listeye dön</button><button class="list-primary" type="submit">Teklif isteğini hazırla</button></div>
            <p class="quote-status" role="status" hidden></p>
          </form>
        </section>
        <footer class="shopping-list-footer">
          <button class="list-primary quote-open" type="button">Satıcıdan teklif iste</button>
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
  const quotePanel = dialog.querySelector(".quote-panel");
  const quoteForm = dialog.querySelector(".quote-form");
  const quoteOpenButton = dialog.querySelector(".quote-open");
  const quoteCancelButton = dialog.querySelector(".quote-cancel");
  const quoteStatus = dialog.querySelector(".quote-status");
  const clearButton = dialog.querySelector(".list-clear");
  const shareButton = dialog.querySelector(".list-share");
  let currentItems = readShoppingList();

  function render(items = readShoppingList()) {
    currentItems = items;
    count.textContent = String(items.length);
    count.setAttribute("aria-label", `${items.length} kayıt`);
    trigger.classList.toggle("has-items", items.length > 0);
    quoteOpenButton.disabled = items.length === 0;
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
    showListPanel();
    render();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function showListPanel() {
    content.hidden = false;
    quotePanel.hidden = true;
    quoteOpenButton.hidden = false;
    clearButton.hidden = false;
    shareButton.hidden = false;
    quoteStatus.hidden = true;
  }

  function showQuotePanel() {
    if (!currentItems.length) return;
    content.hidden = true;
    quotePanel.hidden = false;
    quoteOpenButton.hidden = true;
    clearButton.hidden = true;
    shareButton.hidden = true;
    quoteStatus.hidden = true;
    quoteForm.querySelector('[name="quoteName"]').focus();
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

  quoteOpenButton.addEventListener("click", showQuotePanel);
  quoteCancelButton.addEventListener("click", showListPanel);

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const formData = new FormData(quoteForm);
    const sellerEmail = String(formData.get("quoteSellerEmail") || "").trim();
    const name = String(formData.get("quoteName") || "").trim();
    const email = String(formData.get("quoteEmail") || "").trim();
    const phone = String(formData.get("quotePhone") || "").trim();
    const location = String(formData.get("quoteLocation") || "").trim();
    const note = String(formData.get("quoteNote") || "").trim();
    const subject = `Teklif talebi — ${name}`;
    const body = [
      "Merhaba,",
      "",
      "Ne Kadar Lazım? üzerinden aşağıdaki ihtiyaçlarım için teklif almak istiyorum.",
      "",
      `Ad soyad: ${name}`,
      `E-posta: ${email}`,
      `Telefon: ${phone || "Belirtilmedi"}`,
      `İl / ilçe: ${location || "Belirtilmedi"}`,
      `Not: ${note || "Belirtilmedi"}`,
      "",
      formatShoppingListText(currentItems),
    ].join("\n");

    quoteStatus.textContent = "E-posta taslağı açılıyor…";
    quoteStatus.hidden = false;
    window.location.href = `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
