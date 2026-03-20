const Product = require("../models/Product");

// GET productos
const getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// CREAR producto
const createProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
};

// BORRAR producto
const deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
};

module.exports = { getProducts, createProduct, deleteProduct };