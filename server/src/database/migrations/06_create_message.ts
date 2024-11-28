import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('messages', (table) => {
            table.increments('id').primary();
            table.integer("teacher_id")
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("user_id")
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("invite_id")
            .references("id")
            .inTable("invites")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.string("message").notNullable();
            table.string("type").notNullable();
            table.string("price").nullable();
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('messages');
}
