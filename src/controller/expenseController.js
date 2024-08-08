const { RECORD_NOT_FOUND_ERR, INTERNAL_SERVER_ERROR } = require('../error/error')
const expensesRepository = require('../repository/expensesRepository')

/** 
 * creates a new expense for user.id 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {next} next - Eepress next middleware function
*/
exports.createExpense = async (req, res, next) => {
    try {
        const expense = req.body
        const email = req.user.username
        const result = await expensesRepository.createExpense(expense, email)
        if (result.code) {
            console.log('Error: ', result)
            next(result)
        }
        return res.status(201).json({ InsertID: result })
    } catch (error) {
        return next(error)
    }
}

/** 
 * Fetch all expenses from DB
 * @param {object} res - Express response object
 * @param {next} next - Eepress next middleware function 
 */
exports.getAllExpenses = async (req, res, next) => {
    try {
        const result = await expensesRepository.fetchAllExpences()
        return res.status(200).json({ result })
    } catch (error) {
        return next(error)
    }
}

/** 
 * fetch expenses of user by user.id 
 * @param {object} req - contains jwt username details.
 * @param {object} res - Express response object
 */
exports.getExpenses = async (req, res, next) => {
    try {
        let email = req.user.username
        const result = await expensesRepository.getExpenses(email)
        if (result.length === 0) {
            return next({ status: 404, message: RECORD_NOT_FOUND_ERR })
        }
        if (result.code) {
            console.log(result)
            return next({ status: 500, message: INTERNAL_SERVER_ERROR })
        }
        return res.status(200).json({ result })
    } catch (error) {
        return next({ status: 500, message: error.message })
    }
}

/**
 * Update existing record of expense 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {next} next - Eepress next middleware function
 */
exports.updateExpense = async (req, res, next) => {
    try {
        let expense = req.body
        let eid = req.params.eid
        const email = req.user.username
        const result = await expensesRepository.updateExpence(expense, email, eid)
        if (result.affectedRows === 0 || result === 0) {
            return next({ status: 404, message: RECORD_NOT_FOUND_ERR })
        }
        if (result.code) {
            console.log(result)
            return next({ status: 400, message: result.code })
        }
        return res.status(200).json({ result })
    } catch (error) {
        return next({ status: 400, message: error.message })
    }
}

/**
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {object} next Express next middleware function
 * @returns id
 */
exports.deleteExpenseById = async (req, res, next) => {
    try {
        const result = await expensesRepository.deleteExpense(req)
        if (result === 0) {
            return next({ status: 404, message: RECORD_NOT_FOUND_ERR })
        }
        return res.status(200).json({ effectedRow: result, message: 'DELETED' })
    } catch (error) {
        return next({ status: 400, message: error.message })
    }
}

