const { getUser } = require('../controller/UserController')
const db = require('../db/db.config')
const { queryHelper } = require('./queryHelper')

class ExpensesRepository {

    async createExpense(expense, user_email) {
        const { amount, description, category } = expense
        var date = new Date()
        var sql = 'INSERT INTO user_expenses (user_email, amount, description, category, date) VALUES (?,?,?,?,?)'
        try {
            const result = await queryHelper(sql, [user_email, amount, description, category, date]);
            return result.insertId;
        } catch (error) {
            console.error('Error while inserting into database', error);
            throw error;
        }
    }


    async fetchAllExpences() {
        let sql = 'SELECT * FROM user_expenses'
        try {
            const result = await queryHelper(sql)
            return result
        } catch (error) {
            console.error('Error fetching all expenses', error);
            throw error
        }
    }


    async getExpenses(email) {
        let sql = `SELECT user.name, user.email, user_expenses.id,  user_expenses.amount, user_expenses.description, user_expenses.category, user_expenses.date
                    FROM user INNER JOIN user_expenses ON user.email = user_expenses.user_email 
                    WHERE user.email=?`
        try {
            const result = await queryHelper(sql, [email])
            return result
        } catch (error) {
            console.error('Error fetching expenses', error);
            throw error
        }
    }


    async getExpenseByExpenseId(id) {
        let sql = 'SELECT * FROM user_expenses WHERE user_expenses.id = ?'
        try {
            const result = await queryHelper(sql, [id])
            return result
        } catch (error) {
            console.log('Error in fetching the expense ', error)
            throw error
        }
    }


    async deleteExpense(req) {
        const email = req.user.username
        const expenseId = req.params.eid
        const query = `DELETE FROM user_expenses WHERE id = ? AND user_email = ?`

        try {
            const result = await queryHelper(query, [expenseId, email])
            return result.affectedRows
        } catch (error) {
            console.log('Error deleting expense :', error)
            throw error
        }
    }


    async updateExpence(expense, email, eid) {
        try {
            const { amount, description, category } = expense
            let values = []
            let updates = []
            let userResponse;

            const expe = await this.getExpenseByExpenseId(eid)
            if (!expe || expe.length === 0) {
                return 0
            }

            userResponse = await getUser(email)
            if (userResponse.length === 0) {
                return 0
            }

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
            values.push(userResponse[0].email, eid)
            // console.log('values ', values)
            const sql = `UPDATE user_expenses SET ${updates.join(', ')} WHERE user_email = ? AND id = ?`;
            const result = await queryHelper(sql, values)
            return result

        } catch (error) {
            console.log('Error updating. ', error)
            throw error
        }
    }
}

module.exports = new ExpensesRepository()