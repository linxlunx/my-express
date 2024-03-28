const { body } = require('express-validator')

const loginValidator = () => {
    return [
        body('email', 'Email cannot be empty').not().isEmpty(),
        body('password', 'Password cannot be empty').not().isEmpty(),
    ];
}

module.exports = loginValidator
