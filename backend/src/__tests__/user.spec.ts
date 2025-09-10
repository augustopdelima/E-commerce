import { describe, expect, it, beforeAll, afterAll } from "vitest";

import { sequelize } from "../database";
import app from "../app";

import http from "http";

import { AddressInfo } from "net";

import { User } from "../models/user";

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

interface UserDb extends ResponseUserRegister {
  type: string;
}

describe("Rotas Usuário", () => {
  it("Deve registrar um novo usuário", async () => {

    const email = "joao@example.com";

    const res = await fetch(`${baseUrl}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "João",
        email,
        password: "123456",
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json() as ResponseUserRegister;
    expect(data).toHaveProperty("id");

    const userDb = await User.findOne({ where: { id: data.id } });

    const userData = userDb?.dataValues as UserDb;

    expect(userData).not.toBeNull();
    expect(userData.email).not.toBeNull();
    expect(userData.email).toBe(email);
    expect(userData.type).toBe("cliente");
  });
});
