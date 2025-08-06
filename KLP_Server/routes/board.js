var express = require('express');
var router = express.Router();

const controller = require('../controllers/board.js');
const { uploadImageList } = require('../utils/S3.js');
const { checkToken } = require('../utils/checkToken.js');

router.get('/', controller.getBoardList);
router.get('/detail', controller.getBoardDetail);
router.post('/regist', checkToken, uploadImageList, controller.registBoard);
router.post('/comment', checkToken, controller.registComment);
router.post('/delete', checkToken, controller.deleteBoard);
router.post('/update', checkToken, uploadImageList, controller.updateBoard);
router.post('/comment/delete', checkToken, controller.deleteComment);

module.exports = router;
