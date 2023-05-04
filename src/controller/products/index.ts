import { Request, Response } from "express";
import {
  selectProductsLimited,
  selectProducts,
  getProductByID,
  insertProduct,
  updateProduct,
  deleteProduct,
} from "../../services/products";

const index = async (request: Request, response: Response) => {
  try {
    const limit = String(request.query.limit || "");

    const products = limit
      ? await selectProductsLimited(parseInt(limit))
      : await selectProducts();
    response.send(products);
  } catch (error) {
    response.send(error);
  }
};

const show = async (request: Request, response: Response) => {
  try {
    const product = await getProductByID(parseInt(request.params.id));
    response.send(product);
  } catch (error) {
    response.send(error);
  }
};

const insert = async (request: Request, response: Response) => {
  try {
    const product: object = request.body;

    const newProduct = await insertProduct(product);

    response.status(200).send(newProduct);
  } catch (error) {
    response.status(400).send(error);
  }
};

const remove = async (request: Request, response: Response) => {
  try {
    const deletedProduct = await deleteProduct(parseInt(request.params.id));

    response.status(200).json({ msg: "Success!", product: deletedProduct });
  } catch (error: any) {
    response.send(error.message ? { error: error.message } : error);
  }
};

const update = async (request: Request, response: Response) => {
  try {
    const updatedProduct = await updateProduct(
      parseInt(request.params.id),
      request.body
    );

    response.status(200).json({ msg: "Success!", product: updatedProduct });
  } catch (error) {
    response.send(error);
  }
};

export { show, index, remove, update, insert };
