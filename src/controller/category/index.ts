import { Request, Response } from "express";
import { selectProductsByCategory } from "../../services/products";

const show = async (request: Request, response: Response) => {
  try {
    const filteredProducts = await selectProductsByCategory(
      request.params.category
    );

    response.status(200).send(filteredProducts);
  } catch (error) {
    response.send(error);
  }
};

export default { show };
