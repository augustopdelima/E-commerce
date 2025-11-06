import { Sequelize, Options } from "sequelize";

const DEFAULT_FILE = "./data/database.sqlite";

const isTest = process.env.NODE_ENV === "test";

const sequelizeOptions: Options = {
  dialect: "sqlite",
  logging: false,
  storage: isTest ? ":memory:" : process.env.DB ?? DEFAULT_FILE,
};

export const sequelize: Sequelize = new Sequelize(sequelizeOptions);

export default sequelize;
