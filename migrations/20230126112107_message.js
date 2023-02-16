/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
        .createTable('message', function (table) {
            table.increments('message_id');
            table.string('from_email', 255).notNullable()
                                           .references('email').inTable('users');
            table.string('message_text', 255).notNullable()
            table.timestamp('sent_datetime').defaultTo(knex.fn.now())
        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
    return knex.schema
      .table('message', function (table) {
          table.dropForeign('from_email');
      })
      .dropTable('message')
  };
  
