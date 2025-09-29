import { DataTypes, Model } from "sequelize";
import { User } from "./user";
import sequelize from "../database";


export class Address extends Model {
  declare id: number;
  declare street: string;
  declare number: string;
  declare city: string;
  declare state: string;
  declare zipcode: string;
  declare userId: number;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: false,
  }
);
