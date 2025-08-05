var express = require('express');
var router = express.Router();
const controller = require('../controllers/board.js');

router.get('/', controller.getBoardList);

module.exports = router;
