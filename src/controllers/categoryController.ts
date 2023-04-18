import type { Request, Response } from "express";
import type { Knex } from "knex";
import knex from "knex";
import config from "../../knexfile";

const knexInstance = knex(config);
const table = knexInstance("categories");

export const index = async (request: Request, response: Response) => {
  try {
    const data = await table.select("*");
    response.status(200).send(data.map(({ category }) => category));
  } catch (error) {
    response.send(error);
  }
};
