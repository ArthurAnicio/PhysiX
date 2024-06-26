import {Knex} from "knex";

export async function up(knex: Knex){
    return knex.schema.createTable("classes", table => {
        table.increments("id").primary();
        table.string("description").notNullable();
        table.decimal("cost").notNullable();
        table.integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teachers")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable("classes");
}