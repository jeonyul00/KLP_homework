var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth.js');
const { uploadImage } = require('../utils/S3.js');

router.post('/signup', uploadImage, controller.signup);

module.exports = router;
