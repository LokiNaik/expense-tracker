const { request } = require("express")
const db = require('../db/db.config')
const { expenseValidator } = require("../util/fieldsValidator")


exports.createExpense = (req, res) => {
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
    const date = new Date()

    const { error } = expenseValidator(req.body)
    if (error) {
        res.status(500).json({ Error: error.details[0].message })
        return
    }

    var sql = "INSERT INTO user_expenses (amount, description, category, date) VALUES (?,?,?,?) ";
    db.query(sql, [amount, description, category, date], function (error, result, fields) {
        if (error) {
            console.log('Error while inserting into database')
            throw error
        }
        console.log('result', result)
        res.status(200).json({ InsertedId: result.insertId })
    })


}