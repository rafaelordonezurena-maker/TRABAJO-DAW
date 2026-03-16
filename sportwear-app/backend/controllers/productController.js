const products = require("../models/Product");

const getProducts = (req, res) => res.json(products);

const getProductById = (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
};

const createProduct = (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
};

const deleteProduct = (req, res) => {
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Producto no encontrado" });
    const deleted = products.splice(index, 1);
    res.json(deleted[0]);
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };