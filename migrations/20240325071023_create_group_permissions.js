/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    // create groups, user_groups, permissions, group_permissions
    return knex.schema.createTable('groups', function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamps(true, true);
    }).createTable('user_groups', function (table) {
        table.increments('id');
        table.integer('user_id').unsigned().notNullable();
        table.integer('group_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
        table.foreign('group_id').references('id').inTable('groups').onDelete('CASCADE').onUpdate('CASCADE');
        table.timestamps(true, true);
    }).createTable('permissions', function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamps(true, true);
    }).createTable('group_permissions', function (table) {
        table.increments('id');
        table.integer('group_id').unsigned().notNullable();
        table.integer('permission_id').unsigned().notNullable();
        table.foreign('group_id').references('id').inTable('groups').onDelete('CASCADE').onUpdate('CASCADE');
        table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE').onUpdate('CASCADE');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('group_permissions')
        .dropTable('permissions')
        .dropTable('user_groups')
        .dropTable('groups');
};
