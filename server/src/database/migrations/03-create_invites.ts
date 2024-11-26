import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('invites', (table) => {
            table.increments('id').primary();
            table.integer("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.boolean("accepted").notNullable();
            table.json('schedule').notNullable();
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('invites')
}