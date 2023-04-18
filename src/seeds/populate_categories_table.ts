import { Knex } from "knex";
import config from "../../knexfile";

export async function seed(knex: Knex): Promise<void> {
     // Deletes ALL existing entries
     await knex("categories").del();

    const data: string[] = await fetch("https://fakestoreapi.com/products/categories").then((response) => response.json())

    const categoriesPromises = data.map((category) => knex.table("categories").insert({category}))

    await Promise.all(categoriesPromises)

}
