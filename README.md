# Sobremesa Café — QR Ordering Front End

Plain HTML/CSS/JS front end matching the provided UI designs. No build step needed.

## Folder structure
```
sobremesa-cafe/
├── index.html            Home — Takeout/Dine-in + Table No., photo carousel, quick categories
├── menu.html             Menu — search + category filter
├── item.html             Product detail — size/ice/sugar/add-ons, opened by tapping an item
├── cart.html             Cart — real line items, Clear All, Proceed to Checkout
├── order-confirmed.html  Order placed confirmation (order number, table, time)
├── orders.html           My Orders — Active / History tabs
├── order-details.html    Order details — progress stepper, items, Cancel Order
├── css/
│   ├── base.css        Fonts, color/spacing variables, reset, app shell
│   ├── header.css      Top bar (brand, back button, page title, Clear All)
│   ├── search.css      Search bar
│   ├── buttons.css     Add-to-cart circle, filter pills, category icons, CTA button
│   ├── home.css        Home only: order-mode toggle, carousel, coffee series
│   ├── menu.css        Menu only: pill row layout, item list, empty state
│   ├── nav.css         Bottom tab bar + desktop top nav
│   ├── stub.css        Empty-state screens (empty cart, no orders)
│   ├── cart.css        Cart page: line items, quantity controls, summary
│   ├── item.css        Product detail screen (item.html)
│   ├── orders.css      Order confirmed / My Orders / Order Details (stepper + modal)
│   └── responsive.css  Phone/tablet/desktop breakpoints (linked last, so it wins)
│   Every HTML page links all 12 files directly, in this order — no @import,
│   so there's nothing for a dev server or browser to cache incorrectly.
├── js/
│   ├── menu-data.js       Mock menu items — swap for a real API call later
│   ├── app.js             Shared: cart + order data model, nav highlighting
│   ├── home.js            Home: carousel, order-mode toggle, "Coffee Series" cards
│   ├── menu.js            Menu: category pills + live search
│   ├── item.js            Item: size/ice/sugar/add-on selection, live price, Add to Cart
│   ├── cart.js            Cart: renders line items, qty controls, checkout
│   ├── order-confirmed.js Order confirmed: fills in order number/table/time
│   ├── orders.js          My Orders: Active/History tab filtering
│   └── order-details.js   Order details: stepper, items, Cancel Order modal
└── README.md
```

## Run on localhost
Pick one:

**Option A — VS Code Live Server**
1. Open the `sobremesa-cafe` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

**Option B — Python (no install needed if Python is installed)**
```
cd sobremesa-cafe
python3 -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

## If a change doesn't seem to show up
Do a **hard refresh** (Ctrl+Shift+R / Cmd+Shift+R) after replacing the files —
browsers sometimes cache CSS aggressively on a local server. If you're using
VS Code's Live Server, also try stopping and restarting it so it's watching
the newly-extracted files, not an old copy. Also make sure you're viewing it
in an actual browser window/tab, not a narrow embedded preview panel —
the desktop layout only appears once the window is wide enough.

## Works on any device
- **Phone (under 480px):** full-screen single-column app layout.
- **480–899px:** Menu becomes a 2-column card grid so it doesn't stay a
  single stacked column on anything wider than a small phone.
- **Tablet (600–899px):** the app UI framed as a wider centered card,
  "Coffee Series" at 4 columns.
- **Laptop / desktop (900px+):** a real website layout — top nav bar instead
  of bottom tabs, Home's hero goes side-by-side, Menu/Cart use multi-column
  and sidebar layouts.

## The full order flow
1. **Home** — choose Takeout or Dine-in. The table number is read from the
   QR URL (`?table=4`) and shown as read-only context for either order mode,
   then the customer can browse the photo carousel and quick categories.
2. **Item detail → Add to Cart** — customize size/ice/sugar/add-ons; this
   adds a line item to the cart (`addLineToCart` in `js/app.js`) and jumps
   straight to Cart so you see what you added.
3. **Cart** — adjust quantity, remove items, "Clear All", or
   **Proceed to Checkout**, which calls `placeOrderFromCart()` (turns the
   cart into an order, clears it) and opens the confirmation screen.
4. **Order Confirmed** — shows the order number, table/timestamp, with links
   to view details or go home.
5. **My Orders** — Active vs. History tabs list every order created so far.
6. **Order Details** — a progress stepper (Paid → Confirmed → Preparing →
   Ready → Served) plus a **Cancel Order** button (only while the order is
   still cancellable), which opens a confirm modal and then a
   "Order Cancelled" screen.

All of this is stored in `localStorage` (`sobremesa_cart`, `sobremesa_orders`)
— see the next section for wiring it to a real backend.

## Connecting to a backend later
- Replace the `MENU_ITEMS` array in `js/menu-data.js` with a `fetch('/api/menu')` call.
- The cart functions in `js/app.js` (`addLineToCart`, `updateLineQuantity`, etc.)
  currently read/write `localStorage` — swap their insides for real API calls
  when a cart backend exists; every place that calls them stays the same.
- `placeOrderFromCart()` and `cancelOrder()` in `js/app.js` are the two calls
  to point at a real orders API — everything downstream (confirmation, My
  Orders, Order Details, cancel flow) already reads from `getOrders()`, so
  swapping its internals for a `fetch` is the only change needed.
- Each product's `id` field is already there so cart/order API calls can reference it.
