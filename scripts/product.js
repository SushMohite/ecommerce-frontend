const productDetail = document.getElementById("productDetail");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const cartCount = document.getElementById("cart-count");

const API_URL = "https://fakestoreapi.com/products";
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("No product selected");
    return null;
  }

  return id;
}

async function fetchProduct() {
  console.log("Product page loaded");
  try {
    loading.style.display = "block";
    error.style.display = "none";

    const id = getProductId();

    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error");

    const product = await response.json();

    renderProduct(product);
  } catch (err) {
    error.style.display = "block";
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
  console.log("Product ID:", getProductId());
}

function renderProduct(product) {
  productDetail.innerHTML = `
        <div class="product-detail-container">
            
            <div class="image-container">
                <img id="productImage" src="${product.image}" alt="${product.title}">
            </div>

            <div class="details">
                <h2>${product.title}</h2>
                
                <p class="price">₹<span id="price">${product.price}</span></p>

                <p>${product.description}</p>

                <!-- Variations -->
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

                <!-- Quantity -->
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

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({
            id: product.id,
            qty,
            size,
            color
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        alert("Product added to cart!");
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
  cartCount.textContent = cart.length;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProduct();
  updateCartCount();
});
window.addEventListener("storage", updateCartCount);
