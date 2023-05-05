import { Knex } from "knex";
import type {Product} from "../repositories/products"

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("products").del();


  const data: Product[] = await fetch("https://fakestoreapi.com/products").then(
    (response) => response.json()
  );

  const query: { id: number; category: string }[] = await knex(
    "categories"
  ).select("*");

  const categories = query.reduce(
    (acc: { [prop: string]: number }, { id, category }) => {
      acc[category] = id;
      return acc;
    },
    {}
  );

  // Inserts seed entries
  for (let i = 0; i < data.length; i++) {
    const { title, price, description, category, image, rating } = data[i];
    const { rate, count } = rating;
    await knex("products").insert({
      title,
      price,
      description,
      category_id: categories[category],
      image,
      rate,
      count,
    });
  }
}
