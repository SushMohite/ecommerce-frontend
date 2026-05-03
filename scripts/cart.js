const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
function getCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  return cart.filter((item) => item.title && item.price && item.image);
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  let cart = getCart();

  let total = 0;
  cart.forEach((item) => (total += item.qty || 1));

  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

function renderCart() {
  const cart = getCart();

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty</p>";
    cartTotalEl.textContent = "0";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
            <img src="${item.image}" width="80">
            <h4>${item.title}</h4>
            <p>₹${item.price}</p>
            <p>Size: ${item.size || "-"}</p>
            <p>Color: ${item.color || "-"}</p>

            <div>
                <button class="dec">-</button>
                <span>${item.qty}</span>
                <button class="inc">+</button>
            </div>

            <button class="remove">Remove</button>
        `;

    // Quantity increase
    div.querySelector(".inc").addEventListener("click", () => {
      item.qty++;
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    // Quantity decrease
    div.querySelector(".dec").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
        saveCart(cart);
        renderCart();
        updateCartCount();
      }
    });

    // Remove item
    div.querySelector(".remove").addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = totalPrice.toFixed(2);
}

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  alert("Proceeding to checkout...");
  // later → redirect to checkout page
});

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});
