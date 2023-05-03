import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("categories").del();

  const data: string[] = await fetch(
    "https://fakestoreapi.com/products/categories"
  ).then((response) => response.json());

  // Inserts seed entries
  for (let i = 0; i < data.length; i++) {
    await knex("categories").insert({ category: data[i] });
  }
}
