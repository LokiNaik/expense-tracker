const { API_ENDPOINT_NOT_FOUND_ERR, INTERNAL_SERVER_ERROR } = require("./error")

const handleNotFound = (req, res, next) => {
    const error = {
        status: 404,
        message: API_ENDPOINT_NOT_FOUND_ERR
    }
    next(error)
}

const handleError = (err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        error: err.message || INTERNAL_SERVER_ERROR
    })
}

module.exports = {
    handleNotFound,
    handleError
}