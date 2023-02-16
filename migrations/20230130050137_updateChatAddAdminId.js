/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('chat', function(table) {
        table.integer('admin_id')
        table.foreign('admin_id').references('users.user_id')
   })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
    return knex.schema.table('chat', function(table) {
    table.dropColumn('admin_id');
    });
    };