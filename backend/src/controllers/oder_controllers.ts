import { Request, Response } from "express";
import { Order, OrderItem, Product, User } from "../models";
import sequelize from "../database";

interface OrderItemInput {
  productId: number;
  quantity: number;
}

interface CreateOrderRequest {
  userId: number;
  items: OrderItemInput[] | null;
}

export const createOrder = async (req: Request, res: Response) => {

  const transaction = await sequelize.transaction();

  try {
    const { userId, items } = req.body as CreateOrderRequest;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "O pedido precisa de ao menos 1 item" });
    }

    const order = await Order.create(
      {
        userId,
        total: 0,
        status: "created",
      },
      { transaction }
    );

    let total = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          error: `Produto ${item.productId.toString()} não encontrado`,
        });
      }

      
      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Produto ${product.name} não tem estoque suficiente. Disponível: ${product.stock.toString()}`,
        });
      }

      const price = product.price;
      const subtotal = price * item.quantity;
      total += subtotal;

      
      await product.update(
        {
          stock: product.stock - item.quantity,
        },
        { transaction }
      );

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: price,
        },
        { transaction }
      );
    }

    order.total = total;
    await order.save({ transaction });

    
    await transaction.commit();

    return res.status(201).json(order);
  } catch (err) {
    
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "Product",
              attributes: ["id", "name", "price"], // Added name to attributes
            },
          ],
        },
      ],
      order: [["id", "DESC"]], // Optional: orders by newest first
    });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"], // escolha os campos que quer exibir
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "Product", // alias definido na associação
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar todos os pedidos" });
  }
};
