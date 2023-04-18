import type { Knex } from "knex";
import type { Request, Response } from "express";
import knex from "knex";
import config from "../../knexfile";
import type { CategoryDB } from "../types/category";

const knexInstance = knex(config);
const table = knexInstance("products");

async function categoryByID(id: number) {
  const categoriesQuery: CategoryDB[] = await knex(config)("categories").select(
    "*"
  );

  const categoriesObj = categoriesQuery.reduce(
    (acc: { [props: string]: number }, { id, category }) => {
      acc[category] = id;
      return acc;
    },
    {}
  );

  return categoriesObj[id];
}

async function IDByCategory(category: string) {
  const categoriesQuery: CategoryDB[] = await knex(config)("categories").select(
    "*"
  );
  const categoriesObj = categoriesQuery.reduce(
    (acc: { [props: string]: number }, { id, category }) => {
      acc[category] = id;
      return acc;
    },
    {}
  );

  return categoriesObj[category];
}

const categoryFinder = async () => {
  const categoriesQuery: CategoryDB[] = await knex(config)("categories").select(
    "*"
  );

  return (by: "id" | "category") => {
    if (by === "category") {
      const categoriesObj = categoriesQuery.reduce(
        (acc: { [props: string]: number }, { id, category }) => {
          acc[category] = id;
          return acc;
        },
        {}
      );

      return (category: string) => {
        return categoriesObj[category];
      };
    }

    if (by === "id") {
      const categoriesObj = categoriesQuery.reduce(
        (acc: { [props: number]: string }, { id, category }) => {
          acc[id] = category;
          return acc;
        },
        {}
      );

      return (id: number) => {
        return categoriesObj[id];
      };
    }
  };
};

export const index = async (request: Request, response: Response) => {
  try {
    const limit = request.query.limit
      ? parseInt(String(request.query.limit))
      : undefined;
    const data = await table.select("*");

    const responseData = data
      .map(
        ({
          id,
          title,
          image,
          price,
          rate,
          count,
          description,
          category_id,
        }) => {
          return {
            id,
            title,
            description,
            price,
            image,
            category: categoryByID(category_id),
            rating: { rate, count },
          };
        }
      )
      .filter((_, index) => (limit ? index < limit : true));

    response.status(200).send(responseData);
  } catch (error) {
    response.send(error);
  }
};

export const show = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;

    // const data = await table.select("*").where({ id });
    const data = await knexInstance("products").select("*").where({ id });

    const responseData = data.map(
      ({ id, title, image, price, rate, count, description, category_id }) => {
        return {
          id,
          title,
          description,
          price,
          image,
          category: categoryByID(category_id),
          rating: { rate, count },
        };
      }
    );

    data
      ? response.status(200).send(responseData[0])
      : response.send(responseData);
  } catch (error) {
    response.send(error);
  }
};
