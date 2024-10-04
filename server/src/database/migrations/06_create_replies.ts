import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('replies', (table) => {
            table.increments('id').primary();
            table.integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("likes").notNullable();
            table.string("text").notNullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('replies')
}