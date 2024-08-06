const express = require('express')
const server = express()
const bodyParser = require('body-parser');
const userRoute = require('./src/router/userRoute');
const expenseRoute = require('./src/router/expensRoute');
server.use(bodyParser.json());

const port = 8081;


server.use('/users', userRoute)

server.use(expenseRoute)



server.listen(port, () => {
    console.log(`Server started on port : ${port}`)
})