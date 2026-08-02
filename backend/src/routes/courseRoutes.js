const express = require("express");

const router = express.Router();

const controller = require("../controllers/courseController");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/:id/enroll", controller.enroll);

module.exports = router;
