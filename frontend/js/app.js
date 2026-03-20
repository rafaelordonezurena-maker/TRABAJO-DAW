let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
        list.innerHTML += `
        <div class="product">
            <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300x200?text=SportWear'"/>
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
        total += item.price * item.quantity;

        cartList.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" onerror="this.src='https://via.placeholder.com/80'"/>
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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
        brand: document.getElementById("brand").value,
        image: document.getElementById("image").value
    };

    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    await fetch("/api/products/" + id, {
        method: "DELETE"
    });

    loadAdminProducts();
}

/* =========================
   SEED PRODUCTOS PRO (IMÁGENES BUENAS)
========================= */

async function seedProducts() {

const products = [
{ name: "Nike Air Zoom Pegasus", price: 120, category: "running", brand: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
{ name: "Adidas Ultraboost", price: 140, category: "running", brand: "Adidas", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519" },
{ name: "Asics Gel Nimbus", price: 130, category: "running", brand: "Asics", image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634" },

{ name: "Botas Nike Mercurial", price: 180, category: "futbol", brand: "Nike", image: "https://images.unsplash.com/photo-1570498839593-e565b39455fc" },
{ name: "Adidas Predator", price: 170, category: "futbol", brand: "Adidas", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db" },

{ name: "Mancuernas", price: 60, category: "fitness", brand: "Domyos", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61" },
{ name: "Banco de pesas", price: 120, category: "fitness", brand: "Adidas", image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba" },

{ name: "Raqueta Wilson", price: 110, category: "tenis", brand: "Wilson", image: "https://images.unsplash.com/photo-1611251135345-18d0d0d1d7c6" },
{ name: "Pelotas tenis", price: 10, category: "tenis", brand: "Head", image: "https://images.unsplash.com/photo-1595433562696-05c0d1b57d3a" }
];

for (let p of products) {
    await fetch("/api/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(p)
    });
}

alert("🔥 Productos PRO reales creados");

}

/* =========================
   INIT
========================= */

loadProducts();
renderCart();
loadAdminProducts();