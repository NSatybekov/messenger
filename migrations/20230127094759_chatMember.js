/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
               .createTable('chat_member', function(table) {
                  table.integer('chat_id').index()
                  table.foreign('chat_id').references('chat.chat_id');
                    table.integer('user_id').index()
                    table.foreign('user_id').references('users.user_id');
                        table.timestamp('created_at').defaultTo(knex.fn.now());
                        table.timestamp('left_at').defaultTo(null)
                          table.string('role').defaultTo('member').checkIn(['member', 'admin'])
               })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   exports.down = function(knex) {
    return knex.schema.dropTable('chat_member');
};
  
  
    
  