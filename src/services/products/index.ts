import {
  selectProducts,
  getProductByID,
  deleteProduct,
  insertProduct,
  selectProductsByCategory,
  updateProduct,
} from "../../repositories/products";

async function selectProductsLimited(limit: number) {
  const products = await selectProducts();

  return products.filter((_, index) => index < limit);
}

export {
  selectProducts,
  getProductByID,
  deleteProduct,
  insertProduct,
  selectProductsByCategory,
  updateProduct,
  selectProductsLimited,
};
