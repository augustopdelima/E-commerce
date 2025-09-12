import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { sequelize } from "../database";
import app from "../app";
import http from "http";
import { AddressInfo } from "net";
import { Product } from "../models/product";

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port.toString()}`;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe("Rotas Produto", () => {
  it("Deve cadastrar um novo produto", async () => {
    const res = await fetch(`${baseUrl}/product/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bola de basquete",
        description: "Descrição",
        price: 10.5,
        stock: 5,
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data).toHaveProperty("id");
    expect(data.name).toBe("Bola de basquete");
  });

  it("Deve listar produtos", async () => {
    const res = await fetch(`${baseUrl}/product`, {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const produtos = await res.json() as any[];
    expect(produtos.length).toBeGreaterThan(0);
  });
});