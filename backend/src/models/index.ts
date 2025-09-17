import { User } from "./user";
import { Order } from "./order";
import { Product } from "./product";
import { OrderItem } from "./order_item";

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Order.belongsToMany(Product, {
  through: OrderItem,
  foreignKey: "orderId",
  as: "products",
});

Product.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: "productId",
  as: "orders",
});

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

export { User, Order, Product, OrderItem };
