/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
        .createTable('message', function (table) {
            table.increments('message_id');
            table.integer('user_id', 255).notNullable()
                                           .references('users.user_id').onDelete('CASCADE');
            table.string('text', 255).notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.integer('chat_id').index()
                table.foreign('chat_id').references('chat.chat_id').onDelete('CASCADE')
        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
    return knex.schema
      .dropTable('message')
  };
  
