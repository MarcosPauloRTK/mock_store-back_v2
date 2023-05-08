import knex from "knex";
import config from "../../../knexfile";
import Joi from "joi";
import type { CustomHelpers } from "joi";
import { categoryExists, getCategoryID } from "../../services/categories";
import category from "../../controller/category";

const knexInstance = knex(config);

export const JOIProduct = Joi.object({
  title: Joi.string().min(5),
  price: Joi.number().greater(0),
  description: Joi.string(),
  category: Joi.string().external(
    /**
     * Checa assincronamente se a categoria do produto a ser inserido
     * já existe no banco. Interrompe a inserção caso negativo.
     */
    async (value: string, helpers: CustomHelpers) => {
      if (!value) {
        return undefined;
      }

      const boolean = await categoryExists(value);
      if (boolean) {
        return value;
      } else {
        return helpers.error(
          "The given category doesn't exists in the database."
        );
      }
    }
  ),
  image: Joi.string(),
  rating: { rate: Joi.number().min(0).max(5), count: Joi.number().min(0) },
});

export type ProductDB = {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rate: number;
  count: number;
};

export type ProductRawDB = {
  id?: number;
  title?: string;
  price?: number;
  description?: string;
  category_id?: number;
  image?: string;
  rate?: number;
  count?: number;
};

export type Product = {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

async function fromProduct2ProductRawDB(product: Product) {
  const productsRawDB: { [prop: string]: any } = {
    title: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    ...product.rating,
    category_id: await getCategoryID(product.category),
  };

  Object.keys(productsRawDB).forEach((key: string) => {
    productsRawDB[key] === undefined && delete productsRawDB[key];
  });

  const value: ProductRawDB = productsRawDB;
  return value;
}

export async function selectProducts(
  category?: string,
  id?: number,
  limit?: number
) {
  const productsDB: ProductDB[] = await knexInstance("products")
    .select(
      "products.id",
      "products.title",
      "products.price",
      "products.description",
      "products.image",
      "products.rate",
      "products.count",
      "categories.category as category"
    )
    .join("categories", "categories.id", "=", "products.category_id")
    .modify((builder) => {
      if (category) {
        builder.where("categories.category", category);
      }
      if (id) {
        builder.where("products.id", id);
      }
      if (limit) {
        builder.limit(limit);
      }
    });

  return productsDB;
}

export async function insertProduct(product: Product) {
  const newProduct = await fromProduct2ProductRawDB(product);
  const index = await knexInstance("products").insert(newProduct);

  return index[0];
}

export async function updateProduct(id: number, product: Product) {
  await knexInstance("products")
    .update(fromProduct2ProductRawDB(product))
    .where("id", id);
}

export async function deleteProduct(id: number) {
  await knexInstance("products").where("id", id).del();
}
