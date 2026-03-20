let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   IMÁGENES SEGURAS
========================= */

function getImage(category) {
    const images = {
        running: "https://source.unsplash.com/400x300/?running-shoes",
        futbol: "https://source.unsplash.com/400x300/?football-boots",
        fitness: "https://source.unsplash.com/400x300/?gym",
        tenis: "https://source.unsplash.com/400x300/?tennis-racket"
    };

    return images[category] || "https://source.unsplash.com/400x300/?sport";
}

/* =========================
   PRODUCTOS
========================= */

async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();

    const list = document.getElementById("product-list");
    if (!list) return;

    list.innerHTML = "";

    products.forEach(p => {
        const img = p.image || getImage(p.category);

        list.innerHTML += `
        <div class="product">
            <img src="${img}" />
            <h3>${p.name}</h3>
            <p class="price">${p.price}€</p>

            <button onclick="addToCart('${p._id}')">
                Añadir al carrito
            </button>
        </div>
        `;
    });
}

/* =========================
   CARRITO
========================= */

async function addToCart(id) {
    const res = await fetch("/api/products");
    const products = await res.json();

    const product = products.find(p => p._id === id);

    const existing = cart.find(p => p._id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    if (!cartList) return;

    cartList.innerHTML = "<h2>Carrito 🛒</h2>";

    let total = 0;

    cart.forEach(item => {
        const img = item.image || getImage(item.category);

        total += item.price * item.quantity;

        cartList.innerHTML += `
        <div class="cart-item">
            <img src="${img}" width="60"/>
            <div>
                <strong>${item.name}</strong>
                <p>${item.price}€ x ${item.quantity}</p>
            </div>
            <div>
                <button onclick="increase('${item._id}')">+</button>
                <button onclick="decrease('${item._id}')">-</button>
            </div>
        </div>
        `;
    });

    cartList.innerHTML += `<h3>Total: ${total}€</h3>`;
}

function increase(id) {
    const item = cart.find(p => p._id === id);
    item.quantity++;
    saveCart();
    renderCart();
}

function decrease(id) {
    const item = cart.find(p => p._id === id);
    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p._id !== id);
    }

    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   LOGIN
========================= */

document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const user = await res.json();

    if (!user.email) {
        alert("Credenciales incorrectas");
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    alert("Login correcto");
    window.location.href = "index.html";
});

/* =========================
   REGISTER
========================= */

document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetch("/api/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email, password })
    });

    alert("Usuario registrado");
    window.location.href = "login.html";
});

/* =========================
   ADMIN
========================= */

document.getElementById("productForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        alert("No autorizado");
        return;
    }

    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        brand: document.getElementById("brand").value
    };

    await fetch("/api/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    });

    alert("Producto creado");
    loadAdminProducts();
});

async function loadAdminProducts() {
    const container = document.getElementById("admin-products");
    if (!container) return;

    const res = await fetch("/api/products");
    const products = await res.json();

    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
        <div>
            <h3>${p.name}</h3>
            <button onclick="deleteProduct('${p._id}')">Eliminar</button>
        </div>
        `;
    });
}

async function deleteProduct(id) {
    await fetch("/api/products/" + id, { method: "DELETE" });
    loadAdminProducts();
}

/* =========================
   INIT
========================= */

loadProducts();
renderCart();
loadAdminProducts();