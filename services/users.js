const { query } = require("express");
const db = require("../db");
const { hashPassword } = require("../helper/password");

const userGetByID = async (id) => {
    let user = await db.query("SELECT id, username, email, fullname FROM users WHERE id = $1 AND deleted_at is NULL", [id]);
    if (user.rows.length === 0) {
        throw Error('User not found');
    }
    return user.rows[0];
}

const userGetByEmail = async (email) => {
    let user = await db.query("SELECT id, username, email, fullname FROM users WHERE email = $1 AND deleted_at is NULL", [email]);
    if (user.rows.length === 0) {
        throw Error('User not found');
    }
    return user.rows[0];
}

const userCreate = async (username, email, password, fullname) => {
    let hashed = await hashPassword(password)

    user = await db.query("INSERT INTO users (username, email, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id, username, email, fullname", [username, email, hashed, fullname]);

    return user.rows[0];
}

const userUpdate = async (id, username, email, password, fullname) => {
    var user;
    user = await db.query("UPDATE users SET username = $2, email = $3, fullname = $4 WHERE id = $1 RETURNING id, username, email, fullname", [id, username, email, fullname]);

    if (password != "") {
        let hashed = await hashPassword(password)
        user = await db.query("UPDATE users SET password = $2 WHERE id = $1 RETURNING id, username, email, fullname", [id, hashed]);
    }

    return user.rows[0];
}

const userQuery = (q) => {
    let query = "SELECT id, username, email, fullname FROM users WHERE deleted_at is NULL"
    if (q != "") {
        query += " AND (username LIKE '%' || $1 || '%' OR fullname LIKE '%' || $1 || '%' OR email LIKE '%' || $1 || '%')"
    }
    return query
}

const userCount = (q) => {
    let query = "SELECT COUNT(id) FROM users WHERE deleted_at is NULL"
    if (q != "") {
        query += " AND (username LIKE '%' || $1 || '%' OR fullname LIKE '%' || $1 || '%' OR email LIKE '%' || $1 || '%')"
    }
    return query
}

const userPaginate = async (page, limit, q) => {
    let result = {
        data: [],
        meta: {
            page: page,
            limit: limit,
            total: 0,
        }
    }
    offset = (parseInt(page) - 1) * parseInt(limit);
    let query = userQuery(q)
    let queryCount = userCount(q);

    var users;
    var usersCount;

    if (q == "") {
        query += " ORDER BY id DESC LIMIT $1 OFFSET $2"
        users = await db.query(query, [limit, offset]);
        usersCount = await db.query(queryCount);
    } else {
        query += " ORDER BY id DESC LIMIT $2 OFFSET $3"
        users = await db.query(query, [q, limit, offset]);
        usersCount = await db.query(queryCount, [q]);
    }
    result.data = users.rows;
    result.meta.total = parseInt(usersCount.rows[0].count);
    return result;
}

const userAddToGroup = async (user, group) => {
    let exist = await db.query("SELECT id FROM user_groups WHERE user_id = $1 AND group_id = $2", [user.id, group.id]);
    if (exist.rows.length > 0) {
        throw Error('User already in group');
    }

    let userGroup = await db.query("INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2) RETURNING id, user_id, group_id", [user.id, group.id]);

    return userGroup.rows[0];
}

const userIDIsInGroup = async (userID, groupSlug) => {
    let userGroup = await db.query("SELECT users.id FROM users JOIN user_groups ON user_groups.user_id = users.id JOIN groups ON user_groups.group_id = groups.id WHERE users.id = $1 AND groups.slug = $2", [userID, groupSlug]);
    return userGroup.rows.length > 0;
}

const userIDIsInPermission = async (userID, permissionName) => {
    let userPermission = await db.query("SELECT users.id FROM users JOIN user_groups ON user_groups.user_id = users.id JOIN groups ON user_groups.group_id = groups.id JOIN group_permissions ON groups.id = group_permissions.group_id JOIN permissions ON group_permissions.permission_id = permissions.id WHERE users.id = $1 AND permissions.name = $2", [userID, permissionName]);
    return userPermission.rows.length > 0;
}

module.exports = { userGetByID, userGetByEmail, userCreate, userAddToGroup, userPaginate, userIDIsInGroup, userIDIsInPermission, userUpdate }