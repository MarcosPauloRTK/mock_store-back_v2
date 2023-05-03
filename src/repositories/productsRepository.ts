import knex from "knex";
import config from "../../knexfile";
import Joi from "joi";
import { categoryExists } from "../services/categoryServices";

const knexInstance = knex(config);

const JOIProduct = Joi.object({
  title: Joi.string().min(5),
  price: Joi.number().greater(0),
  description: Joi.string().min(5),
  category: Joi.string().external(async (category) => {
    const boolean = await categoryExists(category);

    if (!boolean) {
      throw Error(`There is no such category: ${category}.`);
    }

    return true;
  }),
  image: Joi.string().regex(/https:\/fakestoreapi.com\/img\/.*/),
  rating: { rate: Joi.number().min(0).max(5), count: Joi.number().min(0) },
});

export type ProductDB = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

export async function selectProducts() {
  const productsDB: ProductDB[] = await knexInstance("products")
    .select(
      "products.title",
      "products.price",
      "products.description",
      "products.image",
      "products.rate",
      "products.count",
      "categories.name as category"
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

export async function selectProductsByCategory(category:string){
    await categoryExists(category);

    const productsDB: ProductDB[] = await knexInstance("products")
      .select(
        "products.title",
        "products.price",
        "products.description",
        "products.image",
        "products.rate",
        "products.count",
        "categories.category as category"
      )
      .join("categories", "categories.id", "=", "products.category_id")
      .where({"categories.category" : category});
    
    if (!productsDB.length) {
      throw Error("There is no products avaiable.");
    }
    
    const products: Product[] = productsDB.map((product) => {
      return { ...product, rating: { rate: product.rate, count: product.count } };
    });
    
    return products;
}

export async function getProductByID(id: number) {
  const products = await knexInstance("products")
    .select(
      "products.title",
      "products.price",
      "products.description",
      "products.image",
      "products.rate",
      "products.count",
      "categories.name as category"
    )
    .join("categories", "categories.id", "=", "products.category_id")
    .where({ "products.id": id });

  if (!products.length) throw Error("No product was found for the given ID.");

  return products[0];
}

export async function insertProduct(product: Product) {
  const { value, error } = await JOIProduct.validateAsync(product, {
    presence: "required",
  });

  if (error) {
    throw Error(error.message);
  } else {
    knexInstance("products").insert(value);
    return value;
  }
}

export async function updateProduct(id: number, product: Product) {
  await getProductByID(id);

  const { value, error } = await JOIProduct.validateAsync(product, {
    presence: "optional",
  });

  if (error) {
    throw Error(error.message);
  } else {
    const newProduct = knexInstance("products")
      .update(value)
      .where("id", product.id)
      .returning("*");
    return newProduct;
  }
}

export async function deleteProduct(id: number) {
  const products: Product[] = await knexInstance("products")
    .where("id", id)
    .del()
    .returning("*");

  if (!products.length) {
    throw Error(
      "No product was found for the given ID. So it can not be deleted."
    );
  } else {
    return products[0];
  }
}
