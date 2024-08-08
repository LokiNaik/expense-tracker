const db = require('../db/db.config')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../service/userService')

class UserRepository {

    async createUser(user) {
        const { name, email, contact, password } = user
        var sql = "INSERT INTO user (name, email, contact, password) VALUES (?,?,?,?) ";
        let hashedPassword = await hashPassword(password)
        // console.log('hashed password :', hashedPassword)
        return new Promise((resolve, reject) => {
            db.query(sql, [name, email, contact, hashedPassword], function (error, result, fields) {
                if (error) {
                    console.log('Error while inserting into database')
                    return reject(error)
                }
                // console.log('InsertId: ', result.insertId)
                return resolve(result)
            })
        }).catch((err) => {
            return err
        })
    }

    async userLogin(user) {
        const { email, password } = user
        var sqlFindQuery = "SELECT * FROM user WHERE email = ?"
        return new Promise((resolve, reject) => {
            db.query(sqlFindQuery, email, (err, result) => {
                if (err) {
                    return reject(err)
                }
                return resolve(result)
            })
        }).catch((err) => {
            return reject(err)
        })
    }

    async getUser(email) {
        let sql = 'SELECT user.id, user.email FROM user WHERE user.email = ?'
        return new Promise((resolve, reject) => {
            db.query(sql, email, function (error, result) {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        }).catch((error) => {
            return error
        })
    }
}


module.exports = new UserRepository();