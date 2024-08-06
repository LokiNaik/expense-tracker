const mySql = require('mysql')

let connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
})
connection.connect(function (err) {
    if (err) {
        console.log('Error connecting to Database')
        throw err
    }
    console.log('Connected to Database!')
})

module.exports = connection
