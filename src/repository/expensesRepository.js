const db = require('../db/db.config')

class ExpensesReporitory {

    async createExpense(expense) {
        const { user_id, amount, description, category } = expense
        var date = new Date()
        var sql = 'INSERT INTO user_expenses (user_id, amount, description, category, date) VALUES (?,?,?,?,?)'
        return new Promise((resolve, reject) => {
            db.query(sql, [user_id, amount, description, category, date], function (error, result) {
                if (error) {
                    // console.log('Error while inserting into database')
                    return reject(error)
                }
                resolve(result.insertId)
            })
        }).catch((error) => {
            reject(error)
        })
    }


    async fetchAllExpences() {
        let sql = 'SELECT * FROM user_expenses'
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result)
            })
        }).catch(function (err) {
            return reject(err)
        })
    }


    async getExpenses(id) {
        let sql = `SELECT user.id, user.name, user_expenses.id, user_expenses.amount, user_expenses.description, user_expenses.category, user_expenses.date
                    FROM user INNER JOIN user_expenses ON user.id = user_expenses.user_id 
                    WHERE user.id=${id}`
        return new Promise((resolve, reject) => {
            db.query(sql, function (err, result) {
                if (err) {
                    return reject(err)
                }
                return resolve(result)
            })
        }).catch((err) => {
            return reject(err)
        })
    }


    async deleteExpense(req) {
        const id = req.uid
        const eid = req.eid
        const query = `DELETE FROM user_expenses WHERE id = ? AND user_id = ?`
        return new Promise((resolve, reject) => {
            db.query(query, [eid, id], function (err, result) {
                if (err) {
                    return reject(err)
                }
                return resolve(result.affectedRows)
            })
        }).catch((err) => {
            return reject(err)
        })
    }


    async updateExpence(expense, userId, eid) {
        const { amount, description, category } = expense
        let values = []
        let updates = []

        if (amount) {
            updates.push('amount = ?')
            values.push(amount)
        }
        if (description) {
            updates.push('description = ?')
            values.push(description)
        }
        if (category) {
            updates.push('category = ?')
            values.push(category)
        }
        if (updates.length === 0) {
            return { message: 'nothing to update!' }
        }

        updates.push('date = ?')
        values.push(new Date())
        values.push(userId, eid)
        // console.log('values ', values)

        const sql = `UPDATE user_expenses 
                 SET ${updates.join(', ')} 
                 WHERE user_id = ? AND id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, values, function (err, result) {
                if (err) {
                    return reject(err)
                }
                return resolve(result)
            })
        }).catch((error) => {
            return reject(error)
        })
    }
}

module.exports = new ExpensesReporitory()