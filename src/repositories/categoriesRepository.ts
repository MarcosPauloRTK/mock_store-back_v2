import knex from "knex";
import config from "../../knexfile";
import Joi, { bool } from "joi";

const knexInstance = knex(config);

const JOICategory = Joi.string()
  .min(5)
  .external(async (category) => {
    const boolean = await categoryExists(category);

    if (boolean) {
      throw Error(`The following category already exists: ${category}`);
    }
    return category;
  });

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

export async function categoryExists(category: string) {
  const search: CategoryDB[] = await knexInstance("categories")
    .select("*")
    .where({ category: category });

  return search.length ? true : false;
}

export async function insertCategory(category: string) {
  const value = await JOICategory.validateAsync(category);

  const newCategory = await knexInstance("categories")
    .insert(value)
    .returning("*");

  return newCategory;
}

export async function deleteCategory(category: string) {
  const productDeleted = await knexInstance("products")
    .where("categories.category", category)
    .join("categories", "categories.id", "=", "products.category_id")
    .returning("*");
  // .del()

  const categoryDB = await knexInstance("categories").where(
    "category",
    category
  );
  // .del();

  return { categoryDB, productDeleted };
}
