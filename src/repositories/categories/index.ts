import knex from "knex";
import config from "../../../knexfile";
import Joi from "joi";
import type { CustomHelpers } from "joi";
import { ProductDB, Product, deleteProduct } from "../../repositories/products";
const knexInstance = knex(config);

const JOICategory = Joi.string().external(
  async (value: string, helpers: CustomHelpers) => {
    const boolean = await categoryExists(value);
    if (boolean) {
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

export async function selectCategories() {
  const categoriesDB: CategoryDB[] = await knexInstance("categories").select(
    "*"
  );

  const categories = categoriesDB.map(({ category }) => category);
  return categories;
}

export async function getCategoryID(category: string) {
  const categoriesDB: CategoryDB[] = await knexInstance("categories").select(
    "*"
  );

  const categoryDB = categoriesDB.find(
    (element) => element.category === category
  );
  return categoryDB ? categoryDB["id"] : undefined;
}

export async function getCategoryByID(id: number) {
  const categoriesDB: CategoryDB[] = await knexInstance("categories").select(
    "*"
  );

  const categoryDB = categoriesDB.find((element) => element.id === id);
  return categoryDB ? categoryDB["category"] : "";
}

export async function categoryExists(category: string) {
  const search: CategoryDB[] = await knexInstance("categories")
    .select("*")
    .where("category", category);

  return Boolean(search.length);
}

export async function insertCategory(category: string) {
  const value = await JOICategory.validateAsync(category);
  console.log(value);

  const newCategory = await knexInstance("categories").insert({
    category: value,
  });

  return { msg: "Sucess", index: newCategory };
}

export async function deleteCategory(category: string) {
  const category_id = await getCategoryID(category);

  if (!category_id) {
    throw new Error(
      `The category refered doesn't exists in the database. Category: ${category}`
    );
  }

  const affectedProductsDB = await knexInstance("products")
    .select("id")
    .where("category_id", category_id);

  const affectedProducts = affectedProductsDB.map(({ id }) => id);

  const deletedProducts = await Promise.all(
    affectedProducts.map(async (id) => await deleteProduct(id))
  );

  await knexInstance("categories").where("id", category_id).del()
  
  return {
    msg: "Success",
    category: category,
    numProductsAffected: deletedProducts.length,
    productsDeleted: deletedProducts,
  };

}
