
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userRepository = require('../repository/userRepository');
const { INTERNAL_SERVER_ERROR, USER_NOT_FOUND_ERR, WRONG_PASSWORD_ERR, SERVER_ERR, DUPLICATE_RECORD_ERR } = require('../error/error');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY


/**
 * 
 * @param {object} request Express request object
 * @param {object} res Express response object
 * @param {object} next Express next middleware function
 * @returns 
 */
exports.userRegister = async (request, res, next) => {
    try {
        const user = request.body;
        const response = await userRepository.createUser(user)
        if (response.code) {
            console.log('Error : {}', response)
            return next({ status: 500, message: DUPLICATE_RECORD_ERR })
        }
        return res.status(201).json({ user_created: response })
    } catch (error) {
        console.log('Error : ', error)
        return next({ status: 500, message: INTERNAL_SERVER_ERROR })
    }
}

/**
 * 
 * @param {object} request Express request object
 * @param {object} res Express response object
 * @param {object} next Express next middleware function
 * @returns 
 */
exports.userLogin = async (req, res, next) => {
    const user = req.body
    try {
        const result = await userRepository.userLogin(user)
        if (result.length === 0) {
            return next({ status: 404, message: USER_NOT_FOUND_ERR });
        }
        if (result.code) {
            return next({ status: 500, message: result.code });
        }
        let hash = result[0].password
        bcrypt.compare(user.password, hash).then((isMatch) => {
            if (isMatch) {
                const token = jwt.sign({ username: user.email }, SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return next({ status: 401, message: WRONG_PASSWORD_ERR });
            }
        }).catch((err) => {
            return next({ status: 400, message: SERVER_ERR })
        })
    } catch (error) {
        return next({ status: 500, message: error.message })
    }
}

/**
 * 
 * @param {object} request Express request object
 * @param {object} res Express response object
 * @param {object} next Express next middleware function
 * @returns 
 */
exports.getUser = async (req, res, next) => {
    const email = req
    const result = await userRepository.getUser(email)
    if (result.length === 0) {
        return res.status(404).json({ message: USER_NOT_FOUND_ERR });
    }
    if (result.code) {
        return next({ status: 500, message: result.code });
    }
    return result
}