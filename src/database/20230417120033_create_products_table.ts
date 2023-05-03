import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id", { primaryKey: true });
    table.string("title").notNullable();
    table.decimal("price").checkPositive();
    table.string("description");
    table.integer("category_id");
    table.foreign("category_id").references("categories.id");
    table.string("image");
    table.decimal("rate").checkBetween([0, 5]);
    table.integer("count").checkPositive();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products");
}
