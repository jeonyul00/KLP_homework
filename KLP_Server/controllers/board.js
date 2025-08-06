require('dotenv').config();
const pool = require('../utils/db.js');
const { logErrorToDB } = require('../utils/registErrorLog.js');

// 게시물 리스트
exports.getBoardList = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const size = parseInt(req.query.size, 10) || 20;
        const offset = (page - 1) * size;
        const [rows] = await pool.query(`SELECT b.idx, b.title, m.nickname, b.create_date FROM board b JOIN member m ON b.author = m.idx WHERE b.del = 'N' ORDER BY b.create_date DESC LIMIT ? OFFSET ?`, [size, offset]);
        const [[{ count }]] = await pool.query(`SELECT COUNT(*) AS count FROM board b WHERE b.del = 'N'`);
        const hasNext = page * size < count;
        return res.status(200).json({ status: 200, message: '게시글 목록 조회 성공', data: rows, hasNext });
    } catch (e) {
        await logErrorToDB({ pk_id: 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 게시물 등록
exports.registBoard = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        let memberId = 'unknown';
        const { id } = req.memberInfo;
        if (!id) return res.json({ status: 401, message: '인증 정보가 없습니다.' });
        memberId = id;
        const images = (req.images || []).sort((a, b) => a.order - b.order);
        const { title, contents } = req.body;
        await connection.beginTransaction();
        const [boardResult] = await connection.query(`INSERT INTO board (author, title, contents) VALUES (?, ?, ?)`, [id, title, contents]);
        const boardIdx = boardResult.insertId;
        if (images.length > 0) {
            const imageValues = images.map((img) => [boardIdx, img.s3Path, img.order]);
            await connection.query(`INSERT INTO board_images (board_idx, image, \`order\`) VALUES ?`, [imageValues]);
        }
        await connection.commit();
        return res.status(200).json({ status: 200, message: '게시글 등록 성공' });
    } catch (e) {
        await connection.rollback();
        await logErrorToDB({ pk_id: memberId, request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
};

// 게시물 상세
// TODO: 게시글 등록 먼저하고, 작업하기
exports.getBoardDetail = async (req, res) => {
    try {
        const { idx } = req.query;
    } catch {
        await logErrorToDB({ pk_id: 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};
