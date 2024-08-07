const express = require('express')
const server = express()
const bodyParser = require('body-parser');

const userRoute = require('./src/router/userRoute');
const expenseRoute = require('./src/router/expensRoute');
const Error = require('./src/error/errorHandling');
server.use(bodyParser.json());

const port = 8081;


server.use('/users', userRoute)

server.use('/api', expenseRoute)


server.use('*', Error.handleNotFound)
server.use(Error.handleError)


server.listen(port, () => {
    console.log(`Server started on port : ${port}`)
})