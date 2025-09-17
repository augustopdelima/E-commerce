import { DataTypes, Model } from "sequelize";

import sequelize from "../database";

export class User extends Model {
  declare email: string;
  declare id: number;
  declare name: string;
  declare password: string;
  declare type: "admin" | "client";
}

User.init(
  {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
      type: {
        allowNull: false,
        defaultValue: "client",
        type: DataTypes.ENUM("admin", "client"),
      },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);
