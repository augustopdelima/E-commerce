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
        [
          "Camiseta",
          "Camiseta esportiva confeccionada em 100% algodão, tecido leve e respirável que proporciona conforto durante o dia todo. Ideal para treinos, caminhadas ou uso casual.",
          59.9,
          20,
          "http://localhost:3000/uploads/camiseta-esportiva.png",
        ],
        [
          "Tênis",
          "Tênis esportivo confortável com solado emborrachado antiderrapante e cabedal respirável. Perfeito para corridas leves, academia e atividades do dia a dia.",
          199.9,
          15,
          "http://localhost:3000/uploads/tenis-esportivo.webp",
        ],
        [
          "Mochila",
          "Mochila resistente e prática, com compartimento principal espaçoso, bolsos laterais para garrafas e alças acolchoadas que garantem conforto no transporte.",
          129.9,
          10,
          "http://localhost:3000/uploads/mochila-esportiva.avif",
        ],
        [
          "Meias",
          "Pacote com 5 pares de meias esportivas de algodão com elastano, ajustam bem ao pé e oferecem conforto e respirabilidade durante treinos ou uso diário.",
          29.9,
          50,
          "http://localhost:3000/uploads/meias-esportivas.webp",
        ],
        [
          "Garrafa Térmica",
          "Garrafa térmica de 750ml em aço inoxidável com isolamento a vácuo, mantendo a bebida gelada por até 12h ou quente por até 6h. Ideal para academia ou escritório.",
          89.9,
          30,
          "http://localhost:3000/uploads/garrafa-termica-esportiva.jpg",
        ],
        [
          "Jaqueta Corta-Vento",
          "Jaqueta leve corta-vento com capuz ajustável e tecido impermeável, ideal para corridas ao ar livre e dias chuvosos. Fácil de dobrar e transportar.",
          159.9,
          12,
          "http://localhost:3000/uploads/jaqueta-corta-vento.avif",
        ],
        [
          "Relógio Fitness",
          "Relógio inteligente com monitor de frequência cardíaca, contagem de passos, rastreamento de sono e notificações de celular. Bateria com duração de até 7 dias.",
          249.9,
          8,
          "http://localhost:3000/uploads/relogio-fitness.jpg",
        ],
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
