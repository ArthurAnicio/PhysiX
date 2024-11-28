import {Knex} from "knex";

export async function up(knex: Knex){
    return knex.schema.createTable("classes", table => {
        table.increments("id").primary();
        table.integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teachers")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.integer("user_id")
            .notNullable()
            .references("id")
            .inTable("teachers")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.integer("week_day");
        table.string("from")
            .nullable();
        table.string("to")
            .nullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable("classes");
}