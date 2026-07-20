const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.get('/library', mediaController.library);

module.exports = router;