/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
                      .createTable('comments', function(table){
                        table.increments('comment_id');
                        table.integer('user_id').notNullable()
                                                .references('users.user_id');
                        table.integer('post_id').notNullable()
                                                .references('posts.post_id');
                        table.timestamp('created_at').defaultTo(knex.fn.now());
                        table.string('text', 500).notNullable()
                      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('comments')
};
