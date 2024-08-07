const db = require('../db/db.config')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../service/userService')

class UserRepository {

    async createUser(user) {
        const name = user.name
        const email = user.email
        const contact = user.contact
        const password = user.password

        var sql = "INSERT INTO user (name, email, contact, password) VALUES (?,?,?,?) ";
        let hashedPassword = await hashPassword(password)
        console.log('hashed password :', hashedPassword)
        return new Promise((resolve, reject) => {
            db.query(sql, [name, email, contact, hashedPassword], function (error, result, fields) {
                if (error) {
                    console.log('Error while inserting into database')
                    reject(error)
                }
                console.log('InsertId: ', result.insertId)
                resolve(result.insertId)
            })
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
}


module.exports = new UserRepository();