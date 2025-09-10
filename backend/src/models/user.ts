import { DataTypes, Model } from "sequelize";

import sequelize from "../database";

export class User extends Model {
  public email!: string;
  public id!: number;
  public name!: string;
  public password!: string;
  public type!: "admin" | "cliente";
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
      defaultValue: "cliente",
      type: DataTypes.ENUM("admin", "cliente"),
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);
