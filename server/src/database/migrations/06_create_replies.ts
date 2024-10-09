import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('replies', (table) => {
            table.increments('id').primary();
            table.integer("teacher_id")
<<<<<<< HEAD
=======
            .notNullable()
>>>>>>> 4455a2945c7b839973bca1a8a7f8a8bf190ae570
            .references("id")
            .inTable("teacher")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
<<<<<<< HEAD
            table.integer("user_id")
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.integer("post_id")
            .notNullable()
            .references("id")
            .inTable("posts")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.string("text").notNullable();
            table.integer("likes").notNullable();
=======
            table.integer("likes").notNullable();
            table.string("text").notNullable();
>>>>>>> 4455a2945c7b839973bca1a8a7f8a8bf190ae570
            table.timestamp("created_at").defaultTo(knex.fn.now());
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('replies')
}