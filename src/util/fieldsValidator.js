const joi = require('joi')
const { emit } = require('../db/db.config')

const loginValidation = async data => {
    const emailSchema = joi.object({
        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string()
            .min(6)
            .required()
    })
    return emailSchema.validate(data)
}

const registerValidation = async data => {
    const schema = joi.object({
        name: joi.string()
            .required(),
        password: joi.string()
            .required()
            .min(6),
        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        contact: joi.string()
            .min(8)
            .required()
    })
    return schema.validate(data)
}

const expenseValidator = async (data) => {
    const schema = joi.object({
        amount: joi.number()
            .required(),
        description: joi.string()
            .min(10)
            .required(),
        category: joi.string()
            .min(3)
            .required()
    })
    return schema.validate(data)
}

module.exports = {
    loginValidation,
    registerValidation,
    expenseValidator
}
