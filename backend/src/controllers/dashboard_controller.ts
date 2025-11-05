import { Request, Response } from "express";
import { Order, OrderItem, Product } from "../models";
import { Op, fn, col, literal } from "sequelize";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    

    const [totalSales, topProductRaw, lowStock] = await Promise.all([
      Order.sum("total", {
        where: {
          createdAt: { [Op.between]: [start, end] },
          status: "created",
        },
      }),

      OrderItem.findOne({
        attributes: [
          "productId",
          [fn("SUM", col("OrderItem.quantity")), "quantity"],
          [
            fn("SUM", literal("`OrderItem`.`quantity` * `OrderItem`.`price`")),
            "revenue",
          ],
        ],
        where: { createdAt: { [Op.between]: [start, end] } },
        include: [{ model: Product, attributes: ["name"] }],
        group: ["OrderItem.productId", "Product.id"],
        order: [[fn("SUM", col("OrderItem.quantity")), "DESC"]],
        raw: true,
        nest: true,
      }) as Promise<{
        productId: number;
        quantity: string;
        revenue: string;
        Product: { name: string };
      } | null>,

      Product.findAll({
        where: { stock: { [Op.lt]: 10 } },
        attributes: ["id", "name", "stock", "price"],
        raw: true,
      }),
    ]);

    const topProduct = topProductRaw
      ? {
          name: topProductRaw.Product.name,
          quantity: Number(topProductRaw.quantity) || 0,
          revenue: parseFloat(topProductRaw.revenue) || 0,
        }
      : null;

    console.log("total", totalSales);

    return res.json({
      period: { start, end },
      totalSales: totalSales || 0,
      topProduct,
      lowStock,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
