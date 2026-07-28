const express = require("express");

const router = express.Router();

const controller = require("../controllers/reportController");

router.get("/student/:estudianteId", controller.student);
router.get("/course/:cursoId", controller.course);
router.get("/student/:estudianteId/pdf", controller.studentPdf);

module.exports = router;
