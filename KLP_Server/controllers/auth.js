require('dotenv').config();
const { logErrorToDB } = require('../utils/registErrorLog.js');
const bcrypt = require('bcrypt');
const pool = require('../utils/db.js');
const { sign } = require('../utils/jwt');
const { validateAccountId, validatePassword, validateNickname } = require('../utils/vaildation.js');

// 최초 호출
exports.initCheck = async (req, res) => {
    let memberId = 'unknown';
    try {
        const { id } = req.memberInfo;
        if (!id) {
            return res.json({ status: 400, message: '토큰 정보가 올바르지 않습니다.' });
        }
        const [[row]] = await pool.query(`SELECT idx, nickname, thumbnail FROM member where del = "N" AND idx = ?`, [id]);
        memberId = String(row.idx);
        const accessToken = await sign({ id: row.idx }, 'accessToken');
        return res.json({ status: 201, message: `hello ${row.nickname}`, accessToken, id: row.idx, nickname: row.nickname, thumbnail: row.thumbnail });
    } catch (e) {
        await logErrorToDB({ pk_id: memberId, request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 회원 가입
exports.signup = async (req, res) => {
    let memberId = 'unknown';
    try {
        const thumbnail = req.thumbnail;
        const { nickname, id, pwd } = req.body;
        if (!thumbnail || !nickname || !id || !pwd) {
            return res.json({ status: 400, message: '요청 필드가 누락되었습니다.' });
        }
        const nicknameError = validateNickname(nickname);
        const idError = validateAccountId(id);
        const pwdError = validatePassword(pwd);
        if (nicknameError || idError || pwdError) {
            return res.json({ status: 400, message: '유효성 검사에 실패했습니다.' });
        }
        const [existing] = await pool.query('SELECT member_id FROM member WHERE member_id = ? AND del = "N"', [id]);
        if (existing.length > 0) {
            return res.json({ status: 409, message: '이미 사용 중인 아이디입니다.' });
        }
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const [result] = await pool.query(`INSERT INTO member (member_id, member_pwd, nickname, thumbnail) VALUES (?, ?, ?, ?)`, [id, hashedPassword, nickname, thumbnail]);
        memberId = String(result.insertId);
        const jwtAccessToken = await sign({ id: result.insertId }, 'accessToken');
        const jwtRefreshToken = await sign({ id: result.insertId }, 'refreshToken');
        return res.json({ status: 201, message: '가입 완료', accessToken: jwtAccessToken, refreshToken: jwtRefreshToken, id: result.insertId, nickname, thumbnail });
    } catch (e) {
        await logErrorToDB({ pk_id: memberId, request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 로그인
exports.signin = async (req, res) => {
    let memberId = 'unknown';
    try {
        const { id, pwd } = req.body;
        if (!id || !pwd) {
            return res.json({ status: 400, message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }
        const [[member]] = await pool.query('SELECT idx, member_pwd, nickname, thumbnail FROM member WHERE member_id = ? AND del = "N"', [id]);
        if (!member) {
            return res.json({ status: 404, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
        const isMatch = await bcrypt.compare(pwd, member.member_pwd);
        if (!isMatch) {
            return res.json({ status: 401, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
        memberId = String(member.idx);
        const accessToken = await sign({ id: member.idx }, 'accessToken');
        const refreshToken = await sign({ id: member.idx }, 'refreshToken');
        return res.status(200).json({ status: 200, message: '로그인 성공', accessToken, refreshToken, id: member.idx, nickname: member.nickname, thumbnail: member.thumbnail });
    } catch (e) {
        await logErrorToDB({ pk_id: memberId, request_url: req.originalUrl, payload: req.body, message: e.stack || e.message || 'unknown error' });
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};
