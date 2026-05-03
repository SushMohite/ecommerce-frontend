const API_URL = "https://fakestoreapi.com/products";

document.addEventListener("DOMContentLoaded", () => {
  const productDetail = document.getElementById("productDetail");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  async function fetchProduct() {
    try {
      loading.style.display = "block";
      error.style.display = "none";

      const id = getProductId();
      if (!id) {
        alert("No product selected");
        return;
      }

      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("API Error");

      const product = await response.json();

      loading.style.display = "none";
      renderProduct(product);

    } catch (err) {
      console.error(err);
      loading.style.display = "none";
      error.style.display = "block";
    }
  }

  function renderProduct(product) {
    productDetail.innerHTML = `
      <div class="product-detail-container">
        <div class="image-container">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <div class="details">
          <h2>${product.title}</h2>
          <p class="price">₹<span id="price">${product.price}</span></p>
          <p>${product.description}</p>

          <div class="variations">
            <label>Size:</label>
            <select id="size">
              <option>S</option>
              <option>M</option>
              <option>L</option>
            </select>

            <label>Color:</label>
            <select id="color">
              <option>Black</option>
              <option>Blue</option>
              <option>Red</option>
            </select>
          </div>

          <div class="quantity">
            <button id="decrease">-</button>
            <span id="qty">1</span>
            <button id="increase">+</button>
          </div>

          <p>Total: ₹<span id="total">${product.price}</span></p>

          <button id="addCartBtn">Add to Cart</button>
        </div>
      </div>
    `;

    setupInteractions(product);
  }

  function setupInteractions(product) {
    let qty = 1;
    const price = product.price;

    const qtyEl = document.getElementById("qty");
    const totalEl = document.getElementById("total");

    document.getElementById("increase").addEventListener("click", () => {
      qty++;
      update();
    });

    document.getElementById("decrease").addEventListener("click", () => {
      if (qty > 1) {
        qty--;
        update();
      }
    });

    function update() {
      qtyEl.textContent = qty;
      totalEl.textContent = (price * qty).toFixed(2);
    }

    document.getElementById("addCartBtn").addEventListener("click", () => {
      const size = document.getElementById("size").value;
      const color = document.getElementById("color").value;

      addToCart(product, qty, size, color);
    });
  }

  function addToCart(product, qty = 1, size = null, color = null) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) =>
        item.id === product.id &&
        item.size === size &&
        item.color === color
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty,
        size,
        color
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Item added to cart!");
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach(item => {
      total += item.qty || 1;
    });

    const el = document.getElementById("cart-count");
    if (el) {
      el.textContent = total;
    }
  }

  fetchProduct();
  updateCartCount();
});

window.addEventListener("storage", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  cart.forEach(item => total += item.qty || 1);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
});