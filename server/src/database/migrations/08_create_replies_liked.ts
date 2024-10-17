import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('likedReplies', (table) => {
            table.increments('id').primary();
            table.integer("user_id")
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("teacher_id")
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("reply_id")
            .notNullable()
            .references("id")
            .inTable("replies")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('likedReplies');
}