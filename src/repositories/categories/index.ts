import knex from "knex";
import config from "../../../knexfile";
import Joi from "joi";
import type { CustomHelpers } from "joi";
import { deleteProduct } from "../../repositories/products";
const knexInstance = knex(config);

export const JOICategory = Joi.string().external(
  async (value: string, helpers: CustomHelpers) => {
    const categoryDB = await selectCategories(value);

    if (categoryDB.length) {
      return helpers.error(
        "The given category already exists in the database."
      );
    } else {
      return value;
    }
  }
);

export type Category = string;
export type CategoryDB = {
  id: number;
  category: string;
};

export async function selectCategories(category?: string, id?: number) {
  const categoriesDB: CategoryDB[] = await knexInstance("categories")
    .select("*")
    .modify((builder) => {
      if (category) {
        builder.where("category", category);
      }
      if (id) {
        builder.where("id", id);
      }
    });

  return categoriesDB;
}

export async function insertCategory(category: object) {
  const index = await knexInstance("categories").insert(category);

  return index;
}

export async function deleteCategory(id: number) {
  const affectedProductsDB = await knexInstance("products")
    .select("id")
    .where("category_id", id);

  const affectedProducts = affectedProductsDB.map(({ id }) => id);

  const deletedProducts = await Promise.all(
    affectedProducts.map(async (id) => await deleteProduct(id))
  );

  await knexInstance("categories").where("id", id).del();

  return {
    category: await selectCategories(undefined, id),
    numProductsAffected: deletedProducts.length,
    productsDeleted: deletedProducts,
  };
}
