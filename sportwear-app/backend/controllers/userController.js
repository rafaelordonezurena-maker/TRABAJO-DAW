const users = require("../models/User");

const getUsers = (req, res) => res.json(users);

const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json(newUser);
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: "Email o contraseña incorrectos" });
    res.json(user);
};

module.exports = { getUsers, registerUser, loginUser };