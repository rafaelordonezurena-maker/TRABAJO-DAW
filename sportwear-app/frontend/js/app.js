const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
let cart = [];

let allProducts = []; // Para filtros

// Cargar productos
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        renderProducts(products);
    })
    .catch(err => console.error(err));

// Función para mostrar productos
function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Marca: ${product.brand || 'N/A'}</p>
            <button class="add-to-cart">Añadir al carrito</button>
        `;
        card.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));
        productList.appendChild(card);
    });
}

// Carrito
function addToCart(product) {
    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
}

function renderCart() {
    cartList.innerHTML = "<h2>Carrito 🛒</h2>";
    if (cart.length === 0) {
        cartList.innerHTML += "<p>Vacío</p>";
        return;
    }
    cart.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `${item.name} - $${item.price} x ${item.quantity} <button class="remove-item">Eliminar</button>`;
        div.querySelector(".remove-item").addEventListener("click", () => {
            cart = cart.filter(i => i.id !== item.id);
            renderCart();
        });
        cartList.appendChild(div);
    });
}

// Filtros
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const sortPriceBtn = document.getElementById("sortPrice");

categoryFilter?.addEventListener("change", applyFilters);
brandFilter?.addEventListener("change", applyFilters);
sortPriceBtn?.addEventListener("click", () => {
    const sorted = [...allProducts].sort((a, b) => a.price - b.price);
    renderProducts(sorted);
});

function applyFilters() {
    let filtered = [...allProducts];
    const category = categoryFilter.value;
    const brand = brandFilter.value;

    if (category) filtered = filtered.filter(p => p.category === category);
    if (brand) filtered = filtered.filter(p => p.brand === brand);

    renderProducts(filtered);
}