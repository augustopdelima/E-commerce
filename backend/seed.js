// seed.js
const sqlite3 = require("sqlite3").verbose();

const bcrypt = require("bcrypt");

// abre conexão com o banco (ajuste o caminho se necessário)
const db = new sqlite3.Database("./database.sqlite");

async function initDataUser() {
  const passHash = await bcrypt.hash("123456", 10);

  db.serialize(() => {
    // cria tabela se não existir
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      type TEXT CHECK(type IN ('admin', 'client')) NOT NULL
    )
  `);

    

    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)"
    );

    stmt.run("João da Silva", "joao2@example.com", passHash, "client");
    stmt.run("Admin Master", "admin2@example.com", passHash, "admin");

    stmt.finalize();

    console.log("Usuários de teste criados com sucesso!");
  });

  db.close();
}

function initDataProducts() {
  db.serialize(() => {
    // cria tabela se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
      )
    `);

    const stmt = db.prepare(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)"
    );

    // produtos de exemplo
    const products = [
      ["Camiseta", "100% algodão", 59.9, 20],
      ["Tênis", "Esportivo confortável", 199.9, 15],
      ["Mochila", "Resistente e prática", 129.9, 10],
      ["Boné", "Boné estilo snapback", 49.9, 30],
      ["Jaqueta", "Jaqueta impermeável", 249.9, 5],
      ["Calça Jeans", "Jeans slim fit", 99.9, 25],
      ["Meias", "Pacote com 5 pares", 29.9, 50],
      ["Óculos de sol", "UV400 proteção", 79.9, 12],
    ];

    products.forEach((p) => {
      stmt.run(p[0], p[1], p[2], p[3]);
    });

    stmt.finalize();
    console.log("Produtos de teste criados com sucesso!");
  });

  db.close();
}

//initDataProducts()

//initDataUser();
