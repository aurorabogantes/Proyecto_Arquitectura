const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/current', controller.current);

module.exports = router;
