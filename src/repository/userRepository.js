const db = require('../db/db.config')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../service/userService');
const { queryHelper } = require('./queryHelper');

class UserRepository {

    async createUser(user) {
        try {
            const { name, email, contact, password } = user
            var sql = "INSERT INTO user (name, email, contact, password) VALUES (?,?,?,?) ";
            let hashedPassword = await hashPassword(password)
            // console.log('hashed password :', hashedPassword)
            const result = await queryHelper(sql, [name, email, contact, hashedPassword])
            return result
        } catch (error) {
            console.log('Error in register new user!', error)
            throw error
        }
    }

    async userLogin(user) {
        const { email, password } = user
        var sqlFindQuery = "SELECT * FROM user WHERE email = ?"
        try {
            const result = await queryHelper(sqlFindQuery, [email])
            return result
        } catch (error) {
            console.log('Error logging in : ', error)
            throw error
        }
    }

    async getUser(email) {
        let sql = 'SELECT user.id, user.email FROM user WHERE user.email = ?'
        try {
            const result = await queryHelper(sql, [email])
            return result
        } catch (error) {
            console.log('Error fetching user : ', error)
            throw error
        }
    }
}


module.exports = new UserRepository();