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
    const connection = await pool.getConnection();
    try {
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

// 게시글 상세 조회
// TODO: 병렬 처리
exports.getBoardDetail = async (req, res) => {
    try {
        const { idx } = req.query;
        if (!idx) {
            return res.json({ status: 400, message: '잘못된 요청입니다.' });
        }
        const [boardRows] = await pool.query(`SELECT b.idx, b.title, b.contents, b.author, m.nickname, b.create_date FROM board b JOIN member m ON b.author = m.idx WHERE b.idx = ? AND b.del = 'N'`, [idx]);
        if (boardRows.length === 0) {
            return res.json({ status: 404, message: '게시글이 존재하지 않습니다.' });
        }
        const board = boardRows[0];
        const [images] = await pool.query(`SELECT image, \`order\` FROM board_images WHERE board_idx = ? AND del = 'N' ORDER BY CAST(\`order\` AS UNSIGNED)`, [idx]);
        const [comments] = await pool.query(`SELECT c.idx, c.board_idx, c.author, m.nickname, c.contents, c.create_date FROM board_comments c JOIN member m ON c.author = m.idx WHERE c.board_idx = ? AND c.del = 'N' ORDER BY c.create_date ASC`, [idx]);
        return res.status(200).json({ status: 200, message: '게시글 상세 조회 성공', data: { board, images, comments } });
    } catch (e) {
        await logErrorToDB({ pk_id: 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 댓글 등록
exports.registComment = async (req, res) => {
    try {
        const { idx: board_idx, comment: contents } = req.body;
        const { id: author } = req.memberInfo;
        if (!board_idx || !contents || !author) {
            return res.json({ status: 400, message: '필수 정보가 누락되었습니다.' });
        }
        await pool.query(`INSERT INTO board_comments (board_idx, author, contents) VALUES (?, ?, ?)`, [board_idx, author, contents]);
        return res.status(200).json({ status: 200, message: '댓글이 등록되었습니다.' });
    } catch (e) {
        await logErrorToDB({ pk_id: req.memberInfo?.id || 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 게시물 삭제
// TODO: 병렬처리
exports.deleteBoard = async (req, res) => {
    const connection = await pool.getConnection();
    const { boardIdx } = req.body;
    const memberId = req.memberInfo?.id;
    if (!boardIdx || !memberId) {
        return res.json({ status: 400, message: '잘못된 요청입니다.' });
    }
    try {
        await connection.beginTransaction();
        const [[board]] = await connection.query(`SELECT author FROM board WHERE idx = ? AND del = 'N'`, [boardIdx]);
        if (!board) {
            return res.json({ status: 404, message: '게시글이 존재하지 않습니다.' });
        }
        if (board.author !== memberId) {
            return res.json({ status: 403, message: '삭제 권한이 없습니다.' });
        }
        await connection.query(`UPDATE board SET del = 'Y' WHERE idx = ?`, [boardIdx]);
        await connection.query(`UPDATE board_images SET del = 'Y' WHERE board_idx = ?`, [boardIdx]);
        await connection.query(`UPDATE board_comments SET del = 'Y' WHERE board_idx = ?`, [boardIdx]);
        await connection.commit();
        return res.status(200).json({ status: 200, message: '게시글이 삭제되었습니다.' });
    } catch (e) {
        await connection.rollback();
        await logErrorToDB({ pk_id: memberId || 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
};

// 게시물 수정
// TODO: 병렬처리
exports.updateBoard = async (req, res) => {
    const { idx, title, contents } = req.body;
    const uploadedImages = (req.images || []).sort((a, b) => a.order - b.order);
    if (!idx || !title || !contents) {
        return res.json({ message: '필수 값 누락', status: 400 });
    }
    const connection = await pool.getConnection();

    try {
        const [boardRows] = await connection.query('SELECT author FROM board WHERE idx = ? AND del = "N"', [idx]);
        if (boardRows.length === 0) {
            return res.json({ message: '게시글이 존재하지 않거나 이미 삭제되었습니다.', status: 404 });
        }
        const boardAuthorId = boardRows[0].author;
        const requestUserId = req.memberInfo?.id;
        if (Number(boardAuthorId) !== Number(requestUserId)) {
            return res.json({ message: '작성자만 수정할 수 있습니다.', status: 403 });
        }
        await connection.beginTransaction();
        await connection.query('UPDATE board SET title = ?, contents = ?, update_date = NOW() WHERE idx = ? AND del = "N"', [title, contents, idx]);
        await connection.query('UPDATE board_images SET del = "Y" WHERE board_idx = ? AND del = "N"', [idx]);
        for (const image of uploadedImages) {
            await connection.query('INSERT INTO board_images (board_idx, image, `order`, del) VALUES (?, ?, ?, "N")', [idx, image.s3Path, String(image.order)]);
        }
        await connection.commit();
        return res.status(200).json({ message: '게시글이 수정되었습니다.', status: 200 });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ message: '서버 오류', status: 500 });
    } finally {
        connection.release();
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const memberId = req.memberInfo?.id;
    const { idx: commentIdx } = req.body;
    if (!memberId || !commentIdx) {
        return res.json({ status: 400, message: '잘못된 요청입니다.' });
    }
    try {
        const [[comment]] = await pool.query(`SELECT author FROM board_comments WHERE idx = ? AND del = 'N'`, [commentIdx]);
        if (!comment) {
            return res.json({ status: 404, message: '댓글이 존재하지 않습니다.' });
        }
        if (comment.author !== memberId) {
            return res.json({ status: 403, message: '삭제 권한이 없습니다.' });
        }
        await pool.query(`UPDATE board_comments SET del = 'Y' WHERE idx = ?`, [commentIdx]);
        return res.status(200).json({ status: 200, message: '댓글이 삭제되었습니다.' });
    } catch (e) {
        await logErrorToDB({ pk_id: memberId || 'unknown', request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};
