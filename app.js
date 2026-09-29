/**
 * app.js
 * Shared cart data + behavior for every page: the cart is an array of
 * "line items" stored in localStorage (so it persists across pages),
 * plus the bottom/top nav active-state highlighting.
 *
 * A line item looks like:
 * {
 *   lineId: "abc123",       unique id for this specific line (so the same
 *                            drink with different customization can appear twice)
 *   itemId: "cafe-latte",   the MENU_ITEMS id
 *   name: "Cafe Latte",
 *   thumbGradient: "...",
 *   size: "16 oz",          "" for non-customizable items
 *   ice: "Normal Ice",      "" for non-customizable items
 *   sugar: "100%",          "" for non-customizable items
 *   addons: [{ label, price }],
 *   unitPrice: 168,         size price + add-ons, per single unit
 *   quantity: 2
 * }
 */

const CART_KEY = "sobremesa_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, line) => sum + line.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

// Two lines are "the same" (and should just stack quantity) only if every
// customization choice matches exactly.
function lineSignature(line) {
  const addonIds = line.addons.map((a) => a.label).sort().join(",");
  return [line.itemId, line.size, line.ice, line.sugar, addonIds].join("|");
}

function addLineToCart(line) {
  const cart = getCart();
  const signature = lineSignature(line);
  const existing = cart.find((l) => lineSignature(l) === signature);
  if (existing) {
    existing.quantity += line.quantity;
  } else {
    cart.push({ ...line, lineId: `${line.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
  }
  saveCart(cart);
}

// Convenience used by the quick "+" button on Home/Menu cards: adds one
// unit of an item's default variant (base size, no add-ons).
function quickAddToCart(itemId) {
  const item = MENU_ITEMS.find((i) => i.id === itemId);
  if (!item) return;
  const customizable = typeof isCustomizable === "function" && isCustomizable(item);
  addLineToCart({
    itemId: item.id,
    name: item.name,
    thumbGradient: item.thumbGradient,
    size: customizable ? getSizes(item)[0].label : "",
    ice: customizable ? "Normal Ice" : "",
    sugar: customizable ? "100%" : "",
    addons: [],
    unitPrice: customizable ? getSizes(item)[0].price : item.priceMin,
    quantity: 1
  });
}

function updateLineQuantity(lineId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((l) => l.lineId !== lineId);
  } else {
    const line = cart.find((l) => l.lineId === lineId);
    if (line) line.quantity = quantity;
  }
  saveCart(cart);
}

function removeLineFromCart(lineId) {
  saveCart(getCart().filter((l) => l.lineId !== lineId));
}

function clearCart() {
  saveCart([]);
}

/* ==========================================================================
   Orders — created from the cart at checkout. Matches the design's flow:
   Cart -> Proceed to Checkout -> Order Placed -> My Orders -> Order Details
   (with a progress stepper) -> optional Cancel Order.
   ========================================================================== */

const ORDERS_KEY = "sobremesa_orders";
const ORDER_MODE_KEY = "sobremesa_order_mode";   // "Dine-in" | "Takeout"
const TABLE_NO_KEY = "sobremesa_table_no";

// The order moves through these in sequence; "Cancelled" is a separate
// terminal state reachable from Paid/Confirmed/Preparing.
const ORDER_STEPS = ["Paid", "Confirmed", "Preparing", "Ready", "Served"];

function getOrderMode() {
  return localStorage.getItem(ORDER_MODE_KEY) || "Dine-in";
}

function setOrderMode(mode) {
  localStorage.setItem(ORDER_MODE_KEY, mode);
}

function getTableNo() {
  const tableNo = localStorage.getItem(TABLE_NO_KEY);
  if (!tableNo || tableNo === "4") {
    localStorage.setItem(TABLE_NO_KEY, "1");
    return "1";
  }
  return tableNo;
}

function setTableNo(tableNo) {
  localStorage.setItem(TABLE_NO_KEY, tableNo);
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getOrder(orderNumber) {
  return getOrders().find((o) => o.orderNumber === orderNumber);
}

// Creates an order from the current cart, clears the cart, and returns the
// new order so the caller can redirect to its confirmation/detail page.
function placeOrderFromCart() {
  const cart = getCart();
  if (cart.length === 0) return null;

  const orders = getOrders();
  const nextSeq = orders.length ? Math.max(...orders.map((o) => o.seq)) + 1 : 29;

  const order = {
    orderNumber: String(nextSeq).padStart(4, "0"),
    seq: nextSeq,
    mode: getOrderMode(),
    tableNo: getTableNo(),
    items: cart,
    total: getCartTotal(),
    status: "Preparing",     // demo orders start "in progress" so the
                              // status stepper/cancel flow has something to show
    placedAt: new Date().toISOString()
  };

  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}

function cancelOrder(orderNumber) {
  const orders = getOrders();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  if (order) order.status = "Cancelled";
  saveOrders(orders);
}

function formatOrderTime(isoString) {
  const d = new Date(isoString);
  const datePart = d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  const timePart = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

// Shared by cart.js and order-details.js to render a line item's
// customization choices as a single readable string.
function optionsSummary(line) {
  const parts = [line.size, line.ice, line.sugar].filter(Boolean);
  if (line.addons.length) {
    parts.push(`+${line.addons.map((a) => a.label).join(", +")}`);
  }
  return parts.join(" • ");
}

function renderCartBadge() {
  const badges = document.querySelectorAll("[data-cart-badge]");
  if (!badges.length) return;
  const count = getCartCount();
  badges.forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  });
}

function highlightActiveNav() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === current);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartBadge();
  highlightActiveNav();
});

function createExitDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "exit-dialog";
  dialog.setAttribute("aria-labelledby", "exit-dialog-title");
  dialog.setAttribute("aria-describedby", "exit-dialog-description");
  dialog.innerHTML = `
    <div class="exit-dialog-content">
      <span class="exit-dialog-mark" aria-hidden="true">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </span>
      <p class="exit-dialog-eyebrow">LEAVE SOBREMESA CAFÉ</p>
      <h2 id="exit-dialog-title">Return to the welcome screen?</h2>
      <p class="exit-dialog-description" id="exit-dialog-description">
        Your cart and order information will remain saved on this device.
      </p>
      <div class="exit-dialog-actions">
        <button class="exit-dialog-button exit-dialog-stay" type="button" data-exit-cancel>Stay here</button>
        <button class="exit-dialog-button exit-dialog-confirm" type="button" data-exit-confirm>
          Exit to welcome <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;

  dialog.querySelector("[data-exit-cancel]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-exit-confirm]").addEventListener("click", () => {
    dialog.close();
    window.location.assign("index.html");
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return dialog;
}

let exitDialog;

document.addEventListener("click", (event) => {
  const exitLink = event.target.closest(".exit-link");
  if (!exitLink) return;

  event.preventDefault();
  exitDialog ||= createExitDialog();
  if (!exitDialog.open) exitDialog.showModal();
});
