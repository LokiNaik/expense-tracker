const express = require('express')
const expenseRoute = express.Router()
const expenseController = require('../controller/expenseController')
const { expenseValidator, validateId } = require('../util/fieldsValidator')

expenseRoute.post('/expenses', expenseValidator, expenseController.createExpense)
expenseRoute.get('/expenses', expenseController.getAllExpenses)
expenseRoute.get('/expenses/:id', validateId, expenseController.getExpenses)

module.exports = expenseRoute