require('dotenv').config();
const { logErrorToDB } = require('../utils/registErrorLog.js');
const bcrypt = require('bcrypt');
const pool = require('../utils/db.js');
const { sign } = require('../utils/jwt');
const { validateAccountId, validatePassword, validateNickname } = require('../utils/vaildation.js');

// 회원 가입
exports.signup = async (req, res) => {
    const connection = await pool.getConnection();
    let memberId = 'unknown';
    try {
        const thumbnail = req.thumbnail;
        const { nickname, id, pwd } = req.body;
        if (!thumbnail || !nickname || !id || !pwd) {
            return res.status(400).json({ status: 400, message: '요청 필드가 누락되었습니다.' });
        }
        const nicknameError = validateNickname(nickname);
        const idError = validateAccountId(id);
        const pwdError = validatePassword(pwd);
        if (nicknameError || idError || pwdError) {
            return res.status(400).json({ status: 400, message: '유효성 검사에 실패했습니다.' });
        }
        memberId = id;
        await connection.beginTransaction();
        const [existing] = await connection.query('SELECT member_id FROM member WHERE member_id = ? AND del = "N"', [id]);
        if (existing.length > 0) {
            return res.status(409).json({ status: 409, message: '이미 사용 중인 아이디입니다.' });
        }
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const [result] = await connection.query(`INSERT INTO member (member_id, member_pwd, nickname, thumbnail) VALUES (?, ?, ?, ?)`, [id, hashedPassword, nickname, thumbnail]);
        const jwtAccessToken = await sign({ id: result.insertId }, 'accessToken');
        const jwtRefreshToken = await sign({ id: result.insertId }, 'refreshToken');
        await connection.commit();
        return res.status(201).json({ status: 201, message: '가입 완료', acessToken: jwtAccessToken, refreshToken: jwtRefreshToken, id, nickname, thumbnail });
    } catch (e) {
        await logErrorToDB({ pk_id: memberId, request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
};
