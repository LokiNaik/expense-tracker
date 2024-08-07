const { RECORD_NOT_FOUND_ERR } = require('../error/error')
const expensesRepository = require('../repository/expensesRepository')

/** creates a new expense for user.id */
exports.createExpense = async (req, res) => {
    try {
        const expense = req.body
        const result = await expensesRepository.createExpense(expense)
        res.status(201).json({ InsertID: result })
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
}

/** Fetch all expenses from DB */
exports.getAllExpenses = async (req, res) => {
    try {
        const result = await expensesRepository.fetchAllExpences()
        res.status(200).json({ result })
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
}

/** fetch expenses of user by user.id */
exports.getExpenses = async (req, res) => {
    try {
        let id = req.params.id
        const result = await expensesRepository.getExpenses(id)
        if (result.length === 0) {
            return res.status(404).json({ message: RECORD_NOT_FOUND_ERR })
        }
        return res.status(200).json({ result })
    } catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}

/**Update existing record of expense */
exports.updateExpense = async (req, res) => {
    try {
        let expense = req.body
        let userId = req.params.uid
        let eid = req.params.eid
        const result = await expensesRepository.updateExpence(expense, userId, eid)
        if(result.affectedRows === 0){
            return res.status(404).json({message: RECORD_NOT_FOUND_ERR})
        }
        return res.status(200).json({ result })
    } catch (error) {
        return res.status(400).json({ Error: error.message })
    }
}

exports.deleteExpenseById = async (req, res) => {
    try {
        const result = await expensesRepository.deleteExpense(req.params)
        if (result === 0) {
            return res.status(404).json({ message: RECORD_NOT_FOUND_ERR })
        }
        return res.status(200).json({ effectedRow: result, message: 'DELETED' })
    } catch (error) {
        return res.status(400).json({ Error: error.message })
    }
}

