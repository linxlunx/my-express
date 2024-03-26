const db = require("../db")

const permissionGetByName = async (name) => {
    let permission = await db.query("SELECT id, name FROM permissions WHERE name = $1", [name]);
    if (permission.rows.length === 0) {
        throw Error('Permission not found');
    }
    return permission.rows[0];
}

const permissionCreate = async (name) => {
    let permission = await db.query("INSERT INTO permissions (name) VALUES ($1) RETURNING id, name", [name]);
    return permission.rows[0];
}

module.exports = { permissionGetByName, permissionCreate }