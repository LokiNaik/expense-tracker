const jwt = require('jsonwebtoken');
const { AUTH_HEADER_MISSING_ERR, ACCESS_DENIED_ERR, AUTH_TOKEN_MISSING_ERR } = require('../error/error');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY

exports.authenticateJWT = (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
        return res.status(401).send(AUTH_HEADER_MISSING_ERR);
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({ message: ACCESS_DENIED_ERR });
            }
            // console.log('User : ',user)
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ AUTH_TOKEN_MISSING_ERR });
    }
};