import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('posts', (table) => {
            table.increments('id').primary();
            table.integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.string("text").notNullable();
            table.json("likes").nullable();
            table.integer("replies").notNullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.string("upload").nullable();
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('posts')
}