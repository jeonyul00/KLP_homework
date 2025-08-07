const { verify } = require('./jwt.js');
require('dotenv').config();

const SESSION_EXPIRED_MESSAGE = `세션이 만료되어 로그아웃되었습니다.\n다시 로그인해주세요.`;

const checkToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ message: SESSION_EXPIRED_MESSAGE, tokenExpired: true });
        }
        const token = authHeader.split(' ')[1];
        const { valid, payload } = await verify(token);
        if (!valid) {
            return res.json({ message: SESSION_EXPIRED_MESSAGE, tokenExpired: true });
        }
        const { id } = payload;
        req.memberInfo = { id };
        next();
    } catch (error) {
        console.error('checkToken middleware error:', error);
        return res.status(500).json({ status: 500, message: '서버 내부 오류가 발생했습니다.' });
    }
};

module.exports = { checkToken };
