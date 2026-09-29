/**
 * menu.js
 * Renders category pills + the filterable menu list on menu.html.
 * Reads MENU_ITEMS / CATEGORIES from menu-data.js.
 */

let activeCategory = "all";
let searchTerm = "";

function getInitialCategory() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("category");
  return CATEGORIES.some((c) => c.id === requested) ? requested : "all";
}

function renderPills() {
  const row = document.getElementById("pill-row");
  row.innerHTML = CATEGORIES.map(
    (cat) => `
    <button class="pill ${cat.id === activeCategory ? "active" : ""}" data-category="${cat.id}">
      ${cat.label}
    </button>`
  ).join("");

  row.querySelectorAll("[data-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderPills();
      renderList();
    });
  });
}

function renderList() {
  const list = document.getElementById("menu-list");
  const emptyState = document.getElementById("empty-state");
  const coffeeSeries = document.getElementById("menu-coffee-series");

  if (coffeeSeries) {
    coffeeSeries.hidden = activeCategory !== "all" || searchTerm.trim().length > 0;
  }

  const filtered = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  emptyState.hidden = filtered.length > 0;

  list.innerHTML = filtered
    .map(
      (item) => `
      <a class="menu-row" href="item.html?id=${item.id}">
        <div class="thumb" style="background-image:${item.thumbGradient}"></div>
        <div class="info">
          <p class="name">${item.name}</p>
          <p class="desc">${item.description}</p>
          <p class="price">${formatPrice(item)}</p>
        </div>
        <button class="add-btn" aria-label="Quick add ${item.name} to cart" data-add="${item.id}">+</button>
      </a>`
    )
    .join("");

  // The row itself links to the item's detail page. The + button quick-adds
  // one unit at default price without leaving the list, so it must stop the
  // click from also following the row's link.
  list.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      quickAddToCart(btn.dataset.add);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  activeCategory = getInitialCategory();
  renderPills();
  renderList();

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderList();
  });
});
