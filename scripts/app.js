const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const API_URL = "https://fakestoreapi.com/products";

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelector(".cta-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#products").scrollIntoView({
        behavior: "smooth"
    });
});

async function fetchProducts() {
    try {
        loading.style.display = "block";
        error.style.display = "none";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API Error");
        }

        const products = await response.json();

        renderProducts(products);
    } catch (err) {
        error.style.display = "block";
        console.error(err);
    } finally {
        loading.style.display = "none";
    }
}

function renderProducts(products) {
    productGrid.innerHTML = "";

    products.forEach(product => {
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
            addToCart(product.id);
        });

        productGrid.appendChild(card);
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(id);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Product added to cart!");
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount();
});
