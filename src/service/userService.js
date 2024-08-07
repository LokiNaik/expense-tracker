const bcrypt = require('bcrypt')
const saltRounds = 10

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                return reject(err)
            }
            resolve(hash)
        })
    })
}

module.exports = {
    hashPassword
}