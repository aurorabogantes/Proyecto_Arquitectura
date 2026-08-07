const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/aiController');

router.post('/execute', controller.execute);
router.post('/assist',  controller.assist);

module.exports = router;
