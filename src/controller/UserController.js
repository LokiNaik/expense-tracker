
const db = require('../db/db.config');
const { loginValidation, registerValidation } = require('../util/fieldsValidator');
const bcrypt = require('bcrypt');
const userRepository = require('../repository/userRepository');

exports.userRegister = async (request, response) => {
    try {
        const user = request.body;
        const { error } = await registerValidation(user)
        if (error) {
            return response.status(500).json({ Error: error.details[0].message })
        }
        const response_id = await userRepository.createUser(user)
        response.status(201).json({ Id: response_id })
    } catch (error) {
        console.log('Error', error)
        response.status(500).json({ Error: 'Internal Server Error' })
    }
}

exports.userLogin = async (req, res) => {
    const user = req.body
    const { error } = loginValidation(user)
    if (error) {
        return res.status(500).json({ Error: error.details[0].message })
    }
    try {
        const result = await userRepository.userLogin(user)
        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        }
        let hash = result[0].password
        bcrypt.compare(user.password, hash).then((isMatch) => {
            if (isMatch) {
                res.status(200).json({ message: 'user logged in' })
            } else {
                res.status(400).json({ message: 'Wrong password!' });
            }
        }).catch((err) => {
            res.status(400).json({ message: "Error" })
        })
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
}