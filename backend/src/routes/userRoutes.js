const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { verificarToken, requireRole } = require('../middleware/authMiddleware');

router.get('/current', verificarToken, controller.current);
router.get('/students', verificarToken, requireRole('docente', 'administrador'), controller.listStudents);

module.exports = router;
