const { hashPassword } = require("../src/helper/password");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let permissions = [
    'users-create',
    'users-read',
    'users-update',
    'users-delete',
  ]

  let groups = [
    {
      'name': 'Super Admin',
      'slug': 'super_admin',
      'permissions': []
    },
    {
      'name': 'Admin',
      'slug': 'admin',
      'permissions': ['users-create', 'users-read', 'users-update', 'users-delete'],
    },
    {
      'name': 'User',
      'slug': 'user',
      'permissions': []
    }
  ]

  let users = [
    {
      'username': 'superadmin',
      'email': 'superadmin@test.com',
      'password': await hashPassword('test1234'),
      'fullname': 'Super Admin',
      'group': 'super_admin'
    },
    {
      'username': 'admin',
      'email': 'admin@test.com',
      'password': await hashPassword('test1234'),
      'fullname': 'Admin',
      'group': 'admin'
    },
    {
      'username': 'user',
      'email': 'user@test.com',
      'password': await hashPassword('test1234'),
      'fullname': 'User',
      'group': 'user'
    }
  ]

  // insert permissions
  for (let permission of permissions) {
    await knex('permissions').where({ 'name': permission }).returning('id').then(async (result) => {
      if (!result.length) {
        await knex('permissions').insert({ 'name': permission });
      }
    });
  }

  // insert groups
  for (let group of groups) {
    await knex('groups').where({ 'slug': group.slug }).returning('id').then(async (result) => {
      if (!result.length) {
        await knex('groups').insert({ 'name': group.name, 'slug': group.slug });
      }
    });
  }

  // insert users
  for (let user of users) {
    let groupID = await knex('groups').where({ 'slug': user.group }).first('id');
    await knex('users').where({ 'email': user.email }).returning('id').then(async (result) => {
      if (!result.length) {
        await knex('users').insert({ 'username': user.username, 'email': user.email, 'password': user.password, 'fullname': user.fullname });
      }
    });
  }

  // insert group_permissions
  for (let group of groups) {
    let groupID = await knex('groups').where({ 'slug': group.slug }).first('id');
    for (let permission of group.permissions) {
      let permissionID = await knex('permissions').where({ 'name': permission }).first('id');
      let groupPermission = await knex('group_permissions').where({ 'group_id': groupID.id, 'permission_id': permissionID.id }).first();
      if (!groupPermission) {
        await knex('group_permissions').insert({ 'group_id': groupID.id, 'permission_id': permissionID.id });
      }
    }
  }

  // insert user_groups
  for (let user of users) {
    let userID = await knex('users').where({ 'email': user.email }).first('id');
    let groupID = await knex('groups').where({ 'slug': user.group }).first('id');
    let userGroup = await knex('user_groups').where({ 'user_id': userID.id, 'group_id': groupID.id }).first();
    if (!userGroup) {
      await knex('user_groups').insert({ 'user_id': userID.id, 'group_id': groupID.id });
    }
  }
};
