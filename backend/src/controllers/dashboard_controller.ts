import { Request, Response } from "express";
import { Order, OrderItem, Product } from "../models";
import { Op, fn, col, literal } from "sequelize";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalSales, topProduct, lowStock] = await Promise.all([
     
      Order.sum("total", {
        where: { createdAt: { [Op.between]: [start, end] }, status: "completed" },
      }),
     
      OrderItem.findOne({
        attributes: [
          "productId",
          [fn("SUM", col("quantity")), "quantity"],
          [fn("SUM", literal("quantity * price")), "revenue"],
        ],
        where: { createdAt: { [Op.between]: [start, end] } },
        include: [{ model: Product, attributes: ["name"] }],
        group: ["productId", "Product.id"],
        order: [[fn("SUM", col("quantity")), "DESC"]],
        raw: true,
        nest: true,
      }) as Promise<{ productId: number; quantity: string; revenue: string; Product: { name: string } } | null>,
     
      Product.findAll({
        where: { stock: { [Op.lt]: 10 } },
        attributes: ["id", "name", "stock", "price"],
        raw: true,
      }),
    ]);

    return res.json({
      period: { start, end },
      totalSales: totalSales || 0,
      topProduct: topProduct
        ? { name: topProduct.Product.name, quantity: Number(topProduct.quantity), revenue: Number(topProduct.revenue) }
        : null,
      lowStock: lowStock,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};