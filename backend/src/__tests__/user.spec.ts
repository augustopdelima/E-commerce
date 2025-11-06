import { describe, expect, it, beforeAll, afterAll } from "vitest";

import { sequelize } from "../database";
import app from "../app";

import http from "http";

import { AddressInfo } from "net";

import { User } from "../models/user";

let server: http.Server;
let baseUrl: string;

let userClientId = "";
let token = "";
let tokenAdmin = "";

beforeAll(async () => {
  await sequelize.sync({ force: true });

  server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port.toString()}`;

  const bcrypt = await import("bcrypt");
  const hashed = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashed,
    type: "admin",
  });


  // Criar usuário inicial para testar update
  const res = await fetch(`${baseUrl}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "João",
      email: "joao4@example.com",
      password: "123456",
    }),
  });

  const data = (await res.json()) as ResponseUserRegister;
  userClientId = data.user.id;

  const loginRes = await fetch(`${baseUrl}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "joao4@example.com",
      password: "123456",
    }),
  });

  const loginData = (await loginRes.json()) as LoginResponse;
  token = loginData.accessToken;

  const loginAdmin = await fetch(`${baseUrl}/user/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:"admin@example.com",
      password:"123456",
    })
  });

  const loginAdminData = (await loginAdmin.json()) as LoginResponse;
  
  tokenAdmin = loginAdminData.accessToken;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

interface UserDb {
  id: string;
  email: string;
  name: string;
  type: string;
}

interface ResponseUserRegister {
  message: string;
  user: UserDb;
  token: string;
}

interface LoginResponse {
  message: string;
  user: { id: string; email: string; type: string };
  accessToken: string;
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
    const data = (await res.json()) as ResponseUserRegister;
    expect(data).toHaveProperty("user.id");

    const userDb = await User.findOne({ where: { id: data.user.id } });

    const userData = userDb?.dataValues as UserDb;

    expect(userData).not.toBeNull();
    expect(userData.email).not.toBeNull();
    expect(userData.email).toBe(email);
    expect(userData.type).toBe("client");
    expect(data.message).toBe("Usuário cadastrado com sucesso");
  });
  it("Deve listar e retornar o usuário cadastrado", async () => {
    const email = "joao2@example.com";
    const name = "João2";
    const type = "client";

    const res = await fetch(`${baseUrl}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: "123456" }),
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as ResponseUserRegister;
    expect(data).toHaveProperty("user.id");

    const dataUser = await fetch(`${baseUrl}/user/${data.user.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenAdmin}`},
    });

    expect(dataUser.status).toBe(200);
    const dUser = (await dataUser.json()) as UserDb;

    expect(dUser.id).toBe(data.user.id);
    expect(dUser.email).toBe(email);
    expect(dUser.type).toBe(type);
    expect(dUser.name).toBe(name);
  });

  it("Deve logar com usuário existente", async () => {
    const res = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "123456" }),
    });

    expect(res.status).toBe(200);

    const data = (await res.json()) as LoginResponse;
    expect(data).toHaveProperty("user.id");
    expect(data.user.email).toBe("admin@example.com");
    expect(data.user.type).toBe("admin");
    expect(data).toHaveProperty("accessToken");
  });

  it("Não deve logar com senha incorreta", async () => {
    const res = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "wrong" }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("error");
  });

  it("Não deve logar com usuário inexistente", async () => {
    const res = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "naoexiste@example.com",
        password: "123456",
      }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("error");
  });

  it("Deve gerar novos tokens usando refreshToken", async () => {
    const loginRes = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "123456" }),
    });

    expect(loginRes.status).toBe(200);
    const loginData = (await loginRes.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    const oldAccessToken = loginData.accessToken;
    const oldRefreshToken = loginData.refreshToken;

    const refreshRes = await fetch(`${baseUrl}/user/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: oldRefreshToken,
      }),
    });

    expect(refreshRes.status).toBe(200);
    const refreshData = (await refreshRes.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    expect(refreshData).toHaveProperty("accessToken");
    expect(refreshData.accessToken).not.toBe(oldAccessToken);
    expect(refreshData.refreshToken).not.toBe(oldRefreshToken);
  });

  it("Deve falhar se refreshToken for inválido", async () => {
    const refreshRes = await fetch(`${baseUrl}/user/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: "aaa",
      }),
    });

    expect(refreshRes.status).toBe(403);
    const data = await refreshRes.json();
    expect(data).toHaveProperty("error");
  });

  it("Deve atualizar os dados de um usuário existente", async () => {
    const res = await fetch(`${baseUrl}/user/${userClientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "João da Silva",
        email: "joaosilva@example.com",
      }),
    });

    expect(res.status).toBe(200);
    const updated = (await res.json()) as ResponseUserRegister;
    expect(updated.user).toHaveProperty("id", userClientId);
    expect(updated.user.name).toBe("João da Silva");
    expect(updated.user.email).toBe("joaosilva@example.com");
  });

  it("Deve retornar 404 ao tentar atualizar um usuário inexistente", async () => {
    const res = await fetch(`${baseUrl}/user/99999`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Nome Fake",
        email: "fake@example.com",
      }),
    });

    expect(res.status).toBe(404);
  });

  it("Deve retornar 400 ao enviar dados inválidos", async () => {
    const res = await fetch(`${baseUrl}/user/${userClientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: "email-invalido", // formato incorreto
      }),
    });

    expect(res.status).toBe(400);
  });
});
