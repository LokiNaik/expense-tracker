const express = require('express')
const userRoute = express.Router()
const userController = require('../controller/UserController')
const { registerValidation, loginValidation } = require('../util/fieldsValidator')
const { authenticateJWT } = require('../util/authHelper')

userRoute.post('/register', registerValidation, userController.userRegister)
userRoute.post('/login', loginValidation, userController.userLogin)
userRoute.get('/users',authenticateJWT, userController.getUsers)

module.exports = userRoute