import { Sequelize } from 'sequelize';

// Inicializa o Sequelize usando SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export default sequelize;
