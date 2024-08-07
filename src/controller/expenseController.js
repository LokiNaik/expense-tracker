const db = require('../db/db.config')
const expensesRepository = require('../repository/expensesRepository')


exports.createExpense = async (req, res) => {
    try {
        const expense = req.body
        const result = await expensesRepository.createExpense(expense)
        res.status(200).json({ InsertID: result })
    } catch (error) {
        res.status(500).json({ Error: error })
    }
}


exports.getAllExpenses = async (req, res) => {
    try {
        const result = await expensesRepository.fetchAllExpences()
        res.status(200).json({ result })
    } catch (error) {
        res.status(400).json({ Error: error.message })
    }
}

/** fetch expenses of user by user.id */
exports.getExpenses = async (req, res) => {
    try {
        let id = req.params.id
        const result = await expensesRepository.getExpenses(id)
        if (result.length === 0) {
            return res.status(200).json({ message: 'No Expenses found' })
        }
        return res.status(200).json({ result })
    } catch (error) {
        return res.status(400).json({ Error: error.message })
    }
}