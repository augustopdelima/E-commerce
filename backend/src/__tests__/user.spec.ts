import { describe, expect, it, beforeAll, afterAll } from "vitest";

import { sequelize } from "../database";
import app from "../app";

import http from "http";

import { AddressInfo } from "net";

import { User } from "../models/User";

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

interface ResponseUserRegister {
  id: string;
  email: string;
}

describe("Rotas Usuário", () => {
  it("Deve registrar um novo usuário", async () => {
    const res = await fetch(`${baseUrl}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "João",
        email: "joao@example.comd",
        senha: "123456",
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json() as ResponseUserRegister;
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("email");

    const usuarioDb = await User.findOne({ where: { id: data.id } });
    expect(usuarioDb).not.toBeNull();
    expect(usuarioDb?.email).not.toBeNull();
    expect(usuarioDb?.email).toBe(data.email);
  });
});
