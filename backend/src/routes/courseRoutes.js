const express = require('express');
const router = express.Router();
const courseController = require ('../controllers/courseController');

router.get('/', courseController.index);
router.get('/:id', courseController.show);
router.post('/:id/enroll', courseController.enroll);

module.exports = router;