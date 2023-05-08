import * as productRepository from "../../repositories/products";
import type { Product, ProductDB } from "../../repositories/products";

export async function selectProductsLimited(limit: number) {
  const products = await productRepository.selectProducts(
    undefined,
    undefined,
    limit
  );

  return products;
}

function fromProductDBToProduct(product: ProductDB): Product {
  return { ...product, rating: { rate: product.rate, count: product.count } };
}

export async function selectProducts() {
  const productsDB = await productRepository.selectProducts();

  if (!productsDB.length) {
    throw Error("There is no products avaiable.");
  }

  const products: Product[] = productsDB.map((product) =>
    fromProductDBToProduct(product)
  );

  return products;
}

export async function getProductByID(id: number) {
  const productsDB = await productRepository.selectProducts(undefined, id);

  if (!productsDB.length) {
    throw Error("No products found for the given ID.");
  }

  const product: Product = fromProductDBToProduct(productsDB[0]);

  return product;
}

export async function selectProductsByCategory(category: string) {
  const productsDB = await productRepository.selectProducts(category);

  const products: Product[] = productsDB.map((product) =>
    fromProductDBToProduct(product)
  );

  return products;
}

export async function deletedProduct(id: number) {
  //Check if product exists
  const product = await getProductByID(id);

  if (!product) {
    throw Error("Product not found.");
  }

  //Delete product
  await productRepository.deleteProduct(id);
}

export async function updateProduct(id: number, object: any) {
  //Check if product exists
  const product = await getProductByID(id);

  if (!product) {
    throw Error(
      "No product was found for the given ID. So it can not be updated."
    );
  }

  //Validate value
  const value = await productRepository.JOIProduct.validateAsync(object, {
    presence: "optional",
  });

  //Update product
  await productRepository.updateProduct(id, value);

  return await getProductByID(id);
}

export async function deleteProduct(id: number) {
  //Check if product exists
  const product = await getProductByID(id);

  if (!product) {
    throw Error(
      "No product was found for the given ID. So it can not be deleted."
    );
  }

  //Delete product
  await productRepository.deleteProduct(id);
  return product;
}

export async function insertProduct(product: any) {
  const value: Product = await productRepository.JOIProduct.validateAsync(
    product,
    {
      abortEarly: false,
      presence: "required",
    }
  );

  const index = await productRepository.insertProduct(value);

  return getProductByID(index);
}
