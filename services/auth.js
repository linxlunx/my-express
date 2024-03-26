const db = require("../db")
const { hashPassword, comparePassword } = require("../helper/password")

const errMessage = 'Invalid email or password';

const login = async (email, password) => {
    user = await db.query("SELECT * FROM users WHERE email = $1 and deleted_at is NULL", [email])
    if (user.rows.length === 0) {
        throw Error(errMessage);
    }

    checkPassword = await comparePassword(password, user.rows[0].password);

    if (!checkPassword) {
        throw Error(errMessage);
    }

    return user.rows[0];
}

module.exports = { login }