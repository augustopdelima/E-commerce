import { User } from "./user";
import { Order } from "./order";
import { Product } from "./product";
import { OrderItem } from "./order_item";
import { Address } from "./addresses";
import { Supplier } from "./supplier";
import { CartItem } from "./cart_item";

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

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.belongsTo(Supplier, { as: "supplier", foreignKey: "supplierId" });
Supplier.hasMany(Product, { as: "products", foreignKey: "supplierId" });

User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems" });
CartItem.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export { User, Order, Product, OrderItem, Supplier, CartItem };
