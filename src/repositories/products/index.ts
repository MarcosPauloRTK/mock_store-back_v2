import knex from "knex";
import config from "../../../knexfile";
import Joi from "joi";
import type { CustomHelpers } from "joi";
import { categoryExists, getCategoryID } from "../../services/categories";
import category from "../../controller/category";

const knexInstance = knex(config);

const JOIProduct = Joi.object({
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

async function transformProductToProductRawDB(product: Product) {
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

export async function selectProducts() {
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
    .join("categories", "categories.id", "=", "products.category_id");

  if (!productsDB.length) {
    throw Error("There is no products avaiable.");
  }

  const products: Product[] = productsDB.map((product) => {
    return { ...product, rating: { rate: product.rate, count: product.count } };
  });

  return products;
}

export async function selectProductsByCategory(category: string) {
  await categoryExists(category);

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
    .where({ "categories.category": category });

  if (!productsDB.length) {
    throw Error("There is no products avaiable.");
  }

  const products: Product[] = productsDB.map((product) => {
    return { ...product, rating: { rate: product.rate, count: product.count } };
  });

  return products;
}

export async function getProductByID(id: number) {
  const products: Product[] = await knexInstance("products")
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
    .where({ "products.id": id });

  if (!products.length) throw Error("No product was found for the given ID.");

  return products[0];
}

export async function insertProduct(product: object) {
  const value: Product = await JOIProduct.validateAsync(product, {
    abortEarly: false,
  });

  const newProduct = await transformProductToProductRawDB(value);
  const index = await knexInstance("products").insert(newProduct);

  return getProductByID(index[0]);
}

export async function updateProduct(id: number, product: object) {
  let updatedProduct = await getProductByID(id);

  if (!updatedProduct) {
    throw Error(
      "No product was found for the given ID. So it can not be deleted."
    );
  }

  const value = await JOIProduct.validateAsync(product, {
    presence: "optional",
  });

  let flattenValue = await transformProductToProductRawDB(value);

  await knexInstance("products").update(flattenValue).where("id", id);

  return await getProductByID(id);
}

export async function deleteProduct(id: number) {
  const deletedProduct: Product = await getProductByID(id);

  await knexInstance("products").where("id", id).del();

  if (!deletedProduct) {
    throw Error(
      "No product was found for the given ID. So it can not be deleted."
    );
  } else {
    return deletedProduct;
  }
}
