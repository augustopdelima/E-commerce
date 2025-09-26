const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database.sqlite");

async function initDataUser() {
  const passHash = await bcrypt.hash("123456", 10);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
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

      stmt.finalize((err) => {
        if (err) reject(err);
        else {
          console.log("Usuários de teste criados com sucesso!");
          resolve();
        }
      });
    });
  });
}

function initDataProducts() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          stock INTEGER NOT NULL,
          imageUrl TEXT
        )
      `);

      const stmt = db.prepare(
        "INSERT INTO products (name, description, price, stock, imageUrl) VALUES (?, ?, ?, ?, ?)"
      );

      const products = [
        ["Camiseta", "100% algodão", 59.9, 20, "http://localhost:3000/uploads/placeholder.png"],
        ["Tênis", "Esportivo confortável", 199.9, 15, "http://localhost:3000/uploads/placeholder.png"],
        ["Mochila", "Resistente e prática", 129.9, 10, "http://localhost:3000/uploads/placeholder.png"],
        ["Boné", "Boné estilo snapback", 49.9, 30, "http://localhost:3000/uploads/placeholder.png"],
        ["Jaqueta", "Jaqueta impermeável", 249.9, 5, "http://localhost:3000/uploads/placeholder.png"],
        ["Calça Jeans", "Jeans slim fit", 99.9, 25, "http://localhost:3000/uploads/placeholder.png"],
        ["Meias", "Pacote com 5 pares", 29.9, 50, "http://localhost:3000/uploads/placeholder.png"],
        ["Óculos de sol", "UV400 proteção", 79.9, 12, "http://localhost:3000/uploads/placeholder.png"],
      ];

      products.forEach((p) => {
        stmt.run(p[0], p[1], p[2], p[3], p[4]);
      });

      stmt.finalize((err) => {
        if (err) reject(err);
        else {
          console.log("Produtos de teste criados com sucesso!");
          resolve();
        }
      });
    });
  });
}

async function seed() {
  try {
    await initDataProducts();
    await initDataUser();
  } catch (err) {
    console.error("Erro ao popular o banco:", err);
  } finally {
    db.close((err) => {
      if (err) console.error("Erro ao fechar o banco:", err.message);
      else console.log("Conexão com o banco de dados fechada.");
    });
  }
}

seed();
