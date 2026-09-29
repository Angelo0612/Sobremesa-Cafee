/**
 * order-details.js
 * Powers order-details.html. Reads ?order=<orderNumber>, renders the
 * progress stepper (ORDER_STEPS in app.js), the items ordered, and
 * handles the Cancel Order confirmation modal.
 */

let currentOrder = null;

function renderStepper(order) {
  const stepper = document.getElementById("stepper");

  if (order.status === "Cancelled") {
    stepper.innerHTML = `<div class="stepper-cancelled">This order was cancelled.</div>`;
    return;
  }

  const currentIndex = ORDER_STEPS.indexOf(order.status);
  stepper.innerHTML = ORDER_STEPS.map((step, i) => {
    const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
    return `
      <div class="step ${state}">
        <span class="step-dot">${i < currentIndex ? "✓" : i + 1}</span>
        <span class="step-label">${step}</span>
      </div>`;
  }).join("");
}

function renderItems(order) {
  const list = document.getElementById("order-items-list");
  list.innerHTML = order.items
    .map(
      (line) => `
      <div class="cart-row">
        <div class="thumb" style="background-image:${line.thumbGradient}"></div>
        <div class="info">
          <p class="name">${line.name}</p>
          ${optionsSummary(line) ? `<p class="options">${optionsSummary(line)}</p>` : ""}
          <div class="row-bottom">
            <span class="line-price">₱${line.unitPrice * line.quantity}</span>
            <span class="qty-static">×${line.quantity}</span>
          </div>
        </div>
      </div>`
    )
    .join("");
}

function openModal(id) {
  document.getElementById(id).hidden = false;
}
function closeModal(id) {
  document.getElementById(id).hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  currentOrder = getOrder(params.get("order"));

  if (!currentOrder) {
    window.location.href = "orders.html";
    return;
  }

  document.getElementById("order-number").textContent = `#${currentOrder.orderNumber}`;
  document.getElementById("order-meta").textContent =
    `Table No. ${currentOrder.tableNo} · ${currentOrder.mode} · ${formatOrderTime(currentOrder.placedAt)}`;

  renderStepper(currentOrder);
  renderItems(currentOrder);
  document.getElementById("order-total").textContent = `₱${currentOrder.total}`;

  const cancelBtn = document.getElementById("cancel-order-btn");
  const cancellable = ["Paid", "Confirmed", "Preparing"].includes(currentOrder.status);
  cancelBtn.hidden = !cancellable;

  cancelBtn.addEventListener("click", () => openModal("cancel-modal"));
  document.getElementById("keep-order-btn").addEventListener("click", () => closeModal("cancel-modal"));
  document.getElementById("confirm-cancel-btn").addEventListener("click", () => {
    cancelOrder(currentOrder.orderNumber);
    closeModal("cancel-modal");
    openModal("cancelled-modal");
  });
});
