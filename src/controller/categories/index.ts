import { Request, Response } from "express";
import {
  selectCategories,
  deleteCategory,
  insertCategory,
} from "../../repositories/categories";

const index = async (request: Request, response: Response) => {
  try {
    const categories = await selectCategories();
    response.status(200).json(categories);
  } catch (error) {
    response.send(error);
  }
};

const remove = async (request: Request, response: Response) => {
  try {
    const value = await deleteCategory(request.params.category);
  } catch (error) {
    response.send(error);
  }
};

const insert = async (request: Request, response: Response) => {
  try {
    const value = await insertCategory(request.params.category);
  } catch (error) {
    response.send(error);
  }
};

export default { index, remove, insert };
