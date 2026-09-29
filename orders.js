/**
 * orders.js
 * Powers orders.html — lists orders from getOrders() (see app.js),
 * split into an "Active" tab (still in progress) and a "History" tab
 * (Served or Cancelled).
 */

const ACTIVE_STATUSES = ["Paid", "Confirmed", "Preparing", "Ready"];

function statusClass(status) {
  if (status === "Cancelled") return "status-cancelled";
  if (status === "Served") return "status-served";
  return "status-active";
}

function renderOrders(tab) {
  const orders = getOrders().filter((o) =>
    tab === "active" ? ACTIVE_STATUSES.includes(o.status) : !ACTIVE_STATUSES.includes(o.status)
  );

  const list = document.getElementById("orders-list");
  const empty = document.getElementById("orders-empty");

  if (orders.length === 0) {
    list.hidden = true;
    empty.hidden = false;
    return;
  }

  list.hidden = false;
  empty.hidden = true;

  list.innerHTML = orders
    .map((order) => {
      const firstItem = order.items[0];
      return `
      <a class="order-card" href="order-details.html?order=${order.orderNumber}">
        <div class="thumb" style="background-image:${firstItem ? firstItem.thumbGradient : "none"}"></div>
        <div class="info">
          <p class="name">#${order.orderNumber}</p>
          <p class="meta">${formatOrderTime(order.placedAt)}</p>
        </div>
        <span class="status-badge ${statusClass(order.status)}">${order.status}</span>
      </a>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-tab]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      renderOrders(tab.dataset.tab);
    });
  });
  renderOrders("active");
});
