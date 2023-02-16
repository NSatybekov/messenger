/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('user_id');
            table.string('firstname', 255).notNullable();
            table.string('lastname', 255).notNullable();
            table.string('email', 255).unique().notNullable()
            table.string('hash', 255)
        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
