import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('likedPosts', (table) => {
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
            table.integer("post_id")
            .notNullable()
            .references("id")
            .inTable("posts")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('likedPosts');
}