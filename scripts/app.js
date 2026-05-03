const API_URL = "https://fakestoreapi.com/products";

// Run everything after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const productGrid = document.getElementById("productGrid");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#products").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  async function fetchProducts() {
    try {
      loading.style.display = "block";
      error.style.display = "none";

      const response = await fetch(API_URL);

      if (!response.ok) throw new Error("API Error");

      const products = await response.json();

      renderProducts(products);
    } catch (err) {
      console.error(err);
      error.style.display = "block";
    } finally {
      loading.style.display = "none";
    }
  }

  function renderProducts(products) {
    productGrid.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title.substring(0, 40)}...</h3>
        <p class="price">₹${product.price}</p>
        <button class="add-btn">Add to Cart</button>
      `;

      card.addEventListener("click", () => {
        window.location.href = `product.html?id=${product.id}`;
      });

      card.querySelector(".add-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product, 1);
      });

      productGrid.appendChild(card);
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
        qty: qty,
        size: size,
        color: color,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Item added to cart!");
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach((item) => {
      total += item.qty || 1;
    });

    const el = document.getElementById("cart-count");

    if (el) {
      el.textContent = total;
    }
  }

  // Initial calls
  fetchProducts();
  updateCartCount();
});