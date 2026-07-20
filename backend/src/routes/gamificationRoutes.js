const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');

router.get('/dashboard', gamificationController.dashboard);
router.post('/progress', gamificationController.updateProgress);

module.exports = router;