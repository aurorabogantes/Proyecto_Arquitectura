const authService = require("../services/authService");

const authController = {

    // POST /api/auth/register  { nombre, email, password, rol }
    async register(req, res) {
        try {
            const sesion = await authService.register(req.body);
            res.status(201).json(sesion);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // POST /api/auth/login  { email, password }
    async login(req, res) {
        try {
            const sesion = await authService.login(req.body);
            res.json(sesion);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    // GET /api/auth/me  (requiere token)
    async me(req, res) {
        res.json({ user: req.user });
    }

};

module.exports = authController;
