const { validationResult } = require("express-validator");
const { errors } = require("pg-promise");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(412).json({ errors: errors.array() })
}

module.exports = { validate };