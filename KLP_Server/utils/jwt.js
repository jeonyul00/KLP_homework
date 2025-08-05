const jwt = require('jsonwebtoken');
require('dotenv').config();

const sign = async (payload, type) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: type === 'refreshToken' ? '90d' : '7d',
    });
};

const verify = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, payload: decoded, expired: false };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, expired: true, error: 'expired' };
        }
        return { valid: false, expired: false, error: 'invalid' };
    }
};

module.exports = { sign, verify };
