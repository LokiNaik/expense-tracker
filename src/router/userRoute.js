const express = require('express')
const userRoute = express.Router()
const userController = require('../controller/UserController')
const { registerValidation, loginValidation } = require('../util/fieldsValidator')

userRoute.post('/register', registerValidation, userController.userRegister)
userRoute.post('/login', loginValidation, userController.userLogin)

module.exports = userRoute