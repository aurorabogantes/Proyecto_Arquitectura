const express = require("express");

const router = express.Router();

const controller = require("../controllers/reportController");
const { verificarToken, requireRole } = require("../middleware/authMiddleware");

// El reporte individual lo puede pedir un docente/administrador (de cualquier
// estudiante) o el propio estudiante (solo el suyo); esa verificación puntual
// se hace dentro del controlador porque depende de a quién pide el reporte.
router.get("/student/:estudianteId", verificarToken, controller.student);
router.get("/student/:estudianteId/pdf", verificarToken, controller.studentPdf);

// El reporte grupal por curso es solo para docentes/administradores.
router.get("/course/:cursoId", verificarToken, requireRole("docente", "administrador"), controller.course);

module.exports = router;
