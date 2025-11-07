import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import { sequelize } from "../database";
import app from "../app";
import http from "http";
import { AddressInfo } from "net";
import { Product } from "../models/product";
import { User } from "../models";


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


beforeEach(async () => {
  
  await Product.destroy({ where: {} });
});

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

describe("Rotas Produto", () => {
  it("Deve cadastrar um novo produto", async () => {
    const res = await fetch(`${baseUrl}/product/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", userid: userId, "Authorization":`Bearer ${tokenAdmin}` },
      body: JSON.stringify({
        name: "Bola de basquete",
        description: "Produto oficial de teste",
        price: 10.5,
        stock: 5,
      }),
    });

    expect(res.status).toBe(201);

    const data: unknown = await res.json();
    const produto = data as ProductResponse;

    expect(produto).toHaveProperty("id");
    expect(produto.name).toBe("Bola de basquete");
    expect(produto.description).toBe("Produto oficial de teste");
    expect(produto.price).toBe(10.5);
    expect(produto.stock).toBe(5);
  });

  it("Deve listar produtos", async () => {
    // insere um produto antes de listar
    await Product.create({
      name: "Tênis de corrida",
      description: "Leve e confortável",
      price: 200,
      stock: 20,
    });

    const res = await fetch(`${baseUrl}/product`, { method: "GET" });

    expect(res.status).toBe(200);

    const produtos: unknown = await res.json();
    const lista = produtos as ProductResponse[];

    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);

    const tenis = lista.find((p) => p.name === "Tênis de corrida");
    expect(tenis).toBeDefined();
    expect(tenis?.price).toBe(200);
    expect(tenis?.stock).toBe(20);
  });
});
