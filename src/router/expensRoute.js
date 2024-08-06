const express = require('express')
const expenseRoute = express.Router()
const expenseController = require('../controller/expenseController')

expenseRoute.post('/expenses', expenseController.createExpense)

module.exports = expenseRoute