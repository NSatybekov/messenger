/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema
                    .createTable('posts', function(table){
                        table.increments('post_id');
                        table.integer('user_id').notNullable()
                                                .references('users.user_id');
                        table.timestamp('created_at').defaultTo(knex.fn.now());
                        table.string('name', 50).notNullable();
                        table.string('text', 1000).notNullable();

                    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('posts')
};
