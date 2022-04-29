const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const limiterCtrl = require("../middleware/limiter")

router.post('/signup', userCtrl.signup);
router.post('/login', limiterCtrl.passwordLimiter, userCtrl.login);

module.exports = router;