const express = require('express');
const router = express.Router();
const controller = require('../controllers/gamificationController');

router.get('/dashboard', controller.dashboard);
router.get('/trivia', controller.trivia);
router.post('/trivia-resultado', controller.triviaResultado);
router.post('/points', controller.addPoints);

module.exports = router;
