/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
             .createTable('chat', function(table) {
                table.increments('chat_id');
                table.string('chat_name').notNullable()
             })
             .table('message', function(table) {
                table.integer('chat_id').index()
                table.foreign('chat_id').references('chat.chat_id').onDelete('CASCADE')
             })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('chat')
    .table('message', function (table) {
        table.dropForeign('chat_id');
    })
};


  
