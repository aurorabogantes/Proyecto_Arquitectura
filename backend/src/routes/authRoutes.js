const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { verificarToken } = require("../middleware/authMiddleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", verificarToken, controller.me);

module.exports = router;
