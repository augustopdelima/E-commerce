import { Sequelize, Options } from "sequelize";

const DEFAULT_FILE = "./database.sqlite";

const sequelizeOptions: Options = {
  dialect: "sqlite",
  logging: false,
  storage: process.env.DB ?? DEFAULT_FILE,
};

export const sequelize: Sequelize = new Sequelize(sequelizeOptions);

export default sequelize;
