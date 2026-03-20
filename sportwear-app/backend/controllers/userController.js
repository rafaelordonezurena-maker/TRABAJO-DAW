let users = [];

const register = (req, res) => {
    const { name, email, password } = req.body;

    const user = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: email === "admin@gmail.com" ? "admin" : "user"
    };

    users.push(user);
    res.json(user);
};

const login = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    res.json(user);
};

module.exports = { register, login };