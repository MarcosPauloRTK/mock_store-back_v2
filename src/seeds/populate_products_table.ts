import { Knex } from "knex";
import type { Product } from "../types/product";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("products").del();

  const products: Product[] = await fetch(
    "https://fakestoreapi.com/products/"
  ).then((response) => response.json());

  const categories: { id: number; category: string }[] = await knex
    .table("categories")
    .select("*");

  const categoriesObj = categories.reduce(
    (acc: { [props: string]: number }, { id, category }) => {
      acc[category] = id;
      return acc;
    },
    {}
  );

  const insertPromises = products
    .map((product) => {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        category_id: categoriesObj[product.category],
        price: product.price,
        rate: product.rating.rate,
        count: product.rating.count,
        image: product.image,
      };
    })
    .map(async (product) => await knex.table("products").insert(product));

  // Inserts seed entries
  await Promise.all(insertPromises)
}
