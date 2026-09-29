/**
 * item.js
 * Powers item.html. Reads ?id=<item-id> from the URL, looks it up in
 * MENU_ITEMS (menu-data.js), and renders:
 *   - Coffee / Non-Coffee items: full customization (size, ice, sugar, add-ons)
 *   - Food / Pastries: just a quantity stepper (see isCustomizable in menu-data.js)
 */

let currentItem = null;
let selectedSizeIndex = 0;
let selectedIce = "Normal Ice";
let selectedSugar = "100%";
let selectedAddonIds = new Set();
let quantity = 1;

function getItemFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return MENU_ITEMS.find((item) => item.id === id) || MENU_ITEMS[0];
}

function unitPrice() {
  if (!currentItem) return 0;
  const base = isCustomizable(currentItem)
    ? getSizes(currentItem)[selectedSizeIndex].price
    : currentItem.priceMin;
  const addonsTotal = ADDONS.filter((a) => selectedAddonIds.has(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );
  return base + addonsTotal;
}

function updateTotals() {
  const unit = unitPrice();
  document.getElementById("item-price").textContent = `₱${unit}`;
  document.getElementById("total-price").textContent = `₱${unit * quantity}`;
  document.getElementById("qty-value").textContent = quantity;
}

function renderSizeOptions() {
  const el = document.getElementById("size-options");
  el.innerHTML = getSizes(currentItem)
    .map(
      (size, i) => `
      <button class="option-pill ${i === selectedSizeIndex ? "selected" : ""}" data-size="${i}">
        ${size.label}<span class="pill-sub">₱${size.price}</span>
      </button>`
    )
    .join("");
  el.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSizeIndex = Number(btn.dataset.size);
      renderSizeOptions();
      updateTotals();
    });
  });
}

function renderIceOptions() {
  const icons = { "No Ice": "🚫", "Less Ice": "🧊", "Normal Ice": "🧊🧊", "Extra Ice": "🧊🧊🧊" };
  const el = document.getElementById("ice-options");
  el.innerHTML = ICE_LEVELS.map(
    (level) => `
    <button class="icon-option ${level === selectedIce ? "selected" : ""}" data-ice="${level}">
      <span class="icon">${icons[level]}</span>${level}
    </button>`
  ).join("");
  el.querySelectorAll("[data-ice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedIce = btn.dataset.ice;
      renderIceOptions();
    });
  });
}

function renderSugarOptions() {
  const el = document.getElementById("sugar-options");
  el.innerHTML = SUGAR_LEVELS.map(
    (level) => `
    <button class="option-pill ${level === selectedSugar ? "selected" : ""}" data-sugar="${level}">${level}</button>`
  ).join("");
  el.querySelectorAll("[data-sugar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSugar = btn.dataset.sugar;
      renderSugarOptions();
    });
  });
}

function renderAddonOptions() {
  const el = document.getElementById("addon-options");
  el.innerHTML = ADDONS.map(
    (addon) => `
    <div class="addon-row">
      <label>
        <input type="checkbox" data-addon="${addon.id}" ${selectedAddonIds.has(addon.id) ? "checked" : ""}>
        ${addon.label}
      </label>
      <span class="addon-price">(+₱${addon.price})</span>
    </div>`
  ).join("");
  el.querySelectorAll("[data-addon]").forEach((box) => {
    box.addEventListener("change", () => {
      box.checked ? selectedAddonIds.add(box.dataset.addon) : selectedAddonIds.delete(box.dataset.addon);
      updateTotals();
    });
  });
}

function initPage() {
  currentItem = getItemFromUrl();

  document.getElementById("item-hero").style.backgroundImage = currentItem.thumbGradient;
  document.getElementById("item-name").textContent = currentItem.name;
  document.getElementById("item-desc").textContent = currentItem.description;

  if (isCustomizable(currentItem)) {
    document.getElementById("customize-section").hidden = false;
    renderSizeOptions();
    renderIceOptions();
    renderSugarOptions();
    renderAddonOptions();
  }

  updateTotals();

  document.getElementById("qty-minus").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updateTotals();
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity += 1;
    updateTotals();
  });

  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const customizable = isCustomizable(currentItem);
    addLineToCart({
      itemId: currentItem.id,
      name: currentItem.name,
      thumbGradient: currentItem.thumbGradient,
      size: customizable ? getSizes(currentItem)[selectedSizeIndex].label : "",
      ice: customizable ? selectedIce : "",
      sugar: customizable ? selectedSugar : "",
      addons: ADDONS.filter((a) => selectedAddonIds.has(a.id)),
      unitPrice: unitPrice(),
      quantity
    });
    window.location.href = "cart.html";
  });
}

document.addEventListener("DOMContentLoaded", initPage);
