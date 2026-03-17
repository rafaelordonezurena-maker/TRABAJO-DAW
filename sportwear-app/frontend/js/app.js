let cart = [];

async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();

    const list = document.getElementById("product-list");

    if (!list) return;

    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `
        <div class="product">
            <img src="${p.image}" />
            <h3>${p.name}</h3>
            <p>${p.price}€</p>
            <button onclick='addToCart(${JSON.stringify(p)})'>
                Añadir al carrito
            </button>
        </div>
        `;
    });
}

function addToCart(product) {
    const existing = cart.find(p => p._id === product._id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    if (!cartList) return;

    cartList.innerHTML = "<h2>Carrito</h2>";

    cart.forEach(item => {
        cartList.innerHTML += `
        <div>
            ${item.name} x${item.quantity}
        </div>
        `;
    });
}

loadProducts();