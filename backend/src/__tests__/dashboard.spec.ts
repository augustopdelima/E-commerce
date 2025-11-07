import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { sequelize } from "../database";
import app from "../app";
import http from "http";
import { AddressInfo } from "net";
import { User } from "../models/user";
import { Product } from "../models/product";
import { Order } from "../models/order";
import { OrderItem } from "../models/order_item";


interface DashboardPeriod {
  start: string;
  end: string;
}

interface DashboardTopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface DashboardLowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface DashboardResponse {
  period: DashboardPeriod;
  totalSales: number;
  topProduct: DashboardTopProduct | null;
  lowStock: DashboardLowStockProduct[];
}

interface LoginResponse {
  message: string;
  user: { id: string; email: string; type: string };
  accessToken: string;
}

let server: http.Server;
let baseUrl: string;
let tokenAdmin = "";
let userId = "";

beforeAll(async () => {
  await sequelize.sync({ force: true });

  server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port.toString()}`;

  // Cria admin
  const bcrypt = await import("bcrypt");
  const hashed = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashed,
    type: "admin",
  });

  // Login admin
  const loginAdmin = await fetch(`${baseUrl}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@example.com", password: "123456" }),
  });

  const loginAdminData = (await loginAdmin.json()) as LoginResponse;
  tokenAdmin = loginAdminData.accessToken;
  userId = loginAdminData.user.id;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe("Rota /dashboard", () => {
  it("Deve retornar estatísticas corretas com pedidos existentes", async () => {
    
    const p1 = await Product.create({
      name: "Notebook",
      price: 3000,
      stock: 50,
      description:"notebook"
    });

    const p2 = await Product.create({
      name: "Mouse",
      price: 100,
      stock: 5, 
      description:"notebook"
    });

    const order = await Order.create({
      userId: 1,
      status: "created",
      total: 3100,
    });

    await OrderItem.create({
      orderId: order.id,
      productId: p1.id,
      quantity: 1,
      price: 3000,
    });

    await OrderItem.create({
      orderId: order.id,
      productId: p2.id,
      quantity: 1,
      price: 100,
    });

   
    const res = await fetch(`${baseUrl}/admin/dashboard`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId },
    });

    expect(res.status).toBe(200);

    const data = (await res.json()) as DashboardResponse;

    expect(data).toHaveProperty("totalSales");
    expect(data.totalSales).toBeGreaterThan(0);

    expect(data.topProduct).not.toBeNull();
    expect(data.topProduct?.name).toMatch(/Notebook|Mouse/);
    expect(data.topProduct?.quantity).toBeGreaterThan(0);
    expect(data.topProduct?.revenue).toBeGreaterThan(0);

    expect(Array.isArray(data.lowStock)).toBe(true);
    expect(data.lowStock.some((p) => p.stock < 10)).toBe(true);
  });

  it("Deve retornar valores padrão quando não há pedidos", async () => { 
    await sequelize.sync({ force: true });

    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      type: "admin",
    });

    const loginAdmin = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "123456" }),
    });

    const loginAdminData = (await loginAdmin.json()) as LoginResponse;
    const newToken = loginAdminData.accessToken;

    const res = await fetch(`${baseUrl}/admin/dashboard`, {
      method: "GET",
      headers: { Authorization: `Bearer ${newToken}`, userid: userId },
    });

    expect(res.status).toBe(200);

    const data = (await res.json()) as DashboardResponse;

    expect(data.totalSales).toBe(0);
    expect(data.topProduct).toBeNull();
    expect(Array.isArray(data.lowStock)).toBe(true);
  });

  it("Deve retornar erro 500 se ocorrer exceção", async () => {
    
    const originalSum = Order.sum;
    Order.sum = () => {
      throw new Error("DB error");
    };

    const res = await fetch(`${baseUrl}/admin/dashboard`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId},
    });

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toHaveProperty("error", "Failed to load dashboard stats");

    
    Order.sum = originalSum;
  });
});
