const API_URL = "https://fakestoreapi.com/products";

import { auth } from "./firebase.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const productGrid = document.getElementById("productGrid");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const logoutBtn = document.getElementById("logoutBtn");
  const authLink = document.getElementById("authLink");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebaseAuth.signOut(auth)
        .then(() => {
          localStorage.clear();
          window.location.href = "auth.html";
        })
        .catch((err) => {
          console.error("Logout error:", err);
        });
    });
  }

  firebaseAuth.onAuthStateChanged(auth, (user) => {
    if (user) {
      if (logoutBtn) logoutBtn.style.display = "block";
      if (authLink) authLink.style.display = "none";
    } else {
      if (logoutBtn) logoutBtn.style.display = "none";
      if (authLink) authLink.style.display = "block";
    }
  });

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

  function addToCart(product, qty = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach((item) => (total += item.qty || 1));

    const el = document.getElementById("cart-count");
    if (el) el.textContent = total;
  }

  fetchProducts();
  updateCartCount();
});