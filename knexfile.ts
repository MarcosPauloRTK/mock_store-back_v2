import type { Knex } from "knex";

// Update with your config settings.

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./dev.sqlite3",
  },
  migrations: {
    directory: "./src/database",
  },
  seeds: {
    directory: "./src/seeds",
  },
  useNullAsDefault: true,
};

export default config;
