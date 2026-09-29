/**
 * cart.js
 * Powers cart.html — renders the real cart contents from getCart()
 * (see app.js), lets the person adjust quantity or remove a line, and
 * shows a total. "Proceed to Checkout" creates an order (placeOrderFromCart
 * in app.js) and sends the person to the confirmation screen.
 */

function renderCart() {
  const cart = getCart();
  const emptyState = document.getElementById("cart-empty");
  const content = document.getElementById("cart-content");

  if (cart.length === 0) {
    emptyState.hidden = false;
    content.hidden = true;
    return;
  }

  emptyState.hidden = true;
  content.hidden = false;

  const list = document.getElementById("cart-list");
  list.innerHTML = cart
    .map(
      (line) => `
      <div class="cart-row" data-line="${line.lineId}">
        <div class="thumb" style="background-image:${line.thumbGradient}"></div>
        <div class="info">
          <p class="name">${line.name}</p>
          ${optionsSummary(line) ? `<p class="options">${optionsSummary(line)}</p>` : ""}
          <div class="row-bottom">
            <span class="line-price">₱${line.unitPrice * line.quantity}</span>
            <div class="cart-qty">
              <button data-qty-minus>${line.quantity === 1 ? "🗑" : "−"}</button>
              <span>${line.quantity}</span>
              <button data-qty-plus>+</button>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");

  list.querySelectorAll("[data-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lineId = btn.closest("[data-line]").dataset.line;
      const line = cart.find((l) => l.lineId === lineId);
      updateLineQuantity(lineId, line.quantity - 1);
      renderCart();
    });
  });

  list.querySelectorAll("[data-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lineId = btn.closest("[data-line]").dataset.line;
      const line = cart.find((l) => l.lineId === lineId);
      updateLineQuantity(lineId, line.quantity + 1);
      renderCart();
    });
  });

  document.getElementById("cart-total").textContent = `₱${getCartTotal()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const clearBtn = document.getElementById("clear-all-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (getCart().length === 0) return;
      clearCart();
      renderCart();
    });
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const order = placeOrderFromCart();
      if (order) window.location.href = `order-confirmed.html?order=${order.orderNumber}`;
    });
  }
});
