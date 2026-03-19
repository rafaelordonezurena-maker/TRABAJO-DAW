const isAdmin = (req, res, next) => {
    if (req.body.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "No eres admin" });
    }
};

module.exports = isAdmin;