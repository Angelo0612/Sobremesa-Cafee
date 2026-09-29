/**
 * order-confirmed.js
 * Powers order-confirmed.html. Reads ?order=<orderNumber> and fills in
 * the order number, table, and timestamp from the order created in
 * placeOrderFromCart() (see app.js).
 */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get("order");
  const order = getOrder(orderNumber);

  if (!order) {
    // No matching order (e.g. page opened directly) — just send them home.
    window.location.href = "index.html";
    return;
  }

  document.getElementById("order-number").textContent = `#${order.orderNumber}`;
  document.getElementById("confirm-meta").textContent =
    `Table No. ${order.tableNo} · ${order.mode} · ${formatOrderTime(order.placedAt)}`;
  document.getElementById("view-details-link").href = `order-details.html?order=${order.orderNumber}`;
});
