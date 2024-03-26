const db = require("../db")

const groupGetByName = async (name) => {
    let group = await db.query("SELECT id, name FROM groups WHERE name = $1", [name]);
    if (group.rows.length === 0) {
        throw Error('Group not found');
    }
    return group.rows[0];
}

const groupCreate = async (name) => {
    let slug = name.toString().toLowerCase().replace(' ', '_');
    let group = await db.query("INSERT INTO groups (name, slug) VALUES ($1, $2) RETURNING id, name", [name, slug]);
    return group.rows[0];
}

const groupAddToPermission = async (group, permission) => {
    let exist = await db.query("SELECT id FROM group_permissions WHERE group_id = $1 AND permission_id = $2", [group.id, permission.id]);
    if (exist.rows.length > 0) {
        throw Error('Permission already in group');
    }

    let groupPermission = await db.query("INSERT INTO group_permissions (group_id, permission_id) VALUES ($1, $2) RETURNING id, group_id, permission_id", [group.id, permission.id]);

    return groupPermission.rows[0];
}

module.exports = { groupGetByName, groupCreate, groupAddToPermission }