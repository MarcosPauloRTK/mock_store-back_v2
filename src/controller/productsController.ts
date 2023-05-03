import { Request, Response } from "express";
import {
  selectProducts,
  getProductByID,
  insertProduct,
  deleteProduct,
  updateProduct,
  selectProductsByCategory
} from "../services/productServices";


const indexCategory = async(request:Request, response: Response) => {
  try {
    const filteredProducts = await selectProductsByCategory(request.params.category);

    response.status(200).send(filteredProducts);
  } catch (error) {
    response.send(error)
  }
}

const index = async (request: Request, response: Response) => {
  try {
    const products = await selectProducts();
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
    const product = request.body;
    const newProduct = await insertProduct(product);

    response.status(200).send(newProduct);
  } catch (error) {
    response.send(error);
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

export default {show, index, indexCategory, remove, update, insert};