import * as categoriesRepository from "../../repositories/categories";
import type { CategoryDB } from "../../repositories/categories";

export async function selectCategories() {
  const categoriesDB: CategoryDB[] =
    await categoriesRepository.selectCategories();

  return categoriesDB.map(({ category }) => category);
}

export async function getCategoryID(category: string) {
  const categoryDB: CategoryDB[] = await categoriesRepository.selectCategories(
    category
  );

  if (!categoryDB.length) {
    throw new Error("Category does not exist.");
  }

  return categoryDB.pop()!.id;
}

export async function categoryExists(category: string) {
  const categoryDB: CategoryDB[] = await categoriesRepository.selectCategories(
    category
  );

  return Boolean(categoryDB.length);
}

export async function insertCategory(category: string) {
  const value = await categoriesRepository.JOICategory.validateAsync(category);

  const index: number[] = await categoriesRepository.insertCategory({
    category: value,
  });

  return await categoriesRepository.selectCategories(undefined, index[0]);
}

export async function deleteCategory(category: string) {
  const category_id = await getCategoryID(category);

  if (!category_id) {
    throw new Error(
      `The category refered doesn't exists in the database. Category: ${category}`
    );
  }

  return await categoriesRepository.deleteCategory(category_id);
}
