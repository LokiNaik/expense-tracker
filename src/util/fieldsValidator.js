const joi = require('joi')

const loginValidation = async (req, res, next) => {
    const emailSchema = joi.object({
        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string()
            .min(6)
            .required()
    })
    const { error } = emailSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ Error: error.details[0].message })
    }
    next()
}

const registerValidation = async (req, res, next) => {
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
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({ Error: error.details[0].message })
    }
    next()
}

const expenseValidator = (req, res, next) => {
    const schema = joi.object({
        user_id: joi.number()
            .required(),
        amount: joi.number()
            .required(),
        description: joi.string()
            .min(3)
            .required(),
        category: joi.string()
            .min(3)
            .required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ Error: error.details[0].message });
    }
    next();
};

const validateId = (req, res, next) => {
    const schema = joi.object({
        id: joi.number().integer().required()
    })
    const { error } = schema.validate(req.params)
    if (error) {
        return res.status(400).json({ Error: error.details[0].message })
    }
    next()
}

const expenseUpdateValidator = (req, res, next) => {
    const schema = joi.object({
        user_id: joi.number().optional(),
        amount: joi.number().optional(),
        description: joi.string().optional().min(3),
        category: joi.string().min(3).optional()
    })
    const { err } = schema.validate(req.body)
    if (err) {
        return res.status(400).json({ Error: err.details[0].message }
        )
    }
    next()
}


module.exports = {
    loginValidation,
    registerValidation,
    expenseValidator,
    validateId,
    expenseUpdateValidator,
}
