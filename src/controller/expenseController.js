const db = require('../db/db.config')
const { expenseValidator } = require("../util/fieldsValidator")


exports.createExpense = (req, res) => {
    const user_id = req.body.user_id // id of user getting from payload
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
    var date = new Date()

    const { error } = expenseValidator(req.body)
    if (error) {
        return res.status(500).json({ Error: error.details[0].message })
    }

    var sql = "INSERT INTO user_expenses (user_id, amount, description, category, date) VALUES (?,?,?,?,?) ";
    db.query(sql, [user_id, amount, description, category, date], function (error, result, fields) {
        if (error) {
            console.log('Error while inserting into database')
            throw error
        }
        console.log('result', result)
        res.status(200).json({ InsertedId: result.insertId })
    })
}


exports.getAllExpenses = (req, res) => {
    let sql = 'SELECT * FROM user_expenses'
    db.query(sql, function (error, result) {
        if (error) {
            return res.status(400).json({ message: error.message })
        }
        res.status(200).json({ message: result })
    })
}

/** fetch expenses of user by user.id */
exports.getExpenses = (req, res) => {
    let id = req.params.id
    if (!id) {
        return res.status(400).json({ Error: 'Id not present!' })
    }
    let sql = `SELECT user.id, user.name, user_expenses.amount, user_expenses.description, user_expenses.date
                FROM user INNER JOIN user_expenses ON user.id = user_expenses.user_id 
                WHERE user.id=${id}`
    db.query(sql, function (err, result) {
        if (err) {
            console.log('error', err)
            return res.status(400).json({ Error: err.message })
        }
        if (result.length === 0) {
            return res.status(200).json({ message: 'No Expenses found' })
        }
        res.status(200).json({ message: result })
    })
}