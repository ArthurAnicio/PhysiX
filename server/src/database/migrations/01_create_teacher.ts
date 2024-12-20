import { Knex } from "knex";

export async function up(knex: Knex){
    return knex.schema.createTable('teacher', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('number').notNullable();
        table.string('password').notNullable();
        table.string('avatar').notNullable();
        table.json('schedule').nullable();
        table.boolean('verified').nullable();
    })
}

export async function down(knex: Knex){
    return knex.schema.dropTable('teacher');
}