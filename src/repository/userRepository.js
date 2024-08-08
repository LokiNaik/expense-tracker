const db = require('../db/db.config')
const jwt = require('jsonwebtoken')
require('dotenv').config
const { hashPassword } = require('../service/userService');
const { queryHelper } = require('./queryHelper');
const { query } = require('express');

class UserRepository {

    async createUser(user) {
        try {
            const { name, email, contact, password, role } = user
            var sql = "INSERT INTO user (name, email, contact, password, role) VALUES (?,?,?,?,?) ";
            let hashedPassword = await hashPassword(password)
            const result = await queryHelper(sql, [name, email, contact, hashedPassword, role])
            if (result.insertId) {
                const payload = {
                    username: email,
                    role: role
                }
                const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1hr' })
                return token
            }
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

    async getUsers() {
        let sql = 'SELECT user.id, user.email, user.contact, user.role FROM user'
        try {
            const result = await queryHelper(sql)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}


module.exports = new UserRepository();