import { DataTypes, Model } from 'sequelize';
import { Supplier } from "./supplier";
import sequelize from "../database";

export class Product extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare stock: number;
  declare imageUrl?: string;
  declare supplierId?: number | null;
  declare active: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Supplier,
        key: "id",
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false,
  }
);
