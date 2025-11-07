import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { sequelize } from "../database";
import app from "../app";
import http from "http";
import { AddressInfo } from "net";
import { User } from "../models/user";
import { Supplier } from "../models/supplier";

interface LoginResponse {
  message: string;
  user: { id: string; email: string; type: string };
  accessToken: string;
}

interface SupplierResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
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

describe("Rota /suppliers", () => {
  it("Deve criar um fornecedor com sucesso", async () => {
    const res = await fetch(`${baseUrl}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAdmin}`,
        userid: userId,
      },
      body: JSON.stringify({
        name: "Fornecedor A",
        email: "a@teste.com",
        phone: "9999-9999",
      }),
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as SupplierResponse;
    expect(data).toHaveProperty("id");
    expect(data.name).toBe("Fornecedor A");
    expect(data.active).toBe(true);
  });

  it("Deve retornar todos os fornecedores ativos", async () => {
    await Supplier.create({
      name: "Fornecedor B",
      email: "b@teste.com",
      phone: "8888-8888",
      active: true,
    });

    const res = await fetch(`${baseUrl}/suppliers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        userid: userId,
      },
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as SupplierResponse[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data.every((s) => s.active)).toBe(true);
  });

  it("Deve buscar fornecedor por ID", async () => {
    const created = await Supplier.create({
      name: "Fornecedor C",
      email: "c@teste.com",
      phone: "7777-7777",
      active: true,
    });

    const res = await fetch(`${baseUrl}/suppliers/${created.id.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId },
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as SupplierResponse;
    expect(data.name).toBe("Fornecedor C");
  });

  it("Deve retornar 404 ao buscar fornecedor inexistente", async () => {
    const res = await fetch(`${baseUrl}/suppliers/9999`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId },
    });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Fornecedor não encontrado");
  });

  it("Deve atualizar fornecedor existente", async () => {
    const supplier = await Supplier.create({
      name: "Fornecedor D",
      email: "d@teste.com",
      phone: "6666-6666",
      active: true,
    });

    const res = await fetch(`${baseUrl}/suppliers/${supplier.id.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAdmin}`,
        userid: userId,
      },
      body: JSON.stringify({
        name: "Fornecedor D Atualizado",
        email: "d@novo.com",
        phone: "0000-0000",
      }),
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as SupplierResponse;
    expect(data.name).toBe("Fornecedor D Atualizado");
  });

  it("Deve retornar 404 ao atualizar fornecedor inexistente", async () => {
    const res = await fetch(`${baseUrl}/suppliers/9999`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAdmin}`,
        userid: userId,
      },
      body: JSON.stringify({
        name: "Inexistente",
        email: "x@x.com",
        phone: "0000",
      }),
    });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Fornecedor não encontrado");
  });

  it("Deve inativar fornecedor com sucesso", async () => {
    const supplier = await Supplier.create({
      name: "Fornecedor E",
      email: "e@teste.com",
      phone: "5555-5555",
      active: true,
    });

    const res = await fetch(`${baseUrl}/suppliers/${supplier.id.toString()}/deactivate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Fornecedor inativado com sucesso");

    const updated = await Supplier.findByPk(supplier.id);
    expect(updated?.active).toBe(false);
  });

  it("Deve retornar erro 500 se ocorrer exceção no banco", async () => {
    const originalFindAll = Supplier.findAll;
    Supplier.findAll = () => {
      throw new Error("DB error");
    };

    const res = await fetch(`${baseUrl}/suppliers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`, userid: userId },
    });

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Erro ao buscar fornecedores");

    Supplier.findAll = originalFindAll;
  });
});
