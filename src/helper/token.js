const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    let accessToken = jwt.sign(payload, process.env.NODE_SECRET, { expiresIn: process.env.JWT_EXPIRED });
    let refreshToken = jwt.sign(payload, process.env.NODE_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRED });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    }
}

module.exports = { generateToken }