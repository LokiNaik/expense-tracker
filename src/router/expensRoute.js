const express = require('express')
const expenseRoute = express.Router()
const expenseController = require('../controller/expenseController')
const { expenseValidator, validateId, expenseUpdateValidator } = require('../util/fieldsValidator')
const { authenticateJWT } = require('../util/authHelper')

expenseRoute.post('/expenses', expenseValidator, authenticateJWT, expenseController.createExpense)
expenseRoute.get('/expenses', authenticateJWT, expenseController.getAllExpenses)
expenseRoute.get('/expenses/:id', validateId, authenticateJWT, expenseController.getExpenses)
expenseRoute.put('/:uid/expenses/:eid', expenseUpdateValidator, authenticateJWT, expenseController.updateExpense)
expenseRoute.delete('/:uid/expenses/:eid', authenticateJWT, expenseController.deleteExpenseById)

module.exports = expenseRoute