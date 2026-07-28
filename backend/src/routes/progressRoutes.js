const express = require("express");

const router = express.Router();

const controller = require("../controllers/progressController");

router.get("/student/:estudianteId", controller.byStudent);
router.get("/course/:cursoId", controller.byCourse);
router.get("/student/:estudianteId/course/:cursoId/lessons", controller.lessons);
router.get("/student/:estudianteId/history", controller.history);
router.post("/complete-lesson", controller.completeLesson);
router.post("/time", controller.trackTime);

module.exports = router;
