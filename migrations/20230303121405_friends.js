/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema  
               .createTable('friends', function(table) {
                    table.integer('user_id').notNullable()
                                            .references('users.user_id').onDelete('CASCADE');
                    table.integer('friend_id').notNullable()
                                              .references('users.user_id').onDelete('CASCADE');
                    table.timestamp('created_at').defaultTo(knex.fn.now())
                    table.string('friend_status').notNullable()                            
        })
};

/**
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('friends')
};
