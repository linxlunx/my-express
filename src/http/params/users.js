const { query, body } = require("express-validator")

const userListQuery = () => {
    return [
        query('page').default(1).isNumeric(),
        query('limit').default(10).isNumeric(),
        query('q').default('')
    ];
}

const userCreateBody = () => {
    return [
        body('username').not().isEmpty(),
        body('email').not().isEmpty().isEmail(),
        body('password').not().isEmpty().isLength({ min: 6 }),
        body('confirm_password').not().isEmpty().isLength({ min: 6 }),
        body('fullname').not().isEmpty(),
    ]
}

const userUpdateBody = () => {
    return [
        body('username').not().isEmpty(),
        body('email').not().isEmpty().isEmail(),
        body('password').default("").optional(),
        body('confirm_password').default("").optional(),
        body('fullname').not().isEmpty(),
    ]
}

module.exports = { userListQuery, userCreateBody }