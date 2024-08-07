
const db = require('../db/db.config');
const { loginValidation, registerValidation } = require('../util/fieldsValidator');
const { hashPassword } = require('../service/userService');
const bcrypt = require('bcrypt')

exports.userRegister = async (request, response) => {

    const { name, email, contact, password } = request.body;
    const { error } = await registerValidation(request.body)
    if (error) {
        response.status(500).json({ Error: error.details[0].message })
        return;
    }

    var sql = "INSERT INTO user (name, email, contact, password) VALUES (?,?,?,?) ";
    let hashedPassword = await hashPassword(password)
    db.query(sql, [name, email, contact, hashedPassword], function (error, result, fields) {
        if (error) {
            console.log('Error while inserting into database')
            throw error
        }
        response.status(200).json({ InsertedId: result.insertId })
    })
}

exports.userLogin = (req, res) => {
    const { email, password } = req.body
    const { error } = loginValidation(req.body)
    if (error) {
        res.status(500).json({ Error: error.details[0].message })
        return
    }

    var sqlFindQuery = "SELECT * FROM user WHERE email = ?"
    db.query(sqlFindQuery, email, function (error, result, fields) {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ message: 'Server Error!' })
            throw error
        }
        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        }
        let hash = result[0].password
        bcrypt.compare(password, hash).then((isMatch) => {
            if (isMatch) {
                res.status(200).json({ message: 'user logged in' })
            } else {
                res.status(400).json({ message: 'Wrong password!' });
            }
        }).catch((err) => {
            res.status(400).json({ message: "Error" })
        })
    })
}