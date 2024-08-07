
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userRepository = require('../repository/userRepository');
const { INTERNAL_SERVER_ERROR, USER_NOT_FOUND_ERR, WRONG_PASSWORD_ERR, SERVER_ERR, DUPLICATE_RECORD_ERR } = require('../error/error');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY

exports.userRegister = async (request, res) => {
    try {
        const user = request.body;
        const response = await userRepository.createUser(user)
        if (response.code === 'ER_DUP_ENTRY') {
            return res.status(500).json({ DUPLICATE_RECORD_ERR })
        }
        return res.status(201).json({ Id: response })
    } catch (error) {
        console.log('Error : ', error)
        return res.status(500).json({ Error: INTERNAL_SERVER_ERROR, message: error.message })
    }
}

exports.userLogin = async (req, res) => {
    const user = req.body
    try {
        const result = await userRepository.userLogin(user)
        if (result.length === 0) {
            return res.status(404).json({ message: USER_NOT_FOUND_ERR });
        }
        let hash = result[0].password
        bcrypt.compare(user.password, hash).then((isMatch) => {
            if (isMatch) {
                const token = jwt.sign({ username: user.email }, SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: WRONG_PASSWORD_ERR });
            }
        }).catch((err) => {
            return res.status(400).json({ message: SERVER_ERR })
        })
    } catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}