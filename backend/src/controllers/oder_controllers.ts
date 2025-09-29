import { Request, Response } from "express";
import { Order, OrderItem, Product, User } from "../models";

interface OrderItemInput {
  productId: number;
  quantity: number;
}

interface CreateOrderRequest {
  userId: number;
  items: OrderItemInput[] | null;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body as CreateOrderRequest;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "O pedido precisa de ao menos 1 item" });
    }

    const order = await Order.create({
      userId,
      total: 0,
      status: "created",
    });

    let total = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          error: `Produto ${item.productId.toString()} não encontrado`,
        });
      }

      const price = product.price;
      const subtotal = price * item.quantity;
      total += subtotal;

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      });
    }

    order.total = total;
    await order.save();

    return res.status(201).json(order);
  } catch (err) {
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
          as: "items", // se você definiu esse as no hasMany
          include: [
            {
              model: Product,
              as: "Product", // aqui precisa ser exatamente igual ao alias da associação
            },
          ],
        },
      ],
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
