const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");
connectDB();
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Cargar frontend siempre
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});