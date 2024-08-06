const express = require('express')
const userRoute = express.Router()
const userController = require('../controller/UserController')

userRoute.post('/register', userController.userRegister)
userRoute.post('/login', userController.userLogin)

module.exports = userRoute