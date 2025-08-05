var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth.js');
const { uploadImage } = require('../utils/S3.js');
const { checkToken } = require('../utils/checkToken.js');

router.post('/init', checkToken, controller.initCheck);
router.post('/signup', uploadImage, controller.signup);
router.post('/signin', controller.signin);

module.exports = router;
