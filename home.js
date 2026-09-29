/**
 * home.js
 * Renders the "Coffee Series" preview grid on the home screen from
 * MENU_ITEMS (see menu-data.js).
 */

function renderFeaturedGrid() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const featured = MENU_ITEMS.filter((item) => item.featured);

  grid.innerHTML = featured
    .map(
      (item) => `
      <a class="series-card" href="item.html?id=${item.id}">
        <div class="thumb" style="background-image:${item.thumbGradient}"></div>
        <div class="info">
          <p class="name">${item.name}</p>
          <p class="price">${formatPrice(item)}</p>
          <button class="add-btn" aria-label="Quick add ${item.name} to cart" data-add="${item.id}">+</button>
        </div>
      </a>`
    )
    .join("");

  // Same pattern as the menu list: the card links to the detail page,
  // the + button quick-adds one unit without navigating away.
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      quickAddToCart(btn.dataset.add);
    });
  });
}

document.addEventListener("DOMContentLoaded", renderFeaturedGrid);

/* ---- Carousel: auto-advances and responds to dot clicks ---- */
function initCarousel() {
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  if (!track || !dotsWrap) return;

  const slideCount = track.children.length;
  const dots = [...dotsWrap.children];
  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      restartAutoplay();
    });
  });

  goTo(0);
  restartAutoplay();
}

/* ---- Takeout / Dine-in toggle + QR-provided table number ---- */
function initOrderMode() {
  const modeButtons = document.querySelectorAll(".mode-btn");
  const tableWrap = document.getElementById("table-select-wrap");
  const tableNumber = document.getElementById("table-number");
  if (!modeButtons.length) return;

  function applyMode(mode) {
    modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
    setOrderMode(mode);
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyMode(btn.dataset.mode));
  });

  const params = new URLSearchParams(window.location.search);
  const qrTable = params.get("table") || params.get("tableNo");
  if (qrTable && /^[A-Za-z0-9-]+$/.test(qrTable)) setTableNo(qrTable);

  tableWrap.style.display = "flex";
  tableNumber.textContent = getTableNo();

  applyMode(getOrderMode());
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initOrderMode();
});
